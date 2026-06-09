"use client";

import {
  Flame, TrendingUp, BookOpen, Trophy, Sparkles, Lock, ChevronRight,
  Target, BarChart3, Clock, Star, Users, Zap, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { DailyChallengeCard } from "@/components/cards/DailyChallengeCard";
import { PreparationPathCard } from "@/components/cards/PreparationPathCard";
import { CareerSetupBanner } from "@/components/cards/CareerSetupBanner";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PaywallCard } from "@/components/ui/PaywallCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { XPLevelBar } from "@/components/ui/XPLevelBar";
import { AchievementBadges } from "@/components/ui/AchievementBadges";
import { PageError } from "@/components/ui/ErrorState";
import { LeaderboardCard } from "@/components/cards/LeaderboardCard";
import { WeakSpotCard } from "@/components/cards/WeakSpotCard";
import {
  useCurrentUser, useTests, useUserResults,
  usePreparationPath, useRecommendedTests,
} from "@/lib/queries";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AssessmentTypeIcon } from "@/components/ui/AssessmentTypeIcon";
import {
  ASSESSMENT_TYPE_LABELS, getScoreColor, formatTime,
} from "@/lib/utils";
import type { Test } from "@/lib/types";
import { FREE_TEST_LIMIT } from "@/lib/constants";
import { testsCompletedThisWeek, scoreImprovement } from "@/lib/dashboardStats";
import { useT, type TranslationKey } from "@/lib/i18n";

const FREE_TESTS_LIMIT = FREE_TEST_LIMIT;

const DAILY_EXERCISES: { labelKey: TranslationKey; duration: string; type: string }[] = [
  { labelKey: "dash_ex_logic",     duration: "5 min",  type: "logical_reasoning" },
  { labelKey: "dash_ex_numerical", duration: "8 min",  type: "numerical_reasoning" },
  { labelKey: "dash_ex_verbal",    duration: "6 min",  type: "verbal_reasoning" },
];

function RecommendedTestCard({ test, badge }: { test: Test; badge?: string }) {
  const { t } = useT();
  return (
    <Link
      href={`/tests/${test.id}`}
      className="card card-interactive p-4 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0">
          <AssessmentTypeIcon type={test.type} size={18} />
        </div>
        <div className="flex flex-col items-end gap-1">
          {badge && (
            <span className="text-[10px] font-bold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {badge}
            </span>
          )}
          {test.isFree ? (
            <span className="text-[10px] font-semibold text-[#10b981] bg-[#f0fdf4] px-2 py-0.5 rounded-full">{t("free")}</span>
          ) : (
            <Lock size={11} className="text-subtle mt-0.5" />
          )}
        </div>
      </div>
      <div>
        <p className="font-semibold text-default text-sm leading-snug group-hover:text-[#4f46e5] transition-colors">
          {test.title}
        </p>
        <p className="text-xs text-subtle mt-1">
          {test.estimatedTime} {t("minutes")} · {test.questionCount ?? test.questions.length} {t("questions")}
        </p>
      </div>
      {test.skillsMeasured && test.skillsMeasured.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {test.skillsMeasured.slice(0, 2).map((skill) => (
            <span key={skill} className="text-[10px] font-medium text-body bg-surface-muted px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

// Skeleton mirroring the real dashboard layout — feels faster than a blank
// full-page loader and avoids a jarring swap once data lands.
function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8" aria-busy="true">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="skeleton h-8 w-64 rounded-lg" />
            <div className="skeleton h-4 w-40 rounded" />
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
          {/* XP / achievements / weak spots */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
          {/* Preparation path + daily challenge */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="skeleton h-48 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
          </div>
          {/* Recommended */}
          <div className="flex flex-col gap-4">
            <div className="skeleton h-5 w-48 rounded" />
            <div className="grid sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useT();
  const { data: user, isError: userError, refetch: refetchUser } = useCurrentUser();
  const { data: testsPage, isPending: testsPending, isError: testsError, refetch: refetchTests } = useTests();
  const { data: results = [], isPending: resultsPending, isError: resultsError, refetch: refetchResults } = useUserResults();

  // preparationPath/recommended only matter once the user has career targets.
  // Gating both on the same flag lets them fire in parallel the moment the
  // user resolves — no serial user → path → recommended waterfall.
  const hasCareerTargets = !!(user?.targetRole || user?.targetIndustry);
  const { data: preparationPath = null } = usePreparationPath(hasCareerTargets);
  const { data: recommendedTests = [] } = useRecommendedTests(hasCareerTargets);

  // Any of the three core fetches failing leaves the dashboard unusable, so we
  // surface one clear error + retry rather than a half-empty page.
  if (userError || testsError || resultsError) {
    return (
      <PageError
        onRetry={() => {
          refetchUser();
          refetchTests();
          refetchResults();
        }}
      />
    );
  }

  if (!user || testsPending || resultsPending) {
    return <DashboardSkeleton />;
  }

  const tests = testsPage?.data ?? [];
  const dailyChallenge = tests[0];
  const isAtLimit = user.freeTestsUsed >= FREE_TESTS_LIMIT;

  // Popular for role — tests whose targetRoles include user's role
  const popularForRole = user.targetRole
    ? tests.filter((t) => t.targetRoles?.some((r) =>
        r.toLowerCase().includes((user.targetRole ?? "").toLowerCase()) ||
        (user.targetRole ?? "").toLowerCase().includes(r.toLowerCase())
      )).slice(0, 3)
    : [];

  // Company-associated tests
  const companyTests = user.targetCompany
    ? tests.filter((t) => t.recommendedForCompanies?.some((c) =>
        c.toLowerCase().includes((user.targetCompany ?? "").toLowerCase())
      )).slice(0, 3)
    : [];

  const fallbackRecommended = tests.filter((t) => t.isFree).slice(0, 3);
  const displayRecommended = recommendedTests.length > 0
    ? recommendedTests.slice(0, 3)
    : fallbackRecommended;

  const lockedTests = tests.filter((t) => !t.isFree).slice(0, 3);

  // Adaptive difficulty: if user scored >80% at least 3 times on beginner tests,
  // suggest intermediate tests of the same type they mastered
  const beginnerMastery = new Map<string, number>();
  for (const r of results) {
    const t = tests.find((x) => x.id === r.testId);
    if (t && t.difficulty === "beginner" && r.score > 80) {
      beginnerMastery.set(t.type, (beginnerMastery.get(t.type) ?? 0) + 1);
    }
  }
  const adaptiveSuggestions = tests.filter(
    (t) =>
      t.difficulty === "intermediate" &&
      (beginnerMastery.get(t.type) ?? 0) >= 3
  ).slice(0, 3);

  // Compute skill scores from real results data
  const skillScoreMap = new Map<string, { total: number; count: number }>();
  for (const result of results) {
    const test = tests.find((t) => t.id === result.testId);
    if (!test) continue;
    const existing = skillScoreMap.get(test.type) ?? { total: 0, count: 0 };
    skillScoreMap.set(test.type, { total: existing.total + result.score, count: existing.count + 1 });
  }
  const skillAreas = Array.from(skillScoreMap.entries())
    .map(([type, { total, count }]) => ({
      type,
      name: ASSESSMENT_TYPE_LABELS[type as keyof typeof ASSESSMENT_TYPE_LABELS] ?? type,
      score: Math.round(total / count),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Real trend figures (or null/0 → badge hidden) instead of hardcoded numbers
  const testsThisWeek = testsCompletedThisWeek(results);
  const improvement = scoreImprovement(results);

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <Sidebar streak={user.streak} userName={user.name} isAdmin={user.isAdmin} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

          {/* Welcome */}
          <DashboardHeader
            userName={user.name}
            streak={user.streak}
            targetRole={user.targetRole}
            targetIndustry={user.targetIndustry}
            targetCompany={user.targetCompany}
            freeTestsUsed={user.freeTestsUsed}
            freeTestsLimit={FREE_TESTS_LIMIT}
            hasCareerTargets={hasCareerTargets}
            isAtLimit={isAtLimit}
          />

          {/* Paywall banner */}
          {isAtLimit && (
            <div className="animate-fade-up delay-100">
              <PaywallCard compact />
            </div>
          )}

          {/* Career setup CTA — shown when no targets */}
          {!hasCareerTargets && (
            <div className="animate-fade-up delay-100">
              <CareerSetupBanner />
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-200">
            <DashboardCard
              title={t("dash_tests_completed")}
              value={results.length}
              icon={BookOpen}
              iconColor="text-[#4f46e5]"
              iconBg="bg-[#eef2ff]"
              trend={testsThisWeek > 0 ? { value: testsThisWeek, label: t("dash_this_week_count"), unit: "" } : undefined}
            />
            {/* Avg score — score ring */}
            <div className="card p-5 flex flex-col gap-3">
              <p className="text-sm font-medium text-muted">{t("dash_avg_score")}</p>
              <div className="flex items-center gap-4">
                {results.length > 0 ? (
                  <ScoreRing
                    score={Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)}
                    size={72}
                    strokeWidth={7}
                    color="#10b981"
                    trackColor="#f0fdf4"
                  />
                ) : (
                  <p className="font-display font-bold text-2xl text-default">—</p>
                )}
                {improvement !== null && (
                  <div>
                    <p className={`text-xs font-semibold ${improvement >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
                      {improvement >= 0 ? "+" : ""}{improvement}%
                    </p>
                    <p className="text-xs text-subtle">{t("dash_improvement")}</p>
                  </div>
                )}
              </div>
            </div>
            <DashboardCard
              title={t("dash_day_streak")}
              value={user.streak}
              icon={Flame}
              iconColor="text-amber-500"
              iconBg="bg-amber-50"
              subtitle={t("dash_keep_it_up")}
            />
            <DashboardCard
              title={t("dash_free_tests")}
              value={`${user.freeTestsUsed}/${FREE_TESTS_LIMIT}`}
              icon={Trophy}
              iconColor="text-[#f59e0b]"
              iconBg="bg-amber-50"
            >
              <ProgressBar value={user.freeTestsUsed} max={FREE_TESTS_LIMIT} size="sm" variant="gradient" />
            </DashboardCard>
          </div>

          {/* XP level bar + achievements + weak spots */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up delay-250">
            <XPLevelBar xp={user.xp ?? 0} />
            <AchievementBadges results={results} streak={user.streak} />
            <WeakSpotCard results={results} tests={tests} />
          </div>

          {/* Preparation path + daily challenge */}
          {hasCareerTargets && preparationPath ? (
            <div className="grid lg:grid-cols-2 gap-6 animate-fade-up delay-300">
              <PreparationPathCard path={preparationPath} />
              <div>
                <h2 className="font-display font-semibold text-lg text-default mb-4">{t("dash_daily_challenge")}</h2>
                <DailyChallengeCard test={dailyChallenge} />
              </div>
            </div>
          ) : (
            <div className="animate-fade-up delay-300">
              <h2 className="font-display font-semibold text-lg text-default mb-4">{t("dash_daily_challenge")}</h2>
              <DailyChallengeCard test={dailyChallenge} />
            </div>
          )}

          {/* Suggested daily exercises */}
          <div className="animate-fade-up delay-350">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-default">{t("dash_daily_exercises")}</h2>
              <span className="text-xs text-subtle">{t("dash_short_focused")}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {DAILY_EXERCISES.map((ex) => (
                <Link
                  key={ex.labelKey}
                  href={`/tests?type=${ex.type}`}
                  className="card card-interactive p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center flex-shrink-0">
                    <AssessmentTypeIcon type={ex.type} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-default leading-snug">{t(ex.labelKey)}</p>
                    <p className="text-xs text-subtle flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {ex.duration}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-subtle flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended for you */}
          <div className="animate-fade-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold text-lg text-default">
                  {hasCareerTargets && user.targetRole
                    ? t("dash_recommended_for", { role: user.targetRole })
                    : t("dash_recommended")}
                </h2>
                {hasCareerTargets && (
                  <p className="text-xs text-subtle mt-0.5">{t("dash_based_on_role")}</p>
                )}
              </div>
              <Link href="/tests?sort=recommended" className="text-xs text-[#4f46e5] font-semibold hover:underline flex items-center gap-1">
                {t("dash_browse_all")} <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {displayRecommended.map((test) => (
                <RecommendedTestCard
                  key={test.id}
                  test={test}
                  badge={test.isRecommended ? t("dash_badge_best_match") : undefined}
                />
              ))}
            </div>
          </div>

          {/* Adaptive difficulty upgrade suggestion */}
          {adaptiveSuggestions.length > 0 && (
            <div className="animate-fade-up delay-400">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#10b981]" />
                <div>
                  <h2 className="font-display font-semibold text-lg text-default">{t("dash_ready_level_up")}</h2>
                  <p className="text-xs text-subtle mt-0.5">{t("dash_level_up_sub")}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {adaptiveSuggestions.map((test) => (
                  <RecommendedTestCard key={test.id} test={test} badge={t("dash_badge_leveled_up")} />
                ))}
              </div>
            </div>
          )}

          {/* Popular for your role — only if role is set */}
          {popularForRole.length > 0 && (
            <div className="animate-fade-up delay-450">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  <h2 className="font-display font-semibold text-lg text-default">
                    {t("dash_popular_for")} {user.targetRole}
                  </h2>
                </div>
                <Link href={`/tests?role=${encodeURIComponent(user.targetRole ?? "")}`}
                  className="text-xs text-[#4f46e5] font-semibold hover:underline flex items-center gap-1">
                  {t("dash_see_all")} <ChevronRight size={12} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {popularForRole.map((test) => (
                  <RecommendedTestCard key={test.id} test={test} badge={t("dash_badge_popular")} />
                ))}
              </div>
            </div>
          )}

          {/* Company-specific section */}
          {companyTests.length > 0 && (
            <div className="animate-fade-up delay-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#7c3aed]" />
                  <div>
                    <h2 className="font-display font-semibold text-lg text-default">
                      {t("dash_frequently_used_at", { company: user.targetCompany ?? "" })}
                    </h2>
                    <p className="text-xs text-subtle">{t("dash_candidates_practise")}</p>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {companyTests.map((test) => (
                  <RecommendedTestCard key={test.id} test={test} badge={user.targetCompany} />
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard + skill overview + recent results */}
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-up delay-500">
            <div className="lg:col-span-1">
              <LeaderboardCard />
            </div>
          </div>

          {/* Two-column: skill overview + recent results */}
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-up delay-500">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-base text-default">{t("dash_skill_overview")}</h2>
                <BarChart3 size={16} className="text-subtle" />
              </div>
              {skillAreas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center">
                    <BarChart3 size={18} className="text-subtle" />
                  </div>
                  <p className="text-sm text-muted">{t("dash_complete_tests")}</p>
                  <Link href="/tests" className="text-sm font-semibold text-[#4f46e5] hover:underline">{t("dash_browse_tests")}</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {skillAreas.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <AssessmentTypeIcon type={skill.type} size={15} className="text-subtle" />
                          <span className="text-sm font-medium text-body">{skill.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                      </div>
                      <ProgressBar value={skill.score} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-base text-default">{t("dash_recent_results")}</h2>
                <Link href="/results" className="text-xs text-[#4f46e5] font-semibold hover:underline">{t("dash_view_all")}</Link>
              </div>
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center">
                    <BookOpen size={18} className="text-subtle" />
                  </div>
                  <p className="text-sm text-muted">{t("dash_no_results")}</p>
                  <Link href="/tests" className="text-sm font-semibold text-[#4f46e5] hover:underline">
                    {t("dash_browse_tests")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {results.map((result) => {
                    const test = tests.find((t) => t.id === result.testId);
                    return (
                      <div key={result.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-subtle transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0">
                          <AssessmentTypeIcon type={test?.type} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-default truncate">{test?.title ?? "Test"}</p>
                          <p className="text-xs text-subtle flex items-center gap-1">
                            <Clock size={10} />
                            {formatTime(result.timeTaken)}
                          </p>
                        </div>
                        <span className={`text-sm font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pro locked tests */}
          <div className="animate-fade-up delay-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-semibold text-lg text-default">{t("dash_pro_tests")}</h2>
                <Lock size={14} className="text-subtle" />
              </div>
              <Link href="/pricing" className="text-xs text-[#4f46e5] font-semibold hover:underline">{t("nav_upgrade")}</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {lockedTests.map((test) => (
                <div key={test.id} className="card p-4 flex flex-col gap-3 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0">
                      <AssessmentTypeIcon type={test.type} size={18} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {test.isGeneratedByAI && (
                        <span className="text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles size={9} /> {t("dash_badge_new")}
                        </span>
                      )}
                      <Lock size={12} className="text-subtle" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-default text-sm leading-snug">{test.title}</p>
                    <p className="text-xs text-subtle mt-1">{test.estimatedTime} {t("minutes")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI upsell */}
          <div className="animate-fade-up delay-700 rounded-2xl border border-[#c7d2fe] bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display font-semibold text-default">{t("dash_personal_coaching")}</h3>
                  <span className="text-[10px] font-bold text-[#7c3aed] bg-[#f5f3ff] border border-[#ddd6fe] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {t("dash_coming_soon")}
                  </span>
                </div>
                <p className="text-sm text-body leading-relaxed mb-4">
                  {t("dash_coach_desc")}
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white text-sm font-semibold hover:bg-[#4338ca] transition-colors"
                  >
                    {t("dash_get_early_access")}
                  </Link>
                  <span className="text-xs text-subtle">{t("dash_pro_plan")}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
