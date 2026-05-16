"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, BarChart2, Target, Trophy, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { getSkillsSummary, type SkillsSummary, type SkillEntry } from "@/lib/api";
import { ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_ICONS } from "@/lib/utils";
import type { AssessmentType } from "@/lib/types";
import Link from "next/link";

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
}

function barColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-400";
  return "bg-rose-500";
}

function TrendIcon({ trend }: { trend: SkillEntry["trend"] }) {
  if (trend === "up")   return <TrendingUp size={14} className="text-emerald-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-rose-500" />;
  return <Minus size={14} className="text-[#94a3b8]" />;
}

function typeLabel(type: string): string {
  const key = type.toLowerCase() as AssessmentType;
  return ASSESSMENT_TYPE_LABELS[key] ?? type.replace(/_/g, " ");
}

function typeIcon(type: string): string {
  const key = type.toLowerCase() as AssessmentType;
  return ASSESSMENT_TYPE_ICONS[key] ?? "📋";
}

export default function ProgressPage() {
  const [summary, setSummary] = useState<SkillsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"count" | "score_asc" | "score_desc">("count");

  useEffect(() => {
    getSkillsSummary().then((s) => { setSummary(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden"><Navbar /></div>
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
          </main>
        </div>
      </div>
    );
  }

  const noData = !summary || summary.totalTests === 0;

  const sorted = [...(summary?.skills ?? [])].sort((a, b) => {
    if (sort === "score_asc")  return a.avgScore - b.avgScore;
    if (sort === "score_desc") return b.avgScore - a.avgScore;
    return b.count - a.count;
  });

  const best   = summary?.skills.reduce((a, b) => a.avgScore > b.avgScore ? a : b, summary.skills[0]);
  const weakest = summary?.skills.reduce((a, b) => a.avgScore < b.avgScore ? a : b, summary.skills[0]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden"><Navbar /></div>
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

          {/* Header */}
          <div className="animate-fade-up">
            <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">Skills Progress</h1>
            <p className="text-[#64748b] text-sm">Your performance per assessment type over all attempts</p>
          </div>

          {noData ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
                <BarChart2 size={28} className="text-[#94a3b8]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#0D1B2E] text-lg mb-1">No data yet</h3>
                <p className="text-sm text-[#64748b] max-w-xs">Complete some tests to see your skills breakdown here.</p>
              </div>
              <Link href="/tests" className="px-5 py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold">
                Browse tests
              </Link>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up delay-100">
                {[
                  { label: "Tests done",   value: summary!.totalTests, icon: Target,  color: "text-[#4f46e5]", bg: "bg-[#eef2ff]" },
                  { label: "Overall avg",  value: `${summary!.avgScore}%`, icon: BarChart2, color: scoreColor(summary!.avgScore), bg: "bg-[#f8fafc]" },
                  { label: "Best skill",   value: best ? typeLabel(best.type) : "—", icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50", small: true },
                  { label: "Needs work",   value: weakest ? typeLabel(weakest.type) : "—", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50", small: true },
                ].map(({ label, value, icon: Icon, color, bg, small }) => (
                  <div key={label} className="card p-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold ${small ? "text-sm" : "text-xl"} text-[#0D1B2E] truncate`}>{value}</p>
                      <p className="text-xs text-[#94a3b8]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills breakdown */}
              <div className="card p-6 animate-fade-up delay-200">
                <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                  <h2 className="font-display font-semibold text-base text-[#0D1B2E]">
                    Skills breakdown <span className="text-[#94a3b8] font-normal text-sm ml-1">({sorted.length} types)</span>
                  </h2>
                  <div className="flex rounded-lg border border-[#e2e8f0] overflow-hidden text-xs font-semibold">
                    {([["count", "Most practiced"], ["score_asc", "Weakest first"], ["score_desc", "Strongest first"]] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSort(key)}
                        className={`px-3 py-1.5 transition-colors ${sort === key ? "bg-[#0D1B2E] text-white" : "bg-white text-[#64748b] hover:bg-[#f8fafc]"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col divide-y divide-[#f1f5f9]">
                  {sorted.map((skill) => (
                    <div key={skill.type} className="py-3 flex items-center gap-4">
                      <div className="w-8 text-lg flex-shrink-0 text-center">{typeIcon(skill.type)}</div>
                      <div className="w-44 flex-shrink-0 min-w-0">
                        <p className="text-sm font-medium text-[#0D1B2E] truncate">{typeLabel(skill.type)}</p>
                        <p className="text-xs text-[#94a3b8]">{skill.count} attempt{skill.count !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor(skill.avgScore)}`}
                            style={{ width: `${skill.avgScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 w-20 justify-end">
                        <TrendIcon trend={skill.trend} />
                        <span className={`text-sm font-bold ${scoreColor(skill.avgScore)}`}>{skill.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 text-xs text-[#94a3b8] animate-fade-up delay-300">
                <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-emerald-500" /> Improving (last &gt; avg by 5+)</span>
                <span className="flex items-center gap-1.5"><TrendingDown size={12} className="text-rose-500" /> Declining (last &lt; avg by 5+)</span>
                <span className="flex items-center gap-1.5"><Minus size={12} /> Stable</span>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
