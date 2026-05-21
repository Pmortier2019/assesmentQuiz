"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakBadge({ count, size = "md", className }: StreakBadgeProps) {
  const isHot  = count >= 3;
  const isBlue = count >= 7;

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };
  const iconSizes = { sm: 12, md: 16, lg: 20 };

  const badgeCls = isBlue
    ? "bg-[#ede9fe] text-[#5b21b6] border-[#c4b5fd] streak-badge-blue"
    : isHot
    ? "bg-amber-50 text-amber-700 border-amber-200 streak-badge-hot"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const flameCls = isBlue
    ? "streak-flame-blue"
    : isHot
    ? "streak-flame-hot"
    : "text-amber-400 fill-amber-300";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold border",
        sizes[size],
        badgeCls,
        className,
      )}
    >
      <span className={cn("flex items-center", isHot && "streak-flame-wrap")}>
        <Flame
          size={isBlue ? iconSizes[size] + 4 : isHot ? iconSizes[size] + 2 : iconSizes[size]}
          className={flameCls}
        />
      </span>
      <span>{count} day{count !== 1 ? "s" : ""}</span>
    </div>
  );
}
