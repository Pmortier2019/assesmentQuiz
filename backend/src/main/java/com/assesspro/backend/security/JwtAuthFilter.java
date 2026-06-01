package com.assesspro.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // Refresh tokens may only be exchanged at /api/auth/refresh, never used
            // as API credentials.
            if (jwtService.isValid(token) && !jwtService.isRefreshToken(token)) {
                Long userId = jwtService.extractUserId(token);
                // Load the user so authorization reflects current state — a deleted
                // user or one whose token predates a password change is rejected,
                // and the role is read from the DB (not the token) so demotions
                // take effect immediately.
                User user = userRepository.findById(userId).orElse(null);
                if (user != null && tokenStillValid(user, token)) {
                    var authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
                    var auth = new UsernamePasswordAuthenticationToken(userId, null, List.of(authority));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        chain.doFilter(request, response);
    }

    /** Rejects tokens issued before the user's last password change. */
    private boolean tokenStillValid(User user, String token) {
        if (user.getPasswordChangedAt() == null) return true;
        Instant changedAt = user.getPasswordChangedAt().atZone(ZoneId.systemDefault()).toInstant();
        Instant issuedAt = jwtService.extractIssuedAt(token).toInstant();
        return !issuedAt.isBefore(changedAt);
    }
}
