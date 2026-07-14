"use client";

import { useState, useEffect } from "react";
import { useLocaleRouter } from "@/components/ui/LocaleLink";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import {
  ArrowRight, ArrowLeft, Check, Zap, Building2,
  Briefcase, Target, X,
  Code, BarChart3, Puzzle, LineChart, Megaphone, Speech, Crown, Rocket,
  UsersRound, Cog, Palette, Scale, Headphones, Laptop, Landmark, Hospital,
  Building, ShoppingBag, Tv, GraduationCap, SatelliteDish, Truck, Factory,
  Sprout, TrendingUp, Trophy, type LucideIcon,
} from "lucide-react";
import { saveOnboarding } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useT } from "@/lib/i18n";
import type { RoleCategory, IndustryCategory } from "@/lib/types";
import { LogoMark } from "@/components/ui/Logo";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLES: { value: RoleCategory; icon: LucideIcon; description: string }[] = [
  { value: "Software Engineering",    icon: Code,        description: "Developer, Engineer, Architect" },
  { value: "Data & Analytics",        icon: BarChart3,   description: "Analyst, Data Scientist, BI" },
  { value: "Consulting",              icon: Puzzle,      description: "Strategy, Management, Advisory" },
  { value: "Finance",                 icon: LineChart,   description: "Investment, Banking, Accounting" },
  { value: "Marketing",               icon: Megaphone,   description: "Brand, Growth, Digital" },
  { value: "Communication & PR",      icon: Speech,      description: "PR, Corporate Comms, Media" },
  { value: "Management & Leadership", icon: Crown,       description: "Director, Manager, Executive" },
  { value: "Product Management",      icon: Rocket,      description: "Product Owner, PM, Strategy" },
  { value: "HR",                      icon: UsersRound,  description: "Talent, People Ops, Recruitment" },
  { value: "Sales",                   icon: Target,      description: "Account Exec, BDR, Sales Manager" },
  { value: "Operations",              icon: Cog,         description: "Ops, Process, Supply Chain" },
  { value: "Design & Creative",       icon: Palette,     description: "UX, Graphic Design, Creative" },
  { value: "Legal",                   icon: Scale,       description: "Lawyer, Paralegal, Compliance" },
  { value: "Customer Support",        icon: Headphones,  description: "Support, Success, Service" },
];

const INDUSTRIES: { value: IndustryCategory; icon: LucideIcon }[] = [
  { value: "Technology",         icon: Laptop },
  { value: "Finance",            icon: Landmark },
  { value: "Consulting",         icon: Puzzle },
  { value: "Healthcare",         icon: Hospital },
  { value: "Government",         icon: Building },
  { value: "Retail",             icon: ShoppingBag },
  { value: "Media",              icon: Tv },
  { value: "Energy",             icon: Zap },
  { value: "Education",          icon: GraduationCap },
  { value: "Telecommunications", icon: SatelliteDish },
  { value: "Logistics",          icon: Truck },
  { value: "Manufacturing",      icon: Factory },
];

const LEVELS = [
  { value: "beginner" as const,     icon: Sprout,     label: "Getting started", description: "I'm new to formal assessments" },
  { value: "intermediate" as const, icon: TrendingUp, label: "Building skills",  description: "I've done some tests and want to improve" },
  { value: "advanced" as const,     icon: Trophy,     label: "Peak performance", description: "I regularly prepare and want to excel" },
];

const TOTAL_STEPS = 4;

const UI = {
  en: {
    steps: ["Role", "Industry", "Company", "Level"],
    step: (n: number) => `Step ${n} of ${TOTAL_STEPS}`,
    roleTitle: "What role are you applying for?",
    roleDesc: "We'll personalise your assessment plan based on what employers actually test.",
    industryTitle: "Which industry are you targeting?",
    industryDesc: "Different sectors test different skills. We'll match you to the right preparation.",
    companyTitle: "Any specific company?",
    companyDesc: "We'll prioritise tests used by that company and show you what others applying there practised.",
    companyPlaceholder: "e.g. McKinsey, Deloitte, Google...",
    popular: "Popular choices:",
    levelTitle: "Where are you right now?",
    levelDesc: "We'll set you up at the right difficulty level from day one.",
    continue: "Continue",
    back: "Back",
    skip: "Skip for now",
    profile: "Your profile",
    update: "You can update this anytime from your profile",
    saveError: "We couldn't save your profile. Check your connection and try again.",
    saving: "Building your plan...",
    launch: "Launch my preparation",
    levels: [
      ["Getting started", "I'm new to formal assessments"],
      ["Building skills", "I've done some tests and want to improve"],
      ["Peak performance", "I regularly prepare and want to excel"],
    ],
  },
  nl: {
    steps: ["Rol", "Branche", "Bedrijf", "Niveau"],
    step: (n: number) => `Stap ${n} van ${TOTAL_STEPS}`,
    roleTitle: "Voor welke rol solliciteer je?",
    roleDesc: "We personaliseren je assessmentplan op basis van wat werkgevers echt testen.",
    industryTitle: "Op welke branche richt je je?",
    industryDesc: "Verschillende sectoren testen verschillende vaardigheden. We koppelen je aan de juiste voorbereiding.",
    companyTitle: "Een specifiek bedrijf?",
    companyDesc: "Dan geven we prioriteit aan tests die dat bedrijf gebruikt en wat andere kandidaten daarvoor oefenen.",
    companyPlaceholder: "bijv. McKinsey, Deloitte, Google...",
    popular: "Populaire keuzes:",
    levelTitle: "Waar sta je nu?",
    levelDesc: "We starten meteen op het juiste moeilijkheidsniveau.",
    continue: "Doorgaan",
    back: "Terug",
    skip: "Voor nu overslaan",
    profile: "Jouw profiel",
    update: "Je kunt dit later altijd aanpassen in je profiel",
    saveError: "We konden je profiel niet opslaan. Controleer je verbinding en probeer opnieuw.",
    saving: "Je plan wordt gemaakt...",
    launch: "Start mijn voorbereiding",
    levels: [
      ["Net begonnen", "Ik ben nieuw met formele assessments"],
      ["Vaardigheden opbouwen", "Ik heb al tests gedaan en wil verbeteren"],
      ["Topprestatie", "Ik bereid me regelmatig voor en wil uitblinken"],
    ],
  },
};

// ─── Progress stepper ────────────────────────────────────────────────────────

function Stepper({ current }: { current: number }) {
  const { locale } = useT();
  const labels = UI[locale].steps;
  return (
    <div className="flex items-center gap-0">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                i < current
                  ? "bg-[#2D7BFF] text-white shadow-sm"
                  : i === current
                  ? "bg-[#0D1B2E] text-white ring-2 ring-[#2D7BFF]/30"
                  : "bg-[#f1f5f9] text-[#94a3b8]"
              }`}
            >
              {i < current ? <Check size={13} strokeWidth={3} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium hidden sm:block ${
              i === current ? "text-[#0D1B2E]" : "text-[#94a3b8]"
            }`}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div className={`h-px w-8 sm:w-12 mb-4 mx-1 transition-all duration-300 ${
              i < current ? "bg-[#2D7BFF]" : "bg-[#e2e8f0]"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useLocaleRouter();
  const { status } = useAuth();
  const { locale } = useT();
  const ui = UI[locale];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login?from=/onboarding");
  }, [status, router]);
  const [role, setRole] = useState<RoleCategory | null>(null);
  const [industry, setIndustry] = useState<IndustryCategory | null>(null);
  const [company, setCompany] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const handleFinish = async () => {
    if (!level) return;
    setSaving(true);
    setSaveError(false);
    try {
      await saveOnboarding({
        targetRole: role ?? undefined,
        targetIndustry: industry ?? undefined,
        targetCompany: company.trim() || undefined,
        level,
      });
      router.push("/dashboard");
    } catch {
      // Don't navigate on failure: the targets weren't saved, so the user
      // would be sent straight back here on next login. Surface it and retry.
      setSaveError(true);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f0f4ff] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-[#e2e8f0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={30} className="shrink-0" />
            <span className="font-display font-bold text-[#0D1B2E]">
              Ready to <span className="gradient-text">Ace</span>
            </span>
          </Link>
          <Stepper current={step} />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* ── Step 0: Role ── */}
          {step === 0 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7BFF] uppercase tracking-widest bg-[#EAF1FF] px-3 py-1.5 rounded-full mb-4">
                  <Briefcase size={12} /> {ui.step(1)}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  {ui.roleTitle}
                </h1>
                <p className="text-[#64748b]">
                  {ui.roleDesc}
                </p>
              </div>

              {/* Role cards */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      role === r.value
                        ? "border-[#2D7BFF] bg-[#EAF1FF]"
                        : "border-[#e2e8f0] bg-white hover:border-[#2D7BFF]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <r.icon size={20} className="text-[#2D7BFF] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0D1B2E] leading-tight truncate">{r.value}</p>
                    </div>
                    {role === r.value && (
                      <div className="w-4 h-4 rounded-full bg-[#2D7BFF] flex items-center justify-center flex-shrink-0">
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!role}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {ui.continue} <ArrowRight size={16} />
              </button>
              <p className="text-center text-xs text-[#94a3b8] mt-3">
                {ui.update}
              </p>
            </div>
          )}

          {/* ── Step 1: Industry ── */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7BFF] uppercase tracking-widest bg-[#EAF1FF] px-3 py-1.5 rounded-full mb-4">
                  <Target size={12} /> {ui.step(2)}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  {ui.industryTitle}
                </h1>
                <p className="text-[#64748b]">
                  {ui.industryDesc}
                </p>
              </div>

              {/* Grid of industry cards */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    onClick={() => setIndustry(ind.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${
                      industry === ind.value
                        ? "border-[#2D7BFF] bg-[#EAF1FF]"
                        : "border-[#e2e8f0] bg-white hover:border-[#2D7BFF]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <ind.icon size={24} className="text-[#2D7BFF]" />
                    <p className="text-xs font-semibold text-[#0D1B2E] leading-tight">{ind.value}</p>
                    {industry === ind.value && (
                      <div className="w-4 h-4 rounded-full bg-[#2D7BFF] flex items-center justify-center">
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  <ArrowLeft size={16} /> {ui.back}
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!industry}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {ui.continue} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Company (optional) ── */}
          {step === 2 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7BFF] uppercase tracking-widest bg-[#EAF1FF] px-3 py-1.5 rounded-full mb-4">
                  <Building2 size={12} /> {ui.step(3)}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  {ui.companyTitle}
                </h1>
                <p className="text-[#64748b]">
                  {ui.companyDesc}
                </p>
              </div>

              <div className="relative mb-3">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={ui.companyPlaceholder}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-[#e2e8f0] bg-white text-[#0D1B2E] text-sm outline-none focus:border-[#2D7BFF] focus:ring-2 focus:ring-[#2D7BFF]/10 transition-all placeholder:text-[#94a3b8]"
                />
                {company && (
                  <button
                    onClick={() => setCompany("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X size={14} className="text-[#94a3b8]" />
                  </button>
                )}
              </div>

              {/* Popular companies */}
              <div className="mb-6">
                <p className="text-xs text-[#94a3b8] font-medium mb-2">{ui.popular}</p>
                <div className="flex flex-wrap gap-2">
                  {["McKinsey", "Deloitte", "KPMG", "Goldman Sachs", "Google", "Amazon", "BCG", "Accenture"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCompany(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        company === c
                          ? "bg-[#2D7BFF] text-white border-[#2D7BFF]"
                          : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#2D7BFF]/40 hover:text-[#2D7BFF]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  <ArrowLeft size={16} /> {ui.back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {company.trim() ? ui.continue : ui.skip}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Level ── */}
          {step === 3 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7BFF] uppercase tracking-widest bg-[#EAF1FF] px-3 py-1.5 rounded-full mb-4">
                  <Zap size={12} /> {ui.step(4)}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  {ui.levelTitle}
                </h1>
                <p className="text-[#64748b]">
                  {ui.levelDesc}
                </p>
              </div>

              <div className="grid gap-3 mb-6">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                      level === l.value
                        ? "border-[#2D7BFF] bg-[#EAF1FF]"
                        : "border-[#e2e8f0] bg-white hover:border-[#2D7BFF]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <l.icon size={24} className="text-[#2D7BFF] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#0D1B2E]">{ui.levels[LEVELS.indexOf(l)][0]}</p>
                      <p className="text-sm text-[#64748b] mt-0.5">{ui.levels[LEVELS.indexOf(l)][1]}</p>
                    </div>
                    {level === l.value && (
                      <div className="w-5 h-5 rounded-full bg-[#2D7BFF] flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Summary */}
              {(role || industry || company) && (
                <div className="mb-5 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">{ui.profile}</p>
                  <div className="flex flex-wrap gap-2">
                    {role && (() => {
                      const RoleIcon = ROLES.find(r => r.value === role)?.icon;
                      return (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2D7BFF] bg-[#EAF1FF] px-2.5 py-1 rounded-full">
                          {RoleIcon && <RoleIcon size={12} />} {role}
                        </span>
                      );
                    })()}
                    {industry && (() => {
                      const IndustryIcon = INDUSTRIES.find(i => i.value === industry)?.icon;
                      return (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0891b2] bg-[#ecfeff] px-2.5 py-1 rounded-full">
                          {IndustryIcon && <IndustryIcon size={12} />} {industry}
                        </span>
                      );
                    })()}
                    {company && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1D63E6] bg-[#EAF1FF] px-2.5 py-1 rounded-full">
                        <Building2 size={12} /> {company}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {saveError && (
                <div className="mb-4 rounded-lg bg-[#fff1f2] border border-[#fecdd3] px-3 py-2.5">
                  <p className="text-xs text-[#e11d48] leading-relaxed">
                    {ui.saveError}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  <ArrowLeft size={16} /> {ui.back}
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!level || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {saving ? ui.saving : ui.launch}
                  {!saving && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
