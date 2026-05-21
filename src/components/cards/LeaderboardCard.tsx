"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { getLeaderboard, LeaderboardEntry } from "@/lib/api";
import { InlineLoader } from "@/components/ui/PageLoader";

const MEDALS = ["🥇", "🥈", "🥉"];

interface LeaderboardCardProps {
  type?: string;
}

export function LeaderboardCard({ type }: LeaderboardCardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(type)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-amber-500" />
        <h3 className="font-display font-semibold text-sm text-[#0D1B2E]">
          Weekly Leaderboard
        </h3>
        <span className="ml-auto text-[10px] font-semibold text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-full">
          This week
        </span>
      </div>

      {loading ? (
        <InlineLoader />
      ) : entries.length === 0 ? (
        <p className="text-xs text-[#94a3b8] text-center py-6">No results yet this week</p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <div
              key={e.rank}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors"
            >
              <span className="text-base w-7 text-center flex-shrink-0">
                {e.rank <= 3 ? MEDALS[e.rank - 1] : <Medal size={14} className="text-[#94a3b8]" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0D1B2E] truncate">{e.displayName}</p>
                <p className="text-[10px] text-[#94a3b8] truncate">{e.testTitle}</p>
              </div>
              <span
                className={`text-sm font-bold flex-shrink-0 ${
                  e.score >= 90
                    ? "text-[#10b981]"
                    : e.score >= 70
                    ? "text-[#4f46e5]"
                    : "text-[#f59e0b]"
                }`}
              >
                {e.score}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
