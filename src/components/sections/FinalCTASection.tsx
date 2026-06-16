import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, Zap } from "lucide-react";

export function FinalCTASection({ currency = "$" }: { currency?: string }) {
  return (
    <section className="py-24 bg-[#0D1B2E] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2D7BFF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#1D63E6]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] flex items-center justify-center shadow-xl">
          <Zap size={24} className="text-white fill-white" />
        </div>

        <div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight tracking-tight">
            Your next assessment
            <br />
            starts today.
          </h2>
          <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            5 free tests, no credit card required. Join thousands of candidates who practice smarter.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-bold text-base shadow-2xl hover:opacity-90 transition-opacity"
          >
            Start for free
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white/80 font-semibold text-base hover:border-white/40 hover:text-white transition-all"
          >
            View Pro plan
          </Link>
        </div>

        <p className="text-sm text-white/30">
          No credit card · 5 free tests · Upgrade anytime for {currency}4/month
        </p>
      </div>
    </section>
  );
}
