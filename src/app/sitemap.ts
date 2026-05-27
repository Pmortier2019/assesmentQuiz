import { MetadataRoute } from "next";

const BASE_URL = "https://www.ready-to-ace.com";

const practicePages = [
  "numerical-reasoning",
  "logical-reasoning",
  "verbal-reasoning",
  "situational-judgement",
  "critical-reasoning",
  "data-interpretation",
  "work-style-assessment",
  "leadership-assessment",
  "professional-ethics",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/tests`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/pricing`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/login`, priority: 0.5, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/onboarding`, priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const practiceRoutes = practicePages.map((slug) => ({
    url: `${BASE_URL}/practice/${slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...practiceRoutes];
}
