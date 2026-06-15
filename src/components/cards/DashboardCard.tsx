import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string; unit?: string };
  children?: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-[#2D7BFF]",
  iconBg = "bg-[#EAF1FF]",
  trend,
  children,
  className,
}: DashboardCardProps) {
  return (
    <div className={cn("card p-5 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="font-display font-bold text-2xl text-default mt-0.5 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-subtle mt-0.5">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-semibold",
              trend.value >= 0 ? "text-[#10b981]" : "text-[#f43f5e]"
            )}
          >
            {trend.value >= 0 ? "+" : ""}{trend.value}{trend.unit ?? "%"}
          </span>
          <span className="text-xs text-subtle">{trend.label}</span>
        </div>
      )}

      {children}
    </div>
  );
}
