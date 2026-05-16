package com.assesspro.backend.controller;

import com.assesspro.backend.service.SubscriptionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class LemonSqueezyWebhookController {

    private final SubscriptionService subscriptionService;
    private final ObjectMapper objectMapper;

    @Value("${LEMON_SQUEEZY_WEBHOOK_SECRET:}")
    private String webhookSecret;

    /**
     * POST /api/webhooks/lemonsqueezy
     *
     * Lemon Squeezy sends a POST with JSON body and X-Signature header (HMAC-SHA256 hex).
     * We verify the signature before processing to prevent spoofed requests.
     */
    @PostMapping("/lemonsqueezy")
    public ResponseEntity<String> handleWebhook(
            @RequestHeader("X-Signature") String signature,
            @RequestBody String rawBody) {

        if (!verifySignature(rawBody, signature)) {
            log.warn("Invalid Lemon Squeezy webhook signature");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String eventName = root.path("meta").path("event_name").asText();
            JsonNode customData = root.path("meta").path("custom_data");
            JsonNode attributes = root.path("data").path("attributes");

            String userIdStr = customData.path("user_id").asText(null);
            if (userIdStr == null || userIdStr.isBlank()) {
                log.warn("Webhook missing user_id in custom_data for event {}", eventName);
                return ResponseEntity.ok("skipped — no user_id");
            }

            Long userId = Long.parseLong(userIdStr);
            String lsSubscriptionId = root.path("data").path("id").asText(null);
            String lsCustomerId = attributes.path("customer_id").asText(null);

            subscriptionService.handleWebhookEvent(eventName, lsSubscriptionId, lsCustomerId, userId);
            return ResponseEntity.ok("ok");

        } catch (Exception e) {
            log.error("Error processing Lemon Squeezy webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Processing error");
        }
    }

    private boolean verifySignature(String body, String receivedSignature) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.warn("LEMON_SQUEEZY_WEBHOOK_SECRET not set — skipping signature check");
            return true; // allow through in dev; in prod always set the secret
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(body.getBytes(StandardCharsets.UTF_8));
            String expected = HexFormat.of().formatHex(hash);
            return expected.equalsIgnoreCase(receivedSignature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }
}
