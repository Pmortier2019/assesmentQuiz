package com.assesspro.backend.service;

import com.assesspro.backend.ai.AiClient;
import com.assesspro.backend.ai.ModelTier;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Generation routes each test type to the right model tier: reasoning-heavy
 * tests (maths, logic, data) get the stronger model, behavioural tests the
 * cheaper default.
 */
class AiTestGenerationModelTierTest {

    /** Valid single-question JSON — enough to pass validation for any requested type. */
    private static final String VALID_JSON = """
            {
              "title": "Sample",
              "description": "desc",
              "type": "NUMERICAL_REASONING",
              "difficulty": "MEDIUM",
              "language": "EN",
              "estimatedTimeMinutes": 10,
              "displayQuestionCount": 5,
              "questions": [
                {
                  "questionText": "1 + 1?",
                  "explanation": "Two.",
                  "orderIndex": 1,
                  "mediaItems": [],
                  "answerOptions": [
                    { "answerText": "2", "isCorrect": true,  "orderIndex": 1 },
                    { "answerText": "3", "isCorrect": false, "orderIndex": 2 }
                  ]
                }
              ]
            }
            """;

    /** AiClient that records the tier it was asked to generate with. */
    private static class RecordingAiClient implements AiClient {
        ModelTier lastTier;
        @Override public String generateTest(String prompt) { return generateTest(prompt, ModelTier.STANDARD); }
        @Override public String generateTest(String prompt, ModelTier tier) {
            this.lastTier = tier;
            return VALID_JSON;
        }
    }

    private ModelTier tierUsedFor(TestType type) {
        RecordingAiClient client = new RecordingAiClient();
        AssessmentTestRepository repo = mock(AssessmentTestRepository.class);
        when(repo.save(any(AssessmentTest.class))).thenAnswer(returnsFirstArg());

        AiTestGenerationService service =
                new AiTestGenerationService(client, repo, new ObjectMapper());
        service.generateAndSave(type, Difficulty.MEDIUM, 12, "Analyst", "Finance", true);
        return client.lastTier;
    }

    @Test
    void numericalReasoningUsesReasoningTier() {
        assertThat(tierUsedFor(TestType.NUMERICAL_REASONING)).isEqualTo(ModelTier.REASONING);
    }

    @Test
    void dataInterpretationUsesReasoningTier() {
        assertThat(tierUsedFor(TestType.DATA_INTERPRETATION)).isEqualTo(ModelTier.REASONING);
    }

    @Test
    void personalityUsesStandardTier() {
        assertThat(tierUsedFor(TestType.PERSONALITY_WORK_STYLE)).isEqualTo(ModelTier.STANDARD);
    }

    @Test
    void situationalJudgementUsesStandardTier() {
        assertThat(tierUsedFor(TestType.SITUATIONAL_JUDGEMENT)).isEqualTo(ModelTier.STANDARD);
    }
}
