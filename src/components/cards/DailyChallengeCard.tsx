"use client";

import Link from "next/link";
import { Zap, Clock, ChevronRight } from "lucide-react";
import type { Test } from "@/lib/types";
import { ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_ICONS, formatDuration } from "@/lib/utils";

interface DailyChallengeCardProps {
  test: Test;
}

export function DailyChallengeCard({ test }: DailyChallengeCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B2E] to-[#1a2f4a] p-6 text-white">
      {/* bg decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#4f46e5]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7c3aed]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4f46e5]/30 border border-[#4f46e5]/40">
            <Zap size={12} className="text-[#818cf8] fill-[#818cf8]" />
            <span className="text-xs font-semibold text-[#a5b4fc]">Daily Challenge</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{ASSESSMENT_TYPE_ICONS[test.type]}</span>
          <div>
            <p className="text-xs text-white/50 font-medium mb-0.5">{ASSESSMENT_TYPE_LABELS[test.type]}</p>
            <h3 className="font-display font-bold text-lg leading-tight">{test.title}</h3>
          </div>
        </div>

        <p className="text-sm text-white/60 mb-5 leading-relaxed">{test.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDuration(test.estimatedTime)}
            </span>
            <span>{test.questions.length} questions</span>
          </div>

          <Link
            href={`/tests/${test.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start now
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
