package com.assesspro.backend.service;

import com.assesspro.backend.dto.*;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.ResourceNotFoundException;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.TestResultRepository;
import com.assesspro.backend.repository.UserRepository;
import com.assesspro.backend.service.recommendation.RecommendationEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TestResultRepository resultRepository;
    private final AssessmentTestRepository testRepository;
    private final TestService testService;
    private final RecommendationEngine recommendationEngine;

    @Transactional(readOnly = true)
    public UserResponse getUser(Long userId) {
        User user = findUser(userId);
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public User getUserEntity(Long userId) {
        return findUser(userId);
    }

    @Transactional(readOnly = true)
    public List<UserResultResponse> getUserResults(Long userId) {
        findUser(userId);
        return resultRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toUserResultResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns recommended tests driven by the user's career targets.
     * Falls back to most-attempted type if no targets are set.
     *
     * TODO: Replace RecommendationEngine with AiRecommendationEngine for
     * weak-skill detection, company-specific patterns, and adaptive difficulty.
     */
    @Transactional(readOnly = true)
    public List<TestResponse> getRecommendations(Long userId) {
        User user = findUser(userId);
        List<AssessmentTest> allTests = testRepository.findAll();

        // Career-based recommendations via the rule engine
        List<AssessmentTest> recommended = recommendationEngine.recommendTests(user, allTests);

        if (!recommended.isEmpty()) {
            Set<Long> recommendedIds = recommended.stream()
                    .map(AssessmentTest::getId)
                    .collect(Collectors.toSet());
            return allTests.stream()
                    .sorted((a, b) -> {
                        boolean aRec = recommendedIds.contains(a.getId());
                        boolean bRec = recommendedIds.contains(b.getId());
                        return Boolean.compare(!aRec, !bRec);
                    })
                    .limit(6)
                    .map(t -> testService.toTestResponseWithRecommendedFlag(t, recommendedIds.contains(t.getId())))
                    .collect(Collectors.toList());
        }

        // Fallback: most-attempted type
        List<TestResult> results = resultRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (results.isEmpty()) {
            return testRepository.findWithFilters(null, null, true, null)
                    .stream().limit(5).map(testService::toTestResponse).collect(Collectors.toList());
        }
        TestType favoriteType = results.stream()
                .collect(Collectors.groupingBy(r -> r.getAssessmentTest().getType(), Collectors.counting()))
                .entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey).orElse(null);
        boolean isPro = user.getSubscription() != null
                && user.getSubscription().getStatus() == SubscriptionStatus.ACTIVE;
        Boolean freeFilter = isPro ? null : true;
        return testRepository.findWithFilters(favoriteType, null, freeFilter, null)
                .stream().limit(5).map(testService::toTestResponse).collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateCareerTargets(Long userId, CareerTargetsRequest request) {
        User user = findUser(userId);
        user.setTargetRole(request.getTargetRole());
        user.setTargetIndustry(request.getTargetIndustry());
        user.setTargetCompany(request.getTargetCompany());
        userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public PreparationPathResponse getPreparationPath(Long userId) {
        User user = findUser(userId);
        return recommendationEngine.generatePreparationPath(user);
    }

    @Transactional(readOnly = true)
    public List<TestResponse> getRecommendedTests(Long userId) {
        User user = findUser(userId);
        List<AssessmentTest> allTests = testRepository.findAll();
        List<AssessmentTest> recommended = recommendationEngine.recommendTests(user, allTests);
        return recommended.stream()
                .map(t -> testService.toTestResponseWithRecommendedFlag(t, true))
                .collect(Collectors.toList());
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    public UserResponse toUserResponse(User user) {
        Subscription sub = user.getSubscription();
        boolean isPro = sub != null && sub.getStatus() == SubscriptionStatus.ACTIVE;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .preferredLanguage(user.getPreferredLanguage())
                .freeTestsUsed(user.getFreeTestsUsed())
                .isPro(isPro)
                .createdAt(user.getCreatedAt())
                .targetRole(user.getTargetRole())
                .targetIndustry(user.getTargetIndustry())
                .targetCompany(user.getTargetCompany())
                .build();
    }

    private UserResultResponse toUserResultResponse(TestResult result) {
        return UserResultResponse.builder()
                .resultId(result.getId())
                .testId(result.getAssessmentTest().getId())
                .testTitle(result.getAssessmentTest().getTitle())
                .score(result.getScore())
                .totalQuestions(result.getTotalQuestions())
                .correctAnswers(result.getCorrectAnswers())
                .timeTakenSeconds(result.getTimeTakenSeconds())
                .feedback(result.getFeedback())
                .completedAt(result.getCreatedAt())
                .build();
    }
}
