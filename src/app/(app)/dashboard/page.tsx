"use client";

import { useEffect, useState } from "react";
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
import {
  getCurrentUser, getTests, getUserResults,
  getPreparationPath, getRecommendedTests,
} from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_ICONS, getScoreColor, formatTime,
} from "@/lib/utils";
import type { Test, User, TestResult, PreparationPath } from "@/lib/types";

const FREE_TESTS_LIMIT = 5;

const DAILY_EXERCISES = [
  { label: "5-minute logic drill",      icon: "🧩", duration: "5 min",  type: "logical_reasoning" },
  { label: "Quick numerical warm-up",   icon: "📊", duration: "8 min",  type: "numerical_reasoning" },
  { label: "Verbal inference practice", icon: "📝", duration: "6 min",  type: "verbal_reasoning" },
];

function RecommendedTestCard({ test, badge }: { test: Test; badge?: string }) {
  return (
    <Link
      href={`/tests/${test.id}`}
      className="card card-interactive p-4 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl">{ASSESSMENT_TYPE_ICONS[test.type]}</span>
        <div className="flex flex-col items-end gap-1">
          {badge && (
            <span className="text-[10px] font-bold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {badge}
            </span>
          )}
          {test.isFree ? (
            <span className="text-[10px] font-semibold text-[#10b981] bg-[#f0fdf4] px-2 py-0.5 rounded-full">Free</span>
          ) : (
            <Lock size={11} className="text-[#94a3b8] mt-0.5" />
          )}
        </div>
      </div>
      <div>
        <p className="font-semibold text-[#0D1B2E] text-sm leading-snug group-hover:text-[#4f46e5] transition-colors">
          {test.title}
        </p>
        <p className="text-xs text-[#94a3b8] mt-1">
          {test.estimatedTime} min · {test.questionCount ?? test.questions.length} questions
        </p>
      </div>
      {test.skillsMeasured && test.skillsMeasured.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {test.skillsMeasured.slice(0, 2).map((skill) => (
            <span key={skill} className="text-[10px] font-medium text-[#475569] bg-[#f1f5f9] px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [preparationPath, setPreparationPath] = useState<PreparationPath | null>(null);
  const [recommendedTests, setRecommendedTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [u, testsPage, res] = await Promise.all([
          getCurrentUser(),
          getTests(),
          getUserResults(),
        ]);
        setUser(u);
        setTests(testsPage.data);
        setResults(res);
        if (u.targetRole || u.targetIndustry) {
          const [path, recs] = await Promise.all([
            getPreparationPath().catch(() => null),
            getRecommendedTests().catch(() => [] as Test[]),
          ]);
          setPreparationPath(path);
          setRecommendedTests(recs);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#64748b]">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const dailyChallenge = tests[0];
  const isAtLimit = user.freeTestsUsed >= FREE_TESTS_LIMIT;
  const hasCareerTargets = !!(user.targetRole || user.targetIndustry);

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
      name: ASSESSMENT_TYPE_LABELS[type as keyof typeof ASSESSMENT_TYPE_LABELS] ?? type,
      icon: ASSESSMENT_TYPE_ICONS[type as keyof typeof ASSESSMENT_TYPE_ICONS] ?? "📋",
      score: Math.round(total / count),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar streak={user.streak} userName={user.name} />

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
              title="Tests completed"
              value={results.length}
              icon={BookOpen}
              iconColor="text-[#4f46e5]"
              iconBg="bg-[#eef2ff]"
              trend={{ value: 33, label: "this week" }}
            />
            <DashboardCard
              title="Avg. score"
              value={results.length > 0
                ? `${Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)}%`
                : "—"}
              icon={Target}
              iconColor="text-[#10b981]"
              iconBg="bg-[#f0fdf4]"
              trend={results.length > 0 ? { value: 12, label: "improvement" } : undefined}
            />
            <DashboardCard
              title="Day streak"
              value={user.streak}
              icon={Flame}
              iconColor="text-amber-500"
              iconBg="bg-amber-50"
              subtitle="Keep it up!"
            />
            <DashboardCard
              title="Free tests"
              value={`${user.freeTestsUsed}/${FREE_TESTS_LIMIT}`}
              icon={Trophy}
              iconColor="text-[#f59e0b]"
              iconBg="bg-amber-50"
            >
              <ProgressBar value={user.freeTestsUsed} max={FREE_TESTS_LIMIT} size="sm" variant="gradient" />
            </DashboardCard>
          </div>

          {/* Preparation path + daily challenge */}
          {hasCareerTargets && preparationPath ? (
            <div className="grid lg:grid-cols-2 gap-6 animate-fade-up delay-300">
              <PreparationPathCard path={preparationPath} />
              <div>
                <h2 className="font-display font-semibold text-lg text-[#0D1B2E] mb-4">Daily Challenge</h2>
                <DailyChallengeCard test={dailyChallenge} />
              </div>
            </div>
          ) : (
            <div className="animate-fade-up delay-300">
              <h2 className="font-display font-semibold text-lg text-[#0D1B2E] mb-4">Daily Challenge</h2>
              <DailyChallengeCard test={dailyChallenge} />
            </div>
          )}

          {/* Suggested daily exercises */}
          <div className="animate-fade-up delay-350">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Suggested Daily Exercises</h2>
              <span className="text-xs text-[#94a3b8]">Short & focused</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {DAILY_EXERCISES.map((ex) => (
                <Link
                  key={ex.label}
                  href={`/tests?type=${ex.type}`}
                  className="card card-interactive p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-xl flex-shrink-0">
                    {ex.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0D1B2E] leading-snug">{ex.label}</p>
                    <p className="text-xs text-[#94a3b8] flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {ex.duration}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-[#94a3b8] flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended for you */}
          <div className="animate-fade-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">
                  {hasCareerTargets ? `Recommended for ${user.targetRole ?? "you"}` : "Recommended for you"}
                </h2>
                {hasCareerTargets && (
                  <p className="text-xs text-[#94a3b8] mt-0.5">Based on your role and industry</p>
                )}
              </div>
              <Link href="/tests?sort=recommended" className="text-xs text-[#4f46e5] font-semibold hover:underline flex items-center gap-1">
                Browse all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {displayRecommended.map((test) => (
                <RecommendedTestCard
                  key={test.id}
                  test={test}
                  badge={test.isRecommended ? "Best match" : undefined}
                />
              ))}
            </div>
          </div>

          {/* Popular for your role — only if role is set */}
          {popularForRole.length > 0 && (
            <div className="animate-fade-up delay-450">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">
                    Popular for {user.targetRole}
                  </h2>
                </div>
                <Link href={`/tests?role=${encodeURIComponent(user.targetRole ?? "")}`}
                  className="text-xs text-[#4f46e5] font-semibold hover:underline flex items-center gap-1">
                  See all <ChevronRight size={12} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {popularForRole.map((test) => (
                  <RecommendedTestCard key={test.id} test={test} badge="Popular" />
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
                    <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">
                      Frequently used at {user.targetCompany}
                    </h2>
                    <p className="text-xs text-[#94a3b8]">Candidates applying here practise these</p>
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

          {/* Two-column: skill overview + recent results */}
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-up delay-500">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Skill Overview</h2>
                <BarChart3 size={16} className="text-[#94a3b8]" />
              </div>
              {skillAreas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center">
                    <BarChart3 size={18} className="text-[#94a3b8]" />
                  </div>
                  <p className="text-sm text-[#64748b]">Complete tests to see your skill breakdown.</p>
                  <Link href="/tests" className="text-sm font-semibold text-[#4f46e5] hover:underline">Browse tests</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {skillAreas.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{skill.icon}</span>
                          <span className="text-sm font-medium text-[#334155]">{skill.name}</span>
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
                <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Recent Results</h2>
                <Link href="/results" className="text-xs text-[#4f46e5] font-semibold hover:underline">View all</Link>
              </div>
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center">
                    <BookOpen size={18} className="text-[#94a3b8]" />
                  </div>
                  <p className="text-sm text-[#64748b]">No results yet. Start a test to see your progress here.</p>
                  <Link href="/tests" className="text-sm font-semibold text-[#4f46e5] hover:underline">
                    Browse tests
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {results.map((result) => {
                    const test = tests.find((t) => t.id === result.testId);
                    return (
                      <div key={result.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8fafc] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-base flex-shrink-0">
                          {test ? ASSESSMENT_TYPE_ICONS[test.type] : "📋"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0D1B2E] truncate">{test?.title ?? "Test"}</p>
                          <p className="text-xs text-[#94a3b8] flex items-center gap-1">
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
                <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Pro Tests</h2>
                <Lock size={14} className="text-[#94a3b8]" />
              </div>
              <Link href="/pricing" className="text-xs text-[#4f46e5] font-semibold hover:underline">Upgrade</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {lockedTests.map((test) => (
                <div key={test.id} className="card p-4 flex flex-col gap-3 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{ASSESSMENT_TYPE_ICONS[test.type]}</span>
                    <div className="flex items-center gap-1.5">
                      {test.isGeneratedByAI && (
                        <span className="text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles size={9} /> AI
                        </span>
                      )}
                      <Lock size={12} className="text-[#94a3b8]" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D1B2E] text-sm leading-snug">{test.title}</p>
                    <p className="text-xs text-[#94a3b8] mt-1">{test.estimatedTime} min</p>
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
                  <h3 className="font-display font-semibold text-[#0D1B2E]">AI-Powered Coaching</h3>
                  <span className="text-[10px] font-bold text-[#7c3aed] bg-[#f5f3ff] border border-[#ddd6fe] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Coming soon
                  </span>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed mb-4">
                  Soon your coach will detect weak skills, generate company-specific test series, adapt difficulty in real time, and build a daily practice schedule — all from your performance data.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white text-sm font-semibold hover:bg-[#4338ca] transition-colors"
                  >
                    Get early access
                  </Link>
                  <span className="text-xs text-[#94a3b8]">Pro plan</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
