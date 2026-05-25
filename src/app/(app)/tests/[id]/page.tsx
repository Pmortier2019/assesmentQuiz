"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Clock, CheckCircle2, Flag,
  Trophy, TrendingUp, AlertCircle, ChevronDown, ArrowRight, Lightbulb, Lock,
} from "lucide-react";
import { getTestById, submitTest, getCurrentUser, ApiError } from "@/lib/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { haptics } from "@/lib/haptics";
import { isLoggedIn } from "@/lib/auth";
import { FREE_TEST_LIMIT } from "@/lib/constants";
import { TestQuestionCard } from "@/components/test/TestQuestionCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn, formatTime, ASSESSMENT_TYPE_LABELS, getScoreColor } from "@/lib/utils";
import type { Test, TestResult, QuestionResult } from "@/lib/types";

const PASS_THRESHOLD = 70;

// ─── Results view ─────────────────────────────────────────────────────────────

function TestResultsView({ result, test }: { result: TestResult; test: Test }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const passed = result.score >= PASS_THRESHOLD;
  const correct = result.answers.filter((a) => a.isCorrect).length;
  const total = result.answers.length || result.questionResults?.length || 0;
  const estimatedSecs = test.estimatedTime * 60;
  const timeDelta = estimatedSecs - result.timeTaken;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94a3b8] font-medium">{ASSESSMENT_TYPE_LABELS[test.type]}</p>
            <p className="text-sm font-semibold text-[#0D1B2E] truncate">{test.title}</p>
          </div>
          <Link
            href="/results"
            className="text-xs text-[#4f46e5] font-semibold hover:underline flex items-center gap-1"
          >
            All results <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Score hero */}
        <div className="card p-6 flex flex-col items-center gap-4 text-center animate-fade-up">
          <div className="relative">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={passed ? "url(#passGrad)" : "url(#failGrad)"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.score / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="passGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="failGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-display font-extrabold text-3xl", getScoreColor(result.score))}>
                {result.score}%
              </span>
            </div>
          </div>

          <div>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold mb-2",
              passed
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-amber-100 text-amber-700 border border-amber-200"
            )}>
              {passed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {passed ? "🎉 Passed!" : "Not passed yet — keep practising!"}
            </div>
            <p className="text-[#64748b] text-sm">
              Pass mark: {PASS_THRESHOLD}% &nbsp;·&nbsp; {correct} of {total} correct
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 animate-fade-up delay-100">
          <div className="card p-4 flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 rounded-xl bg-[#eef2ff] flex items-center justify-center">
              <Trophy size={18} className="text-[#4f46e5]" />
            </div>
            <p className="font-display font-bold text-lg text-[#0D1B2E]">{result.score}%</p>
            <p className="text-xs text-[#94a3b8]">Your score</p>
          </div>

          <div className="card p-4 flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={18} className="text-amber-500" />
            </div>
            <p className="font-display font-bold text-lg text-[#0D1B2E]">{formatTime(result.timeTaken)}</p>
            <p className={cn("text-xs font-medium", timeDelta >= 0 ? "text-emerald-600" : "text-rose-500")}>
              {timeDelta >= 0
                ? `${formatTime(timeDelta)} under target`
                : `${formatTime(Math.abs(timeDelta))} over target`}
            </p>
          </div>

          <div className="card p-4 flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            <p className="font-display font-bold text-lg text-[#0D1B2E]">{correct}/{total}</p>
            <p className="text-xs text-[#94a3b8]">Correct</p>
          </div>
        </div>

        {/* Feedback */}
        {result.aiFeedback && (
          <div className="card p-4 border-l-4 border-[#4f46e5] animate-fade-up delay-200">
            <p className="text-sm font-semibold text-[#0D1B2E] mb-1">Feedback</p>
            <p className="text-sm text-[#475569]">{result.aiFeedback}</p>
          </div>
        )}

        {/* Tips to improve */}
        {result.tips && result.tips.length > 0 && (
          <div className="card p-5 animate-fade-up delay-250">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lightbulb size={16} className="text-amber-500" />
              </div>
              <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Tips to improve</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {result.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#475569] leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Per-question breakdown */}
        {result.questionResults && result.questionResults.length > 0 && (
          <div className="flex flex-col gap-3 animate-fade-up delay-300">
            <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Question review</h2>
            {result.questionResults.map((qr, i) => (
              <QuestionReviewCard
                key={qr.questionId}
                qr={qr}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-3 animate-fade-up delay-400">
          <Link
            href="/tests"
            className="flex-1 py-3 rounded-xl border border-[#e2e8f0] text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition-colors text-center"
          >
            Back to tests
          </Link>
          <Link
            href={`/tests/${test.id}`}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity text-center"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuestionReviewCard({
  qr, index, open, onToggle,
}: {
  qr: QuestionResult; index: number; open: boolean; onToggle: () => void;
}) {
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden transition-colors",
      qr.isCorrect ? "border-emerald-200" : "border-rose-200"
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#f8fafc] transition-colors"
      >
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white flex-shrink-0",
          qr.isCorrect ? "bg-emerald-500" : "bg-rose-400"
        )}>
          {qr.isCorrect ? "✓" : "✗"}
        </div>
        <p className="flex-1 text-sm font-medium text-[#0D1B2E] line-clamp-1">{qr.questionText}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            qr.isCorrect
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-rose-600 bg-rose-50 border border-rose-200"
          )}>
            {qr.isCorrect ? "✓ Correct" : "✗ Incorrect"}
          </span>
          <ChevronDown size={14} className={cn("text-[#94a3b8] transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#f1f5f9]">
          <p className="text-sm text-[#475569] pt-3">{qr.questionText}</p>
          <div className="flex flex-col gap-2">
            {qr.answerOptions.map((opt) => {
              const isSelected = opt.id === qr.selectedAnswerOptionId;
              const isCorrectAnswer = opt.isCorrect;
              return (
                <div
                  key={opt.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border",
                    isCorrectAnswer
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium"
                      : isSelected && !isCorrectAnswer
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-transparent text-[#475569]"
                  )}
                >
                  <span className="text-xs font-bold w-4 flex-shrink-0">
                    {isCorrectAnswer ? "✓" : isSelected ? "✗" : ""}
                  </span>
                  {opt.text}
                </div>
              );
            })}
          </div>
          <div className="rounded-lg bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2">
            <p className="text-xs font-semibold text-[#0D1B2E] mb-0.5">Explanation</p>
            <p className="text-xs text-[#475569]">{qr.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Test-taking view ─────────────────────────────────────────────────────────

export default function TestPage() {
  const { id } = useParams<{ id: string }>();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [freeTestsUsed, setFreeTestsUsed] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    async function load() {
      // Load user data first so we can pre-check before hitting the backend
      const u = isLoggedIn() ? await getCurrentUser().catch(() => null) : null;
      const userIsPro = u?.subscription === "pro";
      const userIsAdmin = u?.isAdmin ?? false;
      const userFreeUsed = u?.freeTestsUsed ?? 0;
      if (u) {
        setIsPro(userIsPro);
        setIsAdmin(userIsAdmin);
        setFreeTestsUsed(userFreeUsed);
      }

      // Admins bypass all access checks
      if (userIsAdmin) {
        const t = await getTestById(id).catch(() => null);
        setTest(t);
        setLoading(false);
        return;
      }

      // Pre-check: free limit reached → every test is blocked, skip network call
      if (!userIsPro && userFreeUsed >= FREE_TEST_LIMIT) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // Load the full test; catch 403 (pro-only or limit enforced by backend)
      try {
        const t = await getTestById(id);
        setTest(t);
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) setAccessDenied(true);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    if (result) return; // stop timer after submit
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [result]);

  const handleSelect = useCallback((answerId: string) => {
    const question = test?.questions[currentIndex];
    if (!question) return;
    haptics.tap();
    setAnswers((prev) => ({ ...prev, [question.id]: answerId }));
  }, [test, currentIndex]);

  const handleSubmit = async () => {
    if (!test) return;
    setSubmitting(true);
    const payload = Object.entries(answers).map(([questionId, selectedAnswerId]) => ({
      questionId,
      selectedAnswerId,
    }));
    const r = await submitTest(test.id, payload, elapsed);
    haptics.complete();
    setResult(r);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <PageLoader label="Loading test…" />
    );
  }

  // Paywall guard: Pro test for non-pro user, free limit reached, or backend 403
  // Must come before the !test check so 403 shows paywall instead of "not available"
  const blocked = !isAdmin && !isPro && test != null && (!test.isFree || freeTestsUsed >= FREE_TEST_LIMIT);
  if (blocked || accessDenied) {
    const paywallReason = freeTestsUsed >= FREE_TEST_LIMIT ? "free_limit" : "pro_test";

    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <Link href="/tests" className="text-[#64748b] hover:text-[#0D1B2E] transition-colors">
              <ChevronLeft size={20} />
            </Link>
            {test && <p className="text-sm font-semibold text-[#0D1B2E] truncate">{test.title}</p>}
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center shadow-lg">
              <Lock size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-[#0D1B2E] mb-2">
                {paywallReason === "free_limit" ? "Free limit reached" : "Pro test"}
              </h2>
              <p className="text-[#64748b] text-sm leading-relaxed">
                {paywallReason === "free_limit"
                  ? "You've used all 5 free tests. Upgrade to Pro for unlimited access to every test — €4/month."
                  : "This test is part of the Pro plan. Upgrade to access all premium assessments."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
              >
                Upgrade to Pro — €4/mo
              </Link>
              <Link
                href="/tests"
                className="px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold text-sm hover:border-[#4f46e5]/30 hover:text-[#4f46e5] transition-colors"
              >
                Back to tests
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8]">Cancel anytime · No credit card needed to start</p>
          </div>
        </div>
      </div>
    );
  }

  if (!test || test.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4 p-4">
        <p className="font-display font-semibold text-[#0D1B2E] text-xl">Test not available</p>
        <Link href="/tests" className="text-sm text-[#4f46e5] hover:underline">← Back to tests</Link>
      </div>
    );
  }

  if (result) {
    return <TestResultsView result={result} test={test} />;
  }

  const question = test.questions[currentIndex];
  const total = test.questions.length;
  const answered = Object.keys(answers).length;
  const isLastQuestion = currentIndex === total - 1;
  const allAnswered = answered === total;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header bar */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link href="/tests" className="text-[#64748b] hover:text-[#0D1B2E] transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#94a3b8] font-medium truncate">{ASSESSMENT_TYPE_LABELS[test.type]}</p>
            <p className="text-sm font-semibold text-[#0D1B2E] truncate">{test.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-[#475569]">
              <Clock size={15} className="text-[#94a3b8]" />
              {formatTime(elapsed)}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-[#94a3b8]">{answered}/{total}</span>
              <div className="w-24">
                <ProgressBar value={answered} max={total} size="sm" />
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1f5f9] text-xs font-semibold text-[#475569] hover:bg-[#e2e8f0] transition-colors lg:hidden"
            >
              <Flag size={12} />
              Questions
            </button>
          </div>
        </div>
        <div className="sm:hidden px-4 pb-2">
          <ProgressBar value={currentIndex + 1} max={total} size="sm" />
        </div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 gap-8">
        {/* Main content */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <TestQuestionCard
            question={question}
            questionIndex={currentIndex}
            total={total}
            selectedAnswerId={answers[question.id]}
            onSelect={handleSelect}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {test.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  title={answers[q.id] ? `Q${i + 1} — answered` : `Q${i + 1} — not yet answered`}
                  className={cn(
                    "w-7 h-7 rounded-md text-xs font-bold transition-all",
                    i === currentIndex
                      ? "bg-[#0D1B2E] text-white"
                      : answers[q.id]
                      ? "bg-[#4f46e5] text-white"
                      : "bg-[#e2e8f0] text-[#64748b] hover:bg-[#d1d9e0]"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-md"
              >
                <CheckCircle2 size={16} />
                {submitting ? "Submitting..." : "Finish test"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold hover:bg-[#1a2f4a] transition-colors"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {allAnswered && !isLastQuestion && (
            <div className="p-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16a34a]" />
                <span className="text-sm font-medium text-[#166534]">All questions answered</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#16a34a] text-white text-sm font-semibold hover:bg-[#15803d] transition-colors"
              >
                Submit test
              </button>
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="font-semibold text-[#0D1B2E] text-sm mb-1">
              Questions
            </h3>
            <p className="text-xs text-[#94a3b8] mb-3">{answered} of {total} answered</p>
            <div className="grid grid-cols-4 gap-2">
              {test.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  title={answers[q.id] ? `Question ${i + 1} — answered` : `Question ${i + 1} — not yet answered`}
                  className={cn(
                    "w-full aspect-square rounded-lg text-xs font-bold transition-all",
                    i === currentIndex
                      ? "bg-[#0D1B2E] text-white ring-2 ring-[#0D1B2E] ring-offset-1"
                      : answers[q.id]
                      ? "bg-[#4f46e5] text-white"
                      : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-3 flex flex-col gap-1.5 text-[10px] text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#4f46e5] inline-block" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0D1B2E] inline-block" /> Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#e2e8f0] inline-block" /> Not yet answered
              </span>
            </div>
            {allAnswered && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} />
                {submitting ? "Submitting..." : "Finish test"}
              </button>
            )}
            {!allAnswered && (
              <p className="mt-3 text-[10px] text-[#94a3b8] text-center">
                {total - answered} question{total - answered !== 1 ? "s" : ""} left
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
