package com.assesspro.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lightweight in-memory rate limiter for the public auth endpoints.
 *
 * <p>Protects against credential brute-forcing and password-reset / verification
 * email bombing. Keyed per client IP with a fixed window. This is per-instance
 * state (fine for a single-instance deployment); move to a shared store such as
 * Redis if the backend is ever scaled horizontally.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RateLimitFilter extends OncePerRequestFilter {

    // General auth endpoints (login, register, verify, ...): brute-force protection.
    private static final int GENERAL_LIMIT = 20;
    private static final long GENERAL_WINDOW_MS = 60_000;        // 1 minute

    // Endpoints that send emails: stricter, to prevent mail bombing.
    private static final int EMAIL_LIMIT = 5;
    private static final long EMAIL_WINDOW_MS = 600_000;         // 10 minutes

    private final Map<String, Window> counters = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        // Only throttle state-changing auth calls; let preflight and reads through.
        if (!"POST".equalsIgnoreCase(request.getMethod()) || !path.startsWith("/api/auth/")) {
            chain.doFilter(request, response);
            return;
        }

        boolean emailEndpoint = path.endsWith("/forgot-password") || path.endsWith("/resend-verification");
        int limit = emailEndpoint ? EMAIL_LIMIT : GENERAL_LIMIT;
        long windowMs = emailEndpoint ? EMAIL_WINDOW_MS : GENERAL_WINDOW_MS;
        String key = (emailEndpoint ? "email:" : "auth:") + clientIp(request);

        if (isLimited(key, limit, windowMs)) {
            // Reflect Origin so a throttled browser can still read the 429.
            String origin = request.getHeader("Origin");
            if (origin != null) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Vary", "Origin");
            }
            response.setStatus(429); // Too Many Requests
            response.setHeader("Retry-After", String.valueOf(windowMs / 1000));
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean isLimited(String key, int limit, long windowMs) {
        long now = System.currentTimeMillis();
        // Opportunistic cleanup to bound memory growth across many IPs.
        if (counters.size() > 10_000) {
            counters.entrySet().removeIf(e -> now - e.getValue().start > e.getValue().windowMs);
        }
        Window w = counters.compute(key, (k, existing) ->
                (existing == null || now - existing.start >= windowMs) ? new Window(now, windowMs) : existing);
        return w.count.incrementAndGet() > limit;
    }

    private String clientIp(HttpServletRequest request) {
        // Fly.io sets Fly-Client-IP and cannot be spoofed by the client.
        String flyIp = request.getHeader("Fly-Client-IP");
        if (flyIp != null && !flyIp.isBlank()) return flyIp.strip();
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].strip();
        return request.getRemoteAddr();
    }

    private static final class Window {
        final long start;
        final long windowMs;
        final AtomicInteger count = new AtomicInteger(0);
        Window(long start, long windowMs) { this.start = start; this.windowMs = windowMs; }
    }
}
