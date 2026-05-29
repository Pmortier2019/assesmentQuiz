import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://www.ready-to-ace.com/#app",
      "name": "Ready to Ace",
      "url": "https://www.ready-to-ace.com",
      "description": "Practice job assessment tests used by top employers. Numerical reasoning, logical reasoning, verbal reasoning, situational judgement and more.",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "5 free assessments, then €4/month for unlimited access",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What types of assessment tests can I practice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ready to Ace offers practice tests for numerical reasoning, logical reasoning, verbal reasoning, situational judgement, critical reasoning, data interpretation, work style, leadership and more — the same types used by top employers and assessment providers like SHL, Korn Ferry and cut-e.",
          },
        },
        {
          "@type": "Question",
          "name": "Is Ready to Ace free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can start with 5 free assessment tests. Unlimited access is available for €4 per month.",
          },
        },
        {
          "@type": "Question",
          "name": "Which companies use these types of assessments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most large employers in finance, consulting, technology, government and healthcare use psychometric assessments during hiring. This includes banks, consulting firms, tech companies and graduate employers worldwide.",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
