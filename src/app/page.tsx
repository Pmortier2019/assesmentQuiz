import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { TestCarouselSection } from "@/components/sections/TestCarouselSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { FooterNav } from "@/components/layout/FooterNav";
import Link from "next/link";
import { Zap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t border-[#e2e8f0] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-[#0D1B2E]">
              Ready to <span className="gradient-text">Ace</span>
            </span>
          </Link>
          <FooterNav />
          <p className="text-xs text-[#94a3b8]">© 2026 Ready to Ace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ValueSection />
        <TestCarouselSection />
        <SocialProofSection />
        <FeaturesSection />
        <PricingPreviewSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
