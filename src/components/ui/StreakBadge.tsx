"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function StreakBadge({
  count,
  size = "md",
  animated = true,
  className,
}: StreakBadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = { sm: 12, md: 16, lg: 20 };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        "bg-amber-50 text-amber-700 border border-amber-200",
        animated && "animate-streak",
        sizes[size],
        className
      )}
    >
      <Flame
        size={iconSizes[size]}
        className="text-amber-500 fill-amber-400"
      />
      <span>{count} day streak</span>
    </div>
  );
}
