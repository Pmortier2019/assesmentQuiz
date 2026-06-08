package com.assesspro.backend.repository;

import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.enums.TestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countByUserId(Long userId);

    /**
     * Per-user result count and average score in a single grouped query, so the
     * admin users table no longer fires one query per user (N+1).
     */
    @Query("""
        SELECT r.user.id AS userId, COUNT(r) AS resultCount, AVG(r.score) AS avgScore
        FROM TestResult r
        GROUP BY r.user.id
        """)
    List<UserResultAggregate> aggregateResultsPerUser();

    /** Projection for {@link #aggregateResultsPerUser()}. */
    interface UserResultAggregate {
        Long getUserId();
        long getResultCount();
        Double getAvgScore();
    }

    @Query("SELECT r.createdAt FROM TestResult r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<LocalDateTime> findCreatedAtByUserIdOrderByDesc(@Param("userId") Long userId);

    @Query("""
        SELECT r FROM TestResult r
        WHERE r.assessmentTest.type = :type
          AND r.createdAt >= :since
        ORDER BY r.score DESC, r.timeTakenSeconds ASC
        """)
    List<TestResult> findTopByTypeAndDateRange(
        @Param("type") TestType type,
        @Param("since") LocalDateTime since,
        org.springframework.data.domain.Pageable pageable
    );

    @Query("""
        SELECT r FROM TestResult r
        WHERE r.createdAt >= :since
        ORDER BY r.score DESC, r.timeTakenSeconds ASC
        """)
    List<TestResult> findTopByDateRange(
        @Param("since") LocalDateTime since,
        org.springframework.data.domain.Pageable pageable
    );
}
