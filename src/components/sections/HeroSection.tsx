import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroDashboardMockup } from "./HeroDashboardMockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Base wash */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[600px] bg-gradient-to-b from-[#eef2ff]/70 to-transparent" />
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
              Practice hundreds of real assessment tests built around your profession — and walk into your job application ready to pass.
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
