import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import { BrandBackground, Eyebrow, SafeArea } from "../components";
import { SCENES } from "../timing";
import type { VideoQuestion } from "../questions";

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
 * Continuous quiz block: the prompt and answers settle in, a 5 -> 0 countdown
 * builds tension, then the correct answer is highlighted while the rest dim.
 * Kept as one sequence so nothing re-mounts between phases.
 */
export const QuizScene: React.FC<{ question: VideoQuestion }> = ({
  question,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { phase, local } = phaseFor(frame);

  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const isGrid = question.layout === "grid";

  return (
    <BrandBackground>
      <SafeArea justify="center">
        <div style={{ opacity: interpolate(enter, [0, 1], [0, 1]) }}>
          <Eyebrow>{question.eyebrow}</Eyebrow>
        </div>

        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 56,
            lineHeight: 1.18,
            letterSpacing: -1,
            color: colors.white,
            marginTop: 36,
            transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
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
              fontSize: 64,
              letterSpacing: 2,
              color: colors.navy,
            }}
          >
            {question.sequence}
          </div>
        ) : null}

        <Countdown phase={phase} local={local} fps={fps} />

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
            <AnswerCard
              key={answer.id}
              letter={LETTERS[i]}
              text={answer.text}
              enter={enter}
            />
          ))}
        </div>
      </SafeArea>
    </BrandBackground>
  );
};

const Countdown: React.FC<{ phase: Phase; local: number; fps: number }> = ({
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

// Neutral option tile. The correct answer is intentionally never highlighted —
// viewers pick a letter and comment it; the answer lives in the description.
const AnswerCard: React.FC<{
  letter: string;
  text: string;
  enter: number;
}> = ({ letter, text, enter }) => {
  const stagger = interpolate(enter, [0, 1], [0, 1]);

  return (
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
        opacity: 0.2 + 0.8 * stagger,
        transform: `translateY(${(1 - stagger) * 16}px)`,
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
};
