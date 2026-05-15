package com.assesspro.backend.service.recommendation;

import com.assesspro.backend.dto.PreparationPathResponse;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.User;

import java.util.List;

/**
 * Contract for generating personalised recommendations and preparation paths.
 *
 * Current implementation: {@link RuleBasedRecommendationEngine} (rule-based logic).
 *
 * TODO: Replace with AiRecommendationEngine once AI personalisation is ready.
 * Future AI engine should consider:
 *  - Weak skill detection from past test results
 *  - Company-specific test pattern matching
 *  - Adaptive difficulty based on performance trend
 *  - Personalised daily practice generation
 */
public interface RecommendationEngine {

    /**
     * Returns a ranked list of tests most relevant to the user's career targets.
     */
    List<AssessmentTest> recommendTests(User user, List<AssessmentTest> allTests);

    /**
     * Generates a preparation path (order, focus areas, timeline) for the user.
     */
    PreparationPathResponse generatePreparationPath(User user);
}
