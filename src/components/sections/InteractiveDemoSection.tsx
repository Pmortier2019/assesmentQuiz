"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  RotateCcw,
  ArrowRight,
  MessageSquarePlus,
  Star,
} from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useProfession } from "./PersonalizedExperience";
import { questionForRole, type DemoQuestion } from "@/lib/professionDemo";

// A self-contained product demo: a single real-style assessment question the
// visitor can actually answer. The question follows the profession picked in the
// hero, so the demo proves the "tailored to your profession" promise instead of
// just claiming it. After answering we reveal the explanation and a small
// "result preview" — an honest demo of how one question scores, NOT aggregate
// social-proof numbers.

export function InteractiveDemoSection() {
  const { role } = useProfession();
  const question = questionForRole(role);
  const onboardingHref = role ? `/onboarding?role=${encodeURIComponent(role)}` : "/onboarding";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF1FF] border border-[#BFD6FF] mb-4">
            <Sparkles size={13} className="text-[#2D7BFF]" />
            <span className="text-xs font-semibold text-[#2D7BFF]">Try it yourself, no sign-up</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-3">
            See how it works
          </h2>
          <p className="text-[#64748b] max-w-xl mx-auto">
            Answer one real-style question. You&apos;ll get instant scoring and an explanation,
            exactly how every practice test ends.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Keyed by question so picking a new profession resets the demo state. */}
          <DemoCard key={question.practiceSlug} question={question} onboardingHref={onboardingHref} />

          {/* Honest "be the first to review" note — kept until real reviews exist */}
          <div className="flex flex-col items-center gap-3 mt-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF1FF] flex items-center justify-center">
              <MessageSquarePlus size={22} className="text-[#2D7BFF]" />
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-[#e2e8f0] fill-[#e2e8f0]" />
              ))}
            </div>
            <p className="text-sm text-[#64748b] max-w-sm">
              Be the first to review. Real reviews from real users, nothing made up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCard({ question, onboardingHref }: { question: DemoQuestion; onboardingHref: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = question.answers.find((a) => a.isCorrect)!;
  const isRight = selected === correct.id;

  function reset() {
    setSelected(null);
    setRevealed(false);
  }

  return (
    <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-sm p-6 sm:p-8">
            <p className="text-xs font-semibold text-[#2D7BFF] uppercase tracking-wide mb-2">
              {question.eyebrow}
            </p>
            <p className="text-[#0D1B2E] font-medium mb-1">{question.prompt}</p>
            {question.sequence && (
              <p className="font-display font-extrabold text-2xl text-[#0D1B2E] tracking-wide mb-6">
                {question.sequence}
              </p>
            )}

            <div className={`grid gap-3 ${question.layout === "list" ? "grid-cols-1 mt-5" : "grid-cols-2 mt-6"}`}>
              {question.answers.map((a) => {
                const isSelected = selected === a.id;
                const showCorrect = revealed && a.isCorrect;
                const showWrong = revealed && isSelected && !a.isCorrect;

                let cls =
                  "border-[#e2e8f0] hover:border-[#2D7BFF]/50 text-[#475569]";
                if (showCorrect) cls = "border-[#10b981] bg-[#f0fdf4] text-[#047857]";
                else if (showWrong) cls = "border-[#ef4444] bg-[#fef2f2] text-[#b91c1c]";
                else if (isSelected) cls = "border-[#2D7BFF] bg-[#EAF1FF] text-[#1D63E6]";

                return (
                  <button
                    key={a.id}
                    type="button"
                    disabled={revealed}
                    onClick={() => setSelected(a.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border font-semibold text-left transition-colors disabled:cursor-default ${cls}`}
                  >
                    <span>{a.text}</span>
                    {showCorrect && <CheckCircle2 size={18} className="text-[#10b981] shrink-0" />}
                    {showWrong && <XCircle size={18} className="text-[#ef4444] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {!revealed ? (
              <button
                type="button"
                disabled={!selected}
                onClick={() => setRevealed(true)}
                className="mt-6 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check my answer
              </button>
            ) : (
              <div className="mt-6 space-y-4 animate-fade-up" role="status" aria-live="polite">
                {/* Result preview — a demo of the instant-scoring screen */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <Target size={16} className={isRight ? "text-[#10b981]" : "text-[#ef4444]"} />
                    <p className={`font-display font-extrabold text-lg ${isRight ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {isRight ? "100%" : "0%"}
                    </p>
                    <p className="text-[11px] text-[#94a3b8]">Score</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <Clock size={16} className="text-[#2D7BFF]" />
                    <p className="font-display font-extrabold text-lg text-[#0D1B2E]">~30s</p>
                    <p className="text-[11px] text-[#94a3b8]">Per question</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <CheckCircle2 size={16} className="text-[#10b981]" />
                    <p className="font-display font-extrabold text-lg text-[#0D1B2E]">1/1</p>
                    <p className="text-[11px] text-[#94a3b8]">Explained</p>
                  </div>
                </div>

                {/* Explanation */}
                <div className={`rounded-xl p-4 border ${isRight ? "border-[#bbf7d0] bg-[#f0fdf4]" : "border-[#fecaca] bg-[#fef2f2]"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {isRight ? (
                      <CheckCircle2 size={16} className="text-[#10b981]" />
                    ) : (
                      <XCircle size={16} className="text-[#ef4444]" />
                    )}
                    <span className={`text-sm font-semibold ${isRight ? "text-[#047857]" : "text-[#b91c1c]"}`}>
                      {isRight ? "Correct!" : `Not quite, the answer is ${correct.text}.`}
                    </span>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">{question.explanation}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={onboardingHref}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Start your first free test
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#e2e8f0] text-[#475569] text-sm font-semibold hover:border-[#2D7BFF]/40 hover:text-[#2D7BFF] transition-colors"
                  >
                    <RotateCcw size={15} />
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
  );
}
