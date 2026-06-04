"use client";

import { Trophy, Flame, Star, Zap } from "lucide-react";
import type { TestResult } from "@/lib/types";

interface Badge {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  earned: boolean;
  color: string;
  bg: string;
}

interface AchievementBadgesProps {
  results: TestResult[];
  streak: number;
}

export function AchievementBadges({ results, streak }: AchievementBadgesProps) {
  const hasPerfect     = results.some((r) => r.score === 100);
  const firstTest      = results.length >= 1;
  const sevenStreak    = streak >= 7;
  const speedDemon     = results.some((r) => {
    const questions = r.answers?.length ?? 0;
    return questions > 0 && r.timeTaken < questions * 20;
  });

  const badges: Badge[] = [
    {
      id: "first_test",
      icon: <Trophy size={18} />,
      label: "First Test",
      desc: "Completed your first assessment",
      earned: firstTest,
      color: "text-[#4f46e5]",
      bg: "bg-[#eef2ff]",
    },
    {
      id: "seven_streak",
      icon: <Flame size={18} />,
      label: "7-Day Streak",
      desc: "Practiced 7 days in a row",
      earned: sevenStreak,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "perfect_score",
      icon: <Star size={18} />,
      label: "Perfect Score",
      desc: "Scored 100% on any test",
      earned: hasPerfect,
      color: "text-[#10b981]",
      bg: "bg-[#f0fdf4]",
    },
    {
      id: "speed_demon",
      icon: <Zap size={18} />,
      label: "Speed Demon",
      desc: "Finished a test in under 20s/question",
      earned: speedDemon,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
    },
  ];

  return (
    <div className="card p-4">
      <h3 className="font-display font-semibold text-sm text-default mb-3">Achievements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
              badge.earned
                ? "border-transparent shadow-sm"
                : "border-line opacity-40 grayscale"
            }`}
            style={badge.earned ? { background: "white" } : {}}
            title={badge.earned ? badge.desc : `Locked: ${badge.desc}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.earned ? badge.bg : "bg-surface-muted"}`}>
              <span className={badge.earned ? badge.color : "text-subtle"}>{badge.icon}</span>
            </div>
            <p className={`text-[11px] font-semibold leading-tight ${badge.earned ? "text-default" : "text-subtle"}`}>
              {badge.label}
            </p>
            {!badge.earned && (
              <p className="text-[9px] text-[#cbd5e1]">Locked</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
