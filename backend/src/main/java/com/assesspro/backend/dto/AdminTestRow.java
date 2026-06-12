package com.assesspro.backend.dto;

import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * Lightweight admin-table row for GET /api/admin/tests.
 *
 * Populated by a single grouped projection query so the admin library loads
 * without (a) lazily counting questions per test and (b) eagerly hydrating the
 * four {@code @ElementCollection}s on {@link com.assesspro.backend.entity.AssessmentTest}
 * — both of which produced N+1 queries. Field names mirror the subset of the
 * test list payload the admin page actually reads.
 */
@Value
public class AdminTestRow {
    Long id;
    String title;
    String description;
    TestType type;
    Difficulty difficulty;
    Language language;
    boolean isFree;
    boolean isGeneratedByAI;
    int estimatedTimeMinutes;
    long questionCount;
    int displayQuestionCount;
    LocalDateTime createdAt;

    public AdminTestRow(Long id, String title, String description, TestType type,
                        Difficulty difficulty, Language language, boolean isFree,
                        boolean isGeneratedByAI, int estimatedTimeMinutes, long questionCount,
                        int displayQuestionCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.difficulty = difficulty;
        this.language = language;
        this.isFree = isFree;
        this.isGeneratedByAI = isGeneratedByAI;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.questionCount = questionCount;
        this.displayQuestionCount = displayQuestionCount;
        this.createdAt = createdAt;
    }
}
