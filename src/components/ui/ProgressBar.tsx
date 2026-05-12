"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;      // 0–100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "gradient";
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  variant = "gradient",
  className,
  animated = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  const fills = {
    default: "bg-[#4f46e5]",
    success: "bg-[#10b981]",
    warning: "bg-[#f59e0b]",
    gradient: "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-[#475569]">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-[#0D1B2E]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-[#e2e8f0] rounded-full overflow-hidden",
          heights[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full",
            fills[variant],
            animated && "transition-all duration-700 ease-out"
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
