package com.assesspro.backend.service;

import com.assesspro.backend.dto.SubmitTestRequest;
import com.assesspro.backend.dto.SubmitTestResponse;
import com.assesspro.backend.entity.AnswerOption;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.Question;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Role;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.TestResultRepository;
import com.assesspro.backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Scoring is out of the questions the user actually answered (the served subset),
 * not the full question pool. A pool bigger than the shown count must still allow
 * a perfect 100% — the previous bug divided by the whole pool, capping the score.
 */
@SpringBootTest
@ActiveProfiles("test")
class TestServiceScoringTest {

    @Autowired private TestService testService;
    @Autowired private UserRepository userRepository;
    @Autowired private AssessmentTestRepository testRepository;
    @Autowired private TestResultRepository resultRepository;

    @AfterEach
    void cleanup() {
        resultRepository.deleteAll();
        userRepository.deleteAll();
        testRepository.deleteAll();
    }

    @Test
    void submit_scoresOutOfAnsweredQuestionsNotWholePool() {
        User user = userRepository.save(User.builder()
                .email("scorer@example.com").name("Scorer")
                .emailVerified(true).role(Role.USER).build());
        // Pool of 4, but the user is only shown (and answers) 2 of them.
        AssessmentTest test = testRepository.save(buildTest(4, 2));

        List<Question> pool = test.getQuestions();
        SubmitTestRequest request = new SubmitTestRequest();
        request.setAnswers(List.of(
                answer(pool.get(0)),   // correct
                answer(pool.get(1)))); // correct

        SubmitTestResponse response = testService.submitTest(test.getId(), user.getId(), request);

        // 2/2 correct → 100%, and the attempt counts 2 questions, not the pool's 4.
        assertThat(response.getScore()).isEqualTo(100);
        assertThat(response.getTotalQuestions()).isEqualTo(2);
        assertThat(response.getCorrectAnswers()).isEqualTo(2);
    }

    @Test
    void submit_halfCorrectScoresFiftyAgainstAnsweredCount() {
        User user = userRepository.save(User.builder()
                .email("half@example.com").name("Half")
                .emailVerified(true).role(Role.USER).build());
        AssessmentTest test = testRepository.save(buildTest(4, 2));

        List<Question> pool = test.getQuestions();
        SubmitTestRequest request = new SubmitTestRequest();
        request.setAnswers(List.of(
                answer(pool.get(0)),       // correct
                wrongAnswer(pool.get(1)))); // wrong

        SubmitTestResponse response = testService.submitTest(test.getId(), user.getId(), request);

        assertThat(response.getScore()).isEqualTo(50);
        assertThat(response.getTotalQuestions()).isEqualTo(2);
        assertThat(response.getCorrectAnswers()).isEqualTo(1);
    }

    @Test
    void submit_duplicateSubmissionForSameQuestionIsScoredOnce() {
        User user = userRepository.save(User.builder()
                .email("dupe@example.com").name("Dupe")
                .emailVerified(true).role(Role.USER).build());
        AssessmentTest test = testRepository.save(buildTest(4, 2));

        List<Question> pool = test.getQuestions();
        SubmitTestRequest request = new SubmitTestRequest();
        request.setAnswers(List.of(
                answer(pool.get(0)),
                answer(pool.get(0)))); // same question again — must not double-count

        SubmitTestResponse response = testService.submitTest(test.getId(), user.getId(), request);

        assertThat(response.getTotalQuestions()).isEqualTo(1);
        assertThat(response.getCorrectAnswers()).isEqualTo(1);
        assertThat(response.getScore()).isEqualTo(100);
    }

    /** A submission selecting the question's correct option. */
    private SubmitTestRequest.AnswerSubmission answer(Question q) {
        return submission(q, optionByCorrectness(q, true));
    }

    /** A submission selecting one of the question's wrong options. */
    private SubmitTestRequest.AnswerSubmission wrongAnswer(Question q) {
        return submission(q, optionByCorrectness(q, false));
    }

    private SubmitTestRequest.AnswerSubmission submission(Question q, AnswerOption option) {
        SubmitTestRequest.AnswerSubmission s = new SubmitTestRequest.AnswerSubmission();
        s.setQuestionId(q.getId());
        s.setSelectedAnswerOptionId(option.getId());
        return s;
    }

    private AnswerOption optionByCorrectness(Question q, boolean correct) {
        return q.getAnswerOptions().stream()
                .filter(a -> a.isCorrect() == correct)
                .findFirst()
                .orElseThrow();
    }

    /** Free test with {@code poolSize} questions, each with one correct + one wrong option. */
    private AssessmentTest buildTest(int poolSize, int displayCount) {
        AssessmentTest test = AssessmentTest.builder()
                .title("Scoring Test").type(TestType.NUMERICAL_REASONING)
                .difficulty(Difficulty.EASY).isFree(true).estimatedTimeMinutes(10)
                .displayQuestionCount(displayCount).build();
        for (int i = 0; i < poolSize; i++) {
            Question question = Question.builder()
                    .assessmentTest(test).questionText("Q" + i).explanation("because").orderIndex(i + 1).build();
            AnswerOption right = AnswerOption.builder().answerText("right").isCorrect(true).orderIndex(1).build();
            AnswerOption wrong = AnswerOption.builder().answerText("wrong").isCorrect(false).orderIndex(2).build();
            right.setQuestion(question);
            wrong.setQuestion(question);
            question.getAnswerOptions().add(right);
            question.getAnswerOptions().add(wrong);
            test.getQuestions().add(question);
        }
        return test;
    }
}
