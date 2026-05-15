import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CareerSetupBanner() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#c7d2fe] bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-[#0D1B2E] mb-1">
            Unlock personalised recommendations
          </h3>
          <p className="text-sm text-[#475569] mb-4 leading-relaxed">
            Tell us the role and industry you're targeting. We'll build a preparation plan that matches what employers actually test.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Set up my profile
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
