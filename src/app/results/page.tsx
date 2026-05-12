"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { getResultById, getUserResults, getCurrentUser, getTests } from "@/lib/api";
import { ResultsSummary } from "@/components/test/ResultsSummary";
import { FeedbackCard } from "@/components/cards/FeedbackCard";
import { TestCard } from "@/components/cards/TestCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ASSESSMENT_TYPE_LABELS, getScoreColor, formatTime } from "@/lib/utils";
import type { TestResult, Test } from "@/lib/types";
import { Suspense } from "react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const [result, setResult] = useState<TestResult | null>(null);
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [r, all, user, testsPage] = await Promise.all([
        resultId ? getResultById(resultId) : getUserResults().then((rs) => rs[0] ?? null),
        getUserResults(),
        getCurrentUser(),
        getTests(),
      ]);
      setResult(r);
      setAllResults(all);
      setAllTests(testsPage.data);
      setIsProUser(user.subscription === "pro");
      setLoading(false);
    };
    load();
  }, [resultId]);

  const test = result ? allTests.find((t) => t.id === result.testId) : null;
  const recommendedTests = allTests.filter((t) => t.isFree && t.id !== result?.testId).slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="font-display font-semibold text-[#0D1B2E] text-xl">No results yet</p>
        <p className="text-[#64748b] text-sm">Complete a test to see your results here.</p>
        <Link href="/tests" className="px-5 py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold">
          Browse tests
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Back */}
      <Link href="/tests" className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0D1B2E] transition-colors w-fit">
        <ChevronLeft size={16} />
        Back to tests
      </Link>

      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-sm text-[#94a3b8] font-medium mb-1">
          {test ? ASSESSMENT_TYPE_LABELS[test.type] : "Assessment"}
        </p>
        <h1 className="font-display font-bold text-2xl text-[#0D1B2E]">
          {test?.title ?? "Test Results"}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="animate-fade-up delay-100">
            <ResultsSummary result={result} />
          </div>

          {/* AI Feedback */}
          <div className="animate-fade-up delay-200">
            <h2 className="font-display font-semibold text-base text-[#0D1B2E] mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-[#4f46e5]" />
              AI Feedback
            </h2>
            <FeedbackCard feedback={result.aiFeedback} isProUser={isProUser} />
          </div>

          {/* CTA */}
          <div className="animate-fade-up delay-300 p-6 rounded-2xl bg-gradient-to-br from-[#0D1B2E] to-[#1a2f4a] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg mb-1">Keep the momentum going</h3>
              <p className="text-sm text-white/60">Practice daily to see consistent score improvements.</p>
            </div>
            <Link
              href="/tests"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              Continue practicing
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-5 animate-fade-up delay-200">
          {/* Recommended next */}
          <div className="card p-4">
            <h3 className="font-display font-semibold text-sm text-[#0D1B2E] mb-4">Recommended next</h3>
            <div className="flex flex-col gap-3">
              {recommendedTests.map((t) => (
                <Link
                  key={t.id}
                  href={`/tests/${t.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                >
                  <span className="text-lg">{t.title.split(" ")[0]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0D1B2E] truncate">{t.title}</p>
                    <p className="text-xs text-[#94a3b8]">{t.estimatedTime} min</p>
                  </div>
                  <ArrowRight size={14} className="text-[#94a3b8] group-hover:text-[#4f46e5] transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* History */}
          {allResults.length > 1 && (
            <div className="card p-4">
              <h3 className="font-display font-semibold text-sm text-[#0D1B2E] mb-4">Your history</h3>
              <div className="flex flex-col gap-3">
                {allResults.map((r) => {
                  const t = allTests.find((x) => x.id === r.testId);
                  return (
                    <Link
                      key={r.id}
                      href={`/results?resultId=${r.id}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
                    >
                      <p className="text-xs font-medium text-[#475569] truncate max-w-[160px]">{t?.title ?? "Test"}</p>
                      <span className={`text-sm font-bold ${getScoreColor(r.score)}`}>{r.score}%</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <Navbar />
        </div>
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
          <Suspense fallback={<div className="skeleton h-96 rounded-2xl" />}>
            <ResultsContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
