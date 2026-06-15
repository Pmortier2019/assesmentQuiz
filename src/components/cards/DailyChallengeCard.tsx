"use client";

import { useEffect, useState } from "react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Zap, Clock, ChevronRight, Timer } from "lucide-react";
import type { Test } from "@/lib/types";
import { AssessmentTypeIcon } from "@/components/ui/AssessmentTypeIcon";
import { ASSESSMENT_TYPE_LABELS, formatDuration } from "@/lib/utils";

function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function calc() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface DailyChallengeCardProps {
  test: Test;
}

export function DailyChallengeCard({ test }: DailyChallengeCardProps) {
  const { h, m, s } = useCountdownToMidnight();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B2E] to-[#1a2f4a] p-6 text-white">
      {/* bg decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#2D7BFF]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1D63E6]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2D7BFF]/30 border border-[#2D7BFF]/40">
            <Zap size={12} className="text-[#5E97FF] fill-[#5E97FF]" />
            <span className="text-xs font-semibold text-[#93BBFF]">Daily Challenge</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
            <Timer size={11} className="text-white/60" />
            <span className="text-xs font-mono font-semibold text-white/80 tabular-nums">
              {pad(h)}:{pad(m)}:{pad(s)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
            <AssessmentTypeIcon type={test.type} size={22} className="text-white" />
          </div>
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start now
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
