package com.assesspro.backend.service;

import com.assesspro.backend.dto.SubscriptionResponse;
import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.exception.ResourceNotFoundException;
import com.assesspro.backend.repository.SubscriptionRepository;
import com.assesspro.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Transactional
    public SubscriptionResponse getSubscription(Long userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElseGet(() -> createFreeSubscription(userId));
        return toResponse(sub);
    }

    /**
     * Mock upgrade — grants the user Pro access immediately.
     *
     * TODO: Replace this with a real Stripe checkout flow:
     *   1. Create a Stripe Checkout Session via the Stripe Java SDK
     *   2. Return the session URL so the frontend can redirect the user
     *   3. Handle the webhook event `checkout.session.completed` to actually activate the subscription
     *   4. Store stripeSubscriptionId and stripeCustomerId on the Subscription entity
     */
    @Transactional
    public SubscriptionResponse mockUpgrade(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElse(Subscription.builder().user(user).build());

        sub.setStatus(SubscriptionStatus.ACTIVE);
        sub.setPlan("PRO_MONTHLY");
        sub.setStartedAt(LocalDateTime.now());
        sub.setExpiresAt(LocalDateTime.now().plusMonths(1));
        subscriptionRepository.save(sub);

        return toResponse(sub);
    }

    private Subscription createFreeSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Subscription sub = Subscription.builder()
                .user(user)
                .status(SubscriptionStatus.FREE)
                .plan("FREE")
                .build();
        return subscriptionRepository.save(sub);
    }

    private SubscriptionResponse toResponse(Subscription sub) {
        return SubscriptionResponse.builder()
                .id(sub.getId())
                .userId(sub.getUser().getId())
                .status(sub.getStatus())
                .plan(sub.getPlan())
                .startedAt(sub.getStartedAt())
                .expiresAt(sub.getExpiresAt())
                .isPro(sub.getStatus() == SubscriptionStatus.ACTIVE)
                .build();
    }
}
