import {
  Flame, TrendingUp, BookOpen, Trophy, Sparkles, Lock, ChevronRight,
  Target, BarChart3, Clock
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { DailyChallengeCard } from "@/components/cards/DailyChallengeCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { PaywallCard } from "@/components/ui/PaywallCard";
import { getCurrentUser, getTests, getUserResults } from "@/lib/api";
import { ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_ICONS, getScoreColor, formatTime } from "@/lib/utils";

const FREE_TESTS_LIMIT = 5;

export default async function DashboardPage() {
  const [user, testsPage, results] = await Promise.all([
    getCurrentUser(),
    getTests(),
    getUserResults(),
  ]);
  const tests = testsPage.data;
  const dailyChallenge = tests[0];
  const recommendedTests = tests.filter((t) => t.isFree).slice(0, 3);
  const lockedTests = tests.filter((t) => !t.isFree).slice(0, 3);
  const isAtLimit = user.freeTestsUsed >= FREE_TESTS_LIMIT;

  const skillAreas = [
    { name: "Numerical Reasoning", score: 80, icon: "📊" },
    { name: "Logical Reasoning",   score: 65, icon: "🧩" },
    { name: "Verbal Reasoning",    score: 72, icon: "📝" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar streak={user.streak} userName={user.name} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile navbar */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E]">
                Good morning, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-[#64748b] text-sm mt-1">
                {isAtLimit
                  ? "You've used all free tests — upgrade to keep going."
                  : `${FREE_TESTS_LIMIT - user.freeTestsUsed} free test${FREE_TESTS_LIMIT - user.freeTestsUsed !== 1 ? "s" : ""} remaining.`}
              </p>
            </div>
            <StreakBadge count={user.streak} />
          </div>

          {/* Paywall banner */}
          {isAtLimit && (
            <div className="animate-fade-up delay-100">
              <PaywallCard compact />
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
              value={`${Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)}%`}
              icon={Target}
              iconColor="text-[#10b981]"
              iconBg="bg-[#f0fdf4]"
              trend={{ value: 12, label: "improvement" }}
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

          {/* Daily challenge */}
          <div className="animate-fade-up delay-300">
            <h2 className="font-display font-semibold text-lg text-[#0D1B2E] mb-4">Daily Challenge</h2>
            <DailyChallengeCard test={dailyChallenge} />
          </div>

          {/* Two-column section */}
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-up delay-400">
            {/* Weak skills */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Skill Overview</h2>
                <BarChart3 size={16} className="text-[#94a3b8]" />
              </div>
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
            </div>

            {/* Recent results */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Recent Results</h2>
                <Link href="/results" className="text-xs text-[#4f46e5] font-semibold hover:underline">
                  View all
                </Link>
              </div>
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
            </div>
          </div>

          {/* Recommended tests */}
          <div className="animate-fade-up delay-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Recommended for you</h2>
              <Link href="/tests" className="text-xs text-[#4f46e5] font-semibold hover:underline flex items-center gap-1">
                Browse all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {recommendedTests.map((test) => (
                <Link
                  key={test.id}
                  href={`/tests/${test.id}`}
                  className="card card-interactive p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{ASSESSMENT_TYPE_ICONS[test.type]}</span>
                    <span className="text-xs font-semibold text-[#10b981] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D1B2E] text-sm leading-snug">{test.title}</p>
                    <p className="text-xs text-[#94a3b8] mt-1">{test.estimatedTime} min · {test.questionCount ?? test.questions.length} questions</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pro locked tests */}
          <div className="animate-fade-up delay-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">Pro Tests</h2>
                <Lock size={14} className="text-[#94a3b8]" />
              </div>
              <Link href="/pricing" className="text-xs text-[#4f46e5] font-semibold hover:underline">
                Upgrade
              </Link>
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

          {/* AI Recommendations */}
          <div className="animate-fade-up delay-600 rounded-2xl border border-[#c7d2fe] bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display font-semibold text-[#0D1B2E]">AI Recommendation</h3>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed mb-4">
                  Based on your recent scores, your weakest area is <strong>multi-variable reasoning</strong>. I recommend focusing on numerical reasoning tests at intermediate level — your response time suggests you can handle harder problems with a bit more practice.
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    href="/tests?type=numerical_reasoning&difficulty=intermediate"
                    className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white text-sm font-semibold hover:bg-[#4338ca] transition-colors"
                  >
                    Start recommended test
                  </Link>
                  <span className="text-xs text-[#94a3b8]">Updated daily</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
