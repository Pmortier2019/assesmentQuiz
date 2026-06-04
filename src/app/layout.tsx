import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { QueryProvider } from "@/lib/queryClient";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${bricolage.variable} ${dmSans.variable}`}>
      <body className="min-h-full flex flex-col bg-surface text-default antialiased">
        {/* Set the theme class before first paint to avoid a white flash for
            users who prefer dark. Mirrors DarkModeToggle's localStorage key. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        <LanguageProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
