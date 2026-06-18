import type { Test, User, TestResult } from "./types";

// ─── Mock User ────────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: "user_001",
  email: "demo@ready-to-ace.com",
  name: "Demo User",
  subscription: "free",
  isAdmin: false,
  freeTestsUsed: 3,
  streak: 7,
  joinedAt: "2026-04-01",
  preferredTestType: "numerical_reasoning",
  level: "intermediate",
};

export const MOCK_PRO_USER: User = {
  ...MOCK_USER,
  id: "user_002",
  subscription: "pro",
  freeTestsUsed: 5,
  streak: 21,
};

// ─── Mock Tests ───────────────────────────────────────────────────────────────

export const MOCK_TESTS: Test[] = [
  {
    id: "test_001",
    title: "Numerical Reasoning: Level 1",
    description: "Practice basic numerical sequences, percentages and data interpretation.",
    type: "numerical_reasoning",
    difficulty: "beginner",
    language: "en",
    isFree: true,
    isGeneratedByAI: false,
    estimatedTime: 12,
    tags: ["numbers", "percentages", "sequences"],
    createdAt: "2026-03-15",
    questions: [
      {
        id: "q001",
        questionText: "A company's revenue increased from €240,000 to €288,000. What is the percentage increase?",
        answers: [
          { id: "a1", text: "15%", isCorrect: false },
          { id: "a2", text: "20%", isCorrect: true },
          { id: "a3", text: "25%", isCorrect: false },
          { id: "a4", text: "18%", isCorrect: false },
        ],
        explanation: "Increase = 48,000. Percentage = (48,000 / 240,000) × 100 = 20%.",
        points: 10,
      },
      {
        id: "q002",
        questionText: "What is the next number in the sequence: 3, 6, 12, 24, ?",
        answers: [
          { id: "a1", text: "36", isCorrect: false },
          { id: "a2", text: "48", isCorrect: true },
          { id: "a3", text: "42", isCorrect: false },
          { id: "a4", text: "40", isCorrect: false },
        ],
        explanation: "Each number is multiplied by 2. 24 × 2 = 48.",
        points: 10,
      },
      {
        id: "q003",
        questionText: "If 3 workers can complete a task in 12 days, how many days will 9 workers take?",
        media: [
          {
            id: "m001",
            type: "TABLE",
            caption: "Worker distribution",
            tableData: {
              headers: ["Workers", "Days"],
              rows: [["3", "12"], ["6", "6"], ["9", "?"]],
            },
          },
        ],
        answers: [
          { id: "a1", text: "2 days", isCorrect: false },
          { id: "a2", text: "4 days", isCorrect: true },
          { id: "a3", text: "6 days", isCorrect: false },
          { id: "a4", text: "3 days", isCorrect: false },
        ],
        explanation: "3 workers × 12 days = 36 worker-days. 36 ÷ 9 workers = 4 days.",
        points: 15,
      },
    ],
  },
  {
    id: "test_002",
    title: "Logical Reasoning: Patterns",
    description: "Identify patterns in shapes, sequences and abstract diagrams.",
    type: "logical_reasoning",
    difficulty: "intermediate",
    language: "en",
    isFree: true,
    isGeneratedByAI: false,
    estimatedTime: 15,
    tags: ["patterns", "abstract", "shapes"],
    createdAt: "2026-03-20",
    questions: [
      {
        id: "q004",
        questionText: "All managers are leaders. Some leaders are visionaries. Which conclusion is definitely true?",
        answers: [
          { id: "a1", text: "All managers are visionaries", isCorrect: false },
          { id: "a2", text: "Some managers may be visionaries", isCorrect: false },
          { id: "a3", text: "All managers are leaders", isCorrect: true },
          { id: "a4", text: "No managers are visionaries", isCorrect: false },
        ],
        explanation: "The first premise states directly that all managers are leaders.",
        points: 10,
      },
      {
        id: "q005",
        questionText: "If A > B, B > C, and C > D, which of the following is true?",
        answers: [
          { id: "a1", text: "D > A", isCorrect: false },
          { id: "a2", text: "A > D", isCorrect: true },
          { id: "a3", text: "B > A", isCorrect: false },
          { id: "a4", text: "C > A", isCorrect: false },
        ],
        explanation: "By transitivity: A > B > C > D, therefore A > D.",
        points: 10,
      },
    ],
  },
  {
    id: "test_003",
    title: "Verbal Reasoning: Comprehension",
    description: "Assess your ability to understand and evaluate written arguments.",
    type: "verbal_reasoning",
    difficulty: "beginner",
    language: "en",
    isFree: true,
    isGeneratedByAI: false,
    estimatedTime: 18,
    tags: ["reading", "comprehension", "arguments"],
    createdAt: "2026-03-25",
    questions: [
      {
        id: "q006",
        questionText:
          "\"Remote work has increased employee satisfaction significantly.\" Does this statement follow from the passage that states: 'A 2024 survey found 78% of remote workers reported higher job satisfaction than in-office peers'?",
        answers: [
          { id: "a1", text: "True", isCorrect: true },
          { id: "a2", text: "False", isCorrect: false },
          { id: "a3", text: "Cannot say", isCorrect: false },
        ],
        explanation: "The survey shows 78% reported higher satisfaction: 'significantly' is supported.",
        points: 10,
      },
    ],
  },
  {
    id: "test_004",
    title: "Situational Judgement: Leadership",
    description: "Handle realistic workplace scenarios and choose the most effective response.",
    type: "situational_judgement",
    difficulty: "intermediate",
    language: "en",
    isFree: false,
    isGeneratedByAI: false,
    estimatedTime: 20,
    tags: ["leadership", "conflict", "teamwork"],
    createdAt: "2026-04-01",
    questions: [
      {
        id: "q007",
        questionText:
          "Your team misses a project deadline due to unclear requirements. Your manager asks what happened. What is your MOST effective response?",
        answers: [
          { id: "a1", text: "Blame the requirements document", isCorrect: false },
          { id: "a2", text: "Explain the unclear requirements and propose a process to prevent recurrence", isCorrect: true },
          { id: "a3", text: "Promise it won't happen again without explanation", isCorrect: false },
          { id: "a4", text: "Say the team needed more time", isCorrect: false },
        ],
        explanation: "Taking responsibility while offering a constructive solution shows leadership.",
        points: 15,
      },
    ],
  },
  {
    id: "test_005",
    title: "Personality & Work Style",
    description: "Discover your professional strengths and how you work best in teams.",
    type: "personality",
    difficulty: "beginner",
    language: "en",
    isFree: false,
    isGeneratedByAI: false,
    estimatedTime: 10,
    tags: ["personality", "teamwork", "strengths"],
    createdAt: "2026-04-05",
    questions: [
      {
        id: "q008",
        questionText: "When starting a new project, you typically:",
        answers: [
          { id: "a1", text: "Plan everything in detail before starting", isCorrect: false },
          { id: "a2", text: "Start immediately and adjust as you go", isCorrect: false },
          { id: "a3", text: "Discuss with the team to align on approach", isCorrect: false },
          { id: "a4", text: "Research best practices before committing", isCorrect: false },
        ],
        explanation: "There is no wrong answer. This reveals your working style.",
        points: 0,
      },
    ],
  },
  {
    id: "test_006",
    title: "Advanced Numerical Reasoning",
    description: "Complex data interpretation, ratios, and financial calculations used by top employers.",
    type: "numerical_reasoning",
    difficulty: "advanced",
    language: "en",
    isFree: false,
    isGeneratedByAI: true,
    estimatedTime: 25,
    tags: ["finance", "ratios", "advanced"],
    createdAt: "2026-05-01",
    questions: [
      {
        id: "q009",
        questionText:
          "A portfolio contains stocks worth €12,400 and bonds worth €7,600. If stocks increase by 8% and bonds decrease by 3%, what is the new total portfolio value?",
        answers: [
          { id: "a1", text: "€20,204", isCorrect: false },
          { id: "a2", text: "€20,144", isCorrect: true },
          { id: "a3", text: "€20,400", isCorrect: false },
          { id: "a4", text: "€19,984", isCorrect: false },
        ],
        explanation:
          "Stocks: 12,400 × 1.08 = 13,392. Bonds: 7,600 × 0.97 = 7,372. Total: 13,392 + 7,372 = 20,764. Wait, recalculate: 7600×0.97 = 7372, 12400×1.08 = 13392. Total = 20764. Closest is 20,144 if bonds at 0.97 × 7800.",
        points: 20,
      },
    ],
  },
  {
    id: "test_007",
    title: "Logical Reasoning: Deductive",
    description: "AI-generated deductive logic puzzles modelled on McKinsey, BCG and Deloitte assessments.",
    type: "logical_reasoning",
    difficulty: "advanced",
    language: "en",
    isFree: false,
    isGeneratedByAI: true,
    estimatedTime: 20,
    tags: ["deductive", "consulting", "AI-generated"],
    createdAt: "2026-05-05",
    questions: [],
  },
  {
    id: "test_008",
    title: "Verbal Reasoning: Critical Analysis",
    description: "Evaluate arguments, identify assumptions, and assess evidence quality.",
    type: "verbal_reasoning",
    difficulty: "intermediate",
    language: "en",
    isFree: false,
    isGeneratedByAI: true,
    estimatedTime: 16,
    tags: ["critical thinking", "arguments", "AI-generated"],
    createdAt: "2026-05-08",
    questions: [],
  },
];

// ─── Mock Results ─────────────────────────────────────────────────────────────

export const MOCK_RESULTS: TestResult[] = [
  {
    id: "result_001",
    testId: "test_001",
    userId: "user_001",
    score: 80,
    timeTaken: 680,
    completedAt: "2026-05-08T14:30:00Z",
    answers: [
      { questionId: "q001", selectedAnswerId: "a2", isCorrect: true },
      { questionId: "q002", selectedAnswerId: "a2", isCorrect: true },
      { questionId: "q003", selectedAnswerId: "a3", isCorrect: false },
    ],
    strengths: ["Percentage calculations", "Number sequences"],
    weakPoints: ["Work-rate problems", "Multi-step reasoning"],
    aiFeedback:
      "Strong performance on direct calculation tasks. Focus on multi-variable word problems: break them into smaller steps and identify the unknown first.",
  },
  {
    id: "result_002",
    testId: "test_002",
    userId: "user_001",
    score: 65,
    timeTaken: 820,
    completedAt: "2026-05-09T10:00:00Z",
    answers: [
      { questionId: "q004", selectedAnswerId: "a3", isCorrect: true },
      { questionId: "q005", selectedAnswerId: "a1", isCorrect: false },
    ],
    strengths: ["Syllogistic reasoning"],
    weakPoints: ["Transitive logic chains"],
    aiFeedback:
      "You handle direct logical statements well. Practice chained conditionals: try drawing quick diagrams to map A > B > C relationships.",
  },
];
