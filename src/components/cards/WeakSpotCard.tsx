"use client";

import { Brain, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { TestResult, Test } from "@/lib/types";
import { ASSESSMENT_TYPE_LABELS } from "@/lib/utils";

interface WeakSpotCardProps {
  results: TestResult[];
  tests: Test[];
}

interface TypeStats {
  type: string;
  label: string;
  avgScore: number;
  count: number;
}

export function WeakSpotCard({ results, tests }: WeakSpotCardProps) {
  if (results.length < 3) return null;

  // Group scores by test type
  const typeMap = new Map<string, number[]>();
  for (const r of results) {
    const test = tests.find((t) => t.id === r.testId);
    if (!test) continue;
    const arr = typeMap.get(test.type) ?? [];
    arr.push(r.score);
    typeMap.set(test.type, arr);
  }

  const stats: TypeStats[] = Array.from(typeMap.entries()).map(([type, scores]) => ({
    type,
    label: ASSESSMENT_TYPE_LABELS[type as keyof typeof ASSESSMENT_TYPE_LABELS] ?? type,
    avgScore: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
    count: scores.length,
  }));

  const weakSpots = stats
    .filter((s) => s.avgScore < 70 && s.count >= 1)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 2);

  const strengths = stats
    .filter((s) => s.avgScore >= 80)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 1);

  if (weakSpots.length === 0) return null;

  return (
    <div className="card p-5 border-l-4 border-l-[#f43f5e]">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#fff1f2] flex items-center justify-center flex-shrink-0">
          <Brain size={18} className="text-[#f43f5e]" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-default text-sm">Weak spot detected</h3>
          <p className="text-xs text-subtle mt-0.5">Based on your last {results.length} test results</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold text-[#2D7BFF] bg-[#EAF1FF] px-2 py-0.5 rounded-full">Smart</span>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {weakSpots.map((spot) => (
          <div key={spot.type} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-body">{spot.label}</p>
                <span className="text-xs font-bold text-[#f43f5e]">{spot.avgScore}%</span>
              </div>
              <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f43f5e] to-[#fb7185]"
                  style={{ width: `${spot.avgScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {strengths.length > 0 && (
        <p className="flex items-center gap-1.5 text-xs text-[#10b981] font-medium mb-3">
          <TrendingUp size={13} className="flex-shrink-0" />
          Strong in {strengths[0].label} ({strengths[0].avgScore}%)
        </p>
      )}

      <Link
        href={`/tests?type=${weakSpots[0].type}`}
        className="flex items-center gap-2 text-xs font-semibold text-[#2D7BFF] hover:underline"
      >
        Practice {weakSpots[0].label}
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
