// Scene timing for one question video, in frames at VIDEO.fps (30fps).
//
// The video opens directly on the quiz: prompt, answers and the challenge line
// are all fully visible on frame 0, because the swipe/stay decision in the
// Shorts feed falls inside the first second. There is no separate hook scene —
// the question itself is the hook.
//
// Loop structure (optimised for completion, replays, comments):
//   quiz[question + countdown + commentCta] -> loop-back
// The correct answer is deliberately NOT shown on-screen: it lives off-video in
// the pasted description (with the "why"), which is what drives the comments.

export const TRANSITION = 14; // cross-fade length between sequences

export const SCENES = {
  // Quiz phases run inside one sequence and share the screen:
  question: 84, //   read time before the timer starts (~2.8s)
  countdown: 150, //  visible 5 -> 0 (5s)
  commentCta: 66, //  "Comment your answer" climax, no reveal (~2.2s)
  loop: 40, //        comment + practice link, fading toward the quiz (~1.3s)
} as const;

export const QUIZ_DURATION =
  SCENES.question + SCENES.countdown + SCENES.commentCta;

// TransitionSeries overlaps each transition, so total = sum(sequences) - sum(transitions).
// Sequences: quiz, loop  ->  1 transition between them.
export const TOTAL_DURATION = QUIZ_DURATION + SCENES.loop - TRANSITION;
