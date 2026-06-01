import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Zap, ArrowRight, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { FooterNav } from "@/components/layout/FooterNav";
import { PRACTICE_PAGES } from "./config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PRACTICE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PRACTICE_PAGES[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: `/practice/${slug}` },
    openGraph: {
      title: `${page.title} | Ready to Ace`,
      description: page.metaDescription,
      url: `https://www.ready-to-ace.com/practice/${slug}`,
    },
  };
}

export default async function PracticePage({ params }: Props) {
  const { slug } = await params;
  const page = PRACTICE_PAGES[slug];
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0D1B2E] to-[#1e1b4b] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide uppercase mb-4">
              {page.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              {page.headline}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {page.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
              >
                <Zap size={18} className="fill-white" />
                Start Free — No Sign-Up Required
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-colors"
              >
                Browse All Tests
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0D1B2E] mb-8 text-center">
              What&apos;s included in our {page.title.replace(" Practice", "")} practice
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {page.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                  <CheckCircle2 size={20} className="text-[#4f46e5] mt-0.5 shrink-0" />
                  <span className="text-[#374151] font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA mid-page */}
        <section className="py-12 px-4 bg-[#f8fafc] border-y border-[#e2e8f0]">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-lg font-semibold text-[#0D1B2E] mb-2">
              Start with 5 free tests — no credit card needed
            </p>
            <p className="text-sm text-[#64748b] mb-6">
              Unlimited access from €4/month. Cancel anytime.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold shadow hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0D1B2E] mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-4">
              {page.faqs.map(({ q, a }) => (
                <details key={q} className="group border border-[#e2e8f0] rounded-xl p-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-[#0D1B2E]">
                    {q}
                    <ChevronDown size={18} className="text-[#94a3b8] group-open:rotate-180 transition-transform shrink-0 ml-3" />
                  </summary>
                  <p className="mt-3 text-[#475569] text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to start practising?</h2>
          <p className="text-white/80 mb-6">Join thousands of candidates preparing for their job assessments.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#4f46e5] font-bold shadow hover:shadow-lg transition-shadow"
          >
            <Zap size={18} className="fill-[#4f46e5]" />
            Start Free Today
          </Link>
        </section>
      </main>

      <footer className="bg-white border-t border-[#e2e8f0] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-bold text-[#0D1B2E]">Ready to <span className="text-[#4f46e5]">Ace</span></span>
          </Link>
          <FooterNav />
          <p className="text-xs text-[#94a3b8]">© 2026 Ready to Ace. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
