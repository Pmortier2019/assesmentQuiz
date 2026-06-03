package com.assesspro.backend.controller;

import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.repository.SubscriptionRepository;
import com.assesspro.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for the Lemon Squeezy webhook. The HMAC signature is the
 * only thing standing between an anonymous POST and a subscription upgrade, so
 * the critical cases are: a correctly signed event activates the subscription,
 * and a forged signature is rejected without any side effect.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LemonSqueezyWebhookControllerIntegrationTest {

    /** Must match LEMON_SQUEEZY_WEBHOOK_SECRET in application-test.properties. */
    private static final String WEBHOOK_SECRET = "test-webhook-secret";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    private User createUser(String email) {
        return userRepository.save(User.builder()
                .email(email)
                .name("Payer")
                .emailVerified(true)
                .build());
    }

    private String subscriptionCreatedPayload(Long userId) {
        return """
                {"meta":{"event_name":"subscription_created","custom_data":{"user_id":"%d"}},\
                "data":{"id":"ls_sub_1","attributes":{"customer_id":"cust_1",\
                "renews_at":"2026-12-01T00:00:00.000000Z"}}}"""
                .formatted(userId);
    }

    private String hmacHex(String body) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(body.getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    void validSignature_activatesSubscription() throws Exception {
        User user = createUser("webhook-valid@example.com");
        String body = subscriptionCreatedPayload(user.getId());

        mockMvc.perform(post("/api/webhooks/lemonsqueezy")
                        .header("X-Signature", hmacHex(body))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));

        Subscription sub = subscriptionRepository.findByUserId(user.getId()).orElseThrow();
        assertThat(sub.getStatus()).isEqualTo(SubscriptionStatus.ACTIVE);
        assertThat(sub.getLsSubscriptionId()).isEqualTo("ls_sub_1");
    }

    @Test
    void invalidSignature_isRejectedAndDoesNotProcess() throws Exception {
        User user = createUser("webhook-forged@example.com");
        String body = subscriptionCreatedPayload(user.getId());

        mockMvc.perform(post("/api/webhooks/lemonsqueezy")
                        .header("X-Signature", "deadbeefdeadbeefdeadbeef")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());

        // No subscription should have been created for the user.
        assertThat(subscriptionRepository.findByUserId(user.getId())).isEmpty();
    }
}
