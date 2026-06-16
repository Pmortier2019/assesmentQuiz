import { MetadataRoute } from "next";
import { PRACTICE_PAGES } from "./[lang]/practice/[slug]/config";
import { PROVIDER_PAGES } from "./[lang]/providers/[slug]/config";
import { SITE_URL } from "@/lib/locales";

type Entry = { path: string; priority: number; changeFrequency: "weekly" | "monthly" };

export default function sitemap(): MetadataRoute.Sitemap {
  // Single build timestamp so every entry reports a consistent lastModified.
  const lastModified = new Date();

  const entries: Entry[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/tests", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    // Practice routes are derived from the page config so the sitemap can never
    // drift out of sync with the pages that actually exist.
    ...Object.keys(PRACTICE_PAGES).map(
      (slug): Entry => ({ path: `/practice/${slug}`, priority: 0.9, changeFrequency: "monthly" }),
    ),
    // Provider landing pages, likewise derived from their config.
    ...Object.keys(PROVIDER_PAGES).map(
      (slug): Entry => ({ path: `/providers/${slug}`, priority: 0.8, changeFrequency: "monthly" }),
    ),
  ];

  return entries.map(({ path, priority, changeFrequency }) => {
    const clean = path === "/" ? "" : path;
    const en = `${SITE_URL}${clean}`;
    const nl = `${SITE_URL}/nl${clean}`;
    return {
      url: en,
      lastModified,
      changeFrequency,
      priority,
      // hreflang in the sitemap, reciprocal with the per-page alternates.
      alternates: { languages: { en, nl } },
    };
  });
}
