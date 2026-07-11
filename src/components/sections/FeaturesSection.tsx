"use client";

import { BarChart3, Brain, Briefcase, Layers, Repeat2, Smartphone, type LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n";

type Feature = { icon: LucideIcon; title: string; description: string };

const UI: Record<"en" | "nl", { title: string; subtitle: string; features: Feature[] }> = {
  en: {
    title: "Built for serious candidates",
    subtitle: "Every feature is designed to maximize your assessment score, not just keep you busy.",
    features: [
      { icon: Layers, title: "All assessment types", description: "Numerical, logical, verbal reasoning, situational judgement, personality tests and more in one place." },
      { icon: Briefcase, title: "Profession-tailored tests", description: "Tests are built around your sector and role, so every question is relevant to the job you want." },
      { icon: BarChart3, title: "Progress analytics", description: "Track your improvement over time, identify weak areas, and see exactly how your scores change." },
      { icon: Brain, title: "Instant explanations", description: "Every question includes a clear explanation, not just what's right, but why, so it sticks." },
      { icon: Repeat2, title: "Daily streaks", description: "Build a consistent practice habit with streak tracking. Small steps lead to big improvements." },
      { icon: Smartphone, title: "Mobile-first design", description: "Practice anywhere: on the bus, in a coffee shop, or wherever you have a spare 15 minutes." },
    ],
  },
  nl: {
    title: "Gebouwd voor serieuze kandidaten",
    subtitle: "Elke functie is ontworpen om je assessmentscore te verbeteren, niet om je alleen bezig te houden.",
    features: [
      { icon: Layers, title: "Alle assessmenttypen", description: "Numeriek, logisch en verbaal redeneren, situational judgement, persoonlijkheidstests en meer op een plek." },
      { icon: Briefcase, title: "Tests voor jouw beroep", description: "Tests sluiten aan op je sector en rol, zodat elke vraag relevant is voor de baan die je wilt." },
      { icon: BarChart3, title: "Voortgangsanalyse", description: "Volg je verbetering, herken zwakke plekken en zie precies hoe je scores veranderen." },
      { icon: Brain, title: "Directe uitleg", description: "Elke vraag bevat heldere uitleg: niet alleen wat goed is, maar ook waarom." },
      { icon: Repeat2, title: "Dagelijkse streaks", description: "Bouw een consistente oefengewoonte op. Kleine stappen leiden tot grote verbetering." },
      { icon: Smartphone, title: "Mobiel eerst", description: "Oefen waar je wilt: onderweg, in een koffiezaak of wanneer je 15 minuten over hebt." },
    ],
  },
};

export function FeaturesSection() {
  const { locale } = useT();
  const ui = UI[locale];

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-4">
            {ui.title}
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            {ui.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ui.features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card card-interactive p-6 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D7BFF]/10 to-[#1D63E6]/10 flex items-center justify-center mb-4 group-hover:from-[#2D7BFF]/20 group-hover:to-[#1D63E6]/20 transition-all">
                  <Icon size={20} className="text-[#2D7BFF]" />
                </div>
                <h3 className="font-display font-semibold text-[#0D1B2E] text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
