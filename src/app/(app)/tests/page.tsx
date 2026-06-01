"use client";

import { useState, useEffect } from "react";
import { Sparkles, PackageOpen, Star, Wand2, Lock, CheckCircle2, Crown } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TestCard } from "@/components/cards/TestCard";
import { FilterBar } from "@/components/test/FilterBar";
import type { SortOption } from "@/components/test/FilterBar";
import { getTests, generateTestOfType, getGenerationStatus, getCurrentUser, ALL_GENERATE_TYPES, ALL_DIFFICULTIES } from "@/lib/api";
import { isAdmin, isLoggedIn } from "@/lib/auth";
import { useClientValue } from "@/lib/useClientValue";
import { FREE_TEST_LIMIT } from "@/lib/constants";
import type { Test, AssessmentType, Difficulty, RoleCategory, IndustryCategory } from "@/lib/types";

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState<{ current: number; total: number; label: string } | null>(null);
  const [generateError, setGenerateError] = useState("");
  const [generateAsFree, setGenerateAsFree] = useState(true);
  const adminMode = useClientValue(() => isAdmin(), false);
  const [freeTestsUsed, setFreeTestsUsed] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<AssessmentType | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "all">("all");
  const [selectedRole, setSelectedRole] = useState<RoleCategory | "all">("all");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    if (isLoggedIn()) {
      getCurrentUser().then((u) => {
        setFreeTestsUsed(u.freeTestsUsed);
        setIsPro(u.subscription === "pro");
      }).catch(() => {});
    }
  }, []);

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
    load().catch(() => setLoading(false));
  }, [search, selectedType, selectedDifficulty, selectedTier]);

  // Client-side role/industry/sort filtering
  const filtered = tests
    .filter((t) => {
      if (selectedRole !== "all") {
        const matches = t.targetRoles?.some((r) =>
          r.toLowerCase().includes(selectedRole.toLowerCase()) ||
          selectedRole.toLowerCase().includes(r.toLowerCase())
        );
        if (!matches) return false;
      }
      if (selectedIndustry !== "all") {
        const matches = t.targetIndustries?.some((ind) =>
          ind.toLowerCase().includes(selectedIndustry.toLowerCase())
        );
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "best_match") {
        const aRec = a.isRecommended ? 1 : 0;
        const bRec = b.isRecommended ? 1 : 0;
        if (aRec !== bRec) return bRec - aRec;
        // Secondary: role match score
        const aRole = selectedRole !== "all"
          ? (a.targetRoles?.filter((r) => r.toLowerCase().includes(selectedRole.toLowerCase())).length ?? 0) : 0;
        const bRole = selectedRole !== "all"
          ? (b.targetRoles?.filter((r) => r.toLowerCase().includes(selectedRole.toLowerCase())).length ?? 0) : 0;
        return bRole - aRole;
      }
      return 0;
    });

  const freeTests = filtered.filter((t) => t.isFree);
  const proTests  = filtered.filter((t) => !t.isFree);
  const aiTests   = filtered.filter((t) => t.isGeneratedByAI);
  const recommendedTests = filtered.filter((t) => t.isRecommended);

  const hasCareerFilters = selectedRole !== "all" || selectedIndustry !== "all" || sortBy === "best_match";

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError("");
    setGenerateProgress(null);

    // Check which type+difficulty combos already exist
    let existing: Record<string, string[]> = {};
    try { existing = await getGenerationStatus(); } catch { /* skip check on error */ }

    // Build full list of 33 combinations, skip existing ones
    const todo: { type: string; label: string; difficulty: string }[] = [];
    for (const { type, label } of ALL_GENERATE_TYPES) {
      for (const diff of ALL_DIFFICULTIES) {
        const alreadyExists = existing[type]?.includes(diff);
        if (!alreadyExists) todo.push({ type, label, difficulty: diff });
      }
    }

    if (todo.length === 0) {
      setGenerating(false);
      setGenerateError("");
      const result = await getTests({});
      setTests(result.data);
      return;
    }

    let failed = 0;
    for (let i = 0; i < todo.length; i++) {
      const { type, label, difficulty } = todo[i];
      const diffLabel = difficulty === "EASY" ? "Beginner" : difficulty === "MEDIUM" ? "Intermediate" : "Advanced";
      setGenerateProgress({ current: i + 1, total: todo.length, label: `${label} — ${diffLabel}` });
      try {
        await generateTestOfType(type, difficulty, generateAsFree);
      } catch {
        failed++;
      }
    }

    setGenerating(false);
    setGenerateProgress(null);

    if (failed === todo.length) {
      setGenerateError("Generation failed — try again in a moment.");
    } else {
      if (failed > 0) setGenerateError(`${failed} combinatie(s) mislukt — de rest is gegenereerd.`);
      const result = await getTests({});
      setTests(result.data);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          {/* Header */}
          <div className="animate-fade-up flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">📚 Test Library</h1>
              <p className="text-[#64748b] text-sm">
                <span className="font-semibold text-[#10b981]">{freeTests.length} free</span>
                {" · "}
                <span className="font-semibold text-[#7c3aed]">{proTests.length} Pro</span>
                {aiTests.length > 0 && ` · ${aiTests.length} nieuw`}
                {recommendedTests.length > 0 && ` · ${recommendedTests.length} recommended for you`}
              </p>
            </div>

            {/* Admin-only: generate button */}
            {adminMode && (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748b] font-medium">Generate as:</span>
                  <div className="flex rounded-lg border border-[#e2e8f0] overflow-hidden text-xs font-semibold">
                    <button
                      onClick={() => setGenerateAsFree(true)}
                      className={`px-3 py-1.5 transition-colors ${generateAsFree ? "bg-emerald-500 text-white" : "bg-white text-[#64748b] hover:bg-[#f8fafc]"}`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => setGenerateAsFree(false)}
                      className={`px-3 py-1.5 transition-colors ${!generateAsFree ? "bg-[#4f46e5] text-white" : "bg-white text-[#64748b] hover:bg-[#f8fafc]"}`}
                    >
                      Pro
                    </button>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm"
                  >
                    <Wand2 size={15} />
                    {generating ? "Generating…" : "Generate full library"}
                  </button>
                </div>
                {generating && generateProgress && (
                  <div className="flex flex-col items-end gap-1 min-w-[220px]">
                    <p className="text-xs text-[#64748b]">
                      {generateProgress.current}/{generateProgress.total} — {generateProgress.label}
                    </p>
                    <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-full transition-all duration-300"
                        style={{ width: `${(generateProgress.current / generateProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {generateError && (
                  <p className="text-xs text-[#e11d48]">{generateError}</p>
                )}
              </div>
            )}
          </div>

          {/* Paywall banner — shown when free user is at or near limit */}
          {!isPro && freeTestsUsed !== null && freeTestsUsed >= FREE_TEST_LIMIT - 2 && (
            <div className={`animate-fade-up rounded-2xl border px-5 py-4 flex items-center justify-between gap-4 flex-wrap ${
              freeTestsUsed >= FREE_TEST_LIMIT
                ? "border-rose-200 bg-rose-50"
                : "border-amber-200 bg-amber-50"
            }`}>
              <div className="flex items-center gap-3">
                <Lock size={16} className={freeTestsUsed >= FREE_TEST_LIMIT ? "text-rose-500" : "text-amber-500"} />
                <div>
                  <p className={`text-sm font-semibold ${freeTestsUsed >= FREE_TEST_LIMIT ? "text-rose-700" : "text-amber-700"}`}>
                    {freeTestsUsed >= FREE_TEST_LIMIT
                      ? "You've used all 5 free tests"
                      : `${FREE_TEST_LIMIT - freeTestsUsed} free test${FREE_TEST_LIMIT - freeTestsUsed !== 1 ? "s" : ""} remaining`}
                  </p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {freeTestsUsed >= FREE_TEST_LIMIT
                      ? "Upgrade to Pro for unlimited access to all tests — €4/month."
                      : "Upgrade to Pro for unlimited access and fresh weekly tests."}
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Upgrade to Pro
              </Link>
            </div>
          )}

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
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              selectedIndustry={selectedIndustry}
              onIndustryChange={setSelectedIndustry}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showRoleFilter
            />
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-60 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
                <PackageOpen size={28} className="text-[#94a3b8]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#0D1B2E] text-lg mb-1">No tests found</h3>
                <p className="text-sm text-[#64748b] max-w-xs">
                  Try adjusting your filters or search term. More fresh tests are coming soon.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedType("all");
                  setSelectedDifficulty("all");
                  setSelectedTier("all");
                  setSelectedRole("all");
                  setSelectedIndustry("all");
                  setSortBy("default");
                }}
                className="text-sm text-[#4f46e5] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">

              {/* Best matches — shown when best_match sort is active */}
              {sortBy === "best_match" && recommendedTests.length > 0 && (
                <section className="animate-fade-up">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={16} className="text-[#f59e0b]" />
                    <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Best Matches</h2>
                    <span className="text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full border border-[#c7d2fe]">
                      {recommendedTests.length} for you
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recommendedTests.map((test) => (
                      <TestCard key={test.id} test={test} isLocked={!test.isFree} showRecommendedBadge />
                    ))}
                  </div>
                </section>
              )}

              {/* Career filter active — show role/industry info banner */}
              {hasCareerFilters && selectedRole !== "all" && (
                <div className="rounded-xl border border-[#c7d2fe] bg-[#eef2ff] px-4 py-3 flex items-center gap-3 text-sm text-[#4f46e5] font-medium">
                  <Star size={14} />
                  Showing tests aligned with <strong>{selectedRole}</strong>
                  {selectedIndustry !== "all" && <> in <strong>{selectedIndustry}</strong></>}
                </div>
              )}

              {/* Free tests */}
              {freeTests.length > 0 && (
                <section className={sortBy === "best_match" && recommendedTests.length > 0 ? "" : "animate-fade-up delay-200"}>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={17} className="text-[#10b981]" />
                    <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Free Tests</h2>
                    <span className="text-xs font-semibold text-[#10b981] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#bbf7d0]">
                      {freeTests.length} available — no account needed
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {freeTests.map((test) => (
                      <TestCard
                        key={test.id}
                        test={test}
                        isLocked={false}
                        showRecommendedBadge={test.isRecommended}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Pro tests */}
              {proTests.length > 0 && (
                <section className="animate-fade-up delay-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={17} className="text-[#7c3aed]" />
                    <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Pro Tests</h2>
                    <span className="text-xs font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2 py-0.5 rounded-full border border-[#ddd6fe]">
                      {proTests.length} tests · €4/mo
                    </span>
                    {proTests.some((t) => t.isGeneratedByAI) && (
                      <span className="text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full border border-[#c7d2fe] flex items-center gap-1">
                        <Sparkles size={10} /> Vers nieuw
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94a3b8] mb-4 ml-[1.625rem]">Upgrade to Pro to unlock all tests below</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {proTests.map((test) => (
                      <TestCard
                        key={test.id}
                        test={test}
                        isLocked
                        showRecommendedBadge={test.isRecommended}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Coming soon */}
              <div className="rounded-2xl border border-dashed border-[#c7d2fe] bg-[#f8faff] p-8 text-center animate-fade-up delay-400">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4f46e5]/15 to-[#7c3aed]/15 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={22} className="text-[#4f46e5]" />
                </div>
                <h3 className="font-display font-semibold text-[#0D1B2E] mb-2">
                  More fresh tests coming soon
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
