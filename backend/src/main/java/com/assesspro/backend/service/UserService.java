package com.assesspro.backend.service;

import com.assesspro.backend.dto.TestResponse;
import com.assesspro.backend.dto.UserResponse;
import com.assesspro.backend.dto.UserResultResponse;
import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.ResourceNotFoundException;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.TestResultRepository;
import com.assesspro.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TestResultRepository resultRepository;
    private final AssessmentTestRepository testRepository;
    private final TestService testService;

    @Transactional(readOnly = true)
    public UserResponse getUser(Long userId) {
        User user = findUser(userId);
        return toUserResponse(user);
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
     * Returns recommended tests based on the user's past performance.
     * Currently returns tests of the type the user has attempted most,
     * filtered to free tests when the user has not upgraded.
     *
     * TODO: Replace with a proper ML-based recommendation when available.
     */
    @Transactional(readOnly = true)
    public List<TestResponse> getRecommendations(Long userId) {
        User user = findUser(userId);
        List<TestResult> results = resultRepository.findByUserIdOrderByCreatedAtDesc(userId);

        boolean isPro = user.getSubscription() != null
                && user.getSubscription().getStatus() == SubscriptionStatus.ACTIVE;

        if (results.isEmpty()) {
            // No history → return easy free tests
            return testRepository.findWithFilters(null, null, true, null)
                    .stream()
                    .limit(5)
                    .map(testService::toTestResponse)
                    .collect(Collectors.toList());
        }

        // Find the most-attempted test type
        TestType favoriteType = results.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getAssessmentTest().getType(),
                        Collectors.counting()))
                .entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse(null);

        Boolean freeFilter = isPro ? null : true;
        return testRepository.findWithFilters(favoriteType, null, freeFilter, null)
                .stream()
                .limit(5)
                .map(testService::toTestResponse)
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
