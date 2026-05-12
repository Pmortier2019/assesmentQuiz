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
     * POST /api/users/{userId}/subscription/mock-upgrade
     *
     * Simulates a Pro upgrade without Stripe.
     * TODO: Replace this endpoint with a Stripe Checkout redirect once payments are wired up.
     */
    @PostMapping("/mock-upgrade")
    public ResponseEntity<SubscriptionResponse> mockUpgrade(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.mockUpgrade(userId));
    }
}
