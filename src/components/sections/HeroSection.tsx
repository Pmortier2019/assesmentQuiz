import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Flame, BookOpen } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto animate-float">
      {/* Main card */}
      <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94a3b8] font-medium">Welcome back</p>
            <p className="font-display font-bold text-[#0D1B2E]">Pierre</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <Flame size={14} className="text-amber-500 fill-amber-400" />
            <span className="text-sm font-semibold text-amber-700">7 days</span>
          </div>
        </div>

        {/* Score improvement */}
        <div className="rounded-xl bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#4f46e5]">Score improvement</span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#10b981]">
              <TrendingUp size={12} />
              +18%
            </div>
          </div>
          <div className="flex items-end gap-1 h-12">
            {[40, 55, 48, 65, 72, 68, 80].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#4f46e5] to-[#7c3aed] opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Recommended test */}
        <div className="rounded-xl border border-[#e2e8f0] p-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-[#4f46e5]" />
            <span className="text-xs font-semibold text-[#4f46e5]">Recommended</span>
          </div>
          <p className="text-sm font-semibold text-[#0D1B2E] mb-2">Numerical Reasoning — Level 2</p>
          <ProgressBar value={65} size="sm" />
          <p className="text-xs text-[#94a3b8] mt-1.5">65% mastery · 12 min</p>
        </div>

        {/* Tests progress */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#64748b] font-medium">Free tests used</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${i < 3 ? "bg-[#4f46e5]" : "bg-[#e2e8f0]"}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#475569]">3/5</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-3 py-2 flex items-center gap-2 animate-slide-right delay-300">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] text-[#94a3b8]">Your profession</p>
          <p className="text-xs font-bold text-[#0D1B2E]">New test!</p>
        </div>
      </div>

      {/* Score badge */}
      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-[#e2e8f0] px-3 py-2 animate-slide-right delay-500">
        <p className="text-[10px] text-[#94a3b8]">Latest score</p>
        <p className="text-base font-display font-extrabold text-[#10b981]">84%</p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-[#eef2ff]/60 to-transparent" />
        <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full bg-[#4f46e5]/6 blur-3xl" />
        <div className="absolute top-40 right-[5%] w-64 h-64 rounded-full bg-[#7c3aed]/8 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6 animate-fade-up">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef2ff] border border-[#c7d2fe] w-fit">
              <Sparkles size={13} className="text-[#4f46e5]" />
              <span className="text-xs font-semibold text-[#4f46e5]">Practice tests tailored to your profession</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] text-[#0D1B2E] leading-[1.05] tracking-tight">
              Ace your{" "}
              <span className="gradient-text">assessment.</span>
              <br />
              Get the job.
            </h1>

            {/* Subtext */}
            <p className="text-lg text-[#475569] leading-relaxed max-w-lg">
              Practice tests built around your profession and the companies you want to join. Start with 5 free assessments, then unlock unlimited practice for{" "}
              <span className="font-semibold text-[#0D1B2E]">€4/month</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold shadow-lg hover:opacity-90 transition-opacity text-sm"
              >
                Start free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:border-[#4f46e5]/40 hover:text-[#4f46e5] transition-colors text-sm"
              >
                View test types
              </Link>
            </div>

            {/* Social proof mini */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["SK", "TB", "NV", "ML"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-xs text-[#64748b]">
                  <span className="font-semibold text-[#0D1B2E]">12,400+</span> tests completed
                </p>
              </div>
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
