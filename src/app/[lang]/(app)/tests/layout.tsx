import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Practice Assessment Tests: Numerical, Logical, Verbal & More",
  description:
    "Browse 38 free and pro job assessment practice tests. Numerical reasoning, logical reasoning, verbal reasoning, situational judgement and more. Used by candidates applying to top employers worldwide.",
  alternates: { canonical: "/tests" },
  openGraph: {
    title: "Free Practice Assessment Tests | Ready to Ace",
    description: "38 job assessment practice tests. Numerical, logical, verbal reasoning and more. Start free.",
  },
};

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
