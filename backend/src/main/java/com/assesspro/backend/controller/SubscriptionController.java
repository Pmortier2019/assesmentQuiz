package com.assesspro.backend.controller;

import com.assesspro.backend.dto.SubscriptionResponse;
import com.assesspro.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** GET /api/users/{userId}/subscription */
    @GetMapping
    public ResponseEntity<SubscriptionResponse> getSubscription(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getSubscription(userId));
    }

    /**
     * GET /api/users/{userId}/subscription/checkout-url
     *
     * Returns the Lemon Squeezy hosted checkout URL for the given user.
     * The frontend redirects the user to this URL to complete payment.
     */
    @GetMapping("/checkout-url")
    public ResponseEntity<java.util.Map<String, String>> getCheckoutUrl(@PathVariable Long userId) {
        String url = subscriptionService.getCheckoutUrl(userId);
        return ResponseEntity.ok(java.util.Map.of("checkoutUrl", url));
    }

    /**
     * POST /api/users/{userId}/subscription/mock-upgrade
     * Simulates a Pro upgrade for local testing (no payment).
     */
    @PostMapping("/mock-upgrade")
    public ResponseEntity<SubscriptionResponse> mockUpgrade(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.mockUpgrade(userId));
    }
}
