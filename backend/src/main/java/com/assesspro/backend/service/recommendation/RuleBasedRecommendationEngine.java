package com.assesspro.backend.service.recommendation;

import com.assesspro.backend.dto.PreparationPathResponse;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Rule-based recommendation engine.
 *
 * Scoring: +3 for role match, +2 for industry match, +1 for company match.
 * Ties broken by free tests first, then alphabetically.
 *
 * TODO: Replace with AiRecommendationEngine for:
 *  - Weak skill detection across historical results
 *  - Company-specific preparation patterns (e.g. McKinsey → case-heavy)
 *  - Adaptive difficulty scaling
 *  - Personalised daily practice schedules
 */
@Component
public class RuleBasedRecommendationEngine implements RecommendationEngine {

    @Override
    public List<AssessmentTest> recommendTests(User user, List<AssessmentTest> allTests) {
        String role     = normalise(user.getTargetRole());
        String industry = normalise(user.getTargetIndustry());
        String company  = normalise(user.getTargetCompany());

        return allTests.stream()
                .map(test -> Map.entry(test, score(test, role, industry, company)))
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

        List<String> order  = recommendedOrderFor(role);
        List<String> focus  = focusAreasFor(role);
        int days            = estimatedDaysFor(role);

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

    private int score(AssessmentTest test, String role, String industry, String company) {
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
            case "software engineering" -> List.of("logical deduction", "pattern recognition", "algorithmic thinking");
            case "data & analytics"     -> List.of("data interpretation", "percentages", "statistical reasoning");
            case "finance", "finance & banking" -> List.of("data interpretation", "percentages", "logical calculations");
            case "consulting"           -> List.of("speed", "data interpretation", "structured communication");
            case "marketing", "communication & pr" -> List.of("written communication", "persuasion", "stakeholder management");
            case "hr", "human resources" -> List.of("empathy", "conflict resolution", "behavioural insight");
            case "sales"                -> List.of("persuasion", "resilience", "client management");
            case "operations"           -> List.of("efficiency", "data interpretation", "process thinking");
            case "product management"   -> List.of("prioritisation", "stakeholder alignment", "data-driven decisions");
            case "management & leadership" -> List.of("decision making", "people management", "strategic thinking");
            default                     -> List.of("accuracy", "speed", "critical thinking");
        };
    }

    private int estimatedDaysFor(String role) {
        if (role == null) return 14;
        return switch (normalise(role)) {
            case "software engineering" -> 21;
            case "consulting"           -> 21;
            case "finance", "finance & banking", "data & analytics" -> 18;
            case "management & leadership", "hr" -> 14;
            default                     -> 14;
        };
    }

    private List<String> defaultOrder() {
        return List.of("Logical Reasoning", "Numerical Reasoning", "Verbal Reasoning", "Situational Judgement");
    }

    private String normalise(String s) {
        if (s == null) return null;
        return s.toLowerCase(Locale.ROOT).trim();
    }
}
