"use client";

import { cn } from "@/lib/utils";
import { MediaRenderer } from "./MediaRenderer";
import type { Question, AnswerOption } from "@/lib/types";

interface TestQuestionCardProps {
  question: Question;
  questionIndex: number;
  total: number;
  selectedAnswerId?: string;
  showExplanation?: boolean;
  onSelect: (answerId: string) => void;
}

export function TestQuestionCard({
  question,
  questionIndex,
  total,
  selectedAnswerId,
  showExplanation = false,
  onSelect,
}: TestQuestionCardProps) {
  const getAnswerState = (answer: AnswerOption) => {
    if (!showExplanation) {
      return selectedAnswerId === answer.id ? "selected" : "default";
    }
    if (answer.isCorrect) return "correct";
    if (selectedAnswerId === answer.id && !answer.isCorrect) return "wrong";
    return "default";
  };

  const answerStyles = {
    default:   "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40 hover:bg-[#f8faff] cursor-pointer",
    selected:  "border-[#4f46e5] bg-[#eef2ff] cursor-pointer",
    correct:   "border-[#10b981] bg-[#f0fdf4] cursor-default",
    wrong:     "border-[#f43f5e] bg-[#fff1f2] cursor-default",
  };

  const answerLabelStyles = {
    default:  "bg-[#f1f5f9] text-[#64748b]",
    selected: "bg-[#4f46e5] text-white",
    correct:  "bg-[#10b981] text-white",
    wrong:    "bg-[#f43f5e] text-white",
  };

  const labels = ["A", "B", "C", "D", "E"];

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Question header */}
      <div>
        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">
          Question {questionIndex + 1} of {total}
        </p>
        <h2 className="font-display font-semibold text-[#0D1B2E] text-lg leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      {/* Media */}
      {question.media && question.media.length > 0 && (
        <MediaRenderer items={question.media} />
      )}

      {/* Answer options */}
      <div className="flex flex-col gap-3">
        {question.answers.map((answer, idx) => {
          const state = getAnswerState(answer);
          return (
            <button
              key={answer.id}
              onClick={() => !showExplanation && onSelect(answer.id)}
              disabled={showExplanation}
              className={cn(
                "flex items-start gap-4 w-full text-left p-4 rounded-xl border-2 transition-all duration-150",
                answerStyles[state]
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors",
                  answerLabelStyles[state]
                )}
              >
                {labels[idx] ?? idx + 1}
              </span>
              <span className="text-sm font-medium text-[#334155] leading-relaxed pt-0.5">
                {answer.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="rounded-xl border border-[#c7d2fe] bg-[#eef2ff] p-4 animate-fade-in">
          <p className="text-xs font-semibold text-[#4f46e5] uppercase tracking-wide mb-2">Explanation</p>
          <p className="text-sm text-[#334155] leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
