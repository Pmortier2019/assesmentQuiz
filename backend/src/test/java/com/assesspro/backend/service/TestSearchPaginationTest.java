package com.assesspro.backend.service;

import com.assesspro.backend.dto.PagedResponse;
import com.assesspro.backend.dto.TestResponse;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that search, role filtering and pagination for the public test
 * library are resolved server-side by {@link TestService#searchTests} against
 * H2 — i.e. only the requested page is returned and matching happens in the
 * query, not in memory after fetching everything.
 */
@SpringBootTest
@ActiveProfiles("test")
class TestSearchPaginationTest {

    @Autowired
    private TestService testService;

    @Autowired
    private AssessmentTestRepository testRepository;

    @BeforeEach
    void seed() {
        testRepository.deleteAll();
        // 5 numerical (with a "Finance" role), 3 verbal — 8 total.
        for (int i = 1; i <= 5; i++) {
            testRepository.save(buildTest("Numerical Reasoning " + i, true,
                    TestType.NUMERICAL_REASONING, List.of("Finance")));
        }
        for (int i = 1; i <= 3; i++) {
            testRepository.save(buildTest("Verbal Reasoning " + i, true,
                    TestType.VERBAL_REASONING, List.of("Marketing")));
        }
    }

    private AssessmentTest buildTest(String title, boolean free, TestType type, List<String> roles) {
        return AssessmentTest.builder()
                .title(title)
                .description("Practice " + title)
                .type(type)
                .difficulty(Difficulty.EASY)
                .isFree(free)
                .estimatedTimeMinutes(10)
                .targetRoles(roles)
                .build();
    }

    @Test
    void pagination_returnsOnlyRequestedPage_andReportsTotal() {
        PagedResponse<TestResponse> page0 =
                testService.searchTests(null, null, null, null, null, null, 0, 3);

        assertThat(page0.getData()).hasSize(3);
        assertThat(page0.getTotal()).isEqualTo(8);
        assertThat(page0.isHasMore()).isTrue();
        assertThat(page0.getPage()).isZero();
        assertThat(page0.getPageSize()).isEqualTo(3);
    }

    @Test
    void pagination_lastPage_hasNoMore() {
        PagedResponse<TestResponse> lastPage =
                testService.searchTests(null, null, null, null, null, null, 2, 3);

        // 8 items, size 3 → pages of 3, 3, 2.
        assertThat(lastPage.getData()).hasSize(2);
        assertThat(lastPage.isHasMore()).isFalse();
    }

    @Test
    void search_matchesTitleServerSide() {
        PagedResponse<TestResponse> result =
                testService.searchTests(null, null, null, "verbal", null, null, 0, 20);

        assertThat(result.getTotal()).isEqualTo(3);
        assertThat(result.getData())
                .allSatisfy(t -> assertThat(t.getTitle()).containsIgnoringCase("verbal"));
    }

    @Test
    void search_matchesCategoryGroupViaType() {
        // "cognitive" is a category, not a word in any title — both NUMERICAL and
        // VERBAL reasoning belong to it, so all 8 seeded tests should match.
        PagedResponse<TestResponse> result =
                testService.searchTests(null, null, null, "cognitive", null, null, 0, 20);

        assertThat(result.getTotal()).isEqualTo(8);
    }

    @Test
    void search_categoryWithNoTests_returnsEmpty() {
        // "leadership" is a valid category but no leadership tests are seeded;
        // also exercises the empty-IN gating path.
        PagedResponse<TestResponse> result =
                testService.searchTests(null, null, null, "leadership", null, null, 0, 20);

        assertThat(result.getTotal()).isZero();
    }

    @Test
    void roleFilter_matchesTargetRolesServerSide() {
        PagedResponse<TestResponse> result =
                testService.searchTests(null, null, null, null, "finance", null, 0, 20);

        assertThat(result.getTotal()).isEqualTo(5);
        assertThat(result.getData())
                .allSatisfy(t -> assertThat(t.getType()).isEqualTo(TestType.NUMERICAL_REASONING));
    }
}
