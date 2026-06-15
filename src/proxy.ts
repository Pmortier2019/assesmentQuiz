import { NextResponse, type NextRequest } from "next/server";

// Locale routing: English is the default and keeps clean, prefix-less URLs so
// existing indexed pages and internal links keep working; Dutch lives under
// `/nl`. We deliberately do NOT auto-redirect on Accept-Language — that hurts
// SEO and surprises users. Language is chosen explicitly via the switcher.
const DEFAULT_LOCALE = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dutch URLs already carry their locale segment — render as-is.
  if (pathname === "/nl" || pathname.startsWith("/nl/")) {
    return NextResponse.next();
  }

  // Default locale: rewrite internally to `/en/...` so the [lang] segment
  // resolves, while the browser keeps the clean prefix-less URL.
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on everything except Next internals, API routes, the extension-less
  // metadata image routes, and any path with a file extension (sitemap.xml,
  // robots.txt, icon.png, static assets, …).
  matcher: ["/((?!_next/|api/|opengraph-image|twitter-image|.*\\..*).*)"],
};
