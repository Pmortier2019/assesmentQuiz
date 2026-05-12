import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pro" | "ai" | "free" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
  pro:     "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white border-transparent",
  ai:      "bg-[#f0f0ff] text-[#4f46e5] border-[#c7d2fe]",
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
