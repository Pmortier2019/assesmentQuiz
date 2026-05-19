package com.assesspro.backend.controller;

import com.assesspro.backend.dto.AuthResponse;
import com.assesspro.backend.dto.LoginRequest;
import com.assesspro.backend.dto.RegisterRequest;
import com.assesspro.backend.dto.UserResponse;
import com.assesspro.backend.entity.PasswordResetToken;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.Role;
import com.assesspro.backend.repository.PasswordResetTokenRepository;
import com.assesspro.backend.repository.UserRepository;
import com.assesspro.backend.security.JwtService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    @Value("${FRONTEND_URL:https://ready-to-ace.vercel.app}")
    private String frontendUrl;

    @Data
    static class ForgotPasswordRequest { private String email; }

    @Data
    static class ResetPasswordRequest { private String token; private String newPassword; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .preferredLanguage(Language.EN)
                .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(buildResponse(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElse(null);

        if (user == null || user.getPasswordHash() == null
                || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
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
    public ResponseEntity<?> adminBootstrap(@RequestBody LoginRequest req) {
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(u -> u.getRole() == Role.ADMIN);
        if (adminExists) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("An admin already exists");
        }
        User user = userRepository.findByEmail(req.getEmail()).orElse(null);
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
                        + "\"to\":[\"" + user.getEmail() + "\"],"
                        + "\"subject\":\"Reset je wachtwoord\","
                        + "\"html\":\"<p>Hoi " + user.getName() + ",</p>"
                        + "<p>Klik op de link om je wachtwoord te resetten (geldig 1 uur):</p>"
                        + "<p><a href=\\\"" + resetLink + "\\\">Wachtwoord resetten</a></p>"
                        + "<p>Als je dit niet hebt aangevraagd, kun je deze e-mail negeren.</p>\"}";
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
        return ResponseEntity.ok(Map.of("message", "Als dit e-mailadres bekend is, ontvang je een resetlink."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(req.getToken()).orElse(null);
        if (prt == null || prt.isUsed() || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Link verlopen of al gebruikt");
        }
        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        return ResponseEntity.ok(Map.of("message", "Wachtwoord succesvol gewijzigd"));
    }

    private AuthResponse buildResponse(String token, User user) {
        boolean isPro = user.getSubscription() != null;
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
