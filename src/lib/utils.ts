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
  numerical_reasoning:   "Numerical Reasoning",
  logical_reasoning:     "Logical Reasoning",
  verbal_reasoning:      "Verbal Reasoning",
  situational_judgement: "Situational Judgement",
  personality:           "Personality & Work Style",
  data_interpretation:   "Data Interpretation",
  abstract_reasoning:    "Abstract Reasoning",
  critical_thinking:     "Critical Thinking",
  coding_challenge:      "Coding Challenge",
  leadership_assessment: "Leadership Assessment",
  writing_assessment:    "Writing Assessment",
};

export const ASSESSMENT_TYPE_ICONS: Record<AssessmentType, string> = {
  numerical_reasoning:   "📊",
  logical_reasoning:     "🧩",
  verbal_reasoning:      "📝",
  situational_judgement: "🤝",
  personality:           "🧠",
  data_interpretation:   "📈",
  abstract_reasoning:    "🔷",
  critical_thinking:     "💡",
  coding_challenge:      "💻",
  leadership_assessment: "🏆",
  writing_assessment:    "✍️",
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
