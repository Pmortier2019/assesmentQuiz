"use client";

import { Briefcase, Zap, MessageSquare, Calendar, Shield } from "lucide-react";
import { useT } from "@/lib/i18n";

const UI = {
  en: {
    title: "Everything you need to get hired",
    subtitle: "Built around how professionals actually prepare: consistent, focused, and data-driven.",
    values: (currency: string) => [
      ["5 free tests", "Start immediately. No credit card required. Full access to 5 complete assessments.", Shield, "text-[#2D7BFF]", "bg-[#EAF1FF]"],
      [`${currency}4/month Pro`, "Unlock unlimited tests, fresh new content and detailed analytics for the price of a coffee.", Zap, "text-[#1D63E6]", "bg-[#EAF1FF]"],
      ["Profession-specific", "Tests are tailored to your sector and career, not generic one-size-fits-all content.", Briefcase, "text-[#2563eb]", "bg-[#eff6ff]"],
      ["Personal feedback", "Detailed question-by-question explanations show exactly where to improve and why.", MessageSquare, "text-[#10b981]", "bg-[#f0fdf4]"],
      ["Daily preparation", "A structured daily plan keeps you on track and builds habits, like Duolingo, for professionals.", Calendar, "text-[#f59e0b]", "bg-[#fffbeb]"],
    ],
  },
  nl: {
    title: "Alles wat je nodig hebt om aangenomen te worden",
    subtitle: "Gebouwd rond hoe professionals echt voorbereiden: consistent, gericht en datagedreven.",
    values: (currency: string) => [
      ["5 gratis tests", "Begin direct. Geen creditcard nodig. Volledige toegang tot 5 complete assessments.", Shield, "text-[#2D7BFF]", "bg-[#EAF1FF]"],
      [`${currency}4/maand Pro`, "Ontgrendel onbeperkte tests, nieuwe content en uitgebreide analyses voor de prijs van een koffie.", Zap, "text-[#1D63E6]", "bg-[#EAF1FF]"],
      ["Specifiek voor je beroep", "Tests passen bij je sector en loopbaan, niet bij generieke standaardcontent.", Briefcase, "text-[#2563eb]", "bg-[#eff6ff]"],
      ["Persoonlijke feedback", "Heldere uitleg per vraag laat precies zien waar je kunt verbeteren en waarom.", MessageSquare, "text-[#10b981]", "bg-[#f0fdf4]"],
      ["Dagelijkse voorbereiding", "Een gestructureerd dagelijks plan houdt je op koers en bouwt oefengewoontes op.", Calendar, "text-[#f59e0b]", "bg-[#fffbeb]"],
    ],
  },
};

export function ValueSection({ currency = "$" }: { currency?: string }) {
  const { locale } = useT();
  const ui = UI[locale];

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-4">
            {ui.title}
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            {ui.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {ui.values(currency).map(([title, description, Icon, color, bg], i) => {
            return (
              <div
                key={title as string}
                className={`card card-interactive p-6 flex flex-col gap-4 animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon size={22} className={color as string} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[#0D1B2E] text-base mb-1.5">{title as string}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{description as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
