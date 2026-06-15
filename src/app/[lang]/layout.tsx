import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { QueryProvider } from "@/lib/queryClient";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LOCALES, isLocale, type Locale } from "@/lib/locales";

// Self-hosted at build time (no render-blocking Google Fonts request, no CLS).
// Both are variable fonts, so the full weight range comes for free.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
});

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

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <html lang={locale} className={`h-full ${bricolage.variable} ${dmSans.variable}`}>
      <body className="min-h-full flex flex-col bg-surface text-default antialiased">
        <LanguageProvider locale={locale}>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
