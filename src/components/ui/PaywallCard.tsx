"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/ui/UpgradeButton";

interface PaywallCardProps {
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export function PaywallCard({
  title = "Unlock unlimited practice",
  description = "You've used all 5 free tests. Upgrade to Pro for €4/month and get unlimited fresh assessments.",
  compact = false,
  className,
}: PaywallCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#4f46e5]/20",
        "bg-gradient-to-br from-[#4f46e5]/5 via-white to-[#7c3aed]/5",
        compact ? "p-4" : "p-8",
        className
      )}
    >
      {/* decorative blobs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#4f46e5]/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#7c3aed]/10 blur-2xl pointer-events-none" />

      <div className={cn("relative flex flex-col items-center text-center", compact ? "gap-3" : "gap-5")}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center shadow-lg">
          <Lock size={20} className="text-white" />
        </div>

        <div>
          <h3 className={cn("font-display font-bold text-[#0D1B2E]", compact ? "text-lg" : "text-2xl")}>
            {title}
          </h3>
          {!compact && (
            <p className="mt-2 text-[#64748b] max-w-md text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <UpgradeButton label="Upgrade to Pro — €4/mo" />
          {!compact && (
            <Link
              href="/tests"
              className="px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold text-sm hover:border-[#4f46e5]/30 hover:text-[#4f46e5] transition-colors"
            >
              See all tests
            </Link>
          )}
        </div>

        <p className="text-xs text-[#94a3b8]">No credit card required to start · Cancel anytime</p>
      </div>
    </div>
  );
}
