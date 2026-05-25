package com.assesspro.backend.service;

import com.assesspro.backend.ai.AiClient;
import com.assesspro.backend.ai.AiTestJson;
import com.assesspro.backend.entity.*;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.MediaType;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.exception.AiGenerationException;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiTestGenerationService {

    private final AiClient aiClient;
    private final AssessmentTestRepository testRepository;
    private final ObjectMapper objectMapper;

    /**
     * Generates, validates, and persists an AI-created test.
     *
     * TODO: When connecting a real AI provider, the prompt below can be adjusted
     * to specify output format, tone, question style, or include few-shot examples.
     */
    @Transactional
    public AssessmentTest generateAndSave(TestType type, Difficulty difficulty, Language language, int numberOfQuestions) {
        return generateAndSave(type, difficulty, numberOfQuestions, null, null, true);
    }

    @Transactional
    public AssessmentTest generateAndSave(TestType type, Difficulty difficulty, int numberOfQuestions,
                                          String targetRole, String targetIndustry, boolean isFree) {
        String prompt = buildPrompt(type, difficulty, numberOfQuestions, targetRole, targetIndustry);
        log.info("Generating AI test: type={} difficulty={} role={} industry={} isFree={}", type, difficulty, targetRole, targetIndustry, isFree);

        int maxAttempts = 3;
        Exception lastError = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                String rawJson = aiClient.generateTest(prompt);
                AiTestJson.TestJson testJson = parseJson(rawJson);
                validateTestJson(testJson);

                AssessmentTest test = mapToEntity(testJson);
                test.setType(type);
                test.setGeneratedByAI(true);
                test.setFree(isFree);

                AssessmentTest saved = testRepository.save(test);
                log.info("AI-generated test saved with id={} (attempt {})", saved.getId(), attempt);
                return saved;
            } catch (Exception e) {
                lastError = e;
                log.warn("Generation attempt {}/{} failed: {}", attempt, maxAttempts, e.getMessage());
            }
        }
        throw new RuntimeException("Test generation failed after " + maxAttempts + " attempts: " + lastError.getMessage(), lastError);
    }

    @Transactional
    public AssessmentTest generateForUser(com.assesspro.backend.entity.User user) {
        TestType type = inferTestType(user.getTargetRole());
        Difficulty difficulty = Difficulty.MEDIUM;
        int poolSize = 12;
        return generateAndSave(type, difficulty, poolSize, user.getTargetRole(), user.getTargetIndustry(), true);
    }

    @Transactional
    public AssessmentTest generateForUserOfType(com.assesspro.backend.entity.User user, TestType type) {
        return generateForUserOfType(user, type, Difficulty.MEDIUM, true);
    }

    @Transactional
    public AssessmentTest generateForUserOfType(com.assesspro.backend.entity.User user, TestType type, Difficulty difficulty) {
        return generateForUserOfType(user, type, difficulty, true);
    }

    @Transactional
    public AssessmentTest generateForUserOfType(com.assesspro.backend.entity.User user, TestType type, Difficulty difficulty, boolean isFree) {
        int poolSize = 12;
        return generateAndSave(type, difficulty, poolSize, user.getTargetRole(), user.getTargetIndustry(), isFree);
    }

    private TestType inferTestType(String targetRole) {
        if (targetRole == null) return TestType.NUMERICAL_REASONING;
        String role = targetRole.toLowerCase();
        if (role.contains("software") || role.contains("data") || role.contains("engineer")) return TestType.LOGICAL_REASONING;
        if (role.contains("hr") || role.contains("people") || role.contains("talent"))       return TestType.PERSONALITY_WORK_STYLE;
        if (role.contains("communication") || role.contains("verbal") || role.contains("pr") || role.contains("marketing")) return TestType.VERBAL_REASONING;
        if (role.contains("management") || role.contains("leadership") || role.contains("operations")) return TestType.SITUATIONAL_JUDGEMENT;
        return TestType.NUMERICAL_REASONING;
    }

    private String typeDescription(TestType type) {
        return switch (type) {
            // Cognitive & Reasoning
            case NUMERICAL_REASONING      -> "numerical reasoning (percentages, ratios, data tables, financial calculations)";
            case LOGICAL_REASONING        -> "logical reasoning (deductive and inductive logic, syllogisms, sequences)";
            case VERBAL_REASONING         -> "verbal reasoning (reading comprehension, argument analysis, inference)";
            case ABSTRACT_REASONING       -> "abstract reasoning (patterns, shapes, matrix problems, non-verbal logic)";
            case CRITICAL_THINKING        -> "critical thinking (assumptions, conclusions, argument evaluation, logical fallacies)";
            case INDUCTIVE_REASONING      -> "inductive reasoning (pattern recognition, rule inference from examples, generalisation)";
            case DEDUCTIVE_REASONING      -> "deductive reasoning (applying rules to reach valid conclusions, syllogisms, logical deduction)";
            case DIAGRAMMATIC_REASONING   -> "diagrammatic reasoning (flowcharts, process diagrams, input-output rules, symbol sequences)";
            case SPATIAL_REASONING        -> "spatial reasoning (mental rotation, 2D/3D shapes, unfolded nets, map navigation)";
            case MECHANICAL_REASONING     -> "mechanical reasoning (levers, pulleys, gears, forces, basic physics in workplace machinery)";
            case ANALYTICAL_THINKING      -> "analytical thinking (breaking complex problems into components, root-cause analysis, structured thinking)";
            // Data & Interpretation
            case DATA_INTERPRETATION      -> "data interpretation (charts, graphs, tables, business metrics analysis)";
            case ERROR_CHECKING           -> "error checking (spotting discrepancies in tables, codes, text, and numerical data)";
            // Verbal & Written
            case READING_COMPREHENSION    -> "reading comprehension (extracting meaning from dense passages, identifying main ideas and supporting details)";
            case GRAMMAR_SPELLING         -> "grammar and spelling (correct sentence structure, punctuation, vocabulary, common errors)";
            case WRITING_ASSESSMENT       -> "written communication assessment (email drafting, report structure, clarity and tone)";
            case COMMUNICATION_SKILLS     -> "professional communication skills (clear messaging, active listening scenarios, stakeholder communication)";
            case PRESENTATION_SKILLS      -> "presentation skills (structuring arguments, slide logic, audience-appropriate language, Q&A handling)";
            // Personality & Behavioural
            case PERSONALITY_WORK_STYLE   -> "personality and work style (behavioural preferences, motivators, team dynamics)";
            case SITUATIONAL_JUDGEMENT    -> "situational judgement (workplace scenarios, prioritisation, stakeholder management)";
            case EMOTIONAL_INTELLIGENCE   -> "emotional intelligence (self-awareness, empathy, managing emotions under pressure, interpersonal sensitivity)";
            case ADAPTABILITY             -> "adaptability assessment (handling change, ambiguity, and uncertainty in professional environments)";
            case CULTURAL_FIT             -> "cultural fit and values alignment (organisational values, teamwork expectations, attitude in diverse workplaces)";
            // Leadership & Management
            case LEADERSHIP_ASSESSMENT    -> "leadership assessment (decision making, people management, strategic thinking scenarios)";
            case DECISION_MAKING          -> "decision making (evaluating options under time pressure, risk-benefit trade-offs, stakeholder impact)";
            case STRATEGIC_THINKING       -> "strategic thinking (long-term planning, competitive analysis, setting priorities, scenario planning)";
            case PROJECT_MANAGEMENT       -> "project management (planning, scheduling, resource allocation, risk and stakeholder management)";
            case TIME_MANAGEMENT          -> "time management (prioritisation frameworks, deadline management, workload planning)";
            case RISK_ASSESSMENT          -> "risk assessment (identifying, quantifying, and mitigating business and operational risks)";
            // Interpersonal & Professional
            case TEAMWORK_COLLABORATION   -> "teamwork and collaboration (working in cross-functional teams, managing group dynamics, shared goals)";
            case CONFLICT_RESOLUTION      -> "conflict resolution (de-escalation, mediation, assertive communication, win-win outcomes)";
            case NEGOTIATION_SKILLS       -> "negotiation skills (BATNA, anchoring, persuasion techniques, closing deals)";
            case CUSTOMER_SERVICE         -> "customer service scenarios (handling complaints, empathy, solution focus, service recovery)";
            case SALES_APTITUDE           -> "sales aptitude (prospecting, objection handling, closing techniques, pipeline management)";
            // Domain-specific
            case FINANCIAL_LITERACY       -> "financial literacy (budgets, P&L statements, cash flow, investment concepts, KPIs)";
            case EXCEL_SKILLS             -> "Excel and spreadsheet skills (formulas, pivot tables, data analysis, VLOOKUP, conditional formatting)";
            case CODING_CHALLENGE         -> "coding and algorithmic thinking (pseudocode logic, complexity, debugging scenarios)";
            // Values & Ethics
            case ETHICS_COMPLIANCE        -> "ethics and compliance (recognising ethical dilemmas, corporate governance, whistleblowing, GDPR scenarios)";
            // Creative
            case CREATIVITY_INNOVATION    -> "creativity and innovation (lateral thinking, brainstorming, identifying novel solutions to business problems)";
        };
    }

    private String buildPrompt(TestType type, Difficulty difficulty, int count,
                                String targetRole, String targetIndustry) {
        String role     = targetRole     != null ? targetRole     : "business professional";
        String industry = targetIndustry != null ? targetIndustry : "Finance and Consulting";
        int displayCount = count >= 20 ? 10 : Math.max(5, count - 4);
        String typeFocus = typeDescription(type);

        return """
                You are an assessment generation engine for a professional job interview preparation platform.

                Generate a realistic %s assessment focused on %s.
                Target candidates applying for %s roles in the %s industry.
                The test must closely resemble assessments used by Deloitte, KPMG, Goldman Sachs, Accenture, and similar employers.

                Requirements:
                - Difficulty: %s
                - Language: English
                - Pool size: %d questions (store all of these)
                - displayQuestionCount: %d (shown per attempt — must be less than pool size)

                Return ONLY valid JSON, no markdown fences, no extra text. Use this exact structure:
                {
                  "title": "short title max 8 words",
                  "description": "1-2 sentences describing what this test measures",
                  "type": "%s",
                  "difficulty": "%s",
                  "language": "EN",
                  "estimatedTimeMinutes": <integer>,
                  "displayQuestionCount": %d,
                  "questions": [
                    {
                      "questionText": "realistic business scenario question",
                      "explanation": "step-by-step reasoning — show calculations or logical chain",
                      "orderIndex": 1,
                      "mediaItems": [],
                      "answerOptions": [
                        { "answerText": "...", "isCorrect": true,  "orderIndex": 1 },
                        { "answerText": "...", "isCorrect": false, "orderIndex": 2 },
                        { "answerText": "...", "isCorrect": false, "orderIndex": 3 },
                        { "answerText": "...", "isCorrect": false, "orderIndex": 4 }
                      ]
                    }
                  ]
                }

                Rules:
                1. Exactly 4 answer options per question, exactly 1 with isCorrect: true.
                2. Wrong answers must be plausible — use near-miss values or common mistakes.
                3. Use realistic business data: revenue figures, percentages, ratios, org decisions.
                4. Vary difficulty across questions even within the same level.
                5. All %d questions must be unique — no repeated scenarios or question stems.
                6. Keep each explanation to max 2 sentences — be concise.
                7. Return ONLY the JSON object — nothing else. Do not truncate.
                """.formatted(
                type.name(), typeFocus, role, industry,
                difficulty.name(), count, displayCount,
                type.name(), difficulty.name(), displayCount,
                count
        );
    }

    private AiTestJson.TestJson parseJson(String raw) {
        try {
            return objectMapper.readValue(raw, AiTestJson.TestJson.class);
        } catch (Exception e) {
            throw new AiGenerationException("Failed to parse AI response as JSON: " + e.getMessage(), e);
        }
    }

    private void validateTestJson(AiTestJson.TestJson test) {
        if (test.getTitle() == null || test.getTitle().isBlank()) {
            throw new AiGenerationException("Generated test has no title");
        }
        if (test.getType() == null || test.getType().isBlank()) {
            throw new AiGenerationException("Generated test has no type");
        }
        if (test.getDifficulty() == null || test.getDifficulty().isBlank()) {
            throw new AiGenerationException("Generated test has no difficulty");
        }
        if (test.getLanguage() == null || test.getLanguage().isBlank()) {
            throw new AiGenerationException("Generated test has no language");
        }
        if (test.getQuestions() == null || test.getQuestions().isEmpty()) {
            throw new AiGenerationException("Generated test has no questions");
        }

        for (int i = 0; i < test.getQuestions().size(); i++) {
            AiTestJson.QuestionJson q = test.getQuestions().get(i);

            if (q.getAnswerOptions() == null || q.getAnswerOptions().isEmpty()) {
                throw new AiGenerationException("Question at index " + i + " has no answer options");
            }

            long correctCount = q.getAnswerOptions().stream().filter(AiTestJson.AnswerOptionJson::isCorrect).count();
            if (correctCount == 0) {
                throw new AiGenerationException("Question at index " + i + " has no correct answer");
            }
            if (correctCount > 1) {
                throw new AiGenerationException("Question at index " + i + " has multiple correct answers");
            }

            if (q.getMediaItems() != null) {
                for (AiTestJson.MediaItemJson media : q.getMediaItems()) {
                    try {
                        MediaType.valueOf(media.getMediaType().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new AiGenerationException("Invalid media type: " + media.getMediaType());
                    }
                }
            }
        }
    }

    private AssessmentTest mapToEntity(AiTestJson.TestJson json) {
        AssessmentTest test = AssessmentTest.builder()
                .title(json.getTitle())
                .description(json.getDescription())
                .type(TestType.valueOf(json.getType().toUpperCase()))
                .difficulty(Difficulty.valueOf(json.getDifficulty().toUpperCase()))
                .language(Language.valueOf(json.getLanguage().toUpperCase()))
                .estimatedTimeMinutes(json.getEstimatedTimeMinutes())
                .displayQuestionCount(json.getDisplayQuestionCount())
                .questions(new ArrayList<>())
                .build();

        for (AiTestJson.QuestionJson qJson : json.getQuestions()) {
            Question question = Question.builder()
                    .assessmentTest(test)
                    .questionText(qJson.getQuestionText())
                    .explanation(qJson.getExplanation())
                    .orderIndex(qJson.getOrderIndex())
                    .mediaItems(new ArrayList<>())
                    .answerOptions(new ArrayList<>())
                    .build();

            if (qJson.getMediaItems() != null) {
                for (AiTestJson.MediaItemJson mJson : qJson.getMediaItems()) {
                    QuestionMedia media = QuestionMedia.builder()
                            .question(question)
                            .mediaType(MediaType.valueOf(mJson.getMediaType().toUpperCase()))
                            .url(mJson.getUrl())
                            .altText(mJson.getAltText())
                            .caption(mJson.getCaption())
                            .build();
                    question.getMediaItems().add(media);
                }
            }

            for (AiTestJson.AnswerOptionJson aJson : qJson.getAnswerOptions()) {
                AnswerOption option = AnswerOption.builder()
                        .question(question)
                        .answerText(aJson.getAnswerText())
                        .isCorrect(aJson.isCorrect())
                        .orderIndex(aJson.getOrderIndex())
                        .build();
                question.getAnswerOptions().add(option);
            }

            test.getQuestions().add(question);
        }

        return test;
    }
}
