import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pro" | "ai" | "free" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-surface-muted text-body border-line",
  pro:     "bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white border-transparent",
  ai:      "bg-[#f0f0ff] text-[#2D7BFF] border-[#BFD6FF]",
  free:    "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
  success: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
  warning: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
  danger:  "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]",
};

const sizes = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold rounded-full border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
