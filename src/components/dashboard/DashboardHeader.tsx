"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { StreakBadge } from "@/components/ui/StreakBadge";

interface DashboardHeaderProps {
  userName: string;
  streak: number;
  targetRole?: string | null;
  targetIndustry?: string | null;
  targetCompany?: string | null;
  freeTestsUsed: number;
  freeTestsLimit: number;
  hasCareerTargets: boolean;
  isAtLimit: boolean;
}

function greeting(): "dash_good_morning" | "dash_good_afternoon" | "dash_good_evening" {
  const h = new Date().getHours();
  if (h < 12) return "dash_good_morning";
  if (h < 18) return "dash_good_afternoon";
  return "dash_good_evening";
}

export function DashboardHeader({
  userName, streak, targetRole, targetIndustry, targetCompany,
  freeTestsUsed, freeTestsLimit, hasCareerTargets, isAtLimit,
}: DashboardHeaderProps) {
  const { t } = useT();
  const remaining = freeTestsLimit - freeTestsUsed;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-default">
          {t(greeting())}, {userName.split(" ")[0]} 👋
        </h1>
        {hasCareerTargets ? (
          <p className="text-muted text-sm mt-1">
            {t("dash_preparing_for")}{" "}
            <span className="font-semibold text-[#4f46e5]">{targetRole}</span>
            {targetIndustry && (
              <> {t("dash_in")} <span className="font-semibold text-[#0891b2]">{targetIndustry}</span></>
            )}
            {targetCompany && (
              <> · <span className="font-semibold text-[#7c3aed]">{targetCompany}</span></>
            )}
          </p>
        ) : (
          <p className="text-muted text-sm mt-1">
            {isAtLimit
              ? t("dash_used_all")
              : t("dash_free_remaining", { n: remaining, s: remaining !== 1 ? "s" : "" })}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {hasCareerTargets && (
          <Link href="/onboarding" className="text-xs font-semibold text-[#4f46e5] hover:underline">
            {t("dash_edit_targets")}
          </Link>
        )}
        <StreakBadge count={streak} />
      </div>
    </div>
  );
}
