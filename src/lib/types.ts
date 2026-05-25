// ─── Core domain types ───────────────────────────────────────────────────────

export type Language = "en" | "nl" | "de" | "fr" | "es";

export type AssessmentType =
  // Cognitive & Reasoning
  | "numerical_reasoning"
  | "logical_reasoning"
  | "verbal_reasoning"
  | "abstract_reasoning"
  | "critical_thinking"
  | "inductive_reasoning"
  | "deductive_reasoning"
  | "diagrammatic_reasoning"
  | "spatial_reasoning"
  | "mechanical_reasoning"
  | "analytical_thinking"
  // Data & Interpretation
  | "data_interpretation"
  | "error_checking"
  // Verbal & Written
  | "reading_comprehension"
  | "grammar_spelling"
  | "writing_assessment"
  | "communication_skills"
  | "presentation_skills"
  // Personality & Behavioural
  | "personality"
  | "situational_judgement"
  | "emotional_intelligence"
  | "adaptability"
  | "cultural_fit"
  // Leadership & Management
  | "leadership_assessment"
  | "decision_making"
  | "strategic_thinking"
  | "project_management"
  | "time_management"
  | "risk_assessment"
  // Interpersonal & Professional
  | "teamwork_collaboration"
  | "conflict_resolution"
  | "negotiation_skills"
  | "customer_service"
  | "sales_aptitude"
  // Domain-specific
  | "financial_literacy"
  | "excel_skills"
  | "coding_challenge"
  // Values & Ethics
  | "ethics_compliance"
  // Creative
  | "creativity_innovation";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type MediaType = "IMAGE" | "CHART" | "DIAGRAM" | "TABLE";

export type SubscriptionTier = "free" | "pro";

// ─── Media ───────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  type: MediaType;
  url?: string;           // For IMAGE / CHART / DIAGRAM
  altText?: string;
  caption?: string;
  tableData?: TableData;  // For TABLE type
  chartData?: ChartData;  // For CHART type
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ChartData {
  labels: string[];
  datasets: { label: string; values: number[] }[];
}

// ─── Questions ───────────────────────────────────────────────────────────────

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  media?: MediaItem[];
  answers: AnswerOption[];
  explanation: string;
  points: number;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

export interface Test {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  difficulty: Difficulty;
  language: Language;
  isFree: boolean;
  isGeneratedByAI: boolean;
  estimatedTime: number;  // minutes
  questions: Question[];
  questionCount?: number;       // total pool size
  displayQuestionCount?: number; // how many are shown per attempt (0 = all)
  createdAt: string;
  tags: string[];
  category?: AssessmentCategory;
  subcategory?: string;
  targetRoles?: string[];
  targetIndustries?: string[];
  recommendedForCompanies?: string[];
  skillsMeasured?: string[];
  isRecommended?: boolean;
}

// ─── User / Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: SubscriptionTier;
  isAdmin: boolean;
  freeTestsUsed: number;
  streak: number;
  xp?: number;
  joinedAt: string;
  preferredTestType?: AssessmentType;
  level?: "beginner" | "intermediate" | "advanced";
  targetRole?: string;
  targetIndustry?: string;
  targetCompany?: string;
}

// ─── Results ─────────────────────────────────────────────────────────────────

export interface QuestionResult {
  questionId: string;
  questionText: string;
  explanation: string;
  selectedAnswerOptionId: string | null;
  isCorrect: boolean;
  answerOptions: { id: string; text: string; isCorrect: boolean }[];
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;          // 0–100
  timeTaken: number;      // seconds
  completedAt: string;
  answers: { questionId: string; selectedAnswerId: string; isCorrect: boolean }[];
  strengths: string[];
  weakPoints: string[];
  aiFeedback?: string;
  tips?: string[];
  questionResults?: QuestionResult[]; // populated only from submit response
}

// ─── Career targeting ─────────────────────────────────────────────────────────

export type RoleCategory =
  | "Software Engineering"
  | "Data & Analytics"
  | "Marketing"
  | "Communication & PR"
  | "Finance"
  | "Consulting"
  | "HR"
  | "Sales"
  | "Operations"
  | "Design & Creative"
  | "Product Management"
  | "Customer Support"
  | "Legal"
  | "Management & Leadership";

export type IndustryCategory =
  | "Technology"
  | "Finance"
  | "Consulting"
  | "Government"
  | "Healthcare"
  | "Retail"
  | "Media"
  | "Energy"
  | "Telecommunications"
  | "Education"
  | "Logistics"
  | "Manufacturing";

export type AssessmentCategory =
  | "COGNITIVE"
  | "PERSONALITY"
  | "COMMUNICATION"
  | "MARKETING"
  | "IT_ENGINEERING"
  | "FINANCE_CONSULTING"
  | "HR_LEADERSHIP"
  | "CREATIVE";

export interface CareerTargets {
  targetRole?: string;
  targetIndustry?: string;
  targetCompany?: string;
  level?: string;
}

export interface PreparationPath {
  recommendedOrder: string[];
  focusAreas: string[];
  estimatedPreparationDays: number;
  targetRole?: string;
  targetIndustry?: string;
  targetCompany?: string;
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export interface OnboardingData {
  targetRole?: string;
  targetIndustry?: string;
  targetCompany?: string;
  level: "beginner" | "intermediate" | "advanced";
  preferredTestType?: AssessmentType;
}

// ─── API response wrappers ───────────────────────────────────────────────────
// These match what the Spring Boot backend will return.

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
