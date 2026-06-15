"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles, PackageOpen, Wand2, Lock, Library } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TestCard } from "@/components/cards/TestCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { FilterBar } from "@/components/test/FilterBar";
import { generateTestOfType, getGenerationStatus, ALL_GENERATE_TYPES, ALL_DIFFICULTIES } from "@/lib/api";
import { useTestsInfinite, useCurrentUser, queryKeys } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import { useClientValue } from "@/lib/useClientValue";
import { FREE_TEST_LIMIT } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { AssessmentType, Difficulty, RoleCategory, IndustryCategory } from "@/lib/types";

function TestsContent() {
  const { t, plural } = useT();
  const queryClient = useQueryClient();
  // Filters can be deep-linked via the URL (e.g. the command palette opens
  // /tests?search=cognitive or /tests?type=numerical_reasoning).
  const searchParams = useSearchParams();
  const [generating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState<{ current: number; total: number; label: string } | null>(null);
  const [generateError, setGenerateError] = useState("");
  const [generateAsFree, setGenerateAsFree] = useState(true);
  const adminMode = useClientValue(() => isAdmin(), false);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [selectedType, setSelectedType] = useState<AssessmentType | "all">(
    () => (searchParams.get("type") as AssessmentType | null) ?? "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "all">("all");
  const [selectedRole, setSelectedRole] = useState<RoleCategory | "all">(
    () => (searchParams.get("role") as RoleCategory | null) ?? "all");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCategory | "all">(
    () => (searchParams.get("industry") as IndustryCategory | null) ?? "all");

  // AuthGuard guarantees we're logged in here; user data is shared with the
  // dashboard's cache, so this is free on second visit.
  const { data: user } = useCurrentUser();
  const freeTestsUsed = user?.freeTestsUsed ?? null;
  const isPro = user?.subscription === "pro";

  // Every filter is resolved server-side and forms the query key, so the
  // backend returns only the requested page. "Load more" appends the next page.
  const {
    data,
    isPending: loading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTestsInfinite({
    search: search || undefined,
    type: selectedType === "all" ? undefined : selectedType,
    difficulty: selectedDifficulty === "all" ? undefined : selectedDifficulty,
    tier: selectedTier === "all" ? undefined : selectedTier,
    role: selectedRole === "all" ? undefined : selectedRole,
    industry: selectedIndustry === "all" ? undefined : selectedIndustry,
  });

  const tests = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const clearFilters = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedDifficulty("all");
    setSelectedTier("all");
    setSelectedRole("all");
    setSelectedIndustry("all");
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError("");
    setGenerateProgress(null);

    // Check which type+difficulty combos already exist
    let existing: Record<string, string[]> = {};
    try { existing = await getGenerationStatus(); } catch { /* skip check on error */ }

    // Build full list of combinations, skip existing ones
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
      await queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
      return;
    }

    let failed = 0;
    for (let i = 0; i < todo.length; i++) {
      const { type, label, difficulty } = todo[i];
      const diffLabel = difficulty === "EASY" ? t("diff_beginner") : difficulty === "MEDIUM" ? t("diff_intermediate") : t("diff_advanced");
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
      setGenerateError(t("tests_gen_failed_all"));
    } else {
      if (failed > 0) {
        setGenerateError(plural(failed, { one: "tests_gen_failed_some_one", other: "tests_gen_failed_some_other" }));
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          {/* Header */}
          <div className="animate-fade-up flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="flex items-center gap-2 font-display font-bold text-2xl text-default mb-1">
                <Library size={22} className="text-[#2D7BFF]" />
                {t("tests_library_title")}
              </h1>
              <p className="text-muted text-sm">
                <span className="font-semibold text-default">{t("tests_n_total", { n: total })}</span>
              </p>
            </div>

            {/* Admin-only: generate button */}
            {adminMode && (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted font-medium">{t("tests_generate_as")}</span>
                  <div className="flex rounded-lg border border-line overflow-hidden text-xs font-semibold">
                    <button
                      onClick={() => setGenerateAsFree(true)}
                      className={`px-3 py-1.5 transition-colors ${generateAsFree ? "bg-emerald-500 text-white" : "bg-surface text-muted hover:bg-surface-subtle"}`}
                    >
                      {t("free")}
                    </button>
                    <button
                      onClick={() => setGenerateAsFree(false)}
                      className={`px-3 py-1.5 transition-colors ${!generateAsFree ? "bg-[#2D7BFF] text-white" : "bg-surface text-muted hover:bg-surface-subtle"}`}
                    >
                      {t("pro")}
                    </button>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm"
                  >
                    <Wand2 size={15} />
                    {generating ? t("tests_generating") : t("tests_generate_full")}
                  </button>
                </div>
                {generating && generateProgress && (
                  <div className="flex flex-col items-end gap-1 min-w-[220px]">
                    <p className="text-xs text-muted">
                      {generateProgress.current}/{generateProgress.total} — {generateProgress.label}
                    </p>
                    <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] rounded-full transition-all duration-300"
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
                      ? t("tests_paywall_all_title", { limit: FREE_TEST_LIMIT })
                      : plural(FREE_TEST_LIMIT - freeTestsUsed, { one: "tests_free_remaining_one", other: "tests_free_remaining_other" })}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {freeTestsUsed >= FREE_TEST_LIMIT
                      ? t("tests_paywall_all_desc")
                      : t("tests_paywall_near_desc")}
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t("upgrade_cta")}
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
              showRoleFilter
              showCategoryTiles
            />
          </div>

          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-60 rounded-2xl" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center">
                <PackageOpen size={28} className="text-subtle" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-default text-lg mb-1">{t("tests_none_found")}</h3>
                <p className="text-sm text-muted max-w-xs">
                  {t("tests_none_found_desc")}
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-[#2D7BFF] font-semibold hover:underline"
              >
                {t("tests_clear_filters")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up delay-200">
                {tests.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    isLocked={!test.isFree}
                    showRecommendedBadge={test.isRecommended}
                  />
                ))}
              </div>

              {/* Load more */}
              {hasNextPage && (
                <div className="flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-6 py-3 rounded-xl border border-line bg-surface text-sm font-semibold text-default hover:bg-surface-subtle disabled:opacity-60 transition-colors shadow-sm"
                  >
                    {isFetchingNextPage ? t("tests_loading_more") : t("tests_load_more")}
                  </button>
                </div>
              )}

              {/* Coming soon */}
              <div className="rounded-2xl border border-dashed border-[#BFD6FF] bg-[#f8faff] p-8 text-center animate-fade-up delay-400">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D7BFF]/15 to-[#1D63E6]/15 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={22} className="text-[#2D7BFF]" />
                </div>
                <h3 className="font-display font-semibold text-default mb-2">
                  {t("tests_coming_soon_title")}
                </h3>
                <p className="text-sm text-muted max-w-xs mx-auto">
                  {t("tests_coming_soon_desc")}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense>
      <TestsContent />
    </Suspense>
  );
}
