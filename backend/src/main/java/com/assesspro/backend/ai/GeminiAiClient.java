package com.assesspro.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Slf4j
@Component
public class GeminiAiClient implements AiClient {

    private static final String ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private static final int MAX_RETRIES = 4;
    private static final long INITIAL_BACKOFF_MS = 15_000;

    @Override
    public String generateTest(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("GEMINI_API_KEY is not configured. Add it as an environment variable.");
        }

        long backoffMs = INITIAL_BACKOFF_MS;
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String result = callGemini(prompt);
                if (attempt > 1) log.info("Gemini succeeded on attempt {}", attempt);
                return result;
            } catch (RateLimitException e) {
                if (attempt == MAX_RETRIES) {
                    throw new RuntimeException("Gemini rate limit persists after " + MAX_RETRIES + " retries", e);
                }
                log.warn("Gemini 429 on attempt {}, retrying in {}s…", attempt, backoffMs / 1000);
                try { Thread.sleep(backoffMs); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); throw new RuntimeException("Interrupted during backoff", ie); }
                backoffMs *= 2;
            }
        }
        throw new RuntimeException("Unreachable");
    }

    private String callGemini(String prompt) {
        try {
            String escapedPrompt = objectMapper.writeValueAsString(prompt);
            String requestBody = """
                    {
                      "contents": [{"parts": [{"text": %s}]}]
                    }
                    """.formatted(escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ENDPOINT + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(150))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 429) {
                log.warn("Gemini rate limit (429): {}", response.body());
                throw new RateLimitException("429");
            }
            if (response.statusCode() != 200) {
                log.error("Gemini API error {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Gemini API returned status " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            return text.replaceAll("(?s)^```json\\s*", "").replaceAll("(?s)\\s*```$", "").trim();

        } catch (RateLimitException e) {
            throw e;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("AI generation failed: " + e.getMessage(), e);
        }
    }

    private static class RateLimitException extends RuntimeException {
        RateLimitException(String msg) { super(msg); }
    }
}
