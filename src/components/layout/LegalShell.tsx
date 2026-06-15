"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { LogoMark } from "@/components/ui/Logo";

/**
 * Public shell for the legal pages (Terms, Privacy). Renders a minimal header
 * with the logo and a footer that cross-links the legal pages — no auth, no
 * app chrome, so it's reachable by anyone.
 */
export function LegalShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <LogoMark size={30} className="shrink-0" />
            <span className="font-display font-bold text-[#2F5233] text-lg tracking-tight">
              Ready to <span className="text-[#EF96BD]">Ace</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-default">{title}</h1>
        <p className="text-sm text-subtle mt-2">{lastUpdated}</p>
        <div className="legal-prose mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted">
          {children}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

function LegalFooter() {
  const { t } = useT();
  return (
    <footer className="border-t border-line">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#94a3b8]">
        <Link href="/" className="hover:text-[#475569] transition-colors">{t("legal_home")}</Link>
        <Link href="/terms" className="hover:text-[#475569] transition-colors">{t("legal_terms")}</Link>
        <Link href="/privacy" className="hover:text-[#475569] transition-colors">{t("legal_privacy")}</Link>
        <span className="text-xs">© 2026 Ready to <span className="text-[#EF96BD]">Ace</span></span>
      </div>
    </footer>
  );
}
