"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Star, Layers, Tag, Briefcase, Building2, CornerDownLeft } from "lucide-react";
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

// Flattened list of every type option, for search autocomplete.
const ALL_TYPE_OPTIONS = TYPE_GROUPS.flatMap((g) => g.options);

// Category groups map to the backend AssessmentCategory.forType() map. The
// `term` is the keyword the search query matches to return the whole group,
// so picking a category suggestion just sets the search box to that term.
const CATEGORIES: { label: string; term: string }[] = [
  { label: "Cognitive & Reasoning",    term: "cognitive" },
  { label: "Personality & Behavioural", term: "personality" },
  { label: "Communication & Written",  term: "communication" },
  { label: "Leadership & Management",  term: "leadership" },
  { label: "Sales & Customer",         term: "sales" },
  { label: "Finance & Consulting",     term: "finance" },
  { label: "IT & Engineering",         term: "engineering" },
  { label: "Creative & Values",        term: "creative" },
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
      {/* Search with autocomplete */}
      <SmartSearch
        search={search}
        onSearchChange={onSearchChange}
        onTypeChange={onTypeChange}
        onRoleChange={onRoleChange}
        onIndustryChange={onIndustryChange}
      />

      {/* Sort + type + difficulty + tier */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
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
            <div className="w-px h-4 bg-line" />
          </>
        )}

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as AssessmentType | "all")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all outline-none cursor-pointer",
            selectedType !== "all"
              ? "border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5]"
              : "border-line bg-surface-muted text-muted hover:bg-line"
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
        <div className="w-px h-4 bg-line" />
        <FilterChips options={DIFFICULTY_OPTIONS} selected={selectedDifficulty} onChange={onDifficultyChange as (v: string) => void} />
        <div className="w-px h-4 bg-line" />
        <FilterChips options={TIER_OPTIONS} selected={selectedTier} onChange={onTierChange as (v: string) => void} />
      </div>

      {/* Role + industry filters */}
      {showRoleFilter && (onRoleChange || onIndustryChange) && (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
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
                  : "border-line bg-surface-muted text-muted hover:bg-line"
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
                  : "border-line bg-surface-muted text-muted hover:bg-line"
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

// ── Smart search with autocomplete ──────────────────────────────────────────

type Suggestion = {
  kind: "category" | "type" | "role" | "industry";
  label: string;
  sublabel: string;
  apply: () => void;
};

function SmartSearch({
  search,
  onSearchChange,
  onTypeChange,
  onRoleChange,
  onIndustryChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onTypeChange: (v: AssessmentType | "all") => void;
  onRoleChange?: (v: RoleCategory | "all") => void;
  onIndustryChange?: (v: IndustryCategory | "all") => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const q = search.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(q);

  // Selecting a non-search filter clears the text box so results aren't
  // double-filtered by the leftover query; the new filter chip stands in for it.
  const pick = (apply: () => void) => {
    apply();
    setOpen(false);
  };

  const suggestions: Suggestion[] = q.length === 0 ? [] : [
    ...CATEGORIES
      .filter((c) => match(c.label) || match(c.term))
      .slice(0, 3)
      .map((c): Suggestion => ({
        kind: "category", label: c.label, sublabel: "Category",
        apply: () => onSearchChange(c.term),
      })),
    ...ALL_TYPE_OPTIONS
      .filter((t) => match(t.label))
      .slice(0, 4)
      .map((t): Suggestion => ({
        kind: "type", label: t.label, sublabel: "Test type",
        apply: () => { onTypeChange(t.value); onSearchChange(""); },
      })),
    ...(onRoleChange ? ROLE_OPTIONS
      .filter((r) => r.value !== "all" && match(r.label))
      .slice(0, 3)
      .map((r): Suggestion => ({
        kind: "role", label: r.label, sublabel: "Role",
        apply: () => { onRoleChange(r.value as RoleCategory); onSearchChange(""); },
      })) : []),
    ...(onIndustryChange ? INDUSTRY_OPTIONS
      .filter((i) => i.value !== "all" && match(i.label))
      .slice(0, 3)
      .map((i): Suggestion => ({
        kind: "industry", label: i.label, sublabel: "Industry",
        apply: () => { onIndustryChange(i.value as IndustryCategory); onSearchChange(""); },
      })) : []),
  ];

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const showDropdown = open && suggestions.length > 0;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + suggestions.length) % suggestions.length); }
    else if (e.key === "Enter") { e.preventDefault(); const sel = suggestions[active]; if (sel) pick(sel.apply); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  const kindIcon = (kind: Suggestion["kind"]) =>
    kind === "category" ? Layers : kind === "type" ? Tag : kind === "role" ? Briefcase : Building2;

  return (
    <div ref={ref} className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
      <input
        type="text"
        placeholder="Search tests, categories, roles..."
        value={search}
        onChange={(e) => { onSearchChange(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-line bg-surface text-sm text-default placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
      />

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl border border-line shadow-xl z-20 overflow-hidden py-1"
        >
          {suggestions.map((s, i) => {
            const Icon = kindIcon(s.kind);
            return (
              <button
                key={`${s.kind}-${s.label}`}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(s.apply)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  i === active ? "bg-[#eef2ff]" : "hover:bg-surface-subtle"
                )}
              >
                <Icon size={15} className="text-[#4f46e5] flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-default truncate">{s.label}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-subtle flex-shrink-0">{s.sublabel}</span>
                {i === active && <CornerDownLeft size={13} className="text-subtle flex-shrink-0" />}
              </button>
            );
          })}
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
              : "bg-surface-muted text-muted hover:bg-line hover:text-body"
          )}
        >
          {opt.label}
        </button>
      ))}
    </>
  );
}
