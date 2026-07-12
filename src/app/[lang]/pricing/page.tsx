"use client";

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Navbar } from "@/components/layout/Navbar";
import { PricingCard } from "@/components/cards/PricingCard";
import { UpgradeButton } from "@/components/ui/UpgradeButton";
import { useT } from "@/lib/i18n";
import { CURRENCY } from "@/lib/locales";

const UI = {
  en: {
    badge: "Simple pricing",
    titleA: "One plan.",
    titleB: "One price.",
    titleC: "No surprises.",
    subtitle: "Start with 5 free tests. Upgrade to Pro for unlimited practice, detailed feedback, and daily preparation plans.",
    upgrade: (cur: string) => `Upgrade to Pro (${cur}4/mo)`,
    footnote: "Cancel anytime · No hidden fees · Billed monthly via Lemon Squeezy",
    comparison: "Full feature comparison",
    feature: "Feature",
    free: "Free",
    pro: "Pro",
    rows: [
      ["Practice tests", "5", "Unlimited"],
      ["New tests weekly", "none", "check"],
      ["Assessment types", "All", "All"],
      ["Basic results", "check", "check"],
      ["Detailed feedback", "none", "check"],
      ["Progress tracking", "none", "check"],
      ["Daily preparation plan", "none", "check"],
      ["Streak tracking", "check", "check"],
      ["Mobile access", "check", "check"],
      ["Priority support", "none", "check"],
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      ["Can I cancel anytime?", "Yes, cancel your Pro subscription at any time. You keep access until the end of your billing period."],
      ["What happens after I use my 5 free tests?", "You'll be prompted to upgrade to Pro. All your progress and results are saved either way."],
      ["Are the tests similar to real company assessments?", "Yes, our tests are modelled on assessments used by top employers like McKinsey, Deloitte, Shell, and others."],
      ["How often are new tests added?", "New tests are added weekly. Pro users always have fresh, unique content."],
      ["Is there a student discount?", "At {price}4/month, we're already priced to be accessible to students. More plans coming soon."],
    ],
    ctaTitle: "Ready to start?",
    ctaSub: "5 free tests, no credit card required. Upgrade to Pro when you're ready.",
    start: "Start your first free test",
    demo: "View demo",
  },
  nl: {
    badge: "Eerlijke prijzen",
    titleA: "Een plan.",
    titleB: "Een prijs.",
    titleC: "Geen verrassingen.",
    subtitle: "Start met 5 gratis tests. Upgrade naar Pro voor onbeperkt oefenen, gedetailleerde feedback en dagelijkse voorbereiding.",
    upgrade: (cur: string) => `Upgraden naar Pro (${cur}4/mnd)`,
    footnote: "Altijd opzegbaar · Geen verborgen kosten · Maandelijks gefactureerd via Lemon Squeezy",
    comparison: "Volledige vergelijking",
    feature: "Functie",
    free: "Gratis",
    pro: "Pro",
    rows: [
      ["Oefentests", "5", "Onbeperkt"],
      ["Wekelijks nieuwe tests", "none", "check"],
      ["Assessmenttypen", "Alle", "Alle"],
      ["Basisresultaten", "check", "check"],
      ["Gedetailleerde feedback", "none", "check"],
      ["Voortgang bijhouden", "none", "check"],
      ["Dagelijks voorbereidingsplan", "none", "check"],
      ["Streak bijhouden", "check", "check"],
      ["Mobiele toegang", "check", "check"],
      ["Prioriteitssupport", "none", "check"],
    ],
    faqTitle: "Veelgestelde vragen",
    faq: [
      ["Kan ik altijd opzeggen?", "Ja, je kunt je Pro-abonnement op elk moment opzeggen. Je houdt toegang tot het einde van je betaalperiode."],
      ["Wat gebeurt er na mijn 5 gratis tests?", "Dan vragen we je om te upgraden naar Pro. Je voortgang en resultaten blijven hoe dan ook bewaard."],
      ["Lijken de tests op echte bedrijfsassessments?", "Ja, onze tests zijn gebaseerd op assessments van werkgevers zoals McKinsey, Deloitte, Shell en andere organisaties."],
      ["Hoe vaak komen er nieuwe tests bij?", "Er komen wekelijks nieuwe tests bij. Pro-gebruikers hebben altijd verse, unieke content."],
      ["Is er studentenkorting?", "Met {price}4/maand is Pro al bewust toegankelijk geprijsd. Meer abonnementsvormen volgen later."],
    ],
    ctaTitle: "Klaar om te starten?",
    ctaSub: "5 gratis tests, geen creditcard nodig. Upgrade naar Pro wanneer je er klaar voor bent.",
    start: "Start je eerste gratis test",
    demo: "Bekijk demo",
  },
};

function CellValue({ value, pro = false }: { value: string; pro?: boolean }) {
  if (value === "check") {
    return <Check size={16} className={pro ? "text-[#2D7BFF] mx-auto" : "text-[#10b981] mx-auto"} strokeWidth={3} />;
  }
  if (value === "none") return <span className="text-[#d1d9e0] text-lg">-</span>;
  return <span className={pro ? "text-sm font-semibold text-[#2D7BFF]" : "text-sm font-semibold text-[#0D1B2E]"}>{value}</span>;
}

export default function PricingPage() {
  const { locale } = useT();
  const ui = UI[locale];
  const cur = CURRENCY[locale];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f8fafc]">
        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EAF1FF]/40 to-transparent pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF1FF] border border-[#BFD6FF] mb-6">
              <Sparkles size={13} className="text-[#2D7BFF]" />
              <span className="text-xs font-semibold text-[#2D7BFF]">{ui.badge}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#0D1B2E] mb-4 tracking-tight">
              {ui.titleA} <span className="gradient-text">{ui.titleB}</span>
              <br />{ui.titleC}
            </h1>
            <p className="text-lg text-[#64748b] max-w-xl mx-auto">{ui.subtitle}</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 pb-8">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <PricingCard plan="free" />
            <PricingCard plan="pro" highlighted />
          </div>
          <div className="flex flex-col items-center gap-3 mt-8">
            <UpgradeButton label={ui.upgrade(cur)} size="lg" />
            <p className="text-sm text-[#94a3b8]">{ui.footnote}</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-2xl text-[#0D1B2E] text-center mb-10">{ui.comparison}</h2>

            <div className="rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="grid grid-cols-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
                <div className="p-4 col-span-1">
                  <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">{ui.feature}</span>
                </div>
                <div className="p-4 text-center border-l border-[#e2e8f0]">
                  <span className="text-sm font-bold text-[#0D1B2E]">{ui.free}</span>
                </div>
                <div className="p-4 text-center border-l border-[#e2e8f0] bg-[#EAF1FF]">
                  <span className="text-sm font-bold text-[#2D7BFF]">{ui.pro}</span>
                </div>
              </div>

              {ui.rows.map(([feature, free, pro], i) => (
                <div
                  key={feature}
                  className={`grid grid-cols-3 border-b border-[#f1f5f9] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}
                >
                  <div className="p-4 text-sm text-[#475569] font-medium">{feature}</div>
                  <div className="p-4 text-center border-l border-[#f1f5f9]">
                    <CellValue value={free} />
                  </div>
                  <div className="p-4 text-center border-l border-[#f1f5f9] bg-[#f8faff]">
                    <CellValue value={pro} pro />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-2xl text-[#0D1B2E] text-center mb-10">{ui.faqTitle}</h2>
            <div className="flex flex-col gap-4">
              {ui.faq.map(([q, a]) => (
                <div key={q} className="card p-5">
                  <h3 className="font-display font-semibold text-[#0D1B2E] text-sm mb-2">{q}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{a.replace("{price}", cur)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
            <h2 className="font-display font-bold text-3xl text-[#0D1B2E]">{ui.ctaTitle}</h2>
            <p className="text-[#64748b]">{ui.ctaSub}</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Link
                href="/onboarding"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity"
              >
                {ui.start}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold text-sm hover:border-[#2D7BFF]/30 transition-colors"
              >
                {ui.demo}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
