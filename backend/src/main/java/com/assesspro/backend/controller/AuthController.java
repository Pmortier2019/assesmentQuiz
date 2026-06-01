package com.assesspro.backend.controller;

import com.assesspro.backend.dto.AuthResponse;
import com.assesspro.backend.dto.LoginRequest;
import com.assesspro.backend.dto.RegisterRequest;
import com.assesspro.backend.dto.UserResponse;
import com.assesspro.backend.entity.EmailVerificationToken;
import com.assesspro.backend.entity.PasswordResetToken;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.Role;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.repository.EmailVerificationTokenRepository;
import com.assesspro.backend.repository.PasswordResetTokenRepository;
import com.assesspro.backend.repository.UserRepository;
import com.assesspro.backend.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    @Value("${FRONTEND_URL:https://ready-to-ace.vercel.app}")
    private String frontendUrl;

    // ── Refresh-cookie configuration ─────────────────────────────────────────
    // Frontend (Vercel) and backend (Fly) are different sites, so the cookie
    // must be SameSite=None; Secure to be sent cross-site. Override in dev.
    @Value("${app.auth.cookie-secure:true}")
    private boolean cookieSecure;

    @Value("${app.auth.cookie-same-site:None}")
    private String cookieSameSite;

    @Value("${app.auth.refresh-token-ttl-days:30}")
    private long refreshTtlDays;

    private static final String REFRESH_COOKIE = "refresh_token";
    private static final String REFRESH_PATH = "/api/auth";

    @Data
    static class ForgotPasswordRequest { private String email; }

    @Data
    static class ResetPasswordRequest {
        @NotBlank
        private String token;
        @NotBlank
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String newPassword;
    }

    @Data
    static class VerifyEmailRequest { private String token; }

    private static final String SIGNUP_MESSAGE =
            "Account created. Please check your email to verify your account.";

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        // Don't reveal whether the email is already registered (enumeration).
        // Return the same response either way; notify the existing owner by email.
        if (userRepository.existsByEmail(req.getEmail())) {
            userRepository.findByEmail(req.getEmail())
                    .ifPresent(this::sendAlreadyRegisteredEmail);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", SIGNUP_MESSAGE));
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .preferredLanguage(Language.EN)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);

        String verifyToken = UUID.randomUUID().toString();
        emailVerificationTokenRepository.save(EmailVerificationToken.builder()
                .user(user)
                .token(verifyToken)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build());

        sendVerificationEmail(user, verifyToken);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", SIGNUP_MESSAGE));
    }

    @PostMapping("/verify-email")
    @Transactional
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyEmailRequest req) {
        EmailVerificationToken evt = emailVerificationTokenRepository.findByToken(req.getToken()).orElse(null);
        if (evt == null || evt.isUsed() || evt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Verification link expired or already used.");
        }
        User user = evt.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        evt.setUsed(true);
        emailVerificationTokenRepository.save(evt);

        return issueTokens(user);
    }

    @PostMapping("/resend-verification")
    @Transactional
    public ResponseEntity<?> resendVerification(@RequestBody ForgotPasswordRequest req) {
        userRepository.findByEmail(req.getEmail()).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                String verifyToken = UUID.randomUUID().toString();
                emailVerificationTokenRepository.save(EmailVerificationToken.builder()
                        .user(user)
                        .token(verifyToken)
                        .expiresAt(LocalDateTime.now().plusHours(24))
                        .build());
                sendVerificationEmail(user, verifyToken);
            }
        });
        return ResponseEntity.ok(Map.of("message", "If that address is registered and unverified, a new link has been sent."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (user == null || user.getPasswordHash() == null
                || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "EMAIL_NOT_VERIFIED", "message", "Please verify your email before logging in."));
        }

        return issueTokens(user);
    }

    /**
     * POST /api/auth/admin-bootstrap
     *
     * Promotes the given user to ADMIN — only works when NO admin exists yet.
     * One-time bootstrap to create the first admin account.
     */
    @PostMapping("/admin-bootstrap")
    @Transactional
    public ResponseEntity<?> adminBootstrap(@RequestBody LoginRequest req) {
        boolean adminExists = userRepository.existsByRole(Role.ADMIN);
        if (adminExists) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("An admin already exists");
        }
        User user = userRepository.findByEmailWithSubscription(req.getEmail()).orElse(null);
        if (user == null || user.getPasswordHash() == null
                || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        user.setRole(Role.ADMIN);
        userRepository.save(user);
        return issueTokens(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        userRepository.findByEmail(req.getEmail()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            passwordResetTokenRepository.save(PasswordResetToken.builder()
                    .user(user)
                    .token(resetToken)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .build());

            if (resendApiKey != null && !resendApiKey.isBlank()) {
                String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
                String body = "{\"from\":\"Ready to Ace <noreply@ready-to-ace.com>\","
                        + "\"to\":[\"" + escapeHtml(user.getEmail()) + "\"],"
                        + "\"subject\":\"Reset your password\","
                        + "\"html\":\"<p>Hi " + escapeHtml(user.getName()) + ",</p>"
                        + "<p>Click the link below to reset your password (valid for 1 hour):</p>"
                        + "<p><a href=\\\"" + resetLink + "\\\">Reset my password</a></p>"
                        + "<p>If you didn't request this, you can safely ignore this email.</p>\"}";
                try {
                    HttpClient client = HttpClient.newHttpClient();
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create("https://api.resend.com/emails"))
                            .header("Authorization", "Bearer " + resendApiKey)
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(body))
                            .build();
                    client.send(request, HttpResponse.BodyHandlers.ofString());
                } catch (Exception ignored) {}
            }
        });
        return ResponseEntity.ok(Map.of("message", "If that address is registered, you will receive a reset link."));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(req.getToken()).orElse(null);
        if (prt == null || prt.isUsed() || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Link expired or already used.");
        }
        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        // Invalidate every JWT issued before now — a reset logs out all sessions.
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);
        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    /**
     * POST /api/auth/refresh
     *
     * Reads the httpOnly refresh cookie, and if valid issues a fresh short-lived
     * access token (and rotates the refresh cookie). No Authorization header needed.
     */
    @PostMapping("/refresh")
    @Transactional(readOnly = true)
    public ResponseEntity<?> refresh(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
        if (refreshToken == null
                || !jwtService.isValid(refreshToken)
                || !jwtService.isRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                    .body(Map.of("message", "Session expired. Please log in again."));
        }
        Long userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                    .body(Map.of("message", "Session expired. Please log in again."));
        }
        // Honour the password-change cutoff: a reset invalidates refresh tokens too.
        if (user.getPasswordChangedAt() != null
                && jwtService.extractIssuedAt(refreshToken).toInstant()
                    .isBefore(user.getPasswordChangedAt()
                            .atZone(java.time.ZoneId.systemDefault()).toInstant())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                    .body(Map.of("message", "Session expired. Please log in again."));
        }
        return issueTokens(user);
    }

    /**
     * POST /api/auth/logout
     * Clears the refresh cookie. The short-lived access token expires on its own.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                .body(Map.of("message", "Logged out."));
    }

    /** Builds the access token + refresh cookie response used by every login path. */
    private ResponseEntity<AuthResponse> issueTokens(User user) {
        String access = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refresh = jwtService.generateRefreshToken(user.getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildRefreshCookie(refresh).toString())
                .body(buildResponse(access, user));
    }

    private ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from(REFRESH_COOKIE, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path(REFRESH_PATH)
                .maxAge(Duration.ofDays(refreshTtlDays))
                .build();
    }

    private ResponseCookie clearRefreshCookie() {
        return ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path(REFRESH_PATH)
                .maxAge(0)
                .build();
    }

    private void sendVerificationEmail(User user, String verifyToken) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.warn("RESEND_API_KEY not set — skipping verification email for user {}", user.getEmail());
            return;
        }
        String verifyLink = frontendUrl + "/verify-email?token=" + verifyToken;
        String body = "{\"from\":\"Ready to Ace <noreply@ready-to-ace.com>\","
                + "\"to\":[\"" + escapeHtml(user.getEmail()) + "\"],"
                + "\"subject\":\"Verify your Ready to Ace account\","
                + "\"html\":\"<p>Hi " + escapeHtml(user.getName()) + ",</p>"
                + "<p>Thanks for signing up! Click the link below to verify your email address:</p>"
                + "<p><a href=\\\"" + verifyLink + "\\\">Verify my email</a></p>"
                + "<p>The link expires in 24 hours.</p>"
                + "<p>If you didn't create an account, you can safely ignore this email.</p>\"}";
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("Verification email sent to {} — status {}", user.getEmail(), response.statusCode());
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    /** Sent when someone tries to register with an email that already exists. */
    private void sendAlreadyRegisteredEmail(User user) {
        if (resendApiKey == null || resendApiKey.isBlank()) return;
        String loginLink = frontendUrl + "/login";
        String body = "{\"from\":\"Ready to Ace <noreply@ready-to-ace.com>\","
                + "\"to\":[\"" + escapeHtml(user.getEmail()) + "\"],"
                + "\"subject\":\"You already have a Ready to Ace account\","
                + "\"html\":\"<p>Hi " + escapeHtml(user.getName()) + ",</p>"
                + "<p>Someone (hopefully you) just tried to sign up with this email address, "
                + "but you already have an account.</p>"
                + "<p>You can <a href=\\\"" + loginLink + "\\\">log in here</a>, "
                + "or reset your password if you've forgotten it.</p>"
                + "<p>If this wasn't you, you can safely ignore this email.</p>\"}";
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            client.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            log.error("Failed to send already-registered email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private static String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;");
    }

    private AuthResponse buildResponse(String token, User user) {
        boolean isPro = user.getSubscription() != null
                && user.getSubscription().getStatus() == SubscriptionStatus.ACTIVE;
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .preferredLanguage(user.getPreferredLanguage())
                        .freeTestsUsed(user.getFreeTestsUsed())
                        .isPro(isPro)
                        .isAdmin(user.getRole() == Role.ADMIN)
                        .createdAt(user.getCreatedAt())
                        .targetRole(user.getTargetRole())
                        .targetIndustry(user.getTargetIndustry())
                        .targetCompany(user.getTargetCompany())
                        .build())
                .build();
    }
}
