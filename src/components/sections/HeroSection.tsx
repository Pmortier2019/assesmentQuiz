import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { HeroDashboardMockup } from "./HeroDashboardMockup";

export function HeroSection() {
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
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF1FF] border border-[#BFD6FF] w-fit">
              <Sparkles size={13} className="text-[#2D7BFF]" />
              <span className="text-xs font-semibold text-[#2D7BFF]">Practice tests tailored to your profession</span>
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
              Practice hundreds of realistic assessment tests built around your profession, and walk into your job application ready to pass.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold shadow-lg hover:opacity-90 transition-opacity text-sm"
              >
                Start your first free test
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#e2e8f0] text-[#475569] font-semibold hover:border-[#2D7BFF]/40 hover:text-[#2D7BFF] transition-colors text-sm"
              >
                View test types
              </Link>
            </div>

            {/* Trust signals — honest, verifiable claims (no invented numbers) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm text-[#64748b]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" />
                5 free tests, no card needed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" />
                Instant scoring & explanations
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" />
                Modelled on SHL, Korn Ferry &amp; cut-e
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
