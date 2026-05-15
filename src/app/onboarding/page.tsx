"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Check, Zap, Search, Building2,
  ChevronDown, Briefcase, Target, X,
} from "lucide-react";
import { saveOnboarding } from "@/lib/api";
import type { RoleCategory, IndustryCategory } from "@/lib/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLES: { value: RoleCategory; emoji: string; description: string }[] = [
  { value: "Software Engineering",    emoji: "💻", description: "Developer, Engineer, Architect" },
  { value: "Data & Analytics",        emoji: "📊", description: "Analyst, Data Scientist, BI" },
  { value: "Consulting",              emoji: "🧩", description: "Strategy, Management, Advisory" },
  { value: "Finance",                 emoji: "💹", description: "Investment, Banking, Accounting" },
  { value: "Marketing",               emoji: "📣", description: "Brand, Growth, Digital" },
  { value: "Communication & PR",      emoji: "🗣️", description: "PR, Corporate Comms, Media" },
  { value: "Management & Leadership", emoji: "🏆", description: "Director, Manager, Executive" },
  { value: "Product Management",      emoji: "🚀", description: "Product Owner, PM, Strategy" },
  { value: "HR",                      emoji: "🤝", description: "Talent, People Ops, Recruitment" },
  { value: "Sales",                   emoji: "🎯", description: "Account Exec, BDR, Sales Manager" },
  { value: "Operations",              emoji: "⚙️", description: "Ops, Process, Supply Chain" },
  { value: "Design & Creative",       emoji: "🎨", description: "UX, Graphic Design, Creative" },
  { value: "Legal",                   emoji: "⚖️", description: "Lawyer, Paralegal, Compliance" },
  { value: "Customer Support",        emoji: "🌟", description: "Support, Success, Service" },
];

const INDUSTRIES: { value: IndustryCategory; emoji: string }[] = [
  { value: "Technology",       emoji: "💻" },
  { value: "Finance",          emoji: "🏦" },
  { value: "Consulting",       emoji: "🧩" },
  { value: "Healthcare",       emoji: "🏥" },
  { value: "Government",       emoji: "🏛️" },
  { value: "Retail",           emoji: "🛍️" },
  { value: "Media",            emoji: "📺" },
  { value: "Energy",           emoji: "⚡" },
  { value: "Education",        emoji: "🎓" },
  { value: "Telecommunications", emoji: "📡" },
  { value: "Logistics",        emoji: "🚚" },
  { value: "Manufacturing",    emoji: "🏭" },
];

const LEVELS = [
  { value: "beginner" as const,     emoji: "🌱", label: "Getting started", description: "I'm new to formal assessments" },
  { value: "intermediate" as const, emoji: "📈", label: "Building skills",  description: "I've done some tests and want to improve" },
  { value: "advanced" as const,     emoji: "🏆", label: "Peak performance", description: "I regularly prepare and want to excel" },
];

const TOTAL_STEPS = 4;

// ─── Progress stepper ────────────────────────────────────────────────────────

function Stepper({ current }: { current: number }) {
  const labels = ["Role", "Industry", "Company", "Level"];
  return (
    <div className="flex items-center gap-0">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                i < current
                  ? "bg-[#4f46e5] text-white shadow-sm"
                  : i === current
                  ? "bg-[#0D1B2E] text-white ring-2 ring-[#4f46e5]/30"
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
              i < current ? "bg-[#4f46e5]" : "bg-[#e2e8f0]"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Searchable select ────────────────────────────────────────────────────────

function SearchableSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: T; emoji: string; label?: string; description?: string }[];
  value: T | null;
  onChange: (v: T) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    (o.label ?? o.value).toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
          value
            ? "border-[#4f46e5] bg-[#eef2ff]"
            : "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40"
        }`}
      >
        {selected ? (
          <>
            <span className="text-lg">{selected.emoji}</span>
            <span className="flex-1 font-semibold text-[#0D1B2E] text-sm">{selected.label ?? selected.value}</span>
          </>
        ) : (
          <>
            <Search size={16} className="text-[#94a3b8]" />
            <span className="flex-1 text-[#94a3b8] text-sm">{placeholder}</span>
          </>
        )}
        <ChevronDown size={16} className={`text-[#94a3b8] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#e2e8f0] shadow-xl z-10 overflow-hidden">
          <div className="p-2 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#f8fafc]">
              <Search size={14} className="text-[#94a3b8] flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-[#0D1B2E] outline-none placeholder:text-[#94a3b8]"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X size={12} className="text-[#94a3b8]" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); setQuery(""); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors text-left ${
                  value === o.value ? "bg-[#eef2ff]" : ""
                }`}
              >
                <span className="text-base">{o.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0D1B2E]">{o.label ?? o.value}</p>
                  {o.description && <p className="text-xs text-[#94a3b8] truncate">{o.description}</p>}
                </div>
                {value === o.value && <Check size={14} className="text-[#4f46e5] flex-shrink-0" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-[#94a3b8]">No results for &quot;{query}&quot;</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleCategory | null>(null);
  const [industry, setIndustry] = useState<IndustryCategory | null>(null);
  const [company, setCompany] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!level) return;
    setSaving(true);
    try {
      await saveOnboarding({
        targetRole: role ?? undefined,
        targetIndustry: industry ?? undefined,
        targetCompany: company.trim() || undefined,
        level,
      });
    } catch {
      // Career targets are optional — navigate to dashboard regardless
    }
    router.push("/dashboard");
  };

  const roleOptions = ROLES.map((r) => ({ value: r.value, emoji: r.emoji, description: r.description }));
  const industryOptions = INDUSTRIES.map((i) => ({ value: i.value, emoji: i.emoji }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f0f4ff] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-[#e2e8f0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-[#0D1B2E]">
              Mortier <span className="gradient-text">Asses</span>
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
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4f46e5] uppercase tracking-widest bg-[#eef2ff] px-3 py-1.5 rounded-full mb-4">
                  <Briefcase size={12} /> Step 1 of {TOTAL_STEPS}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  What role are you applying for?
                </h1>
                <p className="text-[#64748b]">
                  We'll personalise your assessment plan based on what employers actually test.
                </p>
              </div>

              {/* Searchable dropdown */}
              <div className="mb-4">
                <SearchableSelect
                  options={roleOptions}
                  value={role}
                  onChange={setRole}
                  placeholder="Search or select a role..."
                />
              </div>

              {/* Quick-pick cards — show top 6 */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {ROLES.slice(0, 6).map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      role === r.value
                        ? "border-[#4f46e5] bg-[#eef2ff]"
                        : "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0D1B2E] leading-tight truncate">{r.value}</p>
                    </div>
                    {role === r.value && (
                      <div className="w-4 h-4 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!role}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Continue <ArrowRight size={16} />
              </button>
              <p className="text-center text-xs text-[#94a3b8] mt-3">
                You can update this anytime from your profile
              </p>
            </div>
          )}

          {/* ── Step 1: Industry ── */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4f46e5] uppercase tracking-widest bg-[#eef2ff] px-3 py-1.5 rounded-full mb-4">
                  <Target size={12} /> Step 2 of {TOTAL_STEPS}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  Which industry are you targeting?
                </h1>
                <p className="text-[#64748b]">
                  Different sectors test different skills. We'll match you to the right preparation.
                </p>
              </div>

              {/* Searchable dropdown */}
              <div className="mb-4">
                <SearchableSelect
                  options={industryOptions}
                  value={industry}
                  onChange={setIndustry}
                  placeholder="Search or select an industry..."
                />
              </div>

              {/* Grid of industry cards */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    onClick={() => setIndustry(ind.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all ${
                      industry === ind.value
                        ? "border-[#4f46e5] bg-[#eef2ff]"
                        : "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <span className="text-2xl">{ind.emoji}</span>
                    <p className="text-xs font-semibold text-[#0D1B2E] leading-tight">{ind.value}</p>
                    {industry === ind.value && (
                      <div className="w-4 h-4 rounded-full bg-[#4f46e5] flex items-center justify-center">
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
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!industry}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Company (optional) ── */}
          {step === 2 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4f46e5] uppercase tracking-widest bg-[#eef2ff] px-3 py-1.5 rounded-full mb-4">
                  <Building2 size={12} /> Step 3 of {TOTAL_STEPS}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  Any specific company?
                </h1>
                <p className="text-[#64748b]">
                  We'll prioritise tests used by that company and show you what others applying there practised.
                </p>
              </div>

              <div className="relative mb-3">
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. McKinsey, Deloitte, Google..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-[#e2e8f0] bg-white text-[#0D1B2E] text-sm outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all placeholder:text-[#94a3b8]"
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
                <p className="text-xs text-[#94a3b8] font-medium mb-2">Popular choices:</p>
                <div className="flex flex-wrap gap-2">
                  {["McKinsey", "Deloitte", "KPMG", "Goldman Sachs", "Google", "Amazon", "BCG", "Accenture"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCompany(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        company === c
                          ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                          : "bg-white text-[#475569] border-[#e2e8f0] hover:border-[#4f46e5]/40 hover:text-[#4f46e5]"
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
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {company.trim() ? "Continue" : "Skip for now"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Level ── */}
          {step === 3 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4f46e5] uppercase tracking-widest bg-[#eef2ff] px-3 py-1.5 rounded-full mb-4">
                  <Zap size={12} /> Step 4 of {TOTAL_STEPS}
                </div>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  Where are you right now?
                </h1>
                <p className="text-[#64748b]">
                  We'll set you up at the right difficulty level from day one.
                </p>
              </div>

              <div className="grid gap-3 mb-6">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                      level === l.value
                        ? "border-[#4f46e5] bg-[#eef2ff]"
                        : "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <span className="text-2xl">{l.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0D1B2E]">{l.label}</p>
                      <p className="text-sm text-[#64748b] mt-0.5">{l.description}</p>
                    </div>
                    {level === l.value && (
                      <div className="w-5 h-5 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Summary */}
              {(role || industry || company) && (
                <div className="mb-5 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Your profile</p>
                  <div className="flex flex-wrap gap-2">
                    {role && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2.5 py-1 rounded-full">
                        {ROLES.find(r => r.value === role)?.emoji} {role}
                      </span>
                    )}
                    {industry && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0891b2] bg-[#ecfeff] px-2.5 py-1 rounded-full">
                        {INDUSTRIES.find(i => i.value === industry)?.emoji} {industry}
                      </span>
                    )}
                    {company && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#7c3aed] bg-[#f5f3ff] px-2.5 py-1 rounded-full">
                        🏢 {company}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!level || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {saving ? "Building your plan..." : "Launch my preparation"}
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
