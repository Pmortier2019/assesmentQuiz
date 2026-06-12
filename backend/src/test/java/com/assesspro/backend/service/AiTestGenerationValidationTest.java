package com.assesspro.backend.service;

import com.assesspro.backend.ai.AiClient;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Generation hardening: the requested language and a safe displayQuestionCount
 * are forced onto the saved test, and malformed model output (wrong option
 * count, duplicate questions) is rejected so it never reaches the database.
 */
class AiTestGenerationValidationTest {

    /** AiClient that returns a fixed JSON payload, ignoring the prompt. */
    private record FixedAiClient(String json) implements AiClient {
        @Override public String generateTest(String prompt) { return json; }
    }

    private AiTestGenerationService serviceReturning(String json) {
        AssessmentTestRepository repo = mock(AssessmentTestRepository.class);
        when(repo.save(any(AssessmentTest.class))).thenAnswer(returnsFirstArg());
        return new AiTestGenerationService(new FixedAiClient(json), repo, new ObjectMapper());
    }

    @Test
    void forcesRequestedLanguageAndDerivesDisplayCount() {
        // Model echoes EN, but the caller asked for NL — the saved test must be NL.
        AiTestGenerationService service = serviceReturning(validJson("EN", 4, 4));

        AssessmentTest test = service.generateAndSave(
                TestType.NUMERICAL_REASONING, Difficulty.MEDIUM, Language.NL, 4);

        assertThat(test.getLanguage()).isEqualTo(Language.NL);
        // Pool of 4 → shown count clamped to less than the pool.
        assertThat(test.getDisplayQuestionCount()).isLessThan(test.getQuestions().size());
        assertThat(test.getDisplayQuestionCount()).isEqualTo(3);
    }

    @Test
    void rejectsQuestionWithoutExactlyFourOptions() {
        AiTestGenerationService service = serviceReturning(validJson("EN", 3, 3)); // 3 options

        assertThatThrownBy(() -> service.generateAndSave(
                TestType.NUMERICAL_REASONING, Difficulty.MEDIUM, Language.EN, 4))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("after 3 attempts");
    }

    @Test
    void rejectsDuplicateQuestions() {
        // Two identical question stems in one pool.
        String json = """
                {
                  "title": "Dup", "description": "d", "type": "NUMERICAL_REASONING",
                  "difficulty": "MEDIUM", "language": "EN", "estimatedTimeMinutes": 10,
                  "displayQuestionCount": 2,
                  "questions": [%s, %s]
                }
                """.formatted(question("Same stem?", 4), question("Same stem?", 4));
        AiTestGenerationService service = serviceReturning(json);

        assertThatThrownBy(() -> service.generateAndSave(
                TestType.NUMERICAL_REASONING, Difficulty.MEDIUM, Language.EN, 4))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("after 3 attempts");
    }

    /** Builds a valid test JSON with {@code questionCount} unique questions, each with {@code options} options. */
    private String validJson(String language, int questionCount, int options) {
        String questions = IntStream.range(0, questionCount)
                .mapToObj(i -> question("Question number " + i + "?", options))
                .collect(Collectors.joining(", "));
        return """
                {
                  "title": "Sample", "description": "desc", "type": "NUMERICAL_REASONING",
                  "difficulty": "MEDIUM", "language": "%s", "estimatedTimeMinutes": 10,
                  "displayQuestionCount": 99,
                  "questions": [%s]
                }
                """.formatted(language, questions);
    }

    /** One question JSON with the given stem and option count; the first option is correct. */
    private String question(String stem, int options) {
        List<String> opts = IntStream.range(0, options)
                .mapToObj(i -> """
                        { "answerText": "opt %d", "isCorrect": %b, "orderIndex": %d }"""
                        .formatted(i, i == 0, i + 1))
                .collect(Collectors.toList());
        return """
                {
                  "questionText": "%s",
                  "explanation": "because",
                  "orderIndex": 1,
                  "mediaItems": [],
                  "answerOptions": [%s]
                }""".formatted(stem, String.join(", ", opts));
    }
}
