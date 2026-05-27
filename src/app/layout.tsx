import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Ready to Ace — Free Job Assessment Practice Tests",
    template: "%s | Ready to Ace",
  },
  description:
    "Practice numerical reasoning, logical reasoning, verbal reasoning, situational judgement and more. Free job assessment tests used by top employers. Start free today.",
  keywords: [
    "job assessment practice",
    "numerical reasoning test",
    "logical reasoning test",
    "verbal reasoning test",
    "situational judgement test",
    "psychometric test practice",
    "SHL practice test",
    "aptitude test practice",
    "free assessment test",
    "job aptitude test",
    "graduate assessment practice",
    "korn ferry assessment",
    "cut-e assessment practice",
  ],
  authors: [{ name: "Ready to Ace" }],
  metadataBase: new URL("https://www.ready-to-ace.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ready to Ace — Free Job Assessment Practice Tests",
    description:
      "Practice numerical, logical, verbal reasoning and more. Free psychometric tests used by top employers. Start free today.",
    type: "website",
    url: "https://www.ready-to-ace.com",
    siteName: "Ready to Ace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready to Ace — Free Job Assessment Practice Tests",
    description: "Practice numerical, logical, verbal reasoning and more. Free psychometric tests used by top employers.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D1B2E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-[#0D1B2E] antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
