"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Flame, BookOpen } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getToken } from "@/lib/auth";
import { getCurrentUser, getTests, getUserResults } from "@/lib/api";
import type { User, Test, TestResult } from "@/lib/types";
import { ASSESSMENT_TYPE_LABELS } from "@/lib/utils";

interface LiveData {
  firstName: string;
  streak: number;
  barHeights: number[];
  scoreImprovement: string;
  recommendedTitle: string;
  masteryPct: number;
  recommendedDuration: number;
  freeTestsUsed: number;
  latestScore: number;
}

const DEMO: LiveData = {
  firstName: "Pierre",
  streak: 7,
  barHeights: [40, 55, 48, 65, 72, 68, 80],
  scoreImprovement: "+18%",
  recommendedTitle: "Numerical Reasoning: Level 2",
  masteryPct: 65,
  recommendedDuration: 12,
  freeTestsUsed: 3,
  latestScore: 84,
};

function computeLiveData(user: User, results: TestResult[], tests: Test[]): LiveData {
  const firstName = user.name.split(" ")[0];

  // Bar chart: last 7 results normalized to 20–100% visual height
  const recent = [...results].reverse().slice(0, 7);
  const barHeights =
    recent.length > 0
      ? recent.map((r) => Math.round(20 + (r.score / 100) * 80))
      : DEMO.barHeights;

  // Score improvement: avg of latter half vs first half
  let scoreImprovement = "—";
  if (results.length >= 4) {
    const half = Math.floor(results.length / 2);
    const older = results.slice(half);
    const newer = results.slice(0, half);
    const avgOlder = older.reduce((s, r) => s + r.score, 0) / older.length;
    const avgNewer = newer.reduce((s, r) => s + r.score, 0) / newer.length;
    const diff = Math.round(avgNewer - avgOlder);
    scoreImprovement = diff >= 0 ? `+${diff}%` : `${diff}%`;
  } else if (results.length === 1) {
    scoreImprovement = "First test!";
  }

  // Find weakest test type (lowest avg score)
  const scoresByType = new Map<string, { total: number; count: number }>();
  for (const r of results) {
    const t = tests.find((x) => x.id === r.testId);
    if (!t) continue;
    const ex = scoresByType.get(t.type) ?? { total: 0, count: 0 };
    scoresByType.set(t.type, { total: ex.total + r.score, count: ex.count + 1 });
  }

  let recommendedTitle = DEMO.recommendedTitle;
  let masteryPct = DEMO.masteryPct;
  let recommendedDuration = DEMO.recommendedDuration;

  if (scoresByType.size > 0) {
    // Pick weakest type
    let weakestType = "";
    let weakestAvg = Infinity;
    for (const [type, { total, count }] of scoresByType) {
      const avg = total / count;
      if (avg < weakestAvg) {
        weakestAvg = avg;
        weakestType = type;
      }
    }
    masteryPct = Math.round(weakestAvg);

    // Find a test of that type the user hasn't done (or just first matching)
    const completedTestIds = new Set(results.map((r) => r.testId));
    const candidate =
      tests.find((t) => t.type === weakestType && !completedTestIds.has(t.id) && t.isFree) ??
      tests.find((t) => t.type === weakestType);

    if (candidate) {
      const typeLabel = ASSESSMENT_TYPE_LABELS[weakestType as keyof typeof ASSESSMENT_TYPE_LABELS] ?? weakestType;
      recommendedTitle = candidate.title ?? typeLabel;
      recommendedDuration = candidate.estimatedTime ?? 12;
    }
  } else if (tests.length > 0) {
    // No results yet — suggest first free test
    const first = tests.find((t) => t.isFree) ?? tests[0];
    recommendedTitle = first.title;
    recommendedDuration = first.estimatedTime ?? 12;
    masteryPct = 0;
  }

  return {
    firstName,
    streak: user.streak,
    barHeights: barHeights.length < 7 ? [...DEMO.barHeights.slice(0, 7 - barHeights.length), ...barHeights] : barHeights,
    scoreImprovement,
    recommendedTitle,
    masteryPct,
    recommendedDuration,
    freeTestsUsed: user.freeTestsUsed,
    latestScore: results.length > 0 ? results[0].score : DEMO.latestScore,
  };
}

export function HeroDashboardMockup() {
  const [data, setData] = useState<LiveData>(DEMO);

  useEffect(() => {
    if (!getToken()) return;
    Promise.all([getCurrentUser(), getUserResults(), getTests()])
      .then(([user, results, testsPage]) => {
        setData(computeLiveData(user, results, testsPage.data));
      })
      .catch(() => {/* stay on DEMO */});
  }, []);

  const improvementColor =
    data.scoreImprovement.startsWith("+") ? "text-[#10b981]" : "text-[#ef4444]";

  return (
    <div className="relative w-full max-w-sm mx-auto animate-float">
      {/* Main card */}
      <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94a3b8] font-medium">Welcome back</p>
            <p className="font-display font-bold text-[#0D1B2E]">{data.firstName}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <Flame size={14} className="text-amber-500 fill-amber-400" />
            <span className="text-sm font-semibold text-amber-700">{data.streak} days</span>
          </div>
        </div>

        {/* Score improvement */}
        <div className="rounded-xl bg-gradient-to-br from-[#EAF1FF] to-[#EAF1FF] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#2D7BFF]">Score improvement</span>
            <div className={`flex items-center gap-1 text-xs font-bold ${improvementColor}`}>
              <TrendingUp size={12} />
              {data.scoreImprovement}
            </div>
          </div>
          <div className="flex items-end gap-1 h-12">
            {data.barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#2D7BFF] to-[#1D63E6] opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Recommended test */}
        <div className="rounded-xl border border-[#e2e8f0] p-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-[#2D7BFF]" />
            <span className="text-xs font-semibold text-[#2D7BFF]">Recommended</span>
          </div>
          <p className="text-sm font-semibold text-[#0D1B2E] mb-2 truncate">{data.recommendedTitle}</p>
          <ProgressBar value={data.masteryPct} size="sm" />
          <p className="text-xs text-[#94a3b8] mt-1.5">{data.masteryPct}% mastery · {data.recommendedDuration} min</p>
        </div>

        {/* Tests progress */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#64748b] font-medium">Free tests used</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${i < data.freeTestsUsed ? "bg-[#2D7BFF]" : "bg-[#e2e8f0]"}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#475569]">{data.freeTestsUsed}/5</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-3 py-2 flex items-center gap-2 animate-slide-right delay-300">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center">
          <BookOpen size={12} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] text-[#94a3b8]">Up next</p>
          <p className="text-xs font-bold text-[#0D1B2E]">New test!</p>
        </div>
      </div>

      {/* Score badge */}
      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-3 py-2 animate-slide-right delay-500">
        <p className="text-[10px] text-[#94a3b8]">Latest score</p>
        <p className="text-base font-display font-extrabold text-[#10b981]">{data.latestScore}%</p>
      </div>
    </div>
  );
}
