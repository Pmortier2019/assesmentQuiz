import { Star, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export function SocialProofSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-3">
            What do our users think?
          </h2>
          <p className="text-[#64748b]">We&apos;re just getting started — be among the first to try it.</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] flex items-center justify-center">
            <MessageSquarePlus size={28} className="text-[#4f46e5]" />
          </div>
          <div className="text-center max-w-sm">
            <p className="font-display font-semibold text-[#0D1B2E] text-lg mb-2">Be the first to review</p>
            <p className="text-sm text-[#64748b]">
              Start practicing today and share your results. Real reviews from real users — nothing made up.
            </p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="text-[#e2e8f0] fill-[#e2e8f0]" />
            ))}
          </div>
          <Link
            href="/onboarding"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start practicing for free
          </Link>
        </div>
      </div>
    </section>
  );
}
