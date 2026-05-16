import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AssessmentType, Difficulty } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
  // Cognitive & Reasoning
  numerical_reasoning:    "Numerical Reasoning",
  logical_reasoning:      "Logical Reasoning",
  verbal_reasoning:       "Verbal Reasoning",
  abstract_reasoning:     "Abstract Reasoning",
  critical_thinking:      "Critical Thinking",
  inductive_reasoning:    "Inductive Reasoning",
  deductive_reasoning:    "Deductive Reasoning",
  diagrammatic_reasoning: "Diagrammatic Reasoning",
  spatial_reasoning:      "Spatial Reasoning",
  mechanical_reasoning:   "Mechanical Reasoning",
  analytical_thinking:    "Analytical Thinking",
  // Data & Interpretation
  data_interpretation:    "Data Interpretation",
  error_checking:         "Error Checking",
  // Verbal & Written
  reading_comprehension:  "Reading Comprehension",
  grammar_spelling:       "Grammar & Spelling",
  writing_assessment:     "Writing Assessment",
  communication_skills:   "Communication Skills",
  presentation_skills:    "Presentation Skills",
  // Personality & Behavioural
  personality:            "Personality & Work Style",
  situational_judgement:  "Situational Judgement",
  emotional_intelligence: "Emotional Intelligence",
  adaptability:           "Adaptability",
  cultural_fit:           "Cultural Fit",
  // Leadership & Management
  leadership_assessment:  "Leadership Assessment",
  decision_making:        "Decision Making",
  strategic_thinking:     "Strategic Thinking",
  project_management:     "Project Management",
  time_management:        "Time Management",
  risk_assessment:        "Risk Assessment",
  // Interpersonal & Professional
  teamwork_collaboration: "Teamwork & Collaboration",
  conflict_resolution:    "Conflict Resolution",
  negotiation_skills:     "Negotiation Skills",
  customer_service:       "Customer Service",
  sales_aptitude:         "Sales Aptitude",
  // Domain-specific
  financial_literacy:     "Financial Literacy",
  excel_skills:           "Excel Skills",
  coding_challenge:       "Coding Challenge",
  // Values & Ethics
  ethics_compliance:      "Ethics & Compliance",
  // Creative
  creativity_innovation:  "Creativity & Innovation",
};

export const ASSESSMENT_TYPE_ICONS: Record<AssessmentType, string> = {
  // Cognitive & Reasoning
  numerical_reasoning:    "📊",
  logical_reasoning:      "🧩",
  verbal_reasoning:       "📝",
  abstract_reasoning:     "🔷",
  critical_thinking:      "💡",
  inductive_reasoning:    "🔍",
  deductive_reasoning:    "🎯",
  diagrammatic_reasoning: "📐",
  spatial_reasoning:      "🗺️",
  mechanical_reasoning:   "⚙️",
  analytical_thinking:    "🔬",
  // Data & Interpretation
  data_interpretation:    "📈",
  error_checking:         "✅",
  // Verbal & Written
  reading_comprehension:  "📖",
  grammar_spelling:       "🖊️",
  writing_assessment:     "✍️",
  communication_skills:   "💬",
  presentation_skills:    "🎤",
  // Personality & Behavioural
  personality:            "🧠",
  situational_judgement:  "🤝",
  emotional_intelligence: "❤️",
  adaptability:           "🌊",
  cultural_fit:           "🌍",
  // Leadership & Management
  leadership_assessment:  "🏆",
  decision_making:        "⚖️",
  strategic_thinking:     "♟️",
  project_management:     "📋",
  time_management:        "⏱️",
  risk_assessment:        "🛡️",
  // Interpersonal & Professional
  teamwork_collaboration: "👥",
  conflict_resolution:    "🕊️",
  negotiation_skills:     "🤜",
  customer_service:       "🎧",
  sales_aptitude:         "💼",
  // Domain-specific
  financial_literacy:     "💰",
  excel_skills:           "📑",
  coding_challenge:       "💻",
  // Values & Ethics
  ethics_compliance:      "⚖️",
  // Creative
  creativity_innovation:  "🎨",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "text-emerald-600 bg-emerald-50",
  intermediate: "text-amber-600 bg-amber-50",
  advanced: "text-rose-600 bg-rose-50",
};

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Average";
  return "Needs work";
}
