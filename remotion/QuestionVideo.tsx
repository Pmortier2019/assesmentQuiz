import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { colors } from "./theme";
import { QUIZ_DURATION, SCENES, TRANSITION } from "./timing";
import { ctaPath, type VideoQuestion } from "./questions";
import { Soundtrack } from "./audio";
import { QuizScene } from "./scenes/QuizScene";
import { LoopScene } from "./scenes/LoopScene";

/**
 * The one reusable video. Every question renders through this component; only
 * the data differs. The video opens directly on the quiz (question, answers and
 * challenge line all visible on frame 0 — the question IS the hook), runs the
 * countdown into the comment CTA, then a short loop-back beat flows into an
 * auto-replay. The correct answer is never shown on-screen; it (and the "why")
 * live in the pasted description, which is what drives the comments.
 */
export const QuestionVideo: React.FC<{ question: VideoQuestion }> = ({
  question,
}) => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Soundtrack voiceover={question.voiceover} />

    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={QUIZ_DURATION}>
        <QuizScene question={question} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: TRANSITION })}
        presentation={fade()}
      />

      <TransitionSeries.Sequence durationInFrames={SCENES.loop}>
        <LoopScene ctaPath={ctaPath(question)} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
