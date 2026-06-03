package com.assesspro.backend.security;

import com.assesspro.backend.entity.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pure unit tests for {@link JwtService} — no Spring context, the @Value fields
 * are injected directly. Covers what the auth filter and refresh flow rely on:
 * tokens round-trip their claims, access and refresh tokens are distinguishable,
 * and forged / expired tokens are rejected.
 */
class JwtServiceTest {

    private static final String SECRET =
            "test-secret-test-secret-test-secret-test-secret-0123456789";

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = newService(SECRET, 120L);
    }

    private JwtService newService(String secret, long accessTtlMinutes) {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "secret", secret);
        ReflectionTestUtils.setField(service, "accessTtlMinutes", accessTtlMinutes);
        ReflectionTestUtils.setField(service, "refreshTtlDays", 30L);
        return service;
    }

    @Test
    void accessToken_roundTripsUserIdRoleAndType() {
        String token = jwtService.generateAccessToken(42L, "user@example.com", Role.USER);

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.isRefreshToken(token)).isFalse();
        assertThat(jwtService.extractType(token)).isEqualTo("access");
        assertThat(jwtService.extractUserId(token)).isEqualTo(42L);
        assertThat(jwtService.extractRole(token)).isEqualTo(Role.USER);
    }

    @Test
    void accessToken_preservesAdminRole() {
        String token = jwtService.generateAccessToken(1L, "admin@example.com", Role.ADMIN);

        assertThat(jwtService.extractRole(token)).isEqualTo(Role.ADMIN);
    }

    @Test
    void refreshToken_isMarkedRefreshAndCarriesUserId() {
        String token = jwtService.generateRefreshToken(7L);

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.isRefreshToken(token)).isTrue();
        assertThat(jwtService.extractType(token)).isEqualTo("refresh");
        assertThat(jwtService.extractUserId(token)).isEqualTo(7L);
    }

    @Test
    void garbageToken_isNotValid() {
        assertThat(jwtService.isValid("this.is.not.a.jwt")).isFalse();
    }

    @Test
    void tokenSignedWithDifferentSecret_isRejected() {
        JwtService other = newService(
                "completely-different-secret-completely-different-987654321", 120L);
        String foreign = other.generateAccessToken(1L, "x@y.z", Role.USER);

        assertThat(jwtService.isValid(foreign)).isFalse();
    }

    @Test
    void expiredAccessToken_isRejected() {
        // Negative TTL → the token is already expired the moment it is minted.
        JwtService shortLived = newService(SECRET, -1L);
        String expired = shortLived.generateAccessToken(1L, "x@y.z", Role.USER);

        assertThat(shortLived.isValid(expired)).isFalse();
    }
}
