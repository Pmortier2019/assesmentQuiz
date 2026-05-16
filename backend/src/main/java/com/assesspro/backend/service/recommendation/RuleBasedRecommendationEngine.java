package com.assesspro.backend.service.recommendation;

import com.assesspro.backend.dto.PreparationPathResponse;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Recommendation engine combining career-target matching with performance-aware scoring.
 *
 * Career scoring: +3 role match, +2 industry match, +1 company match.
 * Performance scoring:
 *   - Weak type (avg < 50%): +5, prefer EASY difficulty: +2
 *   - Below average (avg 50–69%): +3, preferred difficulty: +1
 *   - Mastered (avg ≥ 80%): prefer harder difficulty; EASY penalised by -1
 *   - Never attempted type: +2
 *   - Recently completed (last 7 days): -3
 */
@Component
@RequiredArgsConstructor
public class RuleBasedRecommendationEngine implements RecommendationEngine {

    private final TestResultRepository resultRepository;

    @Override
    public List<AssessmentTest> recommendTests(User user, List<AssessmentTest> allTests) {
        String role     = normalise(user.getTargetRole());
        String industry = normalise(user.getTargetIndustry());
        String company  = normalise(user.getTargetCompany());

        List<TestResult> results = resultRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        Map<TestType, DoubleSummaryStatistics> statsByType = results.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getAssessmentTest().getType(),
                        Collectors.summarizingDouble(TestResult::getScore)
                ));
        Set<TestType> attemptedTypes = statsByType.keySet();

        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        Set<Long> recentIds = results.stream()
                .filter(r -> r.getCreatedAt().isAfter(cutoff))
                .map(r -> r.getAssessmentTest().getId())
                .collect(Collectors.toSet());

        Map<TestType, Difficulty> preferredDifficulty = statsByType.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> {
                            double avg = e.getValue().getAverage();
                            if (avg >= 80) return Difficulty.HARD;
                            if (avg >= 60) return Difficulty.MEDIUM;
                            return Difficulty.EASY;
                        }
                ));

        return allTests.stream()
                .map(test -> {
                    int s = careerScore(test, role, industry, company);
                    s += performanceScore(test, statsByType, attemptedTypes, preferredDifficulty);
                    if (recentIds.contains(test.getId())) s -= 3;
                    return Map.entry(test, s);
                })
                .filter(e -> e.getValue() > 0)
                .sorted(Map.Entry.<AssessmentTest, Integer>comparingByValue().reversed()
                        .thenComparing(e -> e.getKey().isFree() ? 0 : 1)
                        .thenComparing(e -> e.getKey().getTitle()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    @Override
    public PreparationPathResponse generatePreparationPath(User user) {
        String role = user.getTargetRole();

        List<TestResult> results = resultRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        // Derive weak types from actual results; fall back to role-based focus areas
        List<String> weakTypeLabels = results.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getAssessmentTest().getType(),
                        Collectors.averagingInt(TestResult::getScore)
                ))
                .entrySet().stream()
                .filter(e -> e.getValue() < 65)
                .sorted(Map.Entry.comparingByValue())
                .map(e -> typeLabel(e.getKey()))
                .limit(3)
                .collect(Collectors.toList());

        List<String> order = recommendedOrderFor(role);
        List<String> focus = weakTypeLabels.isEmpty() ? focusAreasFor(role) : weakTypeLabels;
        int days = estimatedDaysFor(role);

        return PreparationPathResponse.builder()
                .recommendedOrder(order)
                .focusAreas(focus)
                .estimatedPreparationDays(days)
                .targetRole(user.getTargetRole())
                .targetIndustry(user.getTargetIndustry())
                .targetCompany(user.getTargetCompany())
                .build();
    }

    // ── Scoring ───────────────────────────────────────────────────────────────

    private int careerScore(AssessmentTest test, String role, String industry, String company) {
        int s = 0;
        if (role != null) {
            for (String r : test.getTargetRoles()) {
                if (normalise(r).contains(role) || role.contains(normalise(r))) { s += 3; break; }
            }
        }
        if (industry != null) {
            for (String ind : test.getTargetIndustries()) {
                if (normalise(ind).contains(industry) || industry.contains(normalise(ind))) { s += 2; break; }
            }
        }
        if (company != null) {
            for (String c : test.getRecommendedForCompanies()) {
                if (normalise(c).contains(company) || company.contains(normalise(c))) { s += 1; break; }
            }
        }
        return s;
    }

    private int performanceScore(AssessmentTest test,
                                  Map<TestType, DoubleSummaryStatistics> statsByType,
                                  Set<TestType> attemptedTypes,
                                  Map<TestType, Difficulty> preferredDifficulty) {
        TestType type = test.getType();
        if (!attemptedTypes.contains(type)) {
            return 2; // untested type — mild boost
        }
        DoubleSummaryStatistics stats = statsByType.get(type);
        double avg = stats.getAverage();
        int s = 0;
        if (avg < 50) {
            s += 5;
            if (test.getDifficulty() == Difficulty.EASY) s += 2;
        } else if (avg < 70) {
            s += 3;
            if (test.getDifficulty() == preferredDifficulty.getOrDefault(type, Difficulty.MEDIUM)) s += 1;
        } else if (avg >= 80) {
            Difficulty preferred = preferredDifficulty.getOrDefault(type, Difficulty.HARD);
            if (test.getDifficulty() == preferred) s += 1;
            else if (test.getDifficulty() == Difficulty.EASY) s -= 1;
        }
        return s;
    }

    // ── Role-based rules ──────────────────────────────────────────────────────

    private List<String> recommendedOrderFor(String role) {
        if (role == null) return defaultOrder();
        return switch (normalise(role)) {
            case "software engineering" -> List.of(
                    "Logical Reasoning", "Coding Challenge", "Algorithmic Thinking", "Numerical Reasoning");
            case "data & analytics" -> List.of(
                    "Numerical Reasoning", "Logical Reasoning", "Data Interpretation", "Verbal Reasoning");
            case "finance", "finance & banking" -> List.of(
                    "Numerical Reasoning", "Data Interpretation", "Situational Judgement", "Verbal Reasoning");
            case "consulting" -> List.of(
                    "Numerical Reasoning", "Situational Judgement", "Logical Reasoning", "Verbal Reasoning");
            case "marketing", "communication & pr" -> List.of(
                    "Verbal Reasoning", "Writing Assessment", "Situational Judgement", "Logical Reasoning");
            case "hr", "human resources" -> List.of(
                    "Personality Assessment", "Situational Judgement", "Verbal Reasoning", "Logical Reasoning");
            case "sales" -> List.of(
                    "Situational Judgement", "Verbal Reasoning", "Personality Assessment", "Numerical Reasoning");
            case "operations" -> List.of(
                    "Numerical Reasoning", "Logical Reasoning", "Situational Judgement", "Data Interpretation");
            case "product management" -> List.of(
                    "Logical Reasoning", "Situational Judgement", "Numerical Reasoning", "Verbal Reasoning");
            case "management & leadership" -> List.of(
                    "Leadership Assessment", "Situational Judgement", "Personality Assessment", "Verbal Reasoning");
            case "design & creative" -> List.of(
                    "Logical Reasoning", "Verbal Reasoning", "Situational Judgement", "Personality Assessment");
            case "legal" -> List.of(
                    "Verbal Reasoning", "Logical Reasoning", "Situational Judgement", "Critical Thinking");
            case "customer support" -> List.of(
                    "Situational Judgement", "Verbal Reasoning", "Personality Assessment", "Logical Reasoning");
            default -> defaultOrder();
        };
    }

    private List<String> focusAreasFor(String role) {
        if (role == null) return List.of("accuracy", "speed", "critical thinking");
        return switch (normalise(role)) {
            case "software engineering"         -> List.of("logical deduction", "pattern recognition", "algorithmic thinking");
            case "data & analytics"             -> List.of("data interpretation", "percentages", "statistical reasoning");
            case "finance", "finance & banking" -> List.of("data interpretation", "percentages", "logical calculations");
            case "consulting"                   -> List.of("speed", "data interpretation", "structured communication");
            case "marketing", "communication & pr" -> List.of("written communication", "persuasion", "stakeholder management");
            case "hr", "human resources"        -> List.of("empathy", "conflict resolution", "behavioural insight");
            case "sales"                        -> List.of("persuasion", "resilience", "client management");
            case "operations"                   -> List.of("efficiency", "data interpretation", "process thinking");
            case "product management"           -> List.of("prioritisation", "stakeholder alignment", "data-driven decisions");
            case "management & leadership"      -> List.of("decision making", "people management", "strategic thinking");
            default                             -> List.of("accuracy", "speed", "critical thinking");
        };
    }

    private int estimatedDaysFor(String role) {
        if (role == null) return 14;
        return switch (normalise(role)) {
            case "software engineering"                              -> 21;
            case "consulting"                                        -> 21;
            case "finance", "finance & banking", "data & analytics" -> 18;
            case "management & leadership", "hr"                    -> 14;
            default                                                  -> 14;
        };
    }

    private List<String> defaultOrder() {
        return List.of("Logical Reasoning", "Numerical Reasoning", "Verbal Reasoning", "Situational Judgement");
    }

    private String typeLabel(TestType type) {
        return switch (type) {
            case NUMERICAL_REASONING   -> "Numerical Reasoning";
            case LOGICAL_REASONING     -> "Logical Reasoning";
            case VERBAL_REASONING      -> "Verbal Reasoning";
            case SITUATIONAL_JUDGEMENT -> "Situational Judgement";
            case PERSONALITY_WORK_STYLE -> "Personality & Work Style";
            case DATA_INTERPRETATION   -> "Data Interpretation";
            case ABSTRACT_REASONING    -> "Abstract Reasoning";
            case CRITICAL_THINKING     -> "Critical Thinking";
            case CODING_CHALLENGE      -> "Coding Challenge";
            case LEADERSHIP_ASSESSMENT -> "Leadership Assessment";
            case WRITING_ASSESSMENT    -> "Writing Assessment";
        };
    }

    private String normalise(String s) {
        if (s == null) return null;
        return s.toLowerCase(Locale.ROOT).trim();
    }
}
