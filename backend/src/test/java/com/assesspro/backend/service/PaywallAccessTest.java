package com.assesspro.backend.service;

import com.assesspro.backend.entity.AnswerOption;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.Question;
import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Role;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.AccessDeniedException;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.SubscriptionRepository;
import com.assesspro.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

/**
 * Exercises the paywall on the real {@link TestService} against H2. This is the
 * money path: free users get five free tests, Pro-only tests require an active
 * subscription, and admins bypass both limits.
 *
 * <p>Not {@code @Transactional}: each repository save commits so that the
 * service's own {@code findById} loads a fresh user with its subscription,
 * mirroring how a real request sees the database.
 */
@SpringBootTest
@ActiveProfiles("test")
class PaywallAccessTest {

    private static final int FREE_TEST_LIMIT = 5;

    @Autowired
    private TestService testService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private AssessmentTestRepository testRepository;

    private Long freeTestId;
    private Long proTestId;

    @BeforeEach
    void seedTests() {
        freeTestId = testRepository.save(buildTest("Paywall Free Test", true)).getId();
        proTestId = testRepository.save(buildTest("Paywall Pro Test", false)).getId();
    }

    private AssessmentTest buildTest(String title, boolean free) {
        AssessmentTest test = AssessmentTest.builder()
                .title(title)
                .type(TestType.NUMERICAL_REASONING)
                .difficulty(Difficulty.EASY)
                .isFree(free)
                .estimatedTimeMinutes(10)
                .build();

        Question question = Question.builder()
                .assessmentTest(test)
                .questionText("What is 1 + 1?")
                .explanation("Basic arithmetic.")
                .orderIndex(1)
                .build();
        AnswerOption option = AnswerOption.builder()
                .answerText("2").isCorrect(true).orderIndex(1).build();
        option.setQuestion(question);
        question.getAnswerOptions().add(option);
        test.getQuestions().add(question);
        return test;
    }

    private User createUser(String email, int freeTestsUsed, Role role) {
        return userRepository.save(User.builder()
                .email(email)
                .name("Test User")
                .emailVerified(true)
                .freeTestsUsed(freeTestsUsed)
                .role(role)
                .build());
    }

    private void giveActiveSubscription(User user) {
        subscriptionRepository.save(Subscription.builder()
                .user(user)
                .status(SubscriptionStatus.ACTIVE)
                .plan("PRO_MONTHLY")
                .build());
    }

    @Test
    void freeUser_underLimit_canOpenFreeTest() {
        User user = createUser("free-under@example.com", FREE_TEST_LIMIT - 1, Role.USER);

        var detail = testService.getTestDetail(freeTestId, user.getId());

        assertThat(detail.getTitle()).isEqualTo("Paywall Free Test");
    }

    @Test
    void freeUser_atLimit_isBlockedFromFreeTest() {
        User user = createUser("free-at-limit@example.com", FREE_TEST_LIMIT, Role.USER);

        assertThatExceptionOfType(AccessDeniedException.class)
                .isThrownBy(() -> testService.getTestDetail(freeTestId, user.getId()));
    }

    @Test
    void freeUser_isBlockedFromProTest() {
        User user = createUser("free-pro-attempt@example.com", 0, Role.USER);

        assertThatExceptionOfType(AccessDeniedException.class)
                .isThrownBy(() -> testService.getTestDetail(proTestId, user.getId()));
    }

    @Test
    void proUser_canOpenProTest() {
        User user = createUser("pro-user@example.com", 0, Role.USER);
        giveActiveSubscription(user);

        var detail = testService.getTestDetail(proTestId, user.getId());

        assertThat(detail.getTitle()).isEqualTo("Paywall Pro Test");
    }

    @Test
    void admin_bypassesFreeLimitAndProGate() {
        User admin = createUser("admin@example.com", FREE_TEST_LIMIT + 10, Role.ADMIN);

        // Over the free limit AND no subscription, yet admin reaches both.
        assertThat(testService.getTestDetail(freeTestId, admin.getId()).getTitle())
                .isEqualTo("Paywall Free Test");
        assertThat(testService.getTestDetail(proTestId, admin.getId()).getTitle())
                .isEqualTo("Paywall Pro Test");
    }
}
