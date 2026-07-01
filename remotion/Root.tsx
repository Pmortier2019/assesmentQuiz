import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import { TOTAL_DURATION } from "./timing";
import { compositionId, VIDEO_QUESTIONS } from "./questions";
import { QuestionVideo } from "./QuestionVideo";

/**
 * One composition per question. Adding a question to VIDEO_QUESTIONS adds a
 * composition here automatically, so it shows up in Studio and in the batch
 * render with no extra wiring.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEO_QUESTIONS.map((question, index) => (
      <Composition
        key={compositionId(question, index)}
        id={compositionId(question, index)}
        component={QuestionVideo}
        durationInFrames={TOTAL_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ question }}
      />
    ))}
  </>
);
