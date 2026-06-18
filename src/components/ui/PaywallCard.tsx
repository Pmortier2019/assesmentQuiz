"use client";

import { Lock } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/ui/UpgradeButton";
import { useT } from "@/lib/i18n";
import { CURRENCY } from "@/lib/locales";

interface PaywallCardProps {
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export function PaywallCard({
  title = "Unlock unlimited practice",
  description,
  compact = false,
  className,
}: PaywallCardProps) {
  const { locale } = useT();
  const cur = CURRENCY[locale];
  const desc =
    description ??
    `You've used all 5 free tests. Upgrade to Pro for ${cur}4/month and get unlimited fresh assessments.`;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#2D7BFF]/20",
        "bg-gradient-to-br from-[#2D7BFF]/5 via-white to-[#1D63E6]/5",
        compact ? "p-4" : "p-8",
        className
      )}
    >
      {/* decorative blobs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#2D7BFF]/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#1D63E6]/10 blur-2xl pointer-events-none" />

      <div className={cn("relative flex flex-col items-center text-center", compact ? "gap-3" : "gap-5")}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center shadow-lg">
          <Lock size={20} className="text-white" />
        </div>

        <div>
          <h3 className={cn("font-display font-bold text-default", compact ? "text-lg" : "text-2xl")}>
            {title}
          </h3>
          {!compact && (
            <p className="mt-2 text-muted max-w-md text-sm leading-relaxed">
              {desc}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <UpgradeButton label={`Upgrade to Pro (${cur}4/mo)`} />
          {!compact && (
            <Link
              href="/tests"
              className="px-6 py-3 rounded-xl border border-line text-body font-semibold text-sm hover:border-[#2D7BFF]/30 hover:text-[#2D7BFF] transition-colors"
            >
              See all tests
            </Link>
          )}
        </div>

        <p className="text-xs text-subtle">No credit card required to start · Cancel anytime</p>
      </div>
    </div>
  );
}
