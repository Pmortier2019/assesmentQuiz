import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { accentGradient, colors, fonts } from "../theme";
import { BrandBackground, FooterMark, SafeArea } from "../components";

/**
 * ~1.5s opener. Two layers: a small "stakes" line (why this matters) above a
 * bold "challenge" line that earns the next few seconds of attention. Springs
 * in, with an accent underline that sweeps open.
 */
export const HookScene: React.FC<{ stakes: string; challenge: string }> = ({
  stakes,
  challenge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const scale = interpolate(pop, [0, 1], [0.82, 1]);
  const underline = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <BrandBackground>
      <SafeArea>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: colors.accentFrom,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateRight: "clamp",
            }),
            marginBottom: 40,
          }}
        >
          {stakes}
        </div>

        <div
          style={{
            transform: `scale(${scale})`,
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 108,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: colors.white,
          }}
        >
          {challenge}
        </div>

        <div
          style={{
            marginTop: 48,
            width: 360,
            height: 14,
            borderRadius: 999,
            background: accentGradient,
            transform: `scaleX(${underline})`,
            transformOrigin: "center",
          }}
        />
      </SafeArea>
      <FooterMark />
    </BrandBackground>
  );
};
