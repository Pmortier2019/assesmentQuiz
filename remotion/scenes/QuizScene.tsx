import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { accentGradient, colors, fonts } from "../theme";
import { BrandBackground, SafeArea } from "../components";
import { SCENES } from "../timing";
import { stakesLine, type VideoQuestion } from "../questions";

const PER_TICK = SCENES.countdown / 6; // 5,4,3,2,1,0 across the countdown

type Phase = "question" | "countdown" | "commentCta";

const COUNTDOWN_END = SCENES.question + SCENES.countdown;

function phaseFor(frame: number): { phase: Phase; local: number } {
  if (frame < SCENES.question) return { phase: "question", local: frame };
  if (frame < COUNTDOWN_END)
    return { phase: "countdown", local: frame - SCENES.question };
  return { phase: "commentCta", local: frame - COUNTDOWN_END };
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * The opening AND main scene. Frame 0 already shows the challenge line, the
 * prompt and every answer at full opacity: the swipe/stay decision in the
 * Shorts feed falls inside the first second, so nothing may fade in late.
 * Motion comes from the underline sweep and, later, the countdown pulse —
 * polish only, never gating visibility. No brand mark here; branding waits
 * until the loop scene.
 */
export const QuizScene: React.FC<{ question: VideoQuestion }> = ({
  question,
}) => {
  const frame = useCurrentFrame();
  const { phase, local } = phaseFor(frame);

  const underline = interpolate(frame, [4, 26], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isGrid = question.layout === "grid";

  // Long sequences (e.g. a look-and-say series) overflow the safe band at the
  // default size, so shrink the box font once the string gets long.
  const seqLong = (question.sequence?.length ?? 0) > 22;
  const seqFontSize = seqLong ? 44 : 64;
  const seqLetterSpacing = seqLong ? 1 : 2;

  return (
    <BrandBackground>
      <SafeArea justify="center">
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 1,
            color: colors.surfaceBorder,
            marginBottom: 14,
          }}
        >
          {stakesLine(question)}
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: -0.5,
            color: colors.accentFrom,
          }}
        >
          {question.challenge}
        </div>
        <div
          style={{
            marginTop: 18,
            width: 300,
            height: 10,
            borderRadius: 999,
            background: accentGradient,
            transform: `scaleX(${underline})`,
            transformOrigin: "center",
          }}
        />

        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 56,
            lineHeight: 1.18,
            letterSpacing: -1,
            color: colors.white,
            marginTop: 36,
          }}
        >
          {question.prompt}
        </div>

        {question.sequence ? (
          <div
            style={{
              marginTop: 28,
              padding: "22px 36px",
              borderRadius: 22,
              background: colors.surface,
              border: `2px solid ${colors.surfaceBorder}`,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: seqFontSize,
              letterSpacing: seqLetterSpacing,
              color: colors.navy,
            }}
          >
            {question.sequence}
          </div>
        ) : null}

        <Countdown phase={phase} local={local} />

        <div
          style={{
            marginTop: 28,
            width: "100%",
            display: "grid",
            gridTemplateColumns: isGrid ? "1fr 1fr" : "1fr",
            gap: 20,
          }}
        >
          {question.answers.map((answer, i) => (
            <AnswerCard key={answer.id} letter={LETTERS[i]} text={answer.text} />
          ))}
        </div>
      </SafeArea>
    </BrandBackground>
  );
};

const Countdown: React.FC<{ phase: Phase; local: number }> = ({
  phase,
  local,
}) => {
  const size = 168;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  if (phase === "question") {
    // Reserve the space so the layout does not jump when the timer appears.
    return <div style={{ height: size, marginTop: 28 }} />;
  }

  if (phase === "commentCta") {
    // Tension peak: the timer is spent, so prompt the comment before the flash.
    return (
      <div
        style={{
          height: size,
          marginTop: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: fonts.display,
          color: colors.white,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 46, letterSpacing: -0.5 }}>
          Comment your answer
        </span>
        <span style={{ fontSize: 52 }}>👇</span>
      </div>
    );
  }

  const elapsed = local / SCENES.countdown; // 0 -> 1
  const number = Math.max(0, 5 - Math.floor(local / PER_TICK));
  const tickPhase = (local % PER_TICK) / PER_TICK;
  const pulse = interpolate(tickPhase, [0, 0.35], [1.14, 1], {
    extrapolateRight: "clamp",
  });
  const urgent = number <= 1;
  const ringColor = urgent ? colors.wrong : colors.accentFrom;

  return (
    <div
      style={{
        height: size,
        marginTop: 28,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${pulse})`,
      }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * elapsed}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily={fonts.display}
          fontWeight={800}
          fontSize={86}
          fill={colors.white}
        >
          {number}
        </text>
      </svg>
    </div>
  );
};

// Neutral option tile, fully visible from frame 0. The correct answer is
// intentionally never highlighted — viewers pick a letter and comment it; the
// answer lives in the description.
const AnswerCard: React.FC<{ letter: string; text: string }> = ({
  letter,
  text,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      textAlign: "left",
      padding: "26px 28px",
      borderRadius: 22,
      background: colors.surface,
      border: `3px solid ${colors.surfaceBorder}`,
      color: colors.navy,
    }}
  >
    <div
      style={{
        flexShrink: 0,
        width: 56,
        height: 56,
        borderRadius: 14,
        background: "#ffffff",
        border: `2px solid ${colors.surfaceBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 30,
        color: colors.accentTo,
      }}
    >
      {letter}
    </div>
    <span
      style={{
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: 38,
        lineHeight: 1.15,
      }}
    >
      {text}
    </span>
  </div>
);
