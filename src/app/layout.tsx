import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { QueryProvider } from "@/lib/queryClient";

export const metadata: Metadata = {
  title: {
    default: "Ready to Ace — Free Job Assessment Practice Tests",
    template: "%s | Ready to Ace",
  },
  description:
    "Practice the real numerical, logical & verbal reasoning tests employers use — and walk into your assessment confident. Hundreds of questions, free to start.",
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
  openGraph: {
    title: "Ready to Ace — Free Job Assessment Practice Tests",
    description:
      "Practice the real numerical, logical & verbal reasoning tests employers use — and walk into your assessment confident. Hundreds of questions, free to start.",
    type: "website",
    url: "https://www.ready-to-ace.com",
    siteName: "Ready to Ace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready to Ace — Free Job Assessment Practice Tests",
    description: "Practice the real numerical, logical & verbal reasoning tests employers use — and walk into your assessment confident. Hundreds of questions, free to start.",
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
          <QueryProvider>
            {children}
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
