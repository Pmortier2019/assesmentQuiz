package com.assesspro.backend.controller;

import com.assesspro.backend.dto.AdminTestRow;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.Question;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies the lightweight admin tests projection: it returns one row per test
 * with the question count computed in-query (no per-test lazy load), including
 * tests that have zero questions.
 */
@SpringBootTest
@ActiveProfiles("test")
class AdminTestRowsTest {

    @Autowired
    private AdminController adminController;

    @Autowired
    private AssessmentTestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    private Long testWithTwoId;
    private Long emptyTestId;

    @BeforeEach
    void seed() {
        questionRepository.deleteAll();
        testRepository.deleteAll();

        AssessmentTest withTwo = testRepository.save(AssessmentTest.builder()
                .title("Has questions").description("d").type(TestType.NUMERICAL_REASONING)
                .difficulty(Difficulty.MEDIUM).language(Language.EN).isFree(true).build());
        questionRepository.save(Question.builder()
                .assessmentTest(withTwo).questionText("q1").orderIndex(0).build());
        questionRepository.save(Question.builder()
                .assessmentTest(withTwo).questionText("q2").orderIndex(1).build());

        AssessmentTest empty = testRepository.save(AssessmentTest.builder()
                .title("No questions").description("d").type(TestType.LOGICAL_REASONING)
                .difficulty(Difficulty.HARD).language(Language.EN).isFree(false).build());

        testWithTwoId = withTwo.getId();
        emptyTestId = empty.getId();
    }

    @Test
    void adminTests_returnsRowsWithQuestionCounts() {
        List<AdminTestRow> rows = adminController.adminTests().getBody();
        assertThat(rows).isNotNull().hasSize(2);

        assertThat(rows).anySatisfy(r -> {
            assertThat(r.getId()).isEqualTo(testWithTwoId);
            assertThat(r.getQuestionCount()).isEqualTo(2);
            assertThat(r.isFree()).isTrue();
        });
        // A test with no questions must still appear (LEFT JOIN), counted as 0.
        assertThat(rows).anySatisfy(r -> {
            assertThat(r.getId()).isEqualTo(emptyTestId);
            assertThat(r.getQuestionCount()).isEqualTo(0);
            assertThat(r.isFree()).isFalse();
        });
    }
}
