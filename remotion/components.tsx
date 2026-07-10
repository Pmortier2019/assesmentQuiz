import React from "react";
import { AbsoluteFill } from "remotion";
import { Check } from "lucide-react";
import {
  accentGradient,
  colors,
  fonts,
  SAFE_INSET_X,
  SAFE_INSET_Y,
} from "./theme";

/**
 * Full-bleed navy backdrop with a soft accent glow. Used behind every scene so
 * cross-fades blend on a consistent background.
 */
export const BrandBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 70% at 50% 18%, rgba(45,123,255,0.22), rgba(13,27,46,0) 60%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

/**
 * Centers content inside the safe band. The top and bottom ~15% are left clear
 * of essential content because the Shorts / TikTok / Reels UI overlays them.
 */
export const SafeArea: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
}> = ({ children, justify = "center" }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE_INSET_Y,
      paddingBottom: SAFE_INSET_Y,
      paddingLeft: SAFE_INSET_X,
      paddingRight: SAFE_INSET_X,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Small uppercase accent label above a prompt. */
export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: colors.accentFrom,
      padding: "14px 28px",
      borderRadius: 999,
      background: "rgba(45,123,255,0.12)",
      border: `2px solid rgba(45,123,255,0.35)`,
    }}
  >
    {children}
  </div>
);

/** The Ready to Ace mark: accent check tile + wordmark. Scales with `size`. */
export const Logo: React.FC<{ size?: number; light?: boolean }> = ({
  size = 1,
  light = true,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18 * size,
    }}
  >
    <div
      style={{
        width: 64 * size,
        height: 64 * size,
        borderRadius: 18 * size,
        background: accentGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(45,123,255,0.45)",
      }}
    >
      <Check
        size={40 * size}
        strokeWidth={4}
        color={colors.white}
        absoluteStrokeWidth
      />
    </div>
    <span
      style={{
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 40 * size,
        letterSpacing: -0.5,
        color: light ? colors.white : colors.navy,
      }}
    >
      Ready to Ace
    </span>
  </div>
);

/** Persistent, subtle brand mark pinned near the bottom safe line. */
export const FooterMark: React.FC = () => (
  <AbsoluteFill
    style={{
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: SAFE_INSET_Y - 86,
      pointerEvents: "none",
    }}
  >
    <div style={{ opacity: 0.55 }}>
      <Logo size={0.62} />
    </div>
  </AbsoluteFill>
);
