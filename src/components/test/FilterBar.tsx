"use client";

import { Search, SlidersHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentType, Difficulty, RoleCategory, IndustryCategory } from "@/lib/types";

const ROLE_OPTIONS: { value: RoleCategory | "all"; label: string }[] = [
  { value: "all",                      label: "All roles" },
  { value: "Software Engineering",     label: "Software Eng." },
  { value: "Data & Analytics",         label: "Data & Analytics" },
  { value: "Consulting",               label: "Consulting" },
  { value: "Finance",                  label: "Finance" },
  { value: "Marketing",                label: "Marketing" },
  { value: "Communication & PR",       label: "Comm & PR" },
  { value: "Management & Leadership",  label: "Leadership" },
  { value: "HR",                       label: "HR" },
  { value: "Sales",                    label: "Sales" },
  { value: "Legal",                    label: "Legal" },
];

const INDUSTRY_OPTIONS: { value: IndustryCategory | "all"; label: string }[] = [
  { value: "all",               label: "All industries" },
  { value: "Technology",        label: "Technology" },
  { value: "Finance",           label: "Finance" },
  { value: "Consulting",        label: "Consulting" },
  { value: "Healthcare",        label: "Healthcare" },
  { value: "Government",        label: "Government" },
  { value: "Media",             label: "Media" },
  { value: "Education",         label: "Education" },
];

export type SortOption = "default" | "recommended" | "best_match";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedType: AssessmentType | "all";
  onTypeChange: (v: AssessmentType | "all") => void;
  selectedDifficulty: Difficulty | "all";
  onDifficultyChange: (v: Difficulty | "all") => void;
  selectedTier: "free" | "pro" | "all";
  onTierChange: (v: "free" | "pro" | "all") => void;
  selectedRole?: RoleCategory | "all";
  onRoleChange?: (v: RoleCategory | "all") => void;
  selectedIndustry?: IndustryCategory | "all";
  onIndustryChange?: (v: IndustryCategory | "all") => void;
  sortBy?: SortOption;
  onSortChange?: (v: SortOption) => void;
  showRoleFilter?: boolean;
}

const TYPE_GROUPS: { label: string; options: { value: AssessmentType; label: string }[] }[] = [
  {
    label: "Cognitive & Reasoning",
    options: [
      { value: "numerical_reasoning",    label: "Numerical Reasoning" },
      { value: "logical_reasoning",      label: "Logical Reasoning" },
      { value: "verbal_reasoning",       label: "Verbal Reasoning" },
      { value: "abstract_reasoning",     label: "Abstract Reasoning" },
      { value: "critical_thinking",      label: "Critical Thinking" },
      { value: "inductive_reasoning",    label: "Inductive Reasoning" },
      { value: "deductive_reasoning",    label: "Deductive Reasoning" },
      { value: "diagrammatic_reasoning", label: "Diagrammatic Reasoning" },
      { value: "spatial_reasoning",      label: "Spatial Reasoning" },
      { value: "mechanical_reasoning",   label: "Mechanical Reasoning" },
      { value: "analytical_thinking",    label: "Analytical Thinking" },
    ],
  },
  {
    label: "Data & Interpretation",
    options: [
      { value: "data_interpretation", label: "Data Interpretation" },
      { value: "error_checking",      label: "Error Checking" },
    ],
  },
  {
    label: "Verbal & Written",
    options: [
      { value: "reading_comprehension", label: "Reading Comprehension" },
      { value: "grammar_spelling",      label: "Grammar & Spelling" },
      { value: "writing_assessment",    label: "Writing Assessment" },
      { value: "communication_skills",  label: "Communication Skills" },
      { value: "presentation_skills",   label: "Presentation Skills" },
    ],
  },
  {
    label: "Personality & Behavioural",
    options: [
      { value: "personality",            label: "Personality & Work Style" },
      { value: "situational_judgement",  label: "Situational Judgement" },
      { value: "emotional_intelligence", label: "Emotional Intelligence" },
      { value: "adaptability",           label: "Adaptability" },
      { value: "cultural_fit",           label: "Cultural Fit" },
    ],
  },
  {
    label: "Leadership & Management",
    options: [
      { value: "leadership_assessment", label: "Leadership Assessment" },
      { value: "decision_making",       label: "Decision Making" },
      { value: "strategic_thinking",    label: "Strategic Thinking" },
      { value: "project_management",    label: "Project Management" },
      { value: "time_management",       label: "Time Management" },
      { value: "risk_assessment",       label: "Risk Assessment" },
    ],
  },
  {
    label: "Interpersonal & Professional",
    options: [
      { value: "teamwork_collaboration", label: "Teamwork & Collaboration" },
      { value: "conflict_resolution",    label: "Conflict Resolution" },
      { value: "negotiation_skills",     label: "Negotiation Skills" },
      { value: "customer_service",       label: "Customer Service" },
      { value: "sales_aptitude",         label: "Sales Aptitude" },
    ],
  },
  {
    label: "Domain-specific",
    options: [
      { value: "financial_literacy", label: "Financial Literacy" },
      { value: "excel_skills",       label: "Excel Skills" },
      { value: "coding_challenge",   label: "Coding Challenge" },
    ],
  },
  {
    label: "Values & Creative",
    options: [
      { value: "ethics_compliance",   label: "Ethics & Compliance" },
      { value: "creativity_innovation", label: "Creativity & Innovation" },
    ],
  },
];

const DIFFICULTY_OPTIONS: { value: Difficulty | "all"; label: string }[] = [
  { value: "all",          label: "All levels" },
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
];

const TIER_OPTIONS: { value: "free" | "pro" | "all"; label: string }[] = [
  { value: "all",  label: "All tests" },
  { value: "free", label: "Free" },
  { value: "pro",  label: "Pro" },
];

export function FilterBar({
  search, onSearchChange,
  selectedType, onTypeChange,
  selectedDifficulty, onDifficultyChange,
  selectedTier, onTierChange,
  selectedRole = "all", onRoleChange,
  selectedIndustry = "all", onIndustryChange,
  sortBy = "default", onSortChange,
  showRoleFilter = true,
}: FilterBarProps) {
  const hasActiveCareerFilters = selectedRole !== "all" || selectedIndustry !== "all" || sortBy === "best_match";

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          placeholder="Search tests..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm text-[#0D1B2E] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
        />
      </div>

      {/* Sort + type + difficulty + tier */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-medium">
          <SlidersHorizontal size={13} />
          Filter:
        </div>

        {onSortChange && (
          <>
            <button
              onClick={() => onSortChange("best_match")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                sortBy === "best_match"
                  ? "bg-[#4f46e5] text-white"
                  : "bg-[#eef2ff] text-[#4f46e5] hover:bg-[#e0e7ff]"
              )}
            >
              <Star size={11} /> Best match
            </button>
            <div className="w-px h-4 bg-[#e2e8f0]" />
          </>
        )}

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as AssessmentType | "all")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all outline-none cursor-pointer",
            selectedType !== "all"
              ? "border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5]"
              : "border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
          )}
        >
          <option value="all">All types</option>
          {TYPE_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="w-px h-4 bg-[#e2e8f0]" />
        <FilterChips options={DIFFICULTY_OPTIONS} selected={selectedDifficulty} onChange={onDifficultyChange as (v: string) => void} />
        <div className="w-px h-4 bg-[#e2e8f0]" />
        <FilterChips options={TIER_OPTIONS} selected={selectedTier} onChange={onTierChange as (v: string) => void} />
      </div>

      {/* Role + industry filters */}
      {showRoleFilter && (onRoleChange || onIndustryChange) && (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-medium">
            <Star size={13} />
            Career:
          </div>

          {onRoleChange && (
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value as RoleCategory | "all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all outline-none cursor-pointer",
                selectedRole !== "all"
                  ? "border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5]"
                  : "border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
              )}
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}

          {onIndustryChange && (
            <select
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value as IndustryCategory | "all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all outline-none cursor-pointer",
                selectedIndustry !== "all"
                  ? "border-[#0891b2] bg-[#ecfeff] text-[#0891b2]"
                  : "border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
              )}
            >
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}

          {hasActiveCareerFilters && (
            <button
              onClick={() => {
                onRoleChange?.("all");
                onIndustryChange?.("all");
                onSortChange?.("default");
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors"
            >
              Clear career filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChips({
  options, selected, onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            selected === opt.value
              ? "bg-[#0D1B2E] text-white"
              : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#334155]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </>
  );
}
