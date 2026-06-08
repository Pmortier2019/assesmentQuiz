import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Calculator, Puzzle, FileText, Shapes, Lightbulb, ScanSearch, Target, Workflow,
  Box, Cog, Microscope, BarChart3, ListChecks, BookOpen, SpellCheck, PenLine,
  MessageCircle, Presentation, Smile, Compass, Heart, Waves, Globe, Crown, Scale,
  Crosshair, ClipboardList, Timer, ShieldAlert, UsersRound, HeartHandshake,
  Handshake, Headphones, BadgeDollarSign, Wallet, Table2, Code, Gavel, Palette,
  type LucideIcon,
} from "lucide-react";
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

// Each assessment type maps to a lucide icon (rendered via <AssessmentTypeIcon>)
// rather than an emoji, so the type tiles match the rest of the icon set.
export const ASSESSMENT_TYPE_ICONS: Record<AssessmentType, LucideIcon> = {
  // Cognitive & Reasoning
  numerical_reasoning:    Calculator,
  logical_reasoning:      Puzzle,
  verbal_reasoning:       FileText,
  abstract_reasoning:     Shapes,
  critical_thinking:      Lightbulb,
  inductive_reasoning:    ScanSearch,
  deductive_reasoning:    Target,
  diagrammatic_reasoning: Workflow,
  spatial_reasoning:      Box,
  mechanical_reasoning:   Cog,
  analytical_thinking:    Microscope,
  // Data & Interpretation
  data_interpretation:    BarChart3,
  error_checking:         ListChecks,
  // Verbal & Written
  reading_comprehension:  BookOpen,
  grammar_spelling:       SpellCheck,
  writing_assessment:     PenLine,
  communication_skills:   MessageCircle,
  presentation_skills:    Presentation,
  // Personality & Behavioural
  personality:            Smile,
  situational_judgement:  Compass,
  emotional_intelligence: Heart,
  adaptability:           Waves,
  cultural_fit:           Globe,
  // Leadership & Management
  leadership_assessment:  Crown,
  decision_making:        Scale,
  strategic_thinking:     Crosshair,
  project_management:     ClipboardList,
  time_management:        Timer,
  risk_assessment:        ShieldAlert,
  // Interpersonal & Professional
  teamwork_collaboration: UsersRound,
  conflict_resolution:    HeartHandshake,
  negotiation_skills:     Handshake,
  customer_service:       Headphones,
  sales_aptitude:         BadgeDollarSign,
  // Domain-specific
  financial_literacy:     Wallet,
  excel_skills:           Table2,
  coding_challenge:       Code,
  // Values & Ethics
  ethics_compliance:      Gavel,
  // Creative
  creativity_innovation:  Palette,
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
