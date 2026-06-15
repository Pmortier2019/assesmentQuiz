"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Trophy, TrendingUp, CreditCard, ChevronRight, BarChart2, LogOut, Calendar, ShieldCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/useAuth";
import { useCurrentUser } from "@/lib/queries";
import { logout } from "@/lib/api";
import { LogoMark } from "@/components/ui/Logo";

interface SidebarProps {
  streak?: number;
  userName?: string;
  isAdmin?: boolean;
}

export function Sidebar({ streak: streakProp, userName: userNameProp, isAdmin: isAdminProp }: SidebarProps = {}) {
  const { isAdmin: authIsAdmin } = useAuth();
  // Source the signed-in user here so every page gets the right name/streak
  // without each one having to pass props. React Query dedupes by key, so this
  // shares the cache with any page that also reads useCurrentUser(). Props still
  // win when explicitly provided (e.g. the dashboard passing freshly loaded data).
  const { data: user } = useCurrentUser();
  const userName = userNameProp ?? user?.name ?? "";
  const streak = streakProp ?? user?.streak ?? 0;
  const isAdmin = isAdminProp ?? user?.isAdmin ?? authIsAdmin;
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useT();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("nav_dashboard") },
    { href: "/tests",     icon: BookOpen,        label: t("nav_tests") },
    { href: "/results",   icon: Trophy,          label: t("nav_results") },
    { href: "/progress",  icon: BarChart2,       label: t("nav_progress") },
    { href: "/study-plan",icon: Calendar,        label: "Study Plan" },
    { href: "/pricing",   icon: CreditCard,      label: t("nav_upgrade") },
    { href: "/settings",  icon: Settings,        label: t("nav_settings") },
    ...(isAdmin ? [{ href: "/admin", icon: ShieldCheck, label: "Admin" }] : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 overflow-hidden border-r border-line bg-[#fafafa] p-4 gap-2">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 px-2 py-3 mb-2">
        <LogoMark size={30} className="shrink-0" />
        <span className="font-display font-bold text-default text-lg tracking-tight">
          Ready to <span className="text-[#EF96BD]">Ace</span>
        </span>
      </Link>

      {/* Streak */}
      <div className="px-2 mb-2">
        <StreakBadge count={streak} size="sm" />
      </div>

      {/* Nav — scrolls internally on short screens so the user/logout block below stays pinned */}
      <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-surface text-[#4f46e5] shadow-sm border border-line"
                  : "text-muted hover:bg-surface hover:text-default hover:shadow-sm"
              )}
            >
              <Icon size={18} className={active ? "text-[#4f46e5]" : ""} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto text-[#4f46e5]" />}
            </Link>
          );
        })}
      </nav>

      {/* Language + User */}
      <div className="mt-auto border-t border-line pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
            isAdmin
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]"
          )}>
            {isAdmin ? <ShieldCheck size={14} /> : userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-default truncate">{userName}</p>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                <ShieldCheck size={9} />
                ADMIN
              </span>
            ) : (
              <p className="text-xs text-subtle">{t("dash_free_plan")}</p>
            )}
          </div>
          <TrendingUp size={14} className="text-subtle" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-subtle hover:text-[#e11d48] hover:bg-rose-50 transition-colors w-full"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </aside>
  );
}
