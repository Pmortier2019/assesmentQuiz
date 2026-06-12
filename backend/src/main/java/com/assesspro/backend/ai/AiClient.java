package com.assesspro.backend.ai;

/**
 * Abstraction over any AI provider.
 *
 * TODO: Replace MockAiClient with a real implementation when connecting to an AI provider.
 * Suggested providers: OpenAI GPT-4o, Anthropic Claude, or Google Gemini.
 * The real implementation should POST the prompt to the provider's chat-completions endpoint
 * and return the raw JSON string from the response.
 */
public interface AiClient {

    /**
     * Sends a prompt to the AI and returns a raw JSON string representing a generated test.
     *
     * @param prompt structured prompt describing the test to generate
     * @return raw JSON string matching the AssessmentTest structure
     */
    String generateTest(String prompt);

    /**
     * As {@link #generateTest(String)}, but lets the caller signal how much
     * reasoning power the test needs so the client can pick an appropriate model.
     * Defaults to ignoring the tier; clients that support multiple models override it.
     *
     * @param prompt structured prompt describing the test to generate
     * @param tier   how reasoning-heavy this test is
     * @return raw JSON string matching the AssessmentTest structure
     */
    default String generateTest(String prompt, ModelTier tier) {
        return generateTest(prompt);
    }
}
