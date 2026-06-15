// Shared locale constants and pure path helpers, usable from both server
// (layout, metadata, sitemap) and client (i18n provider, links) code.

export const LOCALES = ["en", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Strips the locale prefix from a visible pathname. The default locale (en)
 * has no prefix, so only `/nl` is ever present.
 */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/nl(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/**
 * Rewrites a visible pathname to point at the given locale. English keeps the
 * clean prefix-less path; Dutch gets a `/nl` prefix.
 */
export function localizePathname(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return base;
  return base === "/" ? "/nl" : `/nl${base}`;
}
