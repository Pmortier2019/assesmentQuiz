"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Sparkles, ClipboardList, CheckCircle, XCircle, Trophy, Check, X, Circle } from "lucide-react";
import { getResultById, getUserResults, getCurrentUser, getTests, getRecommendedTests } from "@/lib/api";
import { ResultsSummary } from "@/components/test/ResultsSummary";
import { FeedbackCard } from "@/components/cards/FeedbackCard";
import { TestCard } from "@/components/cards/TestCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AssessmentTypeIcon } from "@/components/ui/AssessmentTypeIcon";
import { ASSESSMENT_TYPE_LABELS, getScoreColor, formatTime } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import type { TestResult, Test } from "@/lib/types";
import { Suspense } from "react";
import { InlineLoader } from "@/components/ui/PageLoader";

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("resultId");
  const { t } = useT();
  const [result, setResult] = useState<TestResult | null>(null);
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [recommendedTests, setRecommendedTests] = useState<Test[]>([]);
  const [isProUser, setIsProUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPersonalRecord, setIsPersonalRecord] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    const load = async () => {
      const [r, all, user, testsPage, recommended] = await Promise.all([
        resultId ? getResultById(resultId) : getUserResults().then((rs) => rs[0] ?? null),
        getUserResults(),
        getCurrentUser(),
        getTests(),
        getRecommendedTests().catch(() => [] as Test[]),
      ]);
      setResult(r);
      setAllResults(all);
      setAllTests(testsPage.data);
      setIsProUser(user.subscription === "pro");
      setRecommendedTests(
        recommended.filter((t) => t.id !== (r?.testId ?? "")).slice(0, 3)
      );

      // Check for personal record
      if (r) {
        const prevBest = all
          .filter((x) => x.id !== r.id && x.testId === r.testId)
          .reduce((best, x) => Math.max(best, x.score), 0);
        if (r.score > prevBest) setIsPersonalRecord(true);
      }

      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [resultId]);

  // Confetti burst on personal record
  useEffect(() => {
    if (!isPersonalRecord || confettiFired.current) return;
    confettiFired.current = true;
    import("canvas-confetti").then(({ default: confetti }) => {
      const burst = (angle: number, origin: { x: number; y: number }) =>
        confetti({
          angle,
          spread: 55,
          particleCount: 80,
          origin,
          colors: ["#4f46e5", "#7c3aed", "#10b981", "#f59e0b", "#f43f5e"],
          scalar: 1.1,
        });
      burst(60,  { x: 0, y: 0.65 });
      burst(120, { x: 1, y: 0.65 });
      setTimeout(() => {
        burst(75,  { x: 0.1, y: 0.5 });
        burst(105, { x: 0.9, y: 0.5 });
      }, 200);
    });
  }, [isPersonalRecord]);

  const test = result ? allTests.find((t) => t.id === result.testId) : null;

  if (loading) return <InlineLoader />;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="font-display font-semibold text-[#0D1B2E] text-xl">{t("results_no_results")}</p>
        <p className="text-[#64748b] text-sm">{t("results_complete_test")}</p>
        <Link href="/tests" className="px-5 py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold">
          {t("results_browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Back */}
      <Link href="/tests" className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0D1B2E] transition-colors w-fit">
        <ChevronLeft size={16} />
        {t("results_back")}
      </Link>

      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-sm text-[#94a3b8] font-medium mb-1">
          {test ? ASSESSMENT_TYPE_LABELS[test.type] : "Assessment"}
        </p>
        <h1 className="font-display font-bold text-2xl text-[#0D1B2E]">
          {test?.title ?? "Test Results"}
        </h1>
        {isPersonalRecord && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold shadow-md animate-fade-up">
            <Trophy size={16} className="fill-white" />
            New personal record!
          </div>
        )}
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
              {t("results_ai_feedback")}
            </h2>
            <FeedbackCard feedback={result.aiFeedback} isProUser={isProUser} />
          </div>

          {/* Question Review */}
          {result.questionResults && result.questionResults.length > 0 && (
            <div className="animate-fade-up delay-300">
              <h2 className="font-display font-semibold text-base text-[#0D1B2E] mb-3 flex items-center gap-2">
                <ClipboardList size={16} className="text-[#4f46e5]" />
                {t("results_q_review")}
              </h2>
              <div className="flex flex-col gap-4">
                {result.questionResults.map((qr, idx) => (
                  <div key={qr.questionId} className="card p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        qr.isCorrect ? "bg-[#f0fdf4]" : "bg-[#fef2f2]"
                      }`}>
                        {qr.isCorrect
                          ? <CheckCircle size={14} className="text-[#10b981]" />
                          : <XCircle size={14} className="text-[#ef4444]" />
                        }
                      </div>
                      <p className="text-sm font-medium text-[#0D1B2E] leading-relaxed">
                        <span className="text-[#94a3b8] text-xs mr-2">Q{idx + 1}.</span>
                        {qr.questionText}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-9 mb-3">
                      {qr.answerOptions.map((opt) => {
                        const isSelected = opt.id === qr.selectedAnswerOptionId;
                        const isCorrectOpt = opt.isCorrect;
                        let cls = "px-3 py-2 rounded-lg text-sm flex items-start gap-1.5 ";
                        if (isCorrectOpt) {
                          cls += "bg-[#f0fdf4] border border-[#86efac] text-[#166534] font-medium";
                        } else if (isSelected && !isCorrectOpt) {
                          cls += "bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b]";
                        } else {
                          cls += "bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b]";
                        }
                        return (
                          <div key={opt.id} className={cls}>
                            <span className="flex-shrink-0 mt-0.5">
                              {isCorrectOpt
                                ? <Check size={14} className="text-[#16a34a]" strokeWidth={3} />
                                : isSelected
                                ? <X size={14} className="text-[#991b1b]" strokeWidth={3} />
                                : <Circle size={14} className="text-[#cbd5e1]" />}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                    {qr.explanation && (
                      <div className="ml-9 p-3 rounded-lg bg-[#eef2ff] border border-[#c7d2fe]">
                        <p className="text-xs text-[#4f46e5] font-semibold mb-1">{t("results_explanation")}</p>
                        <p className="text-sm text-[#1e1b4b] leading-relaxed">{qr.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="animate-fade-up delay-400 p-6 rounded-2xl bg-gradient-to-br from-[#0D1B2E] to-[#1a2f4a] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg mb-1">{t("results_keep_going")}</h3>
              <p className="text-sm text-white/60">{t("results_practice_daily")}</p>
            </div>
            <Link
              href="/tests"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              {t("results_continue")}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-5 animate-fade-up delay-200">
          {/* Recommended next */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-[#0D1B2E]">{t("results_recommended")}</h3>
              <span className="text-[10px] font-semibold text-[#4f46e5] bg-[#eef2ff] px-2 py-0.5 rounded-full">Voor jou</span>
            </div>
            {recommendedTests.length === 0 ? (
              <p className="text-xs text-[#94a3b8] text-center py-4">{t("results_no_recommendations")}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recommendedTests.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tests/${t.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                      <AssessmentTypeIcon type={t.type} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0D1B2E] truncate">{t.title}</p>
                      <p className="text-xs text-[#94a3b8]">{t.estimatedTime} min · {t.difficulty}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#94a3b8] group-hover:text-[#4f46e5] transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          {allResults.length > 1 && (
            <div className="card p-4">
              <h3 className="font-display font-semibold text-sm text-[#0D1B2E] mb-4">{t("results_history")}</h3>
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
