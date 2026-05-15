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
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    @Override
    public String generateTest(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("GEMINI_API_KEY is not configured. Add it as an environment variable.");
        }

        try {
            String escapedPrompt = objectMapper.writeValueAsString(prompt);
            String requestBody = """
                    {
                      "contents": [{"parts": [{"text": %s}]}],
                      "generationConfig": {"responseMimeType": "application/json"}
                    }
                    """.formatted(escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ENDPOINT + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(90))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Gemini API error {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Gemini API returned status " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            // Strip markdown fences in case Gemini wraps the JSON
            return text.replaceAll("(?s)^```json\\s*", "").replaceAll("(?s)\\s*```$", "").trim();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("AI generation failed: " + e.getMessage(), e);
        }
    }
}
