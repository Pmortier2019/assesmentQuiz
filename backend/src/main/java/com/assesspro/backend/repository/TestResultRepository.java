package com.assesspro.backend.repository;

import com.assesspro.backend.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT r.createdAt FROM TestResult r WHERE r.user.id = :userId ORDER BY r.createdAt DESC"
    )
    List<java.time.LocalDateTime> findCreatedAtByUserIdOrderByDesc(
        @org.springframework.data.repository.query.Param("userId") Long userId
    );
}
