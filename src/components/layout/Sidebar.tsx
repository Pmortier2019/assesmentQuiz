"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  TrendingUp,
  CreditCard,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/ui/StreakBadge";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tests",     icon: BookOpen,        label: "Tests" },
  { href: "/results",   icon: Trophy,          label: "Results" },
  { href: "/pricing",   icon: CreditCard,      label: "Upgrade" },
];

interface SidebarProps {
  streak?: number;
  userName?: string;
}

export function Sidebar({ streak = 7, userName = "Pierre Mortier" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen border-r border-[#e2e8f0] bg-[#fafafa] p-4 gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-2 py-3 mb-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
          <Zap size={14} className="text-white fill-white" />
        </div>
        <span className="font-display font-bold text-[#0D1B2E] text-lg tracking-tight">
          Mortier <span className="gradient-text">Asses</span>
        </span>
      </Link>

      {/* Streak */}
      <div className="px-2 mb-2">
        <StreakBadge count={streak} size="sm" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-white text-[#4f46e5] shadow-sm border border-[#e2e8f0]"
                  : "text-[#64748b] hover:bg-white hover:text-[#0D1B2E] hover:shadow-sm"
              )}
            >
              <Icon size={18} className={active ? "text-[#4f46e5]" : ""} />
              {label}
              {active && (
                <ChevronRight size={14} className="ml-auto text-[#4f46e5]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-auto border-t border-[#e2e8f0] pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0D1B2E] truncate">{userName}</p>
            <p className="text-xs text-[#94a3b8]">Free plan</p>
          </div>
          <TrendingUp size={14} className="text-[#94a3b8]" />
        </div>
      </div>
    </aside>
  );
}
