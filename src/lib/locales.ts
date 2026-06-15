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

/** Reads the active locale from a visible pathname (default locale = no prefix). */
export function localeFromPathname(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

export const SITE_URL = "https://www.ready-to-ace.com";

/**
 * Builds `alternates` metadata (self-canonical + reciprocal hreflang) for a
 * page. `path` is the locale-less canonical path, e.g. "/" or "/practice/x".
 * English lives at the root, Dutch under `/nl`; `x-default` points at English.
 */
export function localeAlternates(path: string, lang: Locale) {
  const clean = path === "/" ? "" : path;
  const en = `${SITE_URL}${clean}`;
  const nl = `${SITE_URL}/nl${clean}`;
  return {
    canonical: lang === "nl" ? nl : en,
    languages: { en, nl, "x-default": en },
  };
}
