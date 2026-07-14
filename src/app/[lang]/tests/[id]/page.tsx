"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import {
  ChevronLeft, ChevronRight, Clock, CheckCircle2, Flag,
  Trophy, TrendingUp, AlertCircle, ChevronDown, ArrowRight, Lightbulb, Lock,
  Check, X,
} from "lucide-react";
import { getTestById, submitTest, getCurrentUser, ApiError } from "@/lib/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { haptics } from "@/lib/haptics";
import { isLoggedIn } from "@/lib/auth";
import { FREE_TEST_LIMIT } from "@/lib/constants";
import { freeLimitReached, isTestBlocked, paywallReasonFor } from "@/lib/paywall";
import { loadProgress, saveProgress, clearProgress } from "@/lib/testProgress";
import { useT } from "@/lib/i18n";
import { TestQuestionCard } from "@/components/test/TestQuestionCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn, formatTime, ASSESSMENT_TYPE_LABELS, getScoreColor } from "@/lib/utils";
import type { Test, TestResult, QuestionResult } from "@/lib/types";

const PASS_THRESHOLD = 70;

// ─── Results view ─────────────────────────────────────────────────────────────

function TestResultsView({ result, test }: { result: TestResult; test: Test }) {
  const { t } = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const passed = result.score >= PASS_THRESHOLD;
  const correct = result.answers.filter((a) => a.isCorrect).length;
  const total = result.answers.length || result.questionResults?.length || 0;
  const estimatedSecs = test.estimatedTime * 60;
  const timeDelta = estimatedSecs - result.timeTaken;

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Header */}
      <header className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-subtle font-medium">{ASSESSMENT_TYPE_LABELS[test.type]}</p>
            <p className="text-sm font-semibold text-default truncate">{test.title}</p>
          </div>
          <Link
            href="/results"
            className="text-xs text-[#2D7BFF] font-semibold hover:underline flex items-center gap-1"
          >
            {t("tt_all_results")} <ArrowRight size={12} />
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
                  <stop offset="0%" stopColor="#2D7BFF" />
                  <stop offset="100%" stopColor="#1D63E6" />
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
              {passed ? t("tt_passed") : t("tt_not_passed")}
            </div>
            <p className="text-muted text-sm">
              {t("tt_pass_mark", { mark: PASS_THRESHOLD, correct, total })}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 animate-fade-up delay-100">
          <div className="card p-4 flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 rounded-xl bg-[#EAF1FF] flex items-center justify-center">
              <Trophy size={18} className="text-[#2D7BFF]" />
            </div>
            <p className="font-display font-bold text-lg text-default">{result.score}%</p>
            <p className="text-xs text-subtle">{t("tt_your_score")}</p>
          </div>

          <div className="card p-4 flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={18} className="text-amber-500" />
            </div>
            <p className="font-display font-bold text-lg text-default">{formatTime(result.timeTaken)}</p>
            <p className={cn("text-xs font-medium", timeDelta >= 0 ? "text-emerald-600" : "text-rose-500")}>
              {timeDelta >= 0
                ? t("tt_under_target", { time: formatTime(timeDelta) })
                : t("tt_over_target", { time: formatTime(Math.abs(timeDelta)) })}
            </p>
          </div>

          <div className="card p-4 flex flex-col items-center gap-1.5 text-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            <p className="font-display font-bold text-lg text-default">{correct}/{total}</p>
            <p className="text-xs text-subtle">{t("tt_correct")}</p>
          </div>
        </div>

        {/* Feedback */}
        {result.aiFeedback && (
          <div className="card p-4 border-l-4 border-[#2D7BFF] animate-fade-up delay-200">
            <p className="text-sm font-semibold text-default mb-1">{t("tt_feedback")}</p>
            <p className="text-sm text-body">{result.aiFeedback}</p>
          </div>
        )}

        {/* Tips to improve */}
        {result.tips && result.tips.length > 0 && (
          <div className="card p-5 animate-fade-up delay-250">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lightbulb size={16} className="text-amber-500" />
              </div>
              <h2 className="font-display font-semibold text-base text-default">{t("tt_tips")}</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {result.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-body leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Per-question breakdown */}
        {result.questionResults && result.questionResults.length > 0 && (
          <div className="flex flex-col gap-3 animate-fade-up delay-300">
            <h2 className="font-display font-semibold text-base text-default">{t("results_q_review")}</h2>
            {result.questionResults.map((qr, i) => (
              <QuestionReviewCard
                key={qr.questionId}
                qr={qr}
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
            className="flex-1 py-3 rounded-xl border border-line text-sm font-semibold text-body hover:bg-surface-subtle transition-colors text-center"
          >
            {t("results_back")}
          </Link>
          <Link
            href={`/tests/${test.id}`}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 transition-opacity text-center"
          >
            {t("tt_try_again")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuestionReviewCard({
  qr, open, onToggle,
}: {
  qr: QuestionResult; open: boolean; onToggle: () => void;
}) {
  const { t } = useT();
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden transition-colors",
      qr.isCorrect ? "border-emerald-200" : "border-rose-200"
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-subtle transition-colors"
      >
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white flex-shrink-0",
          qr.isCorrect ? "bg-emerald-500" : "bg-rose-400"
        )}>
          {qr.isCorrect ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
        </div>
        <p className="flex-1 text-sm font-medium text-default line-clamp-1">{qr.questionText}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
            qr.isCorrect
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-rose-600 bg-rose-50 border border-rose-200"
          )}>
            {qr.isCorrect ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
            {qr.isCorrect ? t("tt_correct") : t("tt_incorrect")}
          </span>
          <ChevronDown size={14} className={cn("text-subtle transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-line">
          <p className="text-sm text-body pt-3">{qr.questionText}</p>
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
                      : "border-transparent text-body"
                  )}
                >
                  <span className="w-4 flex-shrink-0 flex items-center justify-center">
                    {isCorrectAnswer ? <Check size={13} strokeWidth={3} className="text-emerald-600" /> : isSelected ? <X size={13} strokeWidth={3} className="text-rose-500" /> : null}
                  </span>
                  {opt.text}
                </div>
              );
            })}
          </div>
          <div className="rounded-lg bg-surface-subtle border border-line px-3 py-2">
            <p className="text-xs font-semibold text-default mb-0.5">{t("results_explanation")}</p>
            <p className="text-xs text-body">{qr.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Test-taking view ─────────────────────────────────────────────────────────

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const { t, plural } = useT();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
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

      // Show the test and resume any saved attempt for this testId, or start fresh.
      function startTest(t: Test | null) {
        setTest(t);
        if (t && t.questions.length > 0) {
          const saved = loadProgress(id);
          if (saved) {
            setAnswers(saved.answers);
            setCurrentIndex(Math.min(saved.currentIndex, t.questions.length - 1));
            setStartedAt(saved.startedAt);
          } else {
            setStartedAt(Date.now());
          }
        }
        setLoading(false);
      }

      // Admins bypass all access checks
      if (userIsAdmin) {
        const t = await getTestById(id).catch(() => null);
        startTest(t);
        return;
      }

      // Pre-check: free limit reached → every test is blocked, skip network call
      if (freeLimitReached({ isAdmin: userIsAdmin, isPro: userIsPro, freeTestsUsed: userFreeUsed })) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // Load the full test; catch 403 (pro-only or limit enforced by backend)
      try {
        const t = await getTestById(id);
        startTest(t);
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) setAccessDenied(true);
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Timer is derived from the absolute start time so it stays correct across a refresh.
  useEffect(() => {
    if (result || startedAt == null) return; // stop timer after submit
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [result, startedAt]);

  // Persist progress so a refresh / crash mid-test doesn't lose answers.
  useEffect(() => {
    if (!test || result || startedAt == null) return;
    saveProgress(id, { answers, currentIndex, startedAt });
  }, [id, test, result, answers, currentIndex, startedAt]);

  const handleSelect = useCallback((answerId: string) => {
    const question = test?.questions[currentIndex];
    if (!question) return;
    haptics.tap();
    setAnswers((prev) => ({ ...prev, [question.id]: answerId }));
  }, [test, currentIndex]);

  // Keyboard shortcuts during the test: ← / → navigate, number keys pick an
  // answer. Skipped once results are shown or while typing in a field.
  useEffect(() => {
    if (!test || result) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const q = test.questions[currentIndex];
      if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(test.questions.length - 1, i + 1));
      } else if (q && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < q.answers.length) {
          e.preventDefault();
          handleSelect(q.answers[idx].id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [test, result, currentIndex, handleSelect]);

  const handleSubmit = async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = Object.entries(answers).map(([questionId, selectedAnswerId]) => ({
        questionId,
        selectedAnswerId,
      }));
      const timeTaken = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : elapsed;
      const r = await submitTest(test.id, payload, timeTaken);
      clearProgress(test.id);
      haptics.complete();
      setResult(r);
    } catch (err) {
      // A 403 means the backend re-checked the paywall at submit time (e.g. the
      // free limit was reached meanwhile in another tab) — retrying can't
      // succeed, so show the paywall instead of a retryable error. Answers stay
      // in sessionStorage either way. Mirrors the load-time 403 handling.
      if (err instanceof ApiError && err.status === 403) {
        setAccessDenied(true);
      } else {
        setSubmitError(t("tt_submit_failed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLoader label={t("tt_loading")} />
    );
  }

  // Paywall guard: Pro test for non-pro user, free limit reached, or backend 403
  // Must come before the !test check so 403 shows paywall instead of "not available"
  const blocked = test != null && isTestBlocked({ isAdmin, isPro, isFree: test.isFree, freeTestsUsed });
  if (blocked || accessDenied) {
    const paywallReason = paywallReasonFor(freeTestsUsed);

    return (
      <div className="min-h-screen bg-surface-subtle flex flex-col">
        <header className="bg-surface border-b border-line">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <Link href="/tests" className="text-muted hover:text-default transition-colors">
              <ChevronLeft size={20} />
            </Link>
            {test && <p className="text-sm font-semibold text-default truncate">{test.title}</p>}
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center shadow-lg">
              <Lock size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-default mb-2">
                {paywallReason === "free_limit" ? t("tt_free_limit_title") : t("tt_pro_test_title")}
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                {paywallReason === "free_limit"
                  ? t("tt_free_limit_desc", { limit: FREE_TEST_LIMIT })
                  : t("tt_pro_test_desc")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
              >
                {t("tt_upgrade_price")}
              </Link>
              <Link
                href="/tests"
                className="px-6 py-3 rounded-xl border border-line text-body font-semibold text-sm hover:border-[#2D7BFF]/30 hover:text-[#2D7BFF] transition-colors"
              >
                {t("results_back")}
              </Link>
            </div>
            <p className="text-xs text-subtle">{t("tt_cancel_anytime")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!test || test.questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center gap-4 p-4">
        <p className="font-display font-semibold text-default text-xl">{t("tt_test_not_available")}</p>
        <Link href="/tests" className="text-sm text-[#2D7BFF] hover:underline">← {t("results_back")}</Link>
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
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      {/* Header bar */}
      <header className="bg-surface border-b border-line sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link href="/tests" className="text-muted hover:text-default transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-subtle font-medium truncate">{ASSESSMENT_TYPE_LABELS[test.type]}</p>
            <p className="text-sm font-semibold text-default truncate">{test.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-body">
              <Clock size={15} className="text-subtle" />
              {formatTime(elapsed)}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-subtle">{answered}/{total}</span>
              <div className="w-24">
                <ProgressBar value={answered} max={total} size="sm" />
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted text-xs font-semibold text-body hover:bg-line transition-colors lg:hidden"
            >
              <Flag size={12} />
              {t("tt_questions")}
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line text-sm font-semibold text-body hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              {t("tt_previous")}
            </button>

            <div className="hidden sm:flex items-center gap-1" role="group" aria-label={t("tt_questions")}>
              {test.questions.map((q, i) => {
                const stateLabel = i === currentIndex
                  ? t("tt_legend_current")
                  : answers[q.id] ? t("tt_legend_answered") : t("tt_legend_not_answered");
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={t("tt_question_title", { n: i + 1, state: stateLabel })}
                    aria-current={i === currentIndex ? "step" : undefined}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-bold transition-all",
                      i === currentIndex
                        ? "bg-[#0D1B2E] text-white"
                        : answers[q.id]
                        ? "bg-[#2D7BFF] text-white"
                        : "bg-line text-muted hover:bg-[#d1d9e0]"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-md"
              >
                <CheckCircle2 size={16} />
                {submitting ? t("tt_submitting") : t("tt_finish")}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold hover:bg-[#1a2f4a] transition-colors"
              >
                {t("tt_next")}
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          <p className="hidden sm:block text-xs text-subtle text-center">{t("tt_kbd_hint")}</p>

          {allAnswered && !isLastQuestion && (
            <div className="p-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16a34a]" />
                <span className="text-sm font-medium text-[#166534]">{t("tt_all_answered")}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#16a34a] text-white text-sm font-semibold hover:bg-[#15803d] transition-colors"
              >
                {t("tt_submit")}
              </button>
            </div>
          )}

          {submitError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in">
              {submitError}
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="font-semibold text-default text-sm mb-1">
              {t("tt_questions")}
            </h3>
            <p className="text-xs text-subtle mb-3">{t("tt_answered_of", { a: answered, t: total })}</p>
            <div className="grid grid-cols-4 gap-2" role="group" aria-label={t("tt_questions")}>
              {test.questions.map((q, i) => {
                const stateLabel = i === currentIndex
                  ? t("tt_legend_current")
                  : answers[q.id] ? t("tt_legend_answered") : t("tt_legend_not_answered");
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={t("tt_question_title", { n: i + 1, state: stateLabel })}
                    aria-current={i === currentIndex ? "step" : undefined}
                    className={cn(
                      "w-full aspect-square rounded-lg text-xs font-bold transition-all",
                      i === currentIndex
                        ? "bg-[#0D1B2E] text-white ring-2 ring-[#0D1B2E] ring-offset-1"
                        : answers[q.id]
                        ? "bg-[#2D7BFF] text-white"
                        : "bg-surface-muted text-muted hover:bg-line"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 flex flex-col gap-1.5 text-[10px] text-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#2D7BFF] inline-block" /> {t("tt_legend_answered")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0D1B2E] inline-block" /> {t("tt_legend_current")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-line inline-block" /> {t("tt_legend_not_answered")}
              </span>
            </div>
            {allAnswered && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} />
                {submitting ? t("tt_submitting") : t("tt_finish")}
              </button>
            )}
            {!allAnswered && (
              <p className="mt-3 text-[10px] text-subtle text-center">
                {plural(total - answered, { one: "tt_questions_left_one", other: "tt_questions_left_other" })}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
