"use client";

import { useState } from "react";
import { Calendar, BookOpen, ChevronRight, Zap, Sparkles } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AssessmentTypeIcon } from "@/components/ui/AssessmentTypeIcon";

interface DayPlan {
  day: number;
  date: string;
  focus: string;
  testType: string;
  duration: number;
  tip: string;
}

const TEST_TYPES = [
  { type: "numerical_reasoning",    label: "Numerical Reasoning" },
  { type: "logical_reasoning",      label: "Logical Reasoning" },
  { type: "verbal_reasoning",       label: "Verbal Reasoning" },
  { type: "situational_judgement",  label: "Situational Judgement" },
  { type: "personality",            label: "Personality Assessment" },
];

const TIPS = [
  "Start fresh. No coffee yet, simulate exam conditions.",
  "Review yesterday's mistakes before starting today.",
  "Focus on speed today, not just accuracy.",
  "Try explaining your reasoning out loud.",
  "Take a 5-min break every 25 minutes (Pomodoro).",
  "Redo 3 questions you got wrong this week.",
  "Your brain consolidates learning during sleep, so rest well.",
];

function generatePlan(interviewDate: string, targetRole: string, weak: string): DayPlan[] {
  const end = new Date(interviewDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysLeft = Math.max(1, Math.round((end.getTime() - now.getTime()) / 86_400_000));
  const days = Math.min(daysLeft, 21);

  const types = weak
    ? [weak, ...TEST_TYPES.filter((t) => t.type !== weak).map((t) => t.type)]
    : TEST_TYPES.map((t) => t.type);

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const typeIdx = i % types.length;
    const meta = TEST_TYPES.find((t) => t.type === types[typeIdx]) ?? TEST_TYPES[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    return {
      day: i + 1,
      date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
      focus: meta.label,
      testType: meta.type,
      duration: isWeekend ? 30 : 15,
      tip: TIPS[i % TIPS.length],
    };
  });
}

export default function StudyPlanPage() {
  const [interviewDate, setInterviewDate] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [weak, setWeak] = useState("");
  const [plan, setPlan] = useState<DayPlan[] | null>(null);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().split("T")[0];

  function generate() {
    if (!interviewDate) return;
    setPlan(generatePlan(interviewDate, targetRole, weak));
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          {/* Header */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-[#0D1B2E]">Study Plan Generator</h1>
                <p className="text-sm text-[#64748b]">Enter your interview date and get a personalised day-by-day schedule</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-6 animate-fade-up delay-100">
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Interview date *</label>
                <input
                  type="date"
                  min={minStr}
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0D1B2E] focus:outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Target role (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Data Analyst"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0D1B2E] focus:outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Weak area to prioritise</label>
                <select
                  value={weak}
                  onChange={(e) => setWeak(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0D1B2E] focus:outline-none focus:border-[#2D7BFF] bg-white"
                >
                  <option value="">No preference</option>
                  {TEST_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={generate}
              disabled={!interviewDate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Sparkles size={15} />
              Generate my plan
            </button>
          </div>

          {/* Plan */}
          {plan && (
            <div className="flex flex-col gap-4 animate-fade-up">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#2D7BFF]" />
                <h2 className="font-display font-semibold text-lg text-[#0D1B2E]">
                  Your {plan.length}-day study plan
                </h2>
                {targetRole && (
                  <span className="text-xs font-semibold text-[#2D7BFF] bg-[#EAF1FF] px-2 py-0.5 rounded-full">
                    {targetRole}
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {plan.map((day) => {
                  const meta = TEST_TYPES.find((t) => t.type === day.testType) ?? TEST_TYPES[0];
                  return (
                    <div key={day.day} className="card p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#EAF1FF] text-[#2D7BFF] text-[10px] font-bold flex items-center justify-center">
                            {day.day}
                          </span>
                          <span className="text-xs font-semibold text-[#94a3b8]">{day.date}</span>
                        </div>
                        <span className="text-xs text-[#64748b]">{day.duration} min</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <AssessmentTypeIcon type={meta.type} size={18} />
                        <p className="text-sm font-semibold text-[#0D1B2E] leading-tight">{day.focus}</p>
                      </div>

                      <p className="text-[11px] text-[#94a3b8] leading-relaxed mb-3">{day.tip}</p>

                      <Link
                        href={`/tests?type=${day.testType}`}
                        className="flex items-center gap-1 text-xs font-semibold text-[#2D7BFF] hover:underline"
                      >
                        <BookOpen size={11} />
                        Practice now
                        <ChevronRight size={11} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
