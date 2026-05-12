"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssessmentType, Difficulty } from "@/lib/types";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedType: AssessmentType | "all";
  onTypeChange: (v: AssessmentType | "all") => void;
  selectedDifficulty: Difficulty | "all";
  onDifficultyChange: (v: Difficulty | "all") => void;
  selectedTier: "free" | "pro" | "all";
  onTierChange: (v: "free" | "pro" | "all") => void;
}

const TYPE_OPTIONS: { value: AssessmentType | "all"; label: string }[] = [
  { value: "all",                  label: "All types" },
  { value: "numerical_reasoning",  label: "Numerical" },
  { value: "logical_reasoning",    label: "Logical" },
  { value: "verbal_reasoning",     label: "Verbal" },
  { value: "situational_judgement", label: "Situational" },
  { value: "personality",          label: "Personality" },
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
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedTier,
  onTierChange,
}: FilterBarProps) {
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-medium">
          <SlidersHorizontal size={13} />
          Filter:
        </div>

        <FilterChips
          options={TYPE_OPTIONS}
          selected={selectedType}
          onChange={onTypeChange as (v: string) => void}
        />

        <div className="w-px h-4 bg-[#e2e8f0]" />

        <FilterChips
          options={DIFFICULTY_OPTIONS}
          selected={selectedDifficulty}
          onChange={onDifficultyChange as (v: string) => void}
        />

        <div className="w-px h-4 bg-[#e2e8f0]" />

        <FilterChips
          options={TIER_OPTIONS}
          selected={selectedTier}
          onChange={onTierChange as (v: string) => void}
        />
      </div>
    </div>
  );
}

function FilterChips({
  options,
  selected,
  onChange,
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
