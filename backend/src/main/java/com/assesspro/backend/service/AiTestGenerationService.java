package com.assesspro.backend.service;

import com.assesspro.backend.ai.AiClient;
import com.assesspro.backend.ai.AiTestJson;
import com.assesspro.backend.entity.*;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.MediaType;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.AiGenerationException;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiTestGenerationService {

    private final AiClient aiClient;
    private final AssessmentTestRepository testRepository;
    private final ObjectMapper objectMapper;

    /**
     * Generates, validates, and persists an AI-created test.
     *
     * TODO: When connecting a real AI provider, the prompt below can be adjusted
     * to specify output format, tone, question style, or include few-shot examples.
     */
    @Transactional
    public AssessmentTest generateAndSave(TestType type, Difficulty difficulty, Language language, int numberOfQuestions) {
        String prompt = buildPrompt(type, difficulty, language, numberOfQuestions);
        log.debug("Sending prompt to AI client: {}", prompt);

        String rawJson = aiClient.generateTest(prompt);
        log.debug("Received raw JSON from AI client");

        AiTestJson.TestJson testJson = parseJson(rawJson);
        validateTestJson(testJson);

        AssessmentTest test = mapToEntity(testJson);
        test.setGeneratedByAI(true);
        test.setFree(false);

        AssessmentTest saved = testRepository.save(test);
        log.info("AI-generated test saved with id={}", saved.getId());
        return saved;
    }

    private String buildPrompt(TestType type, Difficulty difficulty, Language language, int count) {
        return String.format(
                "Generate a %s assessment test with %d questions. Difficulty: %s. Language: %s. " +
                "Return valid JSON only, no extra text. Structure: { title, description, type, difficulty, language, " +
                "estimatedTimeMinutes, questions: [ { questionText, explanation, orderIndex, mediaItems: [], " +
                "answerOptions: [ { answerText, isCorrect, orderIndex } ] } ] }. " +
                "Each question must have exactly one correct answer.",
                type.name(), count, difficulty.name(), language.name()
        );
    }

    private AiTestJson.TestJson parseJson(String raw) {
        try {
            return objectMapper.readValue(raw, AiTestJson.TestJson.class);
        } catch (Exception e) {
            throw new AiGenerationException("Failed to parse AI response as JSON: " + e.getMessage(), e);
        }
    }

    private void validateTestJson(AiTestJson.TestJson test) {
        if (test.getTitle() == null || test.getTitle().isBlank()) {
            throw new AiGenerationException("Generated test has no title");
        }
        if (test.getType() == null || test.getType().isBlank()) {
            throw new AiGenerationException("Generated test has no type");
        }
        if (test.getDifficulty() == null || test.getDifficulty().isBlank()) {
            throw new AiGenerationException("Generated test has no difficulty");
        }
        if (test.getLanguage() == null || test.getLanguage().isBlank()) {
            throw new AiGenerationException("Generated test has no language");
        }
        if (test.getQuestions() == null || test.getQuestions().isEmpty()) {
            throw new AiGenerationException("Generated test has no questions");
        }

        for (int i = 0; i < test.getQuestions().size(); i++) {
            AiTestJson.QuestionJson q = test.getQuestions().get(i);

            if (q.getAnswerOptions() == null || q.getAnswerOptions().isEmpty()) {
                throw new AiGenerationException("Question at index " + i + " has no answer options");
            }

            long correctCount = q.getAnswerOptions().stream().filter(AiTestJson.AnswerOptionJson::isCorrect).count();
            if (correctCount == 0) {
                throw new AiGenerationException("Question at index " + i + " has no correct answer");
            }
            if (correctCount > 1) {
                throw new AiGenerationException("Question at index " + i + " has multiple correct answers");
            }

            if (q.getMediaItems() != null) {
                for (AiTestJson.MediaItemJson media : q.getMediaItems()) {
                    try {
                        MediaType.valueOf(media.getMediaType().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new AiGenerationException("Invalid media type: " + media.getMediaType());
                    }
                }
            }
        }
    }

    private AssessmentTest mapToEntity(AiTestJson.TestJson json) {
        AssessmentTest test = AssessmentTest.builder()
                .title(json.getTitle())
                .description(json.getDescription())
                .type(TestType.valueOf(json.getType().toUpperCase()))
                .difficulty(Difficulty.valueOf(json.getDifficulty().toUpperCase()))
                .language(Language.valueOf(json.getLanguage().toUpperCase()))
                .estimatedTimeMinutes(json.getEstimatedTimeMinutes())
                .questions(new ArrayList<>())
                .build();

        for (AiTestJson.QuestionJson qJson : json.getQuestions()) {
            Question question = Question.builder()
                    .assessmentTest(test)
                    .questionText(qJson.getQuestionText())
                    .explanation(qJson.getExplanation())
                    .orderIndex(qJson.getOrderIndex())
                    .mediaItems(new ArrayList<>())
                    .answerOptions(new ArrayList<>())
                    .build();

            if (qJson.getMediaItems() != null) {
                for (AiTestJson.MediaItemJson mJson : qJson.getMediaItems()) {
                    QuestionMedia media = QuestionMedia.builder()
                            .question(question)
                            .mediaType(MediaType.valueOf(mJson.getMediaType().toUpperCase()))
                            .url(mJson.getUrl())
                            .altText(mJson.getAltText())
                            .caption(mJson.getCaption())
                            .build();
                    question.getMediaItems().add(media);
                }
            }

            for (AiTestJson.AnswerOptionJson aJson : qJson.getAnswerOptions()) {
                AnswerOption option = AnswerOption.builder()
                        .question(question)
                        .answerText(aJson.getAnswerText())
                        .isCorrect(aJson.isCorrect())
                        .orderIndex(aJson.getOrderIndex())
                        .build();
                question.getAnswerOptions().add(option);
            }

            test.getQuestions().add(question);
        }

        return test;
    }
}
