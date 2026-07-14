import type { RoleCategory } from "@/lib/types";

// ─── Personalised hero data ───────────────────────────────────────────────────
//
// Drives the homepage "I'm preparing as <role>" picker: each role maps to the
// reasoning type employers in that field lean on most, plus the demo question
// the visitor actually answers. Honest, verifiable mapping — no invented stats.

export type DemoTestType =
  | "numerical"
  | "logical"
  | "verbal"
  | "data"
  | "situational"
  | "critical";

/** Human-readable label for a test type, used in hero subtext. */
export const TYPE_LABEL: Record<DemoTestType, string> = {
  numerical: "numerical reasoning",
  logical: "logical reasoning",
  verbal: "verbal reasoning",
  data: "data interpretation",
  situational: "situational judgement",
  critical: "critical reasoning",
};

interface RoleMeta {
  /** Goes into "Ace your <noun> assessment." */
  headlineNoun: string;
  /** Goes into "the type <phrase> lean on most". */
  phrase: string;
  /** Which demo question + reasoning type this role maps to. */
  type: DemoTestType;
}

/**
 * Per-role hero copy and the reasoning type it maps to. Ordered to match the
 * onboarding role list so the two surfaces feel consistent.
 */
export const ROLE_META: Record<RoleCategory, RoleMeta> = {
  "Software Engineering":    { headlineNoun: "software engineering", phrase: "software engineering roles", type: "logical" },
  "Data & Analytics":        { headlineNoun: "data & analytics",     phrase: "data roles",                 type: "data" },
  "Consulting":              { headlineNoun: "consulting",           phrase: "consulting roles",           type: "critical" },
  "Finance":                 { headlineNoun: "finance",              phrase: "finance roles",              type: "numerical" },
  "Marketing":               { headlineNoun: "marketing",            phrase: "marketing roles",            type: "verbal" },
  "Communication & PR":      { headlineNoun: "communications",       phrase: "communications roles",       type: "verbal" },
  "Management & Leadership": { headlineNoun: "leadership",           phrase: "leadership roles",           type: "situational" },
  "Product Management":      { headlineNoun: "product management",   phrase: "product roles",              type: "critical" },
  "HR":                      { headlineNoun: "HR",                   phrase: "HR roles",                   type: "situational" },
  "Sales":                   { headlineNoun: "sales",                phrase: "sales roles",                type: "situational" },
  "Operations":              { headlineNoun: "operations",           phrase: "operations roles",           type: "numerical" },
  "Design & Creative":       { headlineNoun: "design",               phrase: "design roles",               type: "logical" },
  "Legal":                   { headlineNoun: "legal",                phrase: "legal roles",                type: "critical" },
  "Customer Support":        { headlineNoun: "customer support",     phrase: "support roles",              type: "situational" },
};

/** Roles in display order for the picker. */
export const ROLE_OPTIONS = Object.keys(ROLE_META) as RoleCategory[];

export function isRoleCategory(value: string): value is RoleCategory {
  return Object.prototype.hasOwnProperty.call(ROLE_META, value);
}

export interface DemoAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DemoQuestion {
  /** Small uppercase label above the prompt. */
  eyebrow: string;
  prompt: string;
  /** Optional emphasised line (a sequence or short data figure). */
  sequence?: string;
  answers: DemoAnswer[];
  explanation: string;
  /** Practice page this question's type links to. */
  practiceSlug: string;
  /** "grid" for short options, "list" for full-sentence options. */
  layout: "grid" | "list";
}

/**
 * One strong, verifiably-correct question per reasoning type. These are an
 * honest demo of how a single question scores, not aggregate social proof.
 */
export const DEMO_QUESTIONS: Record<DemoTestType, DemoQuestion> = {
  numerical: {
    eyebrow: "Numerical reasoning",
    prompt: "A product costs $80. The price rises by 25%, then is discounted by 20%. What is the final price?",
    answers: [
      { id: "a", text: "$76", isCorrect: false },
      { id: "b", text: "$80", isCorrect: true },
      { id: "c", text: "$84", isCorrect: false },
      { id: "d", text: "$100", isCorrect: false },
    ],
    explanation:
      "A 25% rise takes $80 to $100 (80 × 1.25). A 20% discount takes $100 back to $80 (100 × 0.80). The percentages don't cancel by chance: they apply to different amounts, but here they land back at $80.",
    practiceSlug: "numerical-reasoning",
    layout: "grid",
  },
  logical: {
    eyebrow: "Number series",
    prompt: "Which number comes next in the sequence?",
    sequence: "2, 6, 12, 20, 30, ?",
    answers: [
      { id: "a", text: "36", isCorrect: false },
      { id: "b", text: "40", isCorrect: false },
      { id: "c", text: "42", isCorrect: true },
      { id: "d", text: "48", isCorrect: false },
    ],
    explanation:
      "The gaps between the numbers grow by 2 each step: +4, +6, +8, +10, then +12. So 30 + 12 = 42.",
    practiceSlug: "logical-reasoning",
    layout: "grid",
  },
  verbal: {
    eyebrow: "Verbal reasoning",
    prompt: "Which word is closest in meaning to “meticulous”?",
    answers: [
      { id: "a", text: "Careless", isCorrect: false },
      { id: "b", text: "Thorough", isCorrect: true },
      { id: "c", text: "Hasty", isCorrect: false },
      { id: "d", text: "Generous", isCorrect: false },
    ],
    explanation:
      "“Meticulous” means showing great attention to detail. “Thorough” is the closest match; “careless” and “hasty” are near-opposites.",
    practiceSlug: "verbal-reasoning",
    layout: "grid",
  },
  data: {
    eyebrow: "Data interpretation",
    prompt: "A team closed 40 deals in Q1 and 50 deals in Q2. What was the percentage increase?",
    sequence: "Q1: 40 deals   →   Q2: 50 deals",
    answers: [
      { id: "a", text: "10%", isCorrect: false },
      { id: "b", text: "20%", isCorrect: false },
      { id: "c", text: "25%", isCorrect: true },
      { id: "d", text: "50%", isCorrect: false },
    ],
    explanation:
      "The increase is 10 deals on a base of 40. 10 ÷ 40 = 0.25, so a 25% increase. Always divide the change by the starting value, not the new one.",
    practiceSlug: "data-interpretation",
    layout: "grid",
  },
  situational: {
    eyebrow: "Situational judgement",
    prompt: "A client emails an urgent complaint an hour before a deadline you're rushing to meet. What is the best first step?",
    answers: [
      { id: "a", text: "Ignore it until after the deadline has passed.", isCorrect: false },
      { id: "b", text: "Acknowledge the client and give them a realistic timeframe for a full response.", isCorrect: true },
      { id: "c", text: "Drop everything and miss your deadline to fix it immediately.", isCorrect: false },
      { id: "d", text: "Forward it to a colleague without any context.", isCorrect: false },
    ],
    explanation:
      "A quick acknowledgement with a realistic timeframe manages the client's expectations without sacrificing your deadline. Ignoring, over-reacting, or dumping it on someone else all create bigger problems.",
    practiceSlug: "situational-judgement",
    layout: "list",
  },
  critical: {
    eyebrow: "Critical reasoning",
    prompt: "A study finds that towns with more libraries tend to have higher reading scores. Which conclusion is best supported?",
    answers: [
      { id: "a", text: "Building more libraries causes reading scores to rise.", isCorrect: false },
      { id: "b", text: "There is an association between library numbers and reading scores.", isCorrect: true },
      { id: "c", text: "Libraries are a waste of public money.", isCorrect: false },
      { id: "d", text: "People who read never use libraries.", isCorrect: false },
    ],
    explanation:
      "The study shows a correlation, not a cause. Wealthier or more education-focused towns might fund both libraries and schools. “Association” is all the data supports.",
    practiceSlug: "critical-reasoning",
    layout: "list",
  },
};

/** The demo question for a given role, falling back to the number-series default. */
export function questionForRole(role: RoleCategory | null): DemoQuestion {
  const type = role ? ROLE_META[role].type : "logical";
  return DEMO_QUESTIONS[type];
}
