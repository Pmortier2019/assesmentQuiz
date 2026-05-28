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
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
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

    @Data
    static class ForgotPasswordRequest { private String email; }

    @Data
    static class ResetPasswordRequest { private String token; private String newPassword; }

    @Data
    static class VerifyEmailRequest { private String token; }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
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
                .body(Map.of("message", "Account created. Please check your email to verify your account."));
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

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(buildResponse(token, user));
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

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(buildResponse(token, user));
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
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(buildResponse(token, user));
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
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(req.getToken()).orElse(null);
        if (prt == null || prt.isUsed() || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Link expired or already used.");
        }
        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
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
