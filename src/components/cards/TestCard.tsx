"use client";

import Link from "next/link";
import { Clock, Lock, Sparkles, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn, ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_ICONS, DIFFICULTY_COLORS, DIFFICULTY_LABELS, formatDuration } from "@/lib/utils";
import type { Test } from "@/lib/types";

interface TestCardProps {
  test: Test;
  isLocked?: boolean;
  onStart?: (id: string) => void;
  className?: string;
  showRecommendedBadge?: boolean;
}

export function TestCard({ test, isLocked = false, onStart, className, showRecommendedBadge }: TestCardProps) {
  const locked = isLocked || (!test.isFree);
  const isRecommended = showRecommendedBadge ?? test.isRecommended;

  return (
    <div
      className={cn(
        "card card-interactive group relative overflow-hidden p-5 flex flex-col gap-4",
        locked ? "opacity-80" : "",
        className
      )}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#4f46e5] bg-[#eef2ff] border border-[#c7d2fe] px-2 py-0.5 rounded-full uppercase tracking-wider">
            <Star size={9} /> Best match
          </span>
        </div>
      )}

      {/* AI badge */}
      {test.isGeneratedByAI && (
        <div className={cn("absolute top-3", isRecommended ? "right-3" : "right-3")}>
          <Badge variant="ai" size="sm">
            <Sparkles size={10} />
            AI
          </Badge>
        </div>
      )}

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold shadow-lg"
          >
            <Lock size={14} />
            Unlock Pro
          </Link>
        </div>
      )}

      {/* Icon + type */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-xl">
          {ASSESSMENT_TYPE_ICONS[test.type]}
        </div>
        {locked ? (
          <Lock size={16} className="text-[#94a3b8] mt-1" />
        ) : (
          <Badge variant="free" size="sm">Free</Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-[#64748b]">
            {ASSESSMENT_TYPE_LABELS[test.type]}
          </span>
        </div>
        <h3 className="font-display font-semibold text-[#0D1B2E] text-base leading-snug mb-2 line-clamp-2">
          {test.title}
        </h3>
        <p className="text-sm text-[#64748b] line-clamp-2 leading-relaxed">
          {test.description}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-3">
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", DIFFICULTY_COLORS[test.difficulty])}>
            {DIFFICULTY_LABELS[test.difficulty]}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#94a3b8]">
            <Clock size={12} />
            {formatDuration(test.estimatedTime)}
          </span>
        </div>
        <span className="text-xs text-[#94a3b8]">
          {test.questions.length} q
        </span>
      </div>

      {/* CTA */}
      {!locked && (
        <Link
          href={`/tests/${test.id}`}
          onClick={() => onStart?.(test.id)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold hover:bg-[#1a2f4a] transition-colors group"
        >
          Start test
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
      {locked && (
        <Link
          href="/pricing"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#f1f5f9] text-[#64748b] text-sm font-semibold hover:bg-[#eef2ff] hover:text-[#4f46e5] transition-colors"
        >
          <Lock size={14} />
          Unlock with Pro
        </Link>
      )}
    </div>
  );
}
