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
  // Determine if selected answer is wrong (mid-test feedback)
  const getAnswerState = (answer: AnswerOption) => {
    if (!showExplanation) {
      return selectedAnswerId === answer.id ? "selected" : "default";
    }
    if (answer.isCorrect) return "correct";
    if (selectedAnswerId === answer.id && !answer.isCorrect) return "wrong";
    return "default";
  };

  const answerStyles = {
    default:   "border-line bg-surface hover:border-[#4f46e5]/50 hover:bg-[#f8faff] hover:shadow-sm cursor-pointer",
    selected:  "border-[#4f46e5] bg-[#eef2ff] shadow-sm cursor-pointer ring-1 ring-[#4f46e5]/20",
    correct:   "border-[#10b981] bg-[#f0fdf4] cursor-default",
    wrong:     "border-[#f43f5e] bg-[#fff1f2] cursor-default",
  };

  const answerLabelStyles = {
    default:  "bg-surface-muted text-muted",
    selected: "bg-[#4f46e5] text-white",
    correct:  "bg-[#10b981] text-white",
    wrong:    "bg-[#f43f5e] text-white",
  };

  const answerTextStyles = {
    default:  "text-body",
    selected: "text-[#1e1b4b] font-semibold",
    correct:  "text-[#166534] font-semibold",
    wrong:    "text-[#9f1239]",
  };

  const labels = ["A", "B", "C", "D", "E"];

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Question header */}
      <div>
        <p className="text-xs font-semibold text-subtle uppercase tracking-widest mb-3">
          Question {questionIndex + 1} of {total}
        </p>
        <h2 className="font-display font-semibold text-default text-lg leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      {/* Media */}
      {question.media && question.media.length > 0 && (
        <MediaRenderer items={question.media} />
      )}

      {/* Answer options */}
      <div className="flex flex-col gap-2.5">
        {!showExplanation && !selectedAnswerId && (
          <p className="text-xs font-medium text-subtle flex items-center gap-1.5 mb-1">
            <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-[#cbd5e1]" />
            Choose one answer below
          </p>
        )}
        {question.answers.map((answer, idx) => {
          const state = getAnswerState(answer);
          const isSelected = state === "selected";
          const isCorrect = state === "correct";
          const isWrong = state === "wrong";
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
              {/* Radio-style indicator */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                <span
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    answerLabelStyles[state]
                  )}
                >
                  {isCorrect ? "✓" : isWrong ? "✗" : labels[idx] ?? idx + 1}
                </span>
                {!showExplanation && (
                  <span className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all",
                    isSelected
                      ? "border-[#4f46e5] bg-[#4f46e5]"
                      : "border-[#cbd5e1] bg-transparent"
                  )} />
                )}
              </div>
              <span className={cn(
                "text-sm leading-relaxed pt-0.5 transition-colors",
                answerTextStyles[state]
              )}>
                {answer.text}
              </span>
              {isSelected && !showExplanation && (
                <span className="ml-auto flex-shrink-0 text-[#4f46e5] text-xs font-semibold pt-0.5">Selected</span>
              )}
            </button>
          );
        })}
      </div>


      {/* Explanation (post-submit) */}
      {showExplanation && (
        <div className="rounded-xl border border-[#c7d2fe] bg-[#eef2ff] p-4 animate-fade-in">
          <p className="text-xs font-semibold text-[#4f46e5] uppercase tracking-wide mb-2">Explanation</p>
          <p className="text-sm text-body leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
