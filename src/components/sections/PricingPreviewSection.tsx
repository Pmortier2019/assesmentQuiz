import { PricingCard } from "@/components/cards/PricingCard";

export function PricingPreviewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-[#64748b] text-lg max-w-md mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-center">
          <PricingCard plan="free" />
          <PricingCard plan="pro" highlighted />
        </div>

        <p className="text-center text-sm text-[#94a3b8] mt-8">
          Cancel anytime · Billed monthly · No commitments
        </p>
      </div>
    </section>
  );
}
