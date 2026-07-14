// Ready to Ace — shared design tokens for the Shorts pipeline.
//
// These mirror the brand values used across the marketing site so the videos
// feel like the product, not a separate thing. Keep them in sync with the
// site's palette if it ever shifts.

import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadDmSans } from "@remotion/google-fonts/DMSans";

// Display font (headlines, prompts, answers): Bricolage Grotesque, bold + tight.
const bricolage = loadBricolage("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

// Body font (explanation, fine print): DM Sans.
const dmSans = loadDmSans("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const fonts = {
  display: bricolage.fontFamily,
  body: dmSans.fontFamily,
};

export const colors = {
  navy: "#0D1B2E",
  navySoft: "#16263d",
  accentFrom: "#2D7BFF",
  accentTo: "#1D63E6",
  surface: "#EAF1FF",
  surfaceBorder: "#BFD6FF",
  correct: "#10b981",
  wrong: "#ef4444",
  white: "#ffffff",
  // Muted ink for secondary text on a light surface.
  ink: "#0D1B2E",
  inkMuted: "rgba(13, 27, 46, 0.62)",
};

export const accentGradient = `linear-gradient(135deg, ${colors.accentFrom}, ${colors.accentTo})`;

// Video dimensions and frame rate. The TikTok / Shorts / Reels UI overlays the
// top and bottom ~15%, so keep essential content inside the safe band.
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// 15% top + 15% bottom kept clear of essential content.
export const SAFE_INSET_Y = Math.round(VIDEO.height * 0.15); // 288px
export const SAFE_INSET_X = 88;
