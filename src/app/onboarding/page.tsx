"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Zap } from "lucide-react";
import { saveOnboarding } from "@/lib/api";
import { ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_ICONS } from "@/lib/utils";
import type { AssessmentType, OnboardingData } from "@/lib/types";

const TEST_TYPES: AssessmentType[] = [
  "numerical_reasoning",
  "logical_reasoning",
  "verbal_reasoning",
  "situational_judgement",
  "personality",
];

const LEVELS = [
  {
    value: "beginner" as const,
    label: "Beginner",
    description: "I haven't done many assessments before",
    emoji: "🌱",
  },
  {
    value: "intermediate" as const,
    label: "Intermediate",
    description: "I've done some tests but want to improve",
    emoji: "📈",
  },
  {
    value: "advanced" as const,
    label: "Advanced",
    description: "I regularly take assessments and want to excel",
    emoji: "🏆",
  },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
              i < current
                ? "bg-[#4f46e5] text-white"
                : i === current
                ? "bg-[#0D1B2E] text-white"
                : "bg-[#e2e8f0] text-[#94a3b8]"
            }`}
          >
            {i < current ? <Check size={13} strokeWidth={3} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-8 ${i < current ? "bg-[#4f46e5]" : "bg-[#e2e8f0]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!selectedType || !selectedLevel) return;
    setSaving(true);
    const data: OnboardingData = { preferredTestType: selectedType, level: selectedLevel };
    await saveOnboarding(data);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-[#0D1B2E]">
              Assess<span className="gradient-text">Pro</span>
            </span>
          </Link>
          <StepIndicator current={step} total={2} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Step 0: Test type */}
          {step === 0 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-[#4f46e5] uppercase tracking-widest mb-3">Step 1 of 2</p>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  What do you want to practice first?
                </h1>
                <p className="text-[#64748b]">Choose the assessment type that matters most for your goal.</p>
              </div>

              <div className="grid gap-3">
                {TEST_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === type
                        ? "border-[#4f46e5] bg-[#eef2ff]"
                        : "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-xl flex-shrink-0">
                      {ASSESSMENT_TYPE_ICONS[type]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0D1B2E] text-sm">{ASSESSMENT_TYPE_LABELS[type]}</p>
                    </div>
                    {selectedType === type && (
                      <div className="w-5 h-5 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!selectedType}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 1: Level */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-[#4f46e5] uppercase tracking-widest mb-3">Step 2 of 2</p>
                <h1 className="font-display font-bold text-3xl text-[#0D1B2E] mb-3">
                  What is your current level?
                </h1>
                <p className="text-[#64748b]">This helps us recommend the right starting point for you.</p>
              </div>

              <div className="grid gap-3">
                {LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                      selectedLevel === level.value
                        ? "border-[#4f46e5] bg-[#eef2ff]"
                        : "border-[#e2e8f0] bg-white hover:border-[#4f46e5]/40 hover:bg-[#f8faff]"
                    }`}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#0D1B2E]">{level.label}</p>
                      <p className="text-sm text-[#64748b] mt-0.5">{level.description}</p>
                    </div>
                    {selectedLevel === level.value && (
                      <div className="w-5 h-5 rounded-full bg-[#4f46e5] flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:bg-[#f8fafc] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!selectedLevel || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {saving ? "Setting up your plan..." : "Start practicing"}
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
