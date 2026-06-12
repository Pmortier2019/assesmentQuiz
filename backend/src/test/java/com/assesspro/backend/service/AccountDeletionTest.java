package com.assesspro.backend.service;

import com.assesspro.backend.entity.AnswerOption;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.EmailVerificationToken;
import com.assesspro.backend.entity.PasswordResetToken;
import com.assesspro.backend.entity.Question;
import com.assesspro.backend.entity.Subscription;
import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.UserAnswer;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Role;
import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.EmailVerificationTokenRepository;
import com.assesspro.backend.repository.PasswordResetTokenRepository;
import com.assesspro.backend.repository.SubscriptionRepository;
import com.assesspro.backend.repository.TestResultRepository;
import com.assesspro.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that deleting an account erases every record tied to the user — the
 * GDPR "right to be forgotten" path. Not {@code @Transactional}: each save
 * commits so the deletion runs against real persisted rows.
 */
@SpringBootTest
@ActiveProfiles("test")
class AccountDeletionTest {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private SubscriptionRepository subscriptionRepository;
    @Autowired private TestResultRepository resultRepository;
    @Autowired private AssessmentTestRepository testRepository;
    @Autowired private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;

    @Test
    void deleteAccount_removesUserAndAllAssociatedData() {
        // Seed a fully-populated user: subscription, a result with an answer, and both tokens.
        User user = userRepository.save(User.builder()
                .email("erase-me@example.com").name("Erase Me")
                .emailVerified(true).role(Role.USER).build());
        Long userId = user.getId();

        subscriptionRepository.save(Subscription.builder()
                .user(user).status(SubscriptionStatus.ACTIVE).plan("PRO_MONTHLY").build());

        AssessmentTest test = testRepository.save(buildTest());
        Question question = test.getQuestions().get(0);
        AnswerOption option = question.getAnswerOptions().get(0);

        TestResult result = TestResult.builder()
                .user(user).assessmentTest(test)
                .score(100).totalQuestions(1).correctAnswers(1).build();
        result.getUserAnswers().add(UserAnswer.builder()
                .testResult(result).question(question).selectedAnswerOption(option).isCorrect(true).build());
        resultRepository.save(result);

        emailVerificationTokenRepository.save(EmailVerificationToken.builder()
                .user(user).token("verify-tok").expiresAt(LocalDateTime.now().plusHours(1)).build());
        passwordResetTokenRepository.save(PasswordResetToken.builder()
                .user(user).token("reset-tok").expiresAt(LocalDateTime.now().plusHours(1)).build());

        // Act
        userService.deleteAccount(userId);

        // Assert: nothing tied to the user survives.
        assertThat(userRepository.findById(userId)).isEmpty();
        assertThat(resultRepository.countByUserId(userId)).isZero();
        assertThat(subscriptionRepository.findByUserId(userId)).isEmpty();
        assertThat(emailVerificationTokenRepository.findByToken("verify-tok")).isEmpty();
        assertThat(passwordResetTokenRepository.findByToken("reset-tok")).isEmpty();
    }

    @Test
    void exportUserData_returnsProfileSubscriptionAndResults() {
        // Seed a user with Pro subscription and one completed result.
        User user = userRepository.save(User.builder()
                .email("export-me@example.com").name("Export Me")
                .emailVerified(true).role(Role.USER).build());
        Long userId = user.getId();

        subscriptionRepository.save(Subscription.builder()
                .user(user).status(SubscriptionStatus.ACTIVE).plan("PRO_MONTHLY").build());

        AssessmentTest test = testRepository.save(buildTest());
        resultRepository.save(TestResult.builder()
                .user(user).assessmentTest(test)
                .score(80).totalQuestions(1).correctAnswers(1).build());

        var export = userService.exportUserData(userId);

        assertThat(export.getExportedAt()).isNotNull();
        assertThat(export.getProfile().getEmail()).isEqualTo("export-me@example.com");
        assertThat(export.getSubscriptionStatus()).isEqualTo(SubscriptionStatus.ACTIVE.name());
        assertThat(export.getTestResults()).hasSize(1);
        assertThat(export.getTestResults().get(0).getScore()).isEqualTo(80);
    }

    private AssessmentTest buildTest() {
        AssessmentTest test = AssessmentTest.builder()
                .title("Deletion Test").type(TestType.NUMERICAL_REASONING)
                .difficulty(Difficulty.EASY).isFree(true).estimatedTimeMinutes(10).build();
        Question question = Question.builder()
                .assessmentTest(test).questionText("1 + 1?").explanation("Math.").orderIndex(1).build();
        AnswerOption option = AnswerOption.builder().answerText("2").isCorrect(true).orderIndex(1).build();
        option.setQuestion(question);
        question.getAnswerOptions().add(option);
        test.getQuestions().add(question);
        return test;
    }
}
