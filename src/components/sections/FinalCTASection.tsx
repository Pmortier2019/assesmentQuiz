"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, Zap } from "lucide-react";
import { useT } from "@/lib/i18n";

const UI = {
  en: {
    titleA: "Your next assessment",
    titleB: "starts today.",
    subtitle: "5 free tests, no credit card required. Join the first candidates getting assessment-ready with Ready to Ace.",
    start: "Start your first free test",
    plan: "View Pro plan",
    footnote: (currency: string) => `No credit card · 5 free tests · Upgrade anytime for ${currency}4/month`,
  },
  nl: {
    titleA: "Je volgende assessment",
    titleB: "begint vandaag.",
    subtitle: "5 gratis tests, geen creditcard nodig. Bereid je slimmer voor met Ready to Ace.",
    start: "Start je eerste gratis test",
    plan: "Bekijk Pro-plan",
    footnote: (currency: string) => `Geen creditcard · 5 gratis tests · Upgrade wanneer je wilt voor ${currency}4/maand`,
  },
};

export function FinalCTASection({ currency = "$" }: { currency?: string }) {
  const { locale } = useT();
  const ui = UI[locale];

  return (
    <section className="py-24 bg-[#0D1B2E] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2D7BFF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#1D63E6]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center shadow-xl">
          <Zap size={24} className="text-white fill-white" />
        </div>

        <div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight tracking-tight">
            {ui.titleA}
            <br />
            {ui.titleB}
          </h2>
          <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            {ui.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-bold text-base shadow-2xl hover:opacity-90 transition-opacity"
          >
            {ui.start}
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white/80 font-semibold text-base hover:border-white/40 hover:text-white transition-all"
          >
            {ui.plan}
          </Link>
        </div>

        <p className="text-sm text-white/30">
          {ui.footnote(currency)}
        </p>
      </div>
    </section>
  );
}
