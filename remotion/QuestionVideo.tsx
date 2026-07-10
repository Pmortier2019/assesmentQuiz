import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { colors } from "./theme";
import { QUIZ_DURATION, SCENES, TRANSITION } from "./timing";
import { ctaPath, stakesLine, type VideoQuestion } from "./questions";
import { HookScene } from "./scenes/HookScene";
import { QuizScene } from "./scenes/QuizScene";
import { LoopScene } from "./scenes/LoopScene";

/**
 * The one reusable video. Every question renders through this component; only
 * the data differs. Scenes are joined by short cross-fades in a loop shape tuned
 * for completion, replays and comments: hook (stakes + challenge) -> quiz
 * (question / countdown / comment CTA) -> loop-back to the hook. The correct
 * answer is never shown on-screen; it (and the "why") live in the pasted
 * description, which is what drives the comments.
 */
export const QuestionVideo: React.FC<{ question: VideoQuestion }> = ({
  question,
}) => {
  const crossFade = (
    <TransitionSeries.Transition
      timing={linearTiming({ durationInFrames: TRANSITION })}
      presentation={fade()}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.hook}>
          <HookScene
            stakes={stakesLine(question)}
            challenge={question.challenge}
          />
        </TransitionSeries.Sequence>

        {crossFade}

        <TransitionSeries.Sequence durationInFrames={QUIZ_DURATION}>
          <QuizScene question={question} />
        </TransitionSeries.Sequence>

        {crossFade}

        <TransitionSeries.Sequence durationInFrames={SCENES.loop}>
          <LoopScene ctaPath={ctaPath(question)} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
