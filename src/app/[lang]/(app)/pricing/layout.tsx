import type { Metadata } from "next";
import { CURRENCY, isLocale, localeAlternates } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const loc = isLocale(lang) ? lang : "en";
  const cur = CURRENCY[loc];
  return {
    title: `Pricing: Unlimited Assessment Practice for ${cur}4/month`,
    description: `Get unlimited access to all 38 job assessment practice tests for just ${cur}4/month. Cancel anytime. Start with 5 free tests today.`,
    alternates: localeAlternates("/pricing", loc),
    openGraph: {
      title: "Pricing | Ready to Ace",
      description: `Unlimited job assessment practice for ${cur}4/month. Start free.`,
    },
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
