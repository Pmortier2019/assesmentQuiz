import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { accentGradient, colors, fonts } from "../theme";
import { BrandBackground, FooterMark, SafeArea } from "../components";
import { SCENES } from "../timing";

/**
 * Short loop-back beat. Keeps the comment CTA alive and shows the practice link
 * (the funnel), then fades toward navy so an auto-replay flows back into the
 * hook without reading as a repeat. The explanation deliberately lives off-video
 * (in the pasted description), which is what pulls viewers into the comments.
 */
export const LoopScene: React.FC<{ ctaPath: string }> = ({ ctaPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });

  // Fade out over the last third so the end meets the hook's navy start frame.
  const fade = interpolate(frame, [SCENES.loop - 14, SCENES.loop], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BrandBackground>
      <SafeArea>
        <div style={{ opacity: fade, transform: `scale(${interpolate(pop, [0, 1], [0.9, 1])})` }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 64,
              letterSpacing: -1,
              color: colors.white,
            }}
          >
            Comment your answer 👇
          </div>

          <div
            style={{
              marginTop: 40,
              display: "inline-block",
              padding: "20px 44px",
              borderRadius: 999,
              background: accentGradient,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 40,
              color: colors.white,
              boxShadow: "0 16px 44px rgba(45,123,255,0.5)",
            }}
          >
            Practice free
          </div>

          <div
            style={{
              marginTop: 28,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 36,
              color: colors.surfaceBorder,
            }}
          >
            readytoace.com{ctaPath}
          </div>
        </div>
      </SafeArea>
      <div style={{ opacity: fade }}>
        <FooterMark />
      </div>
    </BrandBackground>
  );
};
