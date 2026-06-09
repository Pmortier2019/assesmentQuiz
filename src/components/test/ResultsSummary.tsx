import { Trophy, Clock, TrendingUp, AlertCircle, Check, ArrowRight } from "lucide-react";
import { cn, formatTime, getScoreColor, getScoreLabel } from "@/lib/utils";
import type { TestResult } from "@/lib/types";

interface ResultsSummaryProps {
  result: TestResult;
  className?: string;
}

export function ResultsSummary({ result, className }: ResultsSummaryProps) {
  const correctCount = result.answers.filter((a) => a.isCorrect).length;
  const total = result.answers.length;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Score hero */}
      <div className="flex flex-col items-center py-8 gap-3 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] border border-[#e2e8f0]">
        <div className="relative">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="url(#scoreGradient)" strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.score / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-display font-extrabold text-3xl", getScoreColor(result.score))}>
              {result.score}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-xl text-[#0D1B2E]">{getScoreLabel(result.score)}</p>
          <p className="text-sm text-[#64748b]">{correctCount} out of {total} correct</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: Trophy, label: "Score", value: `${result.score}%`, color: "text-[#4f46e5]", bg: "bg-[#eef2ff]" },
          { icon: Clock, label: "Time", value: formatTime(result.timeTaken), color: "text-[#f59e0b]", bg: "bg-amber-50" },
          { icon: TrendingUp, label: "Correct", value: `${correctCount}/${total}`, color: "text-[#10b981]", bg: "bg-emerald-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-4 flex flex-col items-center gap-2 text-center">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bg)}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-[#0D1B2E]">{value}</p>
              <p className="text-xs text-[#94a3b8]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weak points */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-[#16a34a]" />
            <span className="font-semibold text-[#16a34a] text-sm">Strengths</span>
          </div>
          <ul className="flex flex-col gap-2">
            {result.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-[#166534]">
                <Check size={15} strokeWidth={3} className="text-[#16a34a] mt-0.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-[#e11d48]" />
            <span className="font-semibold text-[#e11d48] text-sm">Areas to improve</span>
          </div>
          <ul className="flex flex-col gap-2">
            {result.weakPoints.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-[#9f1239]">
                <ArrowRight size={15} className="text-[#f43f5e] mt-0.5 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
