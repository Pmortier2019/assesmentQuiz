"use client";

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Navbar } from "@/components/layout/Navbar";
import { PricingCard } from "@/components/cards/PricingCard";
import { UpgradeButton } from "@/components/ui/UpgradeButton";
import { useT } from "@/lib/i18n";
import { CURRENCY } from "@/lib/locales";

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel your Pro subscription at any time. You keep access until the end of your billing period.",
  },
  {
    q: "What happens after I use my 5 free tests?",
    a: "You'll be prompted to upgrade to Pro. All your progress and results are saved either way.",
  },
  {
    q: "Are the tests similar to real company assessments?",
    a: "Yes — our tests are modelled on assessments used by top employers like McKinsey, Deloitte, Shell, and others.",
  },
  {
    q: "How often are new tests added?",
    a: "New tests are added weekly. Pro users always have fresh, unique content.",
  },
  {
    q: "Is there a student discount?",
    a: "At {price}4/month, we're already priced to be accessible to students. More plans coming soon.",
  },
];

export default function PricingPage() {
  const { locale } = useT();
  const cur = CURRENCY[locale];
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f8fafc]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EAF1FF]/40 to-transparent pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF1FF] border border-[#BFD6FF] mb-6">
              <Sparkles size={13} className="text-[#2D7BFF]" />
              <span className="text-xs font-semibold text-[#2D7BFF]">Simple pricing</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#0D1B2E] mb-4 tracking-tight">
              One plan.{" "}
              <span className="gradient-text">One price.</span>
              <br />No surprises.
            </h1>
            <p className="text-lg text-[#64748b] max-w-xl mx-auto">
              Start with 5 free tests. Upgrade to Pro for unlimited practice, detailed feedback, and daily preparation plans.
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 pb-8">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <PricingCard plan="free" />
            <PricingCard plan="pro" highlighted />
          </div>
          <div className="flex flex-col items-center gap-3 mt-8">
            <UpgradeButton label={`Upgrade to Pro — ${cur}4/mo`} size="lg" />
            <p className="text-sm text-[#94a3b8]">
              Cancel anytime · No hidden fees · Billed monthly via Lemon Squeezy
            </p>
          </div>
        </section>

        {/* Feature comparison */}
        <section className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-2xl text-[#0D1B2E] text-center mb-10">
              Full feature comparison
            </h2>

            <div className="rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="grid grid-cols-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
                <div className="p-4 col-span-1">
                  <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Feature</span>
                </div>
                <div className="p-4 text-center border-l border-[#e2e8f0]">
                  <span className="text-sm font-bold text-[#0D1B2E]">Free</span>
                </div>
                <div className="p-4 text-center border-l border-[#e2e8f0] bg-[#EAF1FF]">
                  <span className="text-sm font-bold text-[#2D7BFF]">Pro</span>
                </div>
              </div>

              {[
                ["Practice tests",          "5",            "Unlimited"],
                ["New tests weekly",         "—",            "✓"],
                ["Assessment types",        "All 5",        "All 5"],
                ["Basic results",           "✓",            "✓"],
                ["Detailed feedback",       "—",            "✓"],
                ["Progress tracking",       "—",            "✓"],
                ["Daily preparation plan",  "—",            "✓"],
                ["Streak tracking",         "✓",            "✓"],
                ["Mobile access",           "✓",            "✓"],
                ["Priority support",        "—",            "✓"],
              ].map(([feature, free, pro], i) => (
                <div
                  key={feature}
                  className={`grid grid-cols-3 border-b border-[#f1f5f9] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}
                >
                  <div className="p-4 text-sm text-[#475569] font-medium">{feature}</div>
                  <div className="p-4 text-center border-l border-[#f1f5f9]">
                    {free === "✓" ? (
                      <Check size={16} className="text-[#10b981] mx-auto" strokeWidth={3} />
                    ) : free === "—" ? (
                      <span className="text-[#d1d9e0] text-lg">—</span>
                    ) : (
                      <span className="text-sm font-semibold text-[#0D1B2E]">{free}</span>
                    )}
                  </div>
                  <div className="p-4 text-center border-l border-[#f1f5f9] bg-[#f8faff]">
                    {pro === "✓" ? (
                      <Check size={16} className="text-[#2D7BFF] mx-auto" strokeWidth={3} />
                    ) : (
                      <span className="text-sm font-semibold text-[#2D7BFF]">{pro}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-2xl text-[#0D1B2E] text-center mb-10">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-4">
              {FAQ.map((item) => (
                <div key={item.q} className="card p-5">
                  <h3 className="font-display font-semibold text-[#0D1B2E] text-sm mb-2">{item.q}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{item.a.replace("{price}", cur)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
            <h2 className="font-display font-bold text-3xl text-[#0D1B2E]">
              Ready to start?
            </h2>
            <p className="text-[#64748b]">
              5 free tests, no credit card required. Upgrade to Pro when you&apos;re ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Link
                href="/onboarding"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity"
              >
                Start your first free test
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold text-sm hover:border-[#2D7BFF]/30 transition-colors"
              >
                View demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
