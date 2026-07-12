"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, Sparkles, CheckCircle2, ChevronDown } from "lucide-react";
import { HeroDashboardMockup } from "./HeroDashboardMockup";
import { useProfession } from "./PersonalizedExperience";
import { ROLE_OPTIONS, ROLE_META, TYPE_LABEL, questionForRole } from "@/lib/professionDemo";
import { useT } from "@/lib/i18n";
import type { RoleCategory } from "@/lib/types";

const UI = {
  en: {
    preparingAs: "I'm preparing as",
    profession: "your profession",
    ace: "Ace your",
    assessment: "assessment.",
    job: "Get the job.",
    defaultSub: "Practice hundreds of realistic assessment tests built around your profession, and walk into your job application ready to pass.",
    roleSub: (type: string, phrase: string) => `Practice realistic ${type} tests, the type ${phrase} lean on most, and walk into your application ready to pass.`,
    start: "Start your first free test",
    browseTypes: "View test types",
    browseType: (type: string) => `Browse ${type} tests`,
    signals: ["5 free tests, no card needed", "Instant scoring and explanations", "Modelled on SHL, Korn Ferry and cut-e"],
  },
  nl: {
    preparingAs: "Ik bereid me voor als",
    profession: "jouw beroep",
    ace: "Haal je",
    assessment: "assessment.",
    job: "Krijg de baan.",
    defaultSub: "Oefen met realistische assessmenttests rond jouw beroep en ga voorbereid je sollicitatie in.",
    roleSub: (type: string) => `Oefen realistische ${type}-tests, afgestemd op je beroep, en ga klaar om te slagen je sollicitatie in.`,
    start: "Start je eerste gratis test",
    browseTypes: "Bekijk testtypen",
    browseType: (type: string) => `Bekijk ${type}-tests`,
    signals: ["5 gratis tests, geen kaart nodig", "Directe score en uitleg", "Gebaseerd op SHL, Korn Ferry en cut-e"],
  },
};

export function HeroSection() {
  const { role, setRole } = useProfession();
  const { locale } = useT();
  const ui = UI[locale];
  const meta = role ? ROLE_META[role] : null;
  const demo = questionForRole(role);

  // Carry the chosen role into onboarding so step 1 can pre-select it.
  const onboardingHref = role ? `/onboarding?role=${encodeURIComponent(role)}` : "/onboarding";

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Base wash */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[600px] bg-gradient-to-b from-[#EAF1FF]/70 to-transparent" />
        {/* Animated blobs */}
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="mesh-blob mesh-blob-4" />
        {/* Noise overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6 animate-fade-up">
            {/* Eyebrow — profession picker that personalises the hero and demo */}
            <div className="inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full bg-[#EAF1FF] border border-[#BFD6FF] w-fit">
              <Sparkles size={13} className="text-[#2D7BFF] shrink-0" />
              <label htmlFor="hero-role" className="text-xs font-semibold text-[#2D7BFF]">
                {ui.preparingAs}
              </label>
              <div className="relative inline-flex items-center">
                <select
                  id="hero-role"
                  value={role ?? ""}
                  onChange={(e) => setRole(e.target.value ? (e.target.value as RoleCategory) : null)}
                  className="appearance-none bg-transparent pr-4 text-xs font-bold text-[#1D63E6] outline-none cursor-pointer"
                >
                  <option value="">{ui.profession}</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="text-[#2D7BFF] absolute right-0 pointer-events-none" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] text-[#0D1B2E] leading-[1.05] tracking-tight">
              {ui.ace}{" "}
              {meta ? `${meta.headlineNoun} ` : null}
              <span className="gradient-text">assessment.</span>
              <br />
              {ui.job}
            </h1>

            {/* Subtext */}
            <p className="text-lg text-[#475569] leading-relaxed max-w-lg">
              {meta
                ? ui.roleSub(TYPE_LABEL[meta.type], meta.phrase)
                : ui.defaultSub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={onboardingHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold shadow-lg hover:opacity-90 transition-opacity text-sm"
              >
                {ui.start}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={meta ? `/practice/${demo.practiceSlug}` : "/tests"}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:border-[#2D7BFF]/40 hover:text-[#2D7BFF] transition-colors text-sm"
              >
                {meta ? ui.browseType(TYPE_LABEL[meta.type]) : ui.browseTypes}
              </Link>
            </div>

            {/* Trust signals — honest, verifiable claims (no invented numbers) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm text-[#64748b]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" />
                {ui.signals[0]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" />
                {ui.signals[1]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" />
                {ui.signals[2]}
              </span>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="animate-fade-up delay-300 flex justify-center lg:justify-end">
            <HeroDashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
