"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, type ComponentProps } from "react";
import { localeFromPathname, localizePathname } from "@/lib/locales";

function localize(href: string, pathname: string): string {
  // Only rewrite internal, absolute paths; leave external URLs, anchors and
  // mailto/tel untouched.
  if (!href.startsWith("/")) return href;
  return localizePathname(href, localeFromPathname(pathname));
}

type NextLinkProps = ComponentProps<typeof NextLink>;

/**
 * Drop-in replacement for `next/link` that keeps the user in their current
 * locale. English (default) renders prefix-less paths; Dutch keeps its `/nl`
 * prefix across navigation. Imported as `Link` so existing JSX is unchanged.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, NextLinkProps>(
  function LocaleLink({ href, ...props }, ref) {
    const pathname = usePathname();
    const localized = typeof href === "string" ? localize(href, pathname) : href;
    return <NextLink ref={ref} href={localized} {...props} />;
  },
);

/**
 * Locale-aware replacement for `useRouter` covering the navigation methods we
 * use. `push`/`replace` localise absolute paths; the rest pass through.
 */
export function useLocaleRouter() {
  const router = useRouter();
  const pathname = usePathname();
  return {
    push: (href: string) => router.push(localize(href, pathname)),
    replace: (href: string) => router.replace(localize(href, pathname)),
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
    prefetch: (href: string) => router.prefetch(localize(href, pathname)),
  };
}
