package com.assesspro.backend.service;

import com.assesspro.backend.dto.*;
import com.assesspro.backend.entity.*;
import com.assesspro.backend.entity.enums.AssessmentCategory;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.AccessDeniedException;
import com.assesspro.backend.exception.ResourceNotFoundException;
import com.assesspro.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
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

    /**
     * Paginated search for the public test library. Search, role and industry
     * are matched server-side so the client never downloads-then-filters, and
     * only the requested page is fetched from the database.
     */
    @Transactional(readOnly = true)
    public PagedResponse<TestResponse> searchTests(
            String type, String difficulty, String access,
            String search, String role, String industry,
            int page, int size) {

        TestType testType = type != null ? TestType.valueOf(type.toUpperCase()) : null;
        Difficulty diff = difficulty != null ? Difficulty.valueOf(difficulty.toUpperCase()) : null;
        Boolean isFree = switch (access != null ? access.toLowerCase() : "") {
            case "free" -> true;
            case "pro"  -> false;
            default     -> null;
        };

        String searchParam   = toLikeParam(search);
        String roleParam     = toLikeParam(role);
        String industryParam = toLikeParam(industry);

        // Let a search term match a whole category group ("cognitive", "leadership")
        // by deriving the category from each type — the stored category column is
        // often null on AI-generated tests, but the type is always present.
        List<TestType> typeMatches = matchingTypesForSearch(search);
        boolean hasTypeMatch = !typeMatches.isEmpty();
        // JPQL needs a non-empty IN list to bind even when the flag gates it off.
        if (!hasTypeMatch) typeMatches = List.of(TestType.NUMERICAL_REASONING);

        // Defensive bounds: never let a client request an unbounded page.
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 100);
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<AssessmentTest> result = testRepository.searchWithFilters(
                testType, diff, isFree, searchParam, hasTypeMatch, typeMatches,
                roleParam, industryParam, pageable);

        List<TestResponse> data = result.getContent().stream()
                .map(this::toTestResponse)
                .collect(Collectors.toList());

        return PagedResponse.<TestResponse>builder()
                .data(data)
                .page(safePage)
                .pageSize(safeSize)
                .total(result.getTotalElements())
                .hasMore(result.hasNext())
                .build();
    }

    /** Lower-cases and wraps a filter term in %…% for a LIKE match, or null if blank. */
    private String toLikeParam(String value) {
        if (value == null || value.isBlank()) return null;
        return "%" + value.toLowerCase() + "%";
    }

    /**
     * Types whose category name or label contains the search term, so a group
     * search like "cognitive" or "leadership" returns every test in that group.
     * Returns an empty list when the term matches no category.
     */
    private List<TestType> matchingTypesForSearch(String search) {
        if (search == null || search.isBlank()) return List.of();
        String q = search.toLowerCase().trim();
        return java.util.Arrays.stream(TestType.values())
                .filter(t -> {
                    AssessmentCategory cat = AssessmentCategory.forType(t);
                    String haystack = (cat.name() + " " + cat.getLabel()).toLowerCase();
                    return haystack.contains(q);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestDetailResponse getTestDetail(Long testId, Long userId) {
        AssessmentTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found: " + testId));

        if (!test.isFree()) {
            checkProAccess(userId);
        } else {
            checkFreeLimit(userId);
        }

        List<Question> allQuestions = questionRepository.findByAssessmentTestIdOrderByOrderIndex(testId);
        List<Question> questions = selectQuestions(allQuestions, test.getDisplayQuestionCount());
        return toTestDetailResponse(test, questions);
    }

    @Transactional
    public SubmitTestResponse submitTest(Long testId, Long userId, SubmitTestRequest request) {
        AssessmentTest test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found: " + testId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (!test.isFree()) {
            checkProAccess(user.getId());
        } else {
            checkFreeLimit(user.getId());
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

        // Award XP: 10 base + 1 per % above 50 + 20 bonus for perfect
        int xpGained = 10 + Math.max(0, score - 50) + (score == 100 ? 20 : 0);
        user.setXp(user.getXp() + xpGained);

        // Increment free tests counter for non-pro users
        if (test.isFree()) {
            user.setFreeTestsUsed(user.getFreeTestsUsed() + 1);
        }
        userRepository.save(user);

        return SubmitTestResponse.builder()
                .resultId(result.getId())
                .testId(testId)
                .userId(user.getId())
                .score(score)
                .totalQuestions(result.getTotalQuestions())
                .correctAnswers(correct)
                .timeTakenSeconds(result.getTimeTakenSeconds())
                .feedback(result.getFeedback())
                .tips(buildTips(score, test.getType()))
                .completedAt(result.getCreatedAt())
                .questionResults(details)
                .build();
    }

    private void checkProAccess(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getRole() == com.assesspro.backend.entity.enums.Role.ADMIN) return;

        boolean isPro = user.getSubscription() != null
                && user.getSubscription().getStatus() == SubscriptionStatus.ACTIVE;

        if (!isPro) {
            throw new AccessDeniedException("Pro subscription required to access this test.");
        }
    }

    private void checkFreeLimit(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getRole() == com.assesspro.backend.entity.enums.Role.ADMIN) return;

        boolean isPro = user.getSubscription() != null
                && user.getSubscription().getStatus() == SubscriptionStatus.ACTIVE;

        if (!isPro && user.getFreeTestsUsed() >= FREE_TEST_LIMIT) {
            throw new AccessDeniedException("Free test limit reached. Upgrade to Pro to access more tests.");
        }
    }

    private List<Question> selectQuestions(List<Question> pool, int displayCount) {
        if (displayCount <= 0 || displayCount >= pool.size()) return pool;
        List<Question> shuffled = new ArrayList<>(pool);
        Collections.shuffle(shuffled);
        return shuffled.subList(0, displayCount);
    }

    private String buildFeedback(int score) {
        if (score >= 80) return "Excellent! You have a strong grasp of this topic.";
        if (score >= 60) return "Good effort! Review the questions you missed to improve further.";
        if (score >= 40) return "Keep practicing. Focus on the explanations for incorrect answers.";
        return "This topic needs more work. Review the material and try again.";
    }

    private List<String> buildTips(int score, TestType type) {
        List<String> tips = new ArrayList<>();

        // Score-based tip
        if (score < 40) {
            tips.add("Go back to basics: re-read each explanation before retrying this test.");
        } else if (score < 60) {
            tips.add("Focus on the questions you got wrong and work through the explanations step by step.");
        } else if (score < 80) {
            tips.add("You're close — try to identify whether your mistakes are due to rushing or gaps in knowledge.");
        } else {
            tips.add("Great score! Challenge yourself with a harder difficulty to keep improving.");
        }

        // Test-type specific tips
        switch (type) {
            case NUMERICAL_REASONING -> {
                tips.add("Always estimate the answer first — it helps you catch calculation errors early.");
                tips.add("Write down intermediate steps; mental arithmetic under time pressure leads to small mistakes.");
                tips.add("Practise percentage change daily: (new − old) ÷ old × 100.");
            }
            case LOGICAL_REASONING -> {
                tips.add("Eliminate impossible answers first rather than looking for the right one directly.");
                tips.add("Draw out patterns or sequences on paper — visualising them makes the rule easier to spot.");
                tips.add("For syllogism questions, use a quick Venn diagram to test whether the conclusion must be true.");
            }
            case VERBAL_REASONING -> {
                tips.add("Answer only from what the passage says — your own knowledge can lead you astray.");
                tips.add("Watch for absolute words like 'always', 'never', 'all' — they are almost always false.");
                tips.add("Skim the questions before reading the passage so you know what to look for.");
            }
            case SITUATIONAL_JUDGEMENT -> {
                tips.add("Think about what response best balances the needs of both the team and the organisation.");
                tips.add("Avoid options that ignore the problem, create conflict, or bypass proper procedures.");
                tips.add("Consider the long-term outcome of each option, not just the immediate fix.");
            }
            case PERSONALITY_WORK_STYLE -> {
                tips.add("Answer based on how you actually behave at work, not how you think you should behave.");
                tips.add("Consistency matters — if you answer very differently on similar questions it can lower your reliability score.");
                tips.add("There are no universally correct answers; focus on accurately representing your work style.");
            }
            default -> tips.add("Review your incorrect answers and read each explanation carefully before your next attempt.");
        }

        return tips;
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
                .displayQuestionCount(test.getDisplayQuestionCount())
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
                .map(q -> {
                    List<AnswerOption> shuffledOptions = new ArrayList<>(q.getAnswerOptions());
                    Collections.shuffle(shuffledOptions);
                    return QuestionResponse.builder()
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
                        .answerOptions(shuffledOptions.stream()
                                .map(a -> AnswerOptionResponse.builder()
                                        .id(a.getId())
                                        .answerText(a.getAnswerText())
                                        .orderIndex(a.getOrderIndex())
                                        .build())
                                .collect(Collectors.toList()))
                        .build();
                })
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
