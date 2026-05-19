import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Ready to Ace — Train for job assessments. Every day.",
    template: "%s | Ready to Ace",
  },
  description:
    "Practice the tests companies use during hiring. Start with 5 free assessments, then unlock unlimited AI-generated practice for €4/month.",
  keywords: ["assessment", "job application", "practice tests", "numerical reasoning", "logical reasoning"],
  authors: [{ name: "Ready to Ace" }],
  openGraph: {
    title: "Ready to Ace — Train for job assessments",
    description: "Practice numerical, logical, verbal reasoning and more. Duolingo for professionals.",
    type: "website",
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
