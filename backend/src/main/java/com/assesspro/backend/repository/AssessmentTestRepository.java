package com.assesspro.backend.repository;

import com.assesspro.backend.dto.AdminTestRow;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentTestRepository extends JpaRepository<AssessmentTest, Long> {

    List<AssessmentTest> findByIsFreeTrue();

    long countByIsFreeTrue();

    long countByIsGeneratedByAITrue();

    /**
     * One row per distinct (type, difficulty) pair that exists. Lets the admin
     * generation-status endpoint resolve coverage in a single query instead of
     * one findByType per TestType enum value.
     */
    @Query("SELECT DISTINCT t.type, t.difficulty FROM AssessmentTest t")
    List<Object[]> findDistinctTypeAndDifficulty();

    /**
     * All tests as lightweight admin rows in a single query. A LEFT JOIN + COUNT
     * yields the question count without lazily loading each test's questions, and
     * selecting only scalar columns avoids hydrating the eager element collections
     * (target roles/industries/companies/skills) the admin table never shows —
     * eliminating the N+1 that made GET /api/admin/tests slow.
     */
    @Query("""
            SELECT new com.assesspro.backend.dto.AdminTestRow(
                t.id, t.title, t.description, t.type, t.difficulty, t.language,
                t.isFree, t.isGeneratedByAI, t.estimatedTimeMinutes, COUNT(q),
                t.displayQuestionCount, t.createdAt)
            FROM AssessmentTest t LEFT JOIN t.questions q
            GROUP BY t.id, t.title, t.description, t.type, t.difficulty, t.language,
                     t.isFree, t.isGeneratedByAI, t.estimatedTimeMinutes,
                     t.displayQuestionCount, t.createdAt
            ORDER BY t.createdAt DESC
            """)
    List<AdminTestRow> findAdminTestRows();

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

    /**
     * Paginated search used by the public test library. Search/role/industry
     * params are matched server-side (case-insensitive LIKE; callers pass them
     * pre-lowercased and wrapped in %…%, or null to skip). The query does not
     * JOIN FETCH the eager element collections, so Hibernate applies a real SQL
     * LIMIT/OFFSET on the root and loads collections via secondary selects —
     * keeping pagination at the database, not in memory. Sorting comes from the
     * Pageable.
     */
    @Query(value = """
        SELECT t FROM AssessmentTest t
        WHERE (:type IS NULL OR t.type = :type)
          AND (:difficulty IS NULL OR t.difficulty = :difficulty)
          AND (:isFree IS NULL OR t.isFree = :isFree)
          AND (:search IS NULL
               OR LOWER(t.title) LIKE :search
               OR LOWER(t.description) LIKE :search
               OR (:hasTypeMatch = TRUE AND t.type IN :typeMatches)
               OR EXISTS (SELECT 1 FROM t.skillsMeasured s WHERE LOWER(s) LIKE :search))
          AND (:role IS NULL OR EXISTS (SELECT 1 FROM t.targetRoles r WHERE LOWER(r) LIKE :role))
          AND (:industry IS NULL OR EXISTS (SELECT 1 FROM t.targetIndustries i WHERE LOWER(i) LIKE :industry))
    """,
    countQuery = """
        SELECT COUNT(t) FROM AssessmentTest t
        WHERE (:type IS NULL OR t.type = :type)
          AND (:difficulty IS NULL OR t.difficulty = :difficulty)
          AND (:isFree IS NULL OR t.isFree = :isFree)
          AND (:search IS NULL
               OR LOWER(t.title) LIKE :search
               OR LOWER(t.description) LIKE :search
               OR (:hasTypeMatch = TRUE AND t.type IN :typeMatches)
               OR EXISTS (SELECT 1 FROM t.skillsMeasured s WHERE LOWER(s) LIKE :search))
          AND (:role IS NULL OR EXISTS (SELECT 1 FROM t.targetRoles r WHERE LOWER(r) LIKE :role))
          AND (:industry IS NULL OR EXISTS (SELECT 1 FROM t.targetIndustries i WHERE LOWER(i) LIKE :industry))
    """)
    Page<AssessmentTest> searchWithFilters(
            @Param("type") TestType type,
            @Param("difficulty") Difficulty difficulty,
            @Param("isFree") Boolean isFree,
            @Param("search") String search,
            @Param("hasTypeMatch") boolean hasTypeMatch,
            @Param("typeMatches") List<TestType> typeMatches,
            @Param("role") String role,
            @Param("industry") String industry,
            Pageable pageable
    );
}
