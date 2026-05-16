"use client";

import { useT, Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

const FLAGS: Record<Locale, string> = { en: "🇬🇧", nl: "🇳🇱" };
const LABELS: Record<Locale, string> = { en: "EN", nl: "NL" };

export function LanguageSwitcher({ compact = false, className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useT();
  const next: Locale = locale === "en" ? "nl" : "en";

  return (
    <button
      onClick={() => setLocale(next)}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold rounded-lg transition-colors",
        "text-[#64748b] hover:text-[#0D1B2E] hover:bg-[#f1f5f9]",
        compact ? "px-2 py-1" : "px-2.5 py-1.5",
        className
      )}
      title={locale === "en" ? "Schakel naar Nederlands" : "Switch to English"}
    >
      <span className="text-base leading-none">{FLAGS[next]}</span>
      {!compact && <span>{LABELS[next]}</span>}
    </button>
  );
}
