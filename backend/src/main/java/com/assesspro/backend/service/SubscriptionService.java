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
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Value("${LEMON_SQUEEZY_VARIANT_ID:}")
    private String variantId;

    @Value("${LEMON_SQUEEZY_STORE_ID:}")
    private String storeId;

    @Value("${LEMON_SQUEEZY_API_KEY:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

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

        String body = String.format("""
            {
              "data": {
                "type": "checkouts",
                "attributes": {
                  "checkout_data": {
                    "email": "%s",
                    "custom": { "user_id": "%d" }
                  }
                },
                "relationships": {
                  "store": { "data": { "type": "stores", "id": "%s" } },
                  "variant": { "data": { "type": "variants", "id": "%s" } }
                }
              }
            }
            """, user.getEmail(), userId, storeId, variantId);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Accept", "application/vnd.api+json");
        headers.setContentType(MediaType.valueOf("application/vnd.api+json"));

        log.info("Creating LemonSqueezy checkout for user {} (store={}, variant={})", userId, storeId, variantId);
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.lemonsqueezy.com/v1/checkouts",
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Map.class
            );
            Map data = (Map) response.getBody().get("data");
            Map attributes = (Map) data.get("attributes");
            String url = (String) attributes.get("url");
            log.info("Checkout URL created: {}", url);
            return url;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("LemonSqueezy API error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Payment provider error: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("Checkout creation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Could not create checkout: " + e.getMessage());
        }
    }

    /**
     * Called by the Lemon Squeezy webhook controller.
     * Activates, renews, or cancels the subscription based on the event.
     * renewsAt is the ISO-8601 timestamp from attributes.renews_at in the payload.
     */
    @Transactional
    public void handleWebhookEvent(String eventName, String lsSubscriptionId,
                                    String lsCustomerId, Long userId, String renewsAt) {
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
                sub.setExpiresAt(parseRenewsAt(renewsAt));
                log.info("Subscription activated for user {}, expires {}", userId, sub.getExpiresAt());
            }
            case "subscription_renewed" -> {
                sub.setStatus(SubscriptionStatus.ACTIVE);
                sub.setExpiresAt(parseRenewsAt(renewsAt));
                log.info("Subscription renewed for user {}, expires {}", userId, sub.getExpiresAt());
            }
            case "subscription_payment_failed" -> {
                sub.setStatus(SubscriptionStatus.PAST_DUE);
                log.warn("Subscription payment failed for user {}", userId);
            }
            case "subscription_cancelled", "subscription_expired" -> {
                sub.setStatus(SubscriptionStatus.CANCELLED);
                log.info("Subscription cancelled for user {}", userId);
            }
            default -> log.debug("Unhandled webhook event: {}", eventName);
        }

        subscriptionRepository.save(sub);
    }

    private LocalDateTime parseRenewsAt(String renewsAt) {
        if (renewsAt != null && !renewsAt.isBlank()) {
            try {
                return OffsetDateTime.parse(renewsAt).toLocalDateTime();
            } catch (Exception e) {
                log.warn("Could not parse renews_at '{}', falling back to +1 month", renewsAt);
            }
        }
        return LocalDateTime.now().plusMonths(1);
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

}
