import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Unlimited Assessment Practice for €4/month",
  description:
    "Get unlimited access to all 38 job assessment practice tests for just €4/month. Cancel anytime. Start with 5 free tests today.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Ready to Ace",
    description: "Unlimited job assessment practice for €4/month. Start free.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
