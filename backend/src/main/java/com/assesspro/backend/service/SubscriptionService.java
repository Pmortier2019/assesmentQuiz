package com.assesspro.backend.service;

import com.assesspro.backend.dto.SubscriptionResponse;
import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.exception.ResourceNotFoundException;
import com.assesspro.backend.repository.SubscriptionRepository;
import com.assesspro.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Value("${LEMON_SQUEEZY_VARIANT_ID:}")
    private String variantId;

    @Value("${LEMON_SQUEEZY_STORE_SLUG:mortier}")
    private String storeSlug;

    @Transactional
    public SubscriptionResponse getSubscription(Long userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElseGet(() -> createFreeSubscription(userId));
        return toResponse(sub);
    }

    /**
     * Returns the Lemon Squeezy hosted checkout URL for the given user.
     * Embeds the user's email and ID in the URL so the webhook knows who paid.
     */
    public String getCheckoutUrl(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        return String.format(
            "https://%s.lemonsqueezy.com/checkout/buy/%s?checkout[email]=%s&checkout[custom][user_id]=%d",
            storeSlug, variantId,
            encodeEmail(user.getEmail()),
            userId
        );
    }

    /**
     * Called by the Lemon Squeezy webhook controller.
     * Activates or cancels the subscription based on the event.
     */
    @Transactional
    public void handleWebhookEvent(String eventName, String lsSubscriptionId,
                                    String lsCustomerId, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.warn("Webhook: user {} not found for event {}", userId, eventName);
            return;
        }

        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElse(Subscription.builder().user(user).build());

        switch (eventName) {
            case "subscription_created", "subscription_updated" -> {
                sub.setStatus(SubscriptionStatus.ACTIVE);
                sub.setPlan("PRO_MONTHLY");
                sub.setLsSubscriptionId(lsSubscriptionId);
                sub.setLsCustomerId(lsCustomerId);
                sub.setStartedAt(LocalDateTime.now());
                sub.setExpiresAt(LocalDateTime.now().plusMonths(1));
                log.info("Subscription activated for user {}", userId);
            }
            case "subscription_cancelled", "subscription_expired" -> {
                sub.setStatus(SubscriptionStatus.CANCELLED);
                log.info("Subscription cancelled for user {}", userId);
            }
            default -> log.debug("Unhandled webhook event: {}", eventName);
        }

        subscriptionRepository.save(sub);
    }

    @Transactional
    public void cancelSubscription(Long userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription found for user: " + userId));
        sub.setStatus(SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(sub);
    }

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

    private String encodeEmail(String email) {
        return email.replace("@", "%40").replace("+", "%2B");
    }
}
