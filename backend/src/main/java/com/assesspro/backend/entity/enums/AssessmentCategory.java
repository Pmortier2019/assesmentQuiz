package com.assesspro.backend.entity.enums;

public enum AssessmentCategory {
    COGNITIVE("Cognitive & Reasoning"),
    PERSONALITY("Personality & Behavioural"),
    COMMUNICATION("Communication & Written"),
    MARKETING("Sales & Customer"),
    IT_ENGINEERING("IT & Engineering"),
    FINANCE_CONSULTING("Finance & Consulting"),
    HR_LEADERSHIP("Leadership & Management"),
    CREATIVE("Creative & Values");

    private final String label;

    AssessmentCategory(String label) {
        this.label = label;
    }

    /** Human-readable group label, e.g. "Cognitive & Reasoning". */
    public String getLabel() {
        return label;
    }

    /**
     * Maps every {@link TestType} to its category. This is the single source of
     * truth for grouping: it drives category-based search (a test's stored
     * {@code category} column is often null for AI-generated tests, but its
     * {@code type} is always present) and the category tiles in the UI.
     */
    public static AssessmentCategory forType(TestType type) {
        return switch (type) {
            case NUMERICAL_REASONING, LOGICAL_REASONING, VERBAL_REASONING,
                 ABSTRACT_REASONING, CRITICAL_THINKING, INDUCTIVE_REASONING,
                 DEDUCTIVE_REASONING, DIAGRAMMATIC_REASONING, SPATIAL_REASONING,
                 MECHANICAL_REASONING, ANALYTICAL_THINKING, DATA_INTERPRETATION,
                 ERROR_CHECKING -> COGNITIVE;

            case READING_COMPREHENSION, GRAMMAR_SPELLING, WRITING_ASSESSMENT,
                 COMMUNICATION_SKILLS, PRESENTATION_SKILLS -> COMMUNICATION;

            case PERSONALITY_WORK_STYLE, SITUATIONAL_JUDGEMENT, EMOTIONAL_INTELLIGENCE,
                 ADAPTABILITY, CULTURAL_FIT -> PERSONALITY;

            case LEADERSHIP_ASSESSMENT, DECISION_MAKING, STRATEGIC_THINKING,
                 PROJECT_MANAGEMENT, TIME_MANAGEMENT, RISK_ASSESSMENT,
                 TEAMWORK_COLLABORATION, CONFLICT_RESOLUTION, NEGOTIATION_SKILLS -> HR_LEADERSHIP;

            case CUSTOMER_SERVICE, SALES_APTITUDE -> MARKETING;

            case FINANCIAL_LITERACY, EXCEL_SKILLS -> FINANCE_CONSULTING;

            case CODING_CHALLENGE -> IT_ENGINEERING;

            case ETHICS_COMPLIANCE, CREATIVITY_INNOVATION -> CREATIVE;
        };
    }
}
