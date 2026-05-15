package com.assesspro.backend.service;

import com.assesspro.backend.dto.ImportTestRequest;
import com.assesspro.backend.entity.AnswerOption;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.Question;
import com.assesspro.backend.entity.enums.AssessmentCategory;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportTestService {

    private final TestRepository testRepository;

    @Transactional
    public AssessmentTest importTest(ImportTestRequest req) {
        TestType type = parseType(req.getType());
        Difficulty difficulty = parseDifficulty(req.getDifficulty());
        AssessmentCategory category = parseCategory(req.getCategory());

        AssessmentTest test = AssessmentTest.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .type(type)
                .difficulty(difficulty)
                .language(Language.EN)
                .category(category)
                .subcategory(req.getSubcategory())
                .targetRoles(orEmpty(req.getTargetRoles()))
                .targetIndustries(orEmpty(req.getTargetIndustries()))
                .recommendedForCompanies(orEmpty(req.getRecommendedForCompanies()))
                .skillsMeasured(orEmpty(req.getSkillsMeasured()))
                .isFree(req.isFree())
                .isGeneratedByAI(false)
                .estimatedTimeMinutes(req.getEstimatedTimeMinutes())
                .build();

        if (req.getQuestions() != null) {
            for (ImportTestRequest.ImportQuestionDto qDto : req.getQuestions()) {
                Question question = Question.builder()
                        .assessmentTest(test)
                        .questionText(qDto.getQuestionText())
                        .explanation(qDto.getExplanation())
                        .orderIndex(qDto.getOrderIndex())
                        .build();

                if (qDto.getAnswers() != null) {
                    for (ImportTestRequest.ImportAnswerDto aDto : qDto.getAnswers()) {
                        AnswerOption option = AnswerOption.builder()
                                .question(question)
                                .answerText(aDto.getAnswerText())
                                .isCorrect(aDto.isCorrect())
                                .orderIndex(aDto.getOrderIndex())
                                .build();
                        question.getAnswerOptions().add(option);
                    }
                }

                test.getQuestions().add(question);
            }
        }

        return testRepository.save(test);
    }

    private TestType parseType(String raw) {
        if (raw == null) throw new IllegalArgumentException("type is required");
        try {
            return TestType.valueOf(raw.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown type: " + raw +
                    ". Valid values: NUMERICAL_REASONING, LOGICAL_REASONING, VERBAL_REASONING, SITUATIONAL_JUDGEMENT, PERSONALITY_WORK_STYLE");
        }
    }

    private Difficulty parseDifficulty(String raw) {
        if (raw == null) return Difficulty.MEDIUM;
        return switch (raw.toUpperCase()) {
            case "EASY", "BEGINNER"    -> Difficulty.EASY;
            case "HARD", "ADVANCED"    -> Difficulty.HARD;
            default                    -> Difficulty.MEDIUM;
        };
    }

    private AssessmentCategory parseCategory(String raw) {
        if (raw == null) return null;
        try {
            return AssessmentCategory.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private List<String> orEmpty(List<String> list) {
        return list != null ? list : new ArrayList<>();
    }
}
