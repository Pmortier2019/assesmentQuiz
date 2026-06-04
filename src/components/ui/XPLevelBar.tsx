"use client";

import { useEffect, useRef, useState } from "react";

const LEVELS = [
  { name: "Rookie",       min: 0,    max: 99   },
  { name: "Learner",      min: 100,  max: 249  },
  { name: "Practitioner", min: 250,  max: 499  },
  { name: "Expert",       min: 500,  max: 999  },
  { name: "Master",       min: 1000, max: 9999 },
] as const;

export function getXPLevel(xp: number) {
  const idx = LEVELS.findLastIndex((l) => xp >= l.min);
  const level = LEVELS[Math.max(0, idx)];
  const next  = LEVELS[Math.min(idx + 1, LEVELS.length - 1)];
  const span  = next.min - level.min;
  const progress = level === next ? 100 : Math.round(((xp - level.min) / span) * 100);
  return { levelNum: idx + 1, levelName: level.name, xp, progress, nextXP: next.min };
}

interface XPLevelBarProps {
  xp: number;
  compact?: boolean;
}

export function XPLevelBar({ xp, compact = false }: XPLevelBarProps) {
  const { levelNum, levelName, progress, nextXP } = getXPLevel(xp);
  const [displayed, setDisplayed] = useState(0);
  const started = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime: number | null = null;
          const duration = 900;
          function tick(now: number) {
            if (!startTime) startTime = now;
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplayed(Math.round(eased * progress));
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [progress]);

  if (compact) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-[#4f46e5]">Lv.{levelNum} {levelName}</span>
          <span className="text-[10px] text-subtle">{xp} / {nextXP} XP</span>
        </div>
        <div ref={barRef} className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] transition-none"
            style={{ width: `${displayed}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-bold">{levelNum}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-default">{levelName}</p>
            <p className="text-[10px] text-subtle">Level {levelNum}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-[#4f46e5]">{xp} XP</p>
          <p className="text-[10px] text-subtle">→ {nextXP} XP</p>
        </div>
      </div>

      <div ref={barRef} className="h-2 bg-surface-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]"
          style={{ width: `${displayed}%`, transition: "width 0.05s linear" }}
        />
      </div>

      <p className="text-[10px] text-subtle">{progress}% to next level</p>
    </div>
  );
}
