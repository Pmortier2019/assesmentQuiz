"use client";

import { useState, useEffect } from "react";
import { Sparkles, PackageOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TestCard } from "@/components/cards/TestCard";
import { FilterBar } from "@/components/test/FilterBar";
import { getTests } from "@/lib/api";
import type { Test, AssessmentType, Difficulty } from "@/lib/types";

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<AssessmentType | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "all">("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getTests({
        search: search || undefined,
        type: selectedType === "all" ? undefined : selectedType,
        difficulty: selectedDifficulty === "all" ? undefined : selectedDifficulty,
        tier: selectedTier === "all" ? undefined : selectedTier,
      });
      setTests(result.data);
      setLoading(false);
    };
    load();
  }, [search, selectedType, selectedDifficulty, selectedTier]);

  const freeTests  = tests.filter((t) => t.isFree);
  const proTests   = tests.filter((t) => !t.isFree);
  const aiTests    = tests.filter((t) => t.isGeneratedByAI);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          {/* Header */}
          <div className="animate-fade-up">
            <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">Test Library</h1>
            <p className="text-[#64748b] text-sm">
              {tests.length} tests available · {aiTests.length} AI-generated
            </p>
          </div>

          {/* Filters */}
          <div className="animate-fade-up delay-100">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
            />
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-60 rounded-2xl" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
                <PackageOpen size={28} className="text-[#94a3b8]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#0D1B2E] text-lg mb-1">No tests found</h3>
                <p className="text-sm text-[#64748b] max-w-xs">
                  Try adjusting your filters or search term. More AI-generated tests are coming soon.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedType("all");
                  setSelectedDifficulty("all");
                  setSelectedTier("all");
                }}
                className="text-sm text-[#4f46e5] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Free tests */}
              {freeTests.length > 0 && (
                <section className="animate-fade-up delay-200">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Free Tests</h2>
                    <span className="text-xs font-semibold text-[#10b981] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#bbf7d0]">
                      {freeTests.length} available
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {freeTests.map((test) => (
                      <TestCard key={test.id} test={test} isLocked={false} />
                    ))}
                  </div>
                </section>
              )}

              {/* Pro tests */}
              {proTests.length > 0 && (
                <section className="animate-fade-up delay-300">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Pro Tests</h2>
                    <span className="text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full border border-[#c7d2fe]">
                      Pro
                    </span>
                    {proTests.some((t) => t.isGeneratedByAI) && (
                      <span className="text-xs font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 rounded-full border border-[#ddd6fe] flex items-center gap-1">
                        <Sparkles size={10} /> AI-generated
                      </span>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {proTests.map((test) => (
                      <TestCard key={test.id} test={test} isLocked />
                    ))}
                  </div>
                </section>
              )}

              {/* AI coming soon */}
              <div className="rounded-2xl border border-dashed border-[#c7d2fe] bg-[#f8faff] p-8 text-center animate-fade-up delay-400">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4f46e5]/15 to-[#7c3aed]/15 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={22} className="text-[#4f46e5]" />
                </div>
                <h3 className="font-display font-semibold text-[#0D1B2E] mb-2">
                  More AI-generated tests coming soon
                </h3>
                <p className="text-sm text-[#64748b] max-w-xs mx-auto">
                  New practice tests are generated weekly, modelled on real assessments from top employers.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
