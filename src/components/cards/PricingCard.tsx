"use client";

import { Check, Sparkles, Zap } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/ui/UpgradeButton";
import { useT } from "@/lib/i18n";
import { CURRENCY } from "@/lib/locales";

interface PricingCardProps {
  plan: "free" | "pro";
  highlighted?: boolean;
  className?: string;
}

const PLANS = {
  en: {
    free: {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect to get started and experience the platform.",
      features: [
        "5 free practice tests",
        "Basic results and score",
        "Limited feedback",
        "All assessment types",
        "English and Dutch",
      ],
      unavailable: [
        "Unlimited tests",
        "New tests added weekly",
        "Detailed feedback",
        "Progress tracking",
        "Daily preparation plan",
      ],
      cta: "Start your first free test",
      href: "/onboarding",
      badge: "Most popular",
    },
    pro: {
      name: "Pro",
      price: "4",
      period: "per month",
      description: "Everything you need to ace your assessment and get the job.",
      features: [
        "Unlimited practice tests",
        "Fresh new tests added weekly",
        "Detailed feedback per question",
        "Progress tracking and analytics",
        "Daily preparation plan",
        "All assessment types",
        "Priority support",
      ],
      unavailable: [],
      cta: "Upgrade to Pro",
      href: "/pricing",
      badge: "Most popular",
    },
  },
  nl: {
    free: {
      name: "Gratis",
      price: "0",
      period: "altijd",
      description: "Ideaal om te starten en het platform te proberen.",
      features: [
        "5 gratis oefentests",
        "Basisscore en resultaat",
        "Beperkte feedback",
        "Alle assessmenttypen",
        "Nederlands en Engels",
      ],
      unavailable: [
        "Onbeperkt tests maken",
        "Wekelijks nieuwe tests",
        "Gedetailleerde feedback",
        "Voortgang bijhouden",
        "Dagelijks voorbereidingsplan",
      ],
      cta: "Start je eerste gratis test",
      href: "/onboarding",
      badge: "Meest gekozen",
    },
    pro: {
      name: "Pro",
      price: "4",
      period: "per maand",
      description: "Alles om je assessment te halen en de baan te krijgen.",
      features: [
        "Onbeperkt oefentests maken",
        "Wekelijks nieuwe tests",
        "Gedetailleerde feedback per vraag",
        "Voortgang en analyses",
        "Dagelijks voorbereidingsplan",
        "Alle assessmenttypen",
        "Prioriteitssupport",
      ],
      unavailable: [],
      cta: "Upgraden naar Pro",
      href: "/pricing",
      badge: "Meest gekozen",
    },
  },
};

export function PricingCard({ plan, highlighted = false, className }: PricingCardProps) {
  const { locale } = useT();
  const data = PLANS[locale][plan];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-8 overflow-hidden",
        highlighted
          ? "bg-gradient-to-br from-[#0D1B2E] to-[#1a2f4a] text-white border-0 shadow-2xl scale-[1.02]"
          : "bg-white border border-[#e2e8f0] shadow-sm",
        className
      )}
    >
      {/* Pro badge */}
      {highlighted && (
        <div className="absolute top-5 right-5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white text-xs font-bold">
            <Sparkles size={10} />
            {data.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {highlighted && (
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center">
              <Zap size={12} className="text-white fill-white" />
            </div>
          )}
          <span className={cn("font-display font-bold text-lg", highlighted ? "text-white" : "text-[#0D1B2E]")}>
            {data.name}
          </span>
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className={cn("font-display font-extrabold text-5xl tracking-tight", highlighted ? "text-white" : "text-[#0D1B2E]")}>
            {CURRENCY[locale]}{data.price}
          </span>
          <span className={cn("text-sm font-medium", highlighted ? "text-white/60" : "text-[#94a3b8]")}>
            /{data.period}
          </span>
        </div>

        <p className={cn("text-sm leading-relaxed", highlighted ? "text-white/70" : "text-[#64748b]")}>
          {data.description}
        </p>
      </div>

      {/* CTA */}
      {highlighted ? (
        <div className="mb-8">
          <UpgradeButton label={data.cta} className="w-full justify-center py-3 rounded-xl text-sm" />
        </div>
      ) : (
        <Link
          href={data.href}
          className="w-full py-3 rounded-xl font-semibold text-sm text-center mb-8 transition-opacity bg-[#0D1B2E] text-white hover:bg-[#1a2f4a] block"
        >
          {data.cta}
        </Link>
      )}

      {/* Features */}
      <div className="flex flex-col gap-3">
        {data.features.map((f) => (
          <div key={f} className="flex items-start gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
              highlighted ? "bg-[#2D7BFF]" : "bg-[#f0fdf4]"
            )}>
              <Check size={11} className={highlighted ? "text-white" : "text-[#16a34a]"} strokeWidth={3} />
            </div>
            <span className={cn("text-sm", highlighted ? "text-white/85" : "text-[#475569]")}>{f}</span>
          </div>
        ))}

        {data.unavailable.map((f) => (
          <div key={f} className="flex items-start gap-3 opacity-40">
            <div className="w-5 h-5 rounded-full flex-shrink-0 bg-[#f1f5f9] flex items-center justify-center mt-0.5">
              <span className="text-[#94a3b8] text-xs font-bold">×</span>
            </div>
            <span className={cn("text-sm", highlighted ? "text-white/50" : "text-[#94a3b8]")}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
