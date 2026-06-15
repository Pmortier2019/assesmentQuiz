import { MetadataRoute } from "next";
import { PRACTICE_PAGES } from "./[lang]/practice/[slug]/config";

const BASE_URL = "https://www.ready-to-ace.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single build timestamp so every entry reports a consistent lastModified.
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/tests`, lastModified, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/pricing`, lastModified, priority: 0.8, changeFrequency: "monthly" },
  ];

  // Derive practice routes from the page config so the sitemap can never drift
  // out of sync with the pages that actually exist.
  const practiceRoutes: MetadataRoute.Sitemap = Object.keys(PRACTICE_PAGES).map((slug) => ({
    url: `${BASE_URL}/practice/${slug}`,
    lastModified,
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...practiceRoutes];
}
