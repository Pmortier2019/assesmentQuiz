package com.assesspro.backend.controller;

import com.assesspro.backend.dto.AuthResponse;
import com.assesspro.backend.dto.LoginRequest;
import com.assesspro.backend.dto.RegisterRequest;
import com.assesspro.backend.dto.UserResponse;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.Role;
import com.assesspro.backend.repository.UserRepository;
import com.assesspro.backend.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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
