package com.assesspro.backend.security;

import com.assesspro.backend.entity.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String secret;

    /** Short-lived access token (minutes). Limits the window if a token leaks. */
    @Value("${app.auth.access-token-ttl-minutes:120}")
    private long accessTtlMinutes;

    /** Long-lived refresh token (days). Stored only in an httpOnly cookie. */
    @Value("${app.auth.refresh-token-ttl-days:30}")
    private long refreshTtlDays;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Backwards-compatible alias used by existing callers. */
    public String generateToken(Long userId, String email, Role role) {
        return generateAccessToken(userId, email, role);
    }

    public String generateAccessToken(Long userId, String email, Role role) {
        long ttl = accessTtlMinutes * 60 * 1000;
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role.name())
                .claim("type", "access")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttl))
                .signWith(key())
                .compact();
    }

    public String generateRefreshToken(Long userId) {
        long ttl = refreshTtlDays * 24 * 60 * 60 * 1000L;
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("type", "refresh")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttl))
                .signWith(key())
                .compact();
    }

    public String extractType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    public boolean isRefreshToken(String token) {
        return "refresh".equals(extractType(token));
    }

    public Long extractUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    public Date extractIssuedAt(String token) {
        return parseClaims(token).getIssuedAt();
    }

    public Role extractRole(String token) {
        String roleName = parseClaims(token).get("role", String.class);
        try {
            return roleName != null ? Role.valueOf(roleName) : Role.USER;
        } catch (IllegalArgumentException e) {
            return Role.USER;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token) {
        try {
            extractUserId(token);
            return true;
        } catch (Exception e) {
            log.debug("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }
}
