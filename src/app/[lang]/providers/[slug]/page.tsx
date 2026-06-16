import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { CheckCircle2, Zap, ArrowRight, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { FooterNav } from "@/components/layout/FooterNav";
import { PROVIDER_PAGES } from "./config";
import { PRACTICE_PAGES } from "../../practice/[slug]/config";
import { LogoMark } from "@/components/ui/Logo";
import { isLocale, localeAlternates, SITE_URL, type Locale } from "@/lib/locales";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

// Per-locale UI chrome so /nl renders fully Dutch, not English buttons.
const UI: Record<Locale, {
  startFree: string;
  browseAll: string;
  covers: (name: string) => string;
  freeLine: string;
  freeSub: string;
  getStarted: string;
  faq: string;
  ctaTitle: string;
  ctaSub: string;
  ctaButton: string;
}> = {
  en: {
    startFree: "Start Free — No Sign-Up Required",
    browseAll: "Browse All Tests",
    covers: (name) => `Tests ${name} uses`,
    freeLine: "Start with 5 free tests — no credit card needed",
    freeSub: "Unlimited access from $4/month. Cancel anytime.",
    getStarted: "Get Started Free",
    faq: "Frequently Asked Questions",
    ctaTitle: "Ready to start practising?",
    ctaSub: "Be one of the first to prepare smarter for your job assessment.",
    ctaButton: "Start Free Today",
  },
  nl: {
    startFree: "Gratis starten — geen account nodig",
    browseAll: "Bekijk alle tests",
    covers: (name) => `Tests die ${name} gebruikt`,
    freeLine: "Begin met 5 gratis tests — geen creditcard nodig",
    freeSub: "Onbeperkte toegang vanaf €4/maand. Altijd opzegbaar.",
    getStarted: "Gratis beginnen",
    faq: "Veelgestelde vragen",
    ctaTitle: "Klaar om te oefenen?",
    ctaSub: "Wees een van de eersten die zich slimmer voorbereidt op het assessment.",
    ctaButton: "Begin vandaag gratis",
  },
};

export async function generateStaticParams() {
  return Object.keys(PROVIDER_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const loc: Locale = isLocale(lang) ? lang : "en";
  const page = PROVIDER_PAGES[slug]?.[loc];
  if (!page) return {};
  const alternates = localeAlternates(`/providers/${slug}`, loc);
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates,
    openGraph: {
      title: `${page.title} | Ready to Ace`,
      description: page.metaDescription,
      url: `${SITE_URL}${loc === "nl" ? "/nl" : ""}/providers/${slug}`,
    },
  };
}

export default async function ProviderPage({ params }: Props) {
  const { lang, slug } = await params;
  const loc: Locale = isLocale(lang) ? lang : "en";
  const page = PROVIDER_PAGES[slug]?.[loc];
  if (!page) notFound();
  const ui = UI[loc];

  // Resolve related practice pages for internal links (skip any missing slug).
  const related = page.relatedSlugs
    .map((s) => ({ slug: s, page: PRACTICE_PAGES[s]?.[loc] }))
    .filter((r): r is { slug: string; page: NonNullable<typeof r.page> } => Boolean(r.page));

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
        <section className="bg-gradient-to-br from-[#0D1B2E] to-[#15275C] text-white py-20 px-4">
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
              >
                <Zap size={18} className="fill-white" />
                {ui.startFree}
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-colors"
              >
                {ui.browseAll}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0D1B2E] mb-8 text-center">
              {ui.covers(page.name)}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {page.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                  <CheckCircle2 size={20} className="text-[#2D7BFF] mt-0.5 shrink-0" />
                  <span className="text-[#374151] font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related practice pages — internal links */}
        {related.length > 0 && (
          <section className="py-16 px-4 bg-[#f8fafc] border-y border-[#e2e8f0]">
            <div className="max-w-3xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map(({ slug: s, page: p }) => (
                  <Link
                    key={s}
                    href={`/practice/${s}`}
                    className="group flex items-center justify-between gap-3 p-5 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#2D7BFF] hover:shadow-sm transition-all"
                  >
                    <span className="font-semibold text-[#0D1B2E]">{p.title}</span>
                    <ArrowRight size={18} className="text-[#94a3b8] group-hover:text-[#2D7BFF] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA mid-page */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-lg font-semibold text-[#0D1B2E] mb-2">{ui.freeLine}</p>
            <p className="text-sm text-[#64748b] mb-6">{ui.freeSub}</p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#2D7BFF] to-[#1D63E6] text-white font-semibold shadow hover:opacity-90 transition-opacity"
            >
              {ui.getStarted}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0D1B2E] mb-8 text-center">{ui.faq}</h2>
            <div className="flex flex-col gap-4">
              {page.faqs.map(({ q, a }) => (
                <details key={q} className="group border border-[#e2e8f0] rounded-xl p-5 bg-white">
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
        <section className="py-16 px-4 bg-gradient-to-br from-[#2D7BFF] to-[#1D63E6] text-white text-center">
          <h2 className="text-2xl font-bold mb-3">{ui.ctaTitle}</h2>
          <p className="text-white/80 mb-6">{ui.ctaSub}</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#2D7BFF] font-bold shadow hover:shadow-lg transition-shadow"
          >
            <Zap size={18} className="fill-[#2D7BFF]" />
            {ui.ctaButton}
          </Link>
        </section>
      </main>

      <footer className="bg-white border-t border-[#e2e8f0] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={30} className="shrink-0" />
            <span className="font-bold text-[#0D1B2E]">Ready to <span className="text-[#2D7BFF]">Ace</span></span>
          </Link>
          <FooterNav />
          <p className="text-xs text-[#94a3b8]">© 2026 Ready to Ace. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
