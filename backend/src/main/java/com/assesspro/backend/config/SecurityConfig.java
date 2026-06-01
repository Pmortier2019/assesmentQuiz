package com.assesspro.backend.config;

import com.assesspro.backend.security.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Health check — no auth needed
                .requestMatchers("/api/health").permitAll()
                // Auth endpoints — always public
                .requestMatchers("/api/auth/**").permitAll()
                // Tests — only the public catalogue listing is anonymous.
                // Test detail (/api/tests/{id}) and per-user routes (recommended)
                // require a valid JWT so access control uses the authenticated user.
                .requestMatchers(HttpMethod.GET, "/api/tests").permitAll()
                // Leaderboard — public, anonymous
                .requestMatchers(HttpMethod.GET, "/api/leaderboard").permitAll()
                // Webhook — called by Lemon Squeezy, verified via HMAC signature
                .requestMatchers("/api/webhooks/**").permitAll()
                // Admin endpoints — ADMIN role only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Everything else requires a valid JWT
                .anyRequest().authenticated()
            )
            // Unauthenticated (missing/expired/invalid token) → 401 so the client can
            // refresh; authenticated-but-forbidden still surfaces as 403.
            .exceptionHandling(e -> e.authenticationEntryPoint(
                    (request, response, ex) -> response.setStatus(HttpServletResponse.SC_UNAUTHORIZED)))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
