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
public class ClaudeAiClient implements AiClient {

    private static final String ENDPOINT = "https://api.anthropic.com/v1/messages";
    // Cheaper/faster default for behavioural tests with no single correct answer.
    private static final String STANDARD_MODEL = "claude-haiku-4-5-20251001";
    // Stronger model for maths/logic/data tests, where a reasoning slip yields a
    // wrong "correct" answer. Worth the extra cost on those categories only.
    private static final String REASONING_MODEL = "claude-sonnet-4-6";
    private static final String ANTHROPIC_VERSION = "2023-06-01";

    @Value("${ANTHROPIC_API_KEY:}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    @Override
    public String generateTest(String prompt) {
        return generateTest(prompt, ModelTier.STANDARD);
    }

    @Override
    public String generateTest(String prompt, ModelTier tier) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("ANTHROPIC_API_KEY is not configured. Add it as an environment variable.");
        }

        String model = tier == ModelTier.REASONING ? REASONING_MODEL : STANDARD_MODEL;

        try {
            String escapedPrompt = objectMapper.writeValueAsString(prompt);
            String requestBody = """
                    {
                      "model": "%s",
                      "max_tokens": 8192,
                      "messages": [{"role": "user", "content": %s}]
                    }
                    """.formatted(model, escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ENDPOINT))
                    .header("Content-Type", "application/json")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", ANTHROPIC_VERSION)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(240))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 429) {
                log.warn("Claude rate limit (429): {}", response.body());
                throw new RuntimeException("Claude rate limit reached — try again in a moment.");
            }
            if (response.statusCode() != 200) {
                log.error("Claude API error {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Claude API returned status " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            String text = root.path("content").get(0).path("text").asText();

            return text.replaceAll("(?s)^```json\\s*", "").replaceAll("(?s)\\s*```$", "").trim();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Claude API call failed", e);
            throw new RuntimeException("Test generation failed: " + e.getMessage(), e);
        }
    }
}
