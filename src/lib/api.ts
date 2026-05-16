import type {
  Test,
  User,
  TestResult,
  QuestionResult,
  OnboardingData,
  AssessmentType,
  AssessmentCategory,
  Difficulty,
  Language,
  PaginatedResponse,
  Question,
  MediaItem,
  AnswerOption,
  CareerTargets,
  PreparationPath,
} from "./types";

import { getToken, getUserIdFromToken, saveAuth, clearAuth } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function currentUserId(): number {
  return getUserIdFromToken() ?? 1; // fallback to 1 for seeded demo user
}

// ─── Type mappers ─────────────────────────────────────────────────────────────

function mapTestType(backend: string): AssessmentType {
  const map: Record<string, AssessmentType> = {
    NUMERICAL_REASONING:   "numerical_reasoning",
    LOGICAL_REASONING:     "logical_reasoning",
    VERBAL_REASONING:      "verbal_reasoning",
    SITUATIONAL_JUDGEMENT: "situational_judgement",
    PERSONALITY_WORK_STYLE: "personality",
    DATA_INTERPRETATION:   "data_interpretation",
    ABSTRACT_REASONING:    "abstract_reasoning",
    CRITICAL_THINKING:     "critical_thinking",
    CODING_CHALLENGE:      "coding_challenge",
    LEADERSHIP_ASSESSMENT: "leadership_assessment",
    WRITING_ASSESSMENT:    "writing_assessment",
  };
  return map[backend] ?? "numerical_reasoning";
}

function mapDifficulty(backend: string): Difficulty {
  const map: Record<string, Difficulty> = {
    EASY: "beginner",
    MEDIUM: "intermediate",
    HARD: "advanced",
  };
  return map[backend] ?? "beginner";
}

function mapTestTypeToBackend(type: AssessmentType): string {
  const map: Record<AssessmentType, string> = {
    numerical_reasoning:   "NUMERICAL_REASONING",
    logical_reasoning:     "LOGICAL_REASONING",
    verbal_reasoning:      "VERBAL_REASONING",
    situational_judgement: "SITUATIONAL_JUDGEMENT",
    personality:           "PERSONALITY_WORK_STYLE",
    data_interpretation:   "DATA_INTERPRETATION",
    abstract_reasoning:    "ABSTRACT_REASONING",
    critical_thinking:     "CRITICAL_THINKING",
    coding_challenge:      "CODING_CHALLENGE",
    leadership_assessment: "LEADERSHIP_ASSESSMENT",
    writing_assessment:    "WRITING_ASSESSMENT",
  };
  return map[type];
}

function mapDifficultyToBackend(diff: Difficulty): string {
  const map: Record<Difficulty, string> = {
    beginner: "EASY",
    intermediate: "MEDIUM",
    advanced: "HARD",
  };
  return map[diff];
}

// ─── Backend response shapes ──────────────────────────────────────────────────

interface BackendTestListItem {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  language: string;
  isFree: boolean;
  isGeneratedByAI: boolean;
  estimatedTimeMinutes: number;
  questionCount: number;
  displayQuestionCount: number;
  createdAt: string;
  category?: string;
  subcategory?: string;
  targetRoles?: string[];
  targetIndustries?: string[];
  recommendedForCompanies?: string[];
  skillsMeasured?: string[];
  isRecommended?: boolean;
}

interface BackendAnswerOption {
  id: number;
  answerText: string;
  orderIndex: number;
}

interface BackendMediaItem {
  id: number;
  mediaType: string;
  url?: string;
  altText?: string;
  caption?: string;
}

interface BackendQuestion {
  id: number;
  questionText: string;
  explanation: string;
  orderIndex: number;
  mediaItems: BackendMediaItem[];
  answerOptions: BackendAnswerOption[];
}

interface BackendTestDetail extends BackendTestListItem {
  questions: BackendQuestion[];
}

interface BackendUserResponse {
  id: number;
  email: string;
  name: string;
  preferredLanguage: string;
  freeTestsUsed: number;
  isPro: boolean;
  createdAt: string;
  targetRole?: string;
  targetIndustry?: string;
  targetCompany?: string;
}

interface BackendUserResult {
  resultId: number;
  testId: number;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  feedback: string;
  completedAt: string;
}

interface BackendSubmitResponse {
  resultId: number;
  testId: number;
  userId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  feedback: string;
  tips: string[];
  completedAt: string;
  questionResults: {
    questionId: number;
    questionText: string;
    explanation: string;
    selectedAnswerOptionId: number | null;
    isCorrect: boolean;
    answerOptions: { id: number; answerText: string; isCorrect: boolean; orderIndex: number }[];
  }[];
}

// ─── Entity mappers ───────────────────────────────────────────────────────────

function mapTestListItem(b: BackendTestListItem): Test {
  return {
    id: String(b.id),
    title: b.title,
    description: b.description,
    type: mapTestType(b.type),
    difficulty: mapDifficulty(b.difficulty),
    language: b.language.toLowerCase() as Language,
    isFree: b.isFree,
    isGeneratedByAI: b.isGeneratedByAI,
    estimatedTime: b.estimatedTimeMinutes,
    questions: [],
    questionCount: b.questionCount,
    displayQuestionCount: b.displayQuestionCount,
    createdAt: b.createdAt,
    tags: [],
    category: b.category as AssessmentCategory | undefined,
    subcategory: b.subcategory,
    targetRoles: b.targetRoles ?? [],
    targetIndustries: b.targetIndustries ?? [],
    recommendedForCompanies: b.recommendedForCompanies ?? [],
    skillsMeasured: b.skillsMeasured ?? [],
    isRecommended: b.isRecommended ?? false,
  };
}

function mapQuestion(q: BackendQuestion): Question {
  const media: MediaItem[] = q.mediaItems.map((m) => ({
    id: String(m.id),
    type: m.mediaType as MediaItem["type"],
    url: m.url,
    altText: m.altText,
    caption: m.caption,
  }));

  const answers: AnswerOption[] = q.answerOptions.map((a) => ({
    id: String(a.id),
    text: a.answerText,
    isCorrect: false, // withheld by backend during test
  }));

  return {
    id: String(q.id),
    questionText: q.questionText,
    media: media.length > 0 ? media : undefined,
    answers,
    explanation: q.explanation,
    points: 1,
  };
}

function mapTestDetail(b: BackendTestDetail): Test {
  return {
    ...mapTestListItem(b),
    questions: b.questions
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(mapQuestion),
  };
}

function mapUserResult(r: BackendUserResult): TestResult {
  return {
    id: String(r.resultId),
    testId: String(r.testId),
    userId: "1",
    score: r.score,
    timeTaken: r.timeTakenSeconds,
    completedAt: r.completedAt ?? new Date().toISOString(),
    answers: [],
    strengths: [],
    weakPoints: [],
    aiFeedback: r.feedback,
  };
}

function mapSubmitResponse(r: BackendSubmitResponse): TestResult {
  const questionResults: QuestionResult[] = (r.questionResults ?? []).map((q) => ({
    questionId: String(q.questionId),
    questionText: q.questionText,
    explanation: q.explanation,
    selectedAnswerOptionId: q.selectedAnswerOptionId != null ? String(q.selectedAnswerOptionId) : null,
    isCorrect: q.isCorrect,
    answerOptions: q.answerOptions
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((a) => ({ id: String(a.id), text: a.answerText, isCorrect: a.isCorrect })),
  }));

  return {
    id: String(r.resultId),
    testId: String(r.testId),
    userId: String(r.userId),
    score: r.score,
    timeTaken: r.timeTakenSeconds,
    completedAt: r.completedAt ?? new Date().toISOString(),
    answers: questionResults.map((q) => ({
      questionId: q.questionId,
      selectedAnswerId: q.selectedAnswerOptionId ?? "",
      isCorrect: q.isCorrect,
    })),
    strengths: [],
    weakPoints: [],
    aiFeedback: r.feedback,
    tips: r.tips ?? [],
    questionResults,
  };
}

function mapUser(u: BackendUserResponse): User {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name,
    subscription: u.isPro ? "pro" : "free",
    freeTestsUsed: u.freeTestsUsed,
    streak: 0, // not tracked by backend yet
    joinedAt: u.createdAt,
    targetRole: u.targetRole,
    targetIndustry: u.targetIndustry,
    targetCompany: u.targetCompany,
  };
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

export interface TestFilters {
  type?: AssessmentType;
  difficulty?: Difficulty;
  tier?: "free" | "pro" | "all";
  search?: string;
}

export async function getTests(
  filters: TestFilters = {},
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<Test>> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", mapTestTypeToBackend(filters.type));
  if (filters.difficulty) params.set("difficulty", mapDifficultyToBackend(filters.difficulty));
  if (filters.tier === "free") params.set("access", "free");
  else if (filters.tier === "pro") params.set("access", "pro");

  const query = params.toString() ? `?${params.toString()}` : "";
  const items = await apiFetch<BackendTestListItem[]>(`/api/tests${query}`);

  let results = items.map(mapTestListItem);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  const total = results.length;
  const start = (page - 1) * pageSize;

  return {
    data: results.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    hasMore: start + pageSize < total,
  };
}

export async function getTestById(id: string): Promise<Test | null> {
  try {
    const detail = await apiFetch<BackendTestDetail>(
      `/api/tests/${id}?userId=${currentUserId()}`
    );
    return mapTestDetail(detail);
  } catch {
    return null;
  }
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User> {
  const u = await apiFetch<BackendUserResponse>(`/api/users/${currentUserId()}`);
  return mapUser(u);
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  if (data.targetRole || data.targetIndustry || data.targetCompany) {
    await updateCareerTargets({
      targetRole: data.targetRole,
      targetIndustry: data.targetIndustry,
      targetCompany: data.targetCompany,
    });
  }
}

export async function updateCareerTargets(targets: CareerTargets): Promise<User> {
  const u = await apiFetch<BackendUserResponse>(
    `/api/users/${currentUserId()}/career-targets`,
    { method: "PATCH", body: JSON.stringify(targets) }
  );
  return mapUser(u);
}

export async function getPreparationPath(): Promise<PreparationPath> {
  return apiFetch<PreparationPath>(
    `/api/users/${currentUserId()}/preparation-path`
  );
}

export async function getRecommendedTests(): Promise<Test[]> {
  const items = await apiFetch<BackendTestListItem[]>(
    `/api/tests/recommended/${currentUserId()}`
  );
  return items.map(mapTestListItem);
}

// ─── Results ─────────────────────────────────────────────────────────────────

export async function submitTest(
  testId: string,
  answers: { questionId: string; selectedAnswerId: string }[],
  timeTakenSeconds: number
): Promise<TestResult> {
  const body = {
    userId: currentUserId(),
    timeTakenSeconds,
    answers: answers.map((a) => ({
      questionId: Number(a.questionId),
      selectedAnswerOptionId: Number(a.selectedAnswerId),
    })),
  };
  const response = await apiFetch<BackendSubmitResponse>(
    `/api/tests/${testId}/submit`,
    { method: "POST", body: JSON.stringify(body) }
  );
  return mapSubmitResponse(response);
}

export async function getUserResults(): Promise<TestResult[]> {
  const results = await apiFetch<BackendUserResult[]>(
    `/api/users/${currentUserId()}/results`
  );
  return results.map(mapUserResult);
}

export async function getResultById(id: string): Promise<TestResult | null> {
  const all = await getUserResults();
  return all.find((r) => r.id === id) ?? null;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export async function startCheckout(): Promise<{ checkoutUrl: string }> {
  await apiFetch(
    `/api/users/${currentUserId()}/subscription/mock-upgrade`,
    { method: "POST" }
  );
  // TODO: replace mock-upgrade with real Stripe checkout URL
  return { checkoutUrl: "/pricing?checkout=mock" };
}

export async function cancelSubscription(): Promise<void> {
  // TODO: DELETE /api/users/{id}/subscription once backend supports it
}

// ─── AI generation ───────────────────────────────────────────────────────────

export async function generateTestForMe(): Promise<Test> {
  const result = await apiFetch<BackendTestListItem>(
    `/api/admin/generate-for-user/${currentUserId()}`,
    { method: "POST" }
  );
  return mapTestListItem(result);
}

export const ALL_GENERATE_TYPES: { type: string; label: string }[] = [
  { type: "NUMERICAL_REASONING",   label: "Numerical Reasoning" },
  { type: "LOGICAL_REASONING",     label: "Logical Reasoning" },
  { type: "VERBAL_REASONING",      label: "Verbal Reasoning" },
  { type: "SITUATIONAL_JUDGEMENT", label: "Situational Judgement" },
  { type: "DATA_INTERPRETATION",   label: "Data Interpretation" },
  { type: "ABSTRACT_REASONING",    label: "Abstract Reasoning" },
  { type: "CRITICAL_THINKING",     label: "Critical Thinking" },
  { type: "PERSONALITY_WORK_STYLE",label: "Personality & Work Style" },
  { type: "LEADERSHIP_ASSESSMENT", label: "Leadership Assessment" },
  { type: "CODING_CHALLENGE",      label: "Coding Challenge" },
  { type: "WRITING_ASSESSMENT",    label: "Writing Assessment" },
];

export const ALL_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export async function getGenerationStatus(): Promise<Record<string, string[]>> {
  return apiFetch<Record<string, string[]>>("/api/admin/generation-status");
}

export async function generateTestOfType(backendType: string, difficulty = "MEDIUM"): Promise<Test> {
  const result = await apiFetch<BackendTestListItem>(
    `/api/admin/generate-type/${currentUserId()}/${backendType}?difficulty=${difficulty}`,
    { method: "POST" }
  );
  return mapTestListItem(result);
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function importTest(json: unknown): Promise<Test> {
  const result = await apiFetch<BackendTestListItem>(
    "/api/admin/tests/import",
    { method: "POST", body: JSON.stringify(json) }
  );
  return mapTestListItem(result);
}

export interface AdminStats {
  totalTests: number;
  totalUsers: number;
  totalResults: number;
  aiTests: number;
  freeTests: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  targetRole: string | null;
  resultCount: number;
  avgScore: number;
  createdAt: string;
}

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/api/admin/stats");
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/api/admin/users");
}

export async function getAdminTests(): Promise<Test[]> {
  const items = await apiFetch<BackendTestListItem[]>("/api/admin/tests");
  return items.map(mapTestListItem);
}

export async function deleteTest(id: string): Promise<void> {
  await apiFetch(`/api/admin/tests/${id}`, { method: "DELETE" });
}

export async function setTestFree(id: string, isFree: boolean): Promise<Test> {
  const result = await apiFetch<BackendTestListItem>(
    `/api/admin/tests/${id}/free?isFree=${isFree}`,
    { method: "PATCH" }
  );
  return mapTestListItem(result);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

interface AuthResponse {
  token: string;
  user: BackendUserResponse;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveAuth(res.token, res.user);
  return mapUser(res.user);
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveAuth(res.token, res.user);
  return mapUser(res.user);
}

export async function logout(): Promise<void> {
  clearAuth();
}
