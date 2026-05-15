package com.assesspro.backend.service;

import com.assesspro.backend.dto.*;
import com.assesspro.backend.entity.*;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.AccessDeniedException;
import com.assesspro.backend.exception.ResourceNotFoundException;
import com.assesspro.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestService {

    private static final int FREE_TEST_LIMIT = 5;

    private final AssessmentTestRepository testRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TestResultRepository resultRepository;

    @Transactional(readOnly = true)
    public List<TestResponse> getTests(String type, String difficulty, String access) {
        TestType testType = type != null ? TestType.valueOf(type.toUpperCase()) : null;
        Difficulty diff = difficulty != null ? Difficulty.valueOf(difficulty.toUpperCase()) : null;
        Boolean isFree = switch (access != null ? access.toLowerCase() : "") {
            case "free" -> true;
            case "pro"  -> false;
            default     -> null;
        };

        return testRepository.findWithFilters(testType, diff, isFree, null)
                .stream()
                .map(this::toTestResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestDetailResponse getTestDetail(Long testId, Long userId) {
        AssessmentTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found: " + testId));

        if (!test.isFree()) {
            checkProAccess(userId, test);
        }

        List<Question> questions = questionRepository.findByAssessmentTestIdOrderByOrderIndex(testId);
        return toTestDetailResponse(test, questions);
    }

    @Transactional
    public SubmitTestResponse submitTest(Long testId, SubmitTestRequest request) {
        AssessmentTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found: " + testId));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));

        if (!test.isFree()) {
            checkProAccess(user.getId(), test);
        }

        List<Question> questions = questionRepository.findByAssessmentTestIdOrderByOrderIndex(testId);
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, Function.identity()));

        TestResult result = TestResult.builder()
                .user(user)
                .assessmentTest(test)
                .totalQuestions(questions.size())
                .timeTakenSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0)
                .userAnswers(new ArrayList<>())
                .build();

        int correct = 0;
        List<SubmitTestResponse.QuestionResultDetail> details = new ArrayList<>();

        for (SubmitTestRequest.AnswerSubmission submission : request.getAnswers()) {
            Question question = questionMap.get(submission.getQuestionId());
            if (question == null) continue;

            AnswerOption selected = question.getAnswerOptions().stream()
                    .filter(a -> a.getId().equals(submission.getSelectedAnswerOptionId()))
                    .findFirst()
                    .orElse(null);

            boolean isCorrect = selected != null && selected.isCorrect();
            if (isCorrect) correct++;

            UserAnswer userAnswer = UserAnswer.builder()
                    .testResult(result)
                    .question(question)
                    .selectedAnswerOption(selected)
                    .isCorrect(isCorrect)
                    .build();
            result.getUserAnswers().add(userAnswer);

            details.add(SubmitTestResponse.QuestionResultDetail.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .explanation(question.getExplanation())
                    .selectedAnswerOptionId(selected != null ? selected.getId() : null)
                    .isCorrect(isCorrect)
                    .answerOptions(question.getAnswerOptions().stream()
                            .map(a -> AnswerOptionResultResponse.builder()
                                    .id(a.getId())
                                    .answerText(a.getAnswerText())
                                    .isCorrect(a.isCorrect())
                                    .orderIndex(a.getOrderIndex())
                                    .build())
                            .collect(Collectors.toList()))
                    .build());
        }

        int score = questions.isEmpty() ? 0 : (correct * 100) / questions.size();
        result.setScore(score);
        result.setCorrectAnswers(correct);
        result.setFeedback(buildFeedback(score));

        resultRepository.save(result);

        // Increment free tests counter for non-pro users
        if (test.isFree()) {
            user.setFreeTestsUsed(user.getFreeTestsUsed() + 1);
            userRepository.save(user);
        }

        return SubmitTestResponse.builder()
                .resultId(result.getId())
                .testId(testId)
                .userId(user.getId())
                .score(score)
                .totalQuestions(result.getTotalQuestions())
                .correctAnswers(correct)
                .timeTakenSeconds(result.getTimeTakenSeconds())
                .feedback(result.getFeedback())
                .completedAt(result.getCreatedAt())
                .questionResults(details)
                .build();
    }

    private void checkProAccess(Long userId, AssessmentTest test) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        boolean isPro = user.getSubscription() != null
                && user.getSubscription().getStatus() == SubscriptionStatus.ACTIVE;

        if (!isPro) {
            if (user.getFreeTestsUsed() >= FREE_TEST_LIMIT) {
                throw new AccessDeniedException(
                        "Free test limit reached. Upgrade to Pro to access more tests.");
            }
        }
    }

    private String buildFeedback(int score) {
        if (score >= 80) return "Excellent! You have a strong grasp of this topic.";
        if (score >= 60) return "Good effort! Review the questions you missed to improve further.";
        if (score >= 40) return "Keep practicing. Focus on the explanations for incorrect answers.";
        return "This topic needs more work. Review the material and try again.";
    }

    public TestResponse toTestResponse(AssessmentTest test) {
        return toTestResponseWithRecommendedFlag(test, false);
    }

    public TestResponse toTestResponseWithRecommendedFlag(AssessmentTest test, boolean isRecommended) {
        return TestResponse.builder()
                .id(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .type(test.getType())
                .difficulty(test.getDifficulty())
                .language(test.getLanguage())
                .isFree(test.isFree())
                .isGeneratedByAI(test.isGeneratedByAI())
                .estimatedTimeMinutes(test.getEstimatedTimeMinutes())
                .questionCount(test.getQuestions().size())
                .createdAt(test.getCreatedAt())
                .category(test.getCategory())
                .subcategory(test.getSubcategory())
                .targetRoles(test.getTargetRoles())
                .targetIndustries(test.getTargetIndustries())
                .recommendedForCompanies(test.getRecommendedForCompanies())
                .skillsMeasured(test.getSkillsMeasured())
                .isRecommended(isRecommended)
                .build();
    }

    private TestDetailResponse toTestDetailResponse(AssessmentTest test, List<Question> questions) {
        List<QuestionResponse> questionResponses = questions.stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .explanation(q.getExplanation())
                        .orderIndex(q.getOrderIndex())
                        .mediaItems(q.getMediaItems().stream()
                                .map(m -> QuestionMediaResponse.builder()
                                        .id(m.getId())
                                        .mediaType(m.getMediaType())
                                        .url(m.getUrl())
                                        .altText(m.getAltText())
                                        .caption(m.getCaption())
                                        .build())
                                .collect(Collectors.toList()))
                        .answerOptions(q.getAnswerOptions().stream()
                                .map(a -> AnswerOptionResponse.builder()
                                        .id(a.getId())
                                        .answerText(a.getAnswerText())
                                        .orderIndex(a.getOrderIndex())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return TestDetailResponse.builder()
                .id(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .type(test.getType())
                .difficulty(test.getDifficulty())
                .language(test.getLanguage())
                .isFree(test.isFree())
                .isGeneratedByAI(test.isGeneratedByAI())
                .estimatedTimeMinutes(test.getEstimatedTimeMinutes())
                .createdAt(test.getCreatedAt())
                .questions(questionResponses)
                .build();
    }
}
