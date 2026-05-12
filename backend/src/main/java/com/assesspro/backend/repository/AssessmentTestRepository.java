package com.assesspro.backend.repository;

import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentTestRepository extends JpaRepository<AssessmentTest, Long> {

    List<AssessmentTest> findByIsFreeTrue();

    List<AssessmentTest> findByType(TestType type);

    List<AssessmentTest> findByDifficulty(Difficulty difficulty);

    List<AssessmentTest> findByLanguage(Language language);

    @Query("""
        SELECT t FROM AssessmentTest t
        WHERE (:type IS NULL OR t.type = :type)
          AND (:difficulty IS NULL OR t.difficulty = :difficulty)
          AND (:isFree IS NULL OR t.isFree = :isFree)
          AND (:language IS NULL OR t.language = :language)
        ORDER BY t.createdAt DESC
    """)
    List<AssessmentTest> findWithFilters(
            @Param("type") TestType type,
            @Param("difficulty") Difficulty difficulty,
            @Param("isFree") Boolean isFree,
            @Param("language") Language language
    );
}
