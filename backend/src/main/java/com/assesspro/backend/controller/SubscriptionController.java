package com.assesspro.backend.controller;

import com.assesspro.backend.dto.SubscriptionResponse;
import com.assesspro.backend.exception.AccessDeniedException;
import com.assesspro.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** GET /api/users/{userId}/subscription */
    @GetMapping
    public ResponseEntity<SubscriptionResponse> getSubscription(@PathVariable Long userId,
                                                                Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(subscriptionService.getSubscription(userId));
    }

    /**
     * GET /api/users/{userId}/subscription/checkout-url
     *
     * Returns the Lemon Squeezy hosted checkout URL for the given user.
     * The frontend redirects the user to this URL to complete payment.
     */
    @GetMapping("/checkout-url")
    public ResponseEntity<java.util.Map<String, String>> getCheckoutUrl(@PathVariable Long userId,
                                                                        Authentication auth) {
        requireOwner(auth, userId);
        String url = subscriptionService.getCheckoutUrl(userId);
        return ResponseEntity.ok(java.util.Map.of("checkoutUrl", url));
    }

    /** DELETE /api/users/{userId}/subscription */
    @DeleteMapping
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        subscriptionService.cancelSubscription(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/users/{userId}/subscription/mock-upgrade
     * Simulates a Pro upgrade for local testing (no payment).
     */
    @PostMapping("/mock-upgrade")
    public ResponseEntity<SubscriptionResponse> mockUpgrade(@PathVariable Long userId,
                                                            Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(subscriptionService.mockUpgrade(userId));
    }

    private void requireOwner(Authentication auth, Long userId) {
        Long authenticatedId = (Long) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !authenticatedId.equals(userId)) {
            throw new AccessDeniedException("You are not allowed to access this resource.");
        }
    }
}
