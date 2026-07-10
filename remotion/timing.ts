// Scene timing for one question video, in frames at VIDEO.fps (30fps).
//
// The quiz block (prompt + answers + countdown + comment CTA + flash) is one
// continuous sequence so the answers never re-mount mid-thought. Hook and the
// short loop-back beat are separate sequences joined by short cross-fades.
//
// Loop structure (optimised for completion, replays, comments):
//   hook -> quiz[question + countdown + commentCta] -> loop-back
// The correct answer is deliberately NOT shown on-screen: it lives off-video in
// the pasted description (with the "why"), which is what drives the comments.

export const TRANSITION = 14; // cross-fade length between sequences

export const SCENES = {
  hook: 45, // ~1.5s
  // Quiz phases run inside one sequence and share the screen:
  question: 78, //   prompt + answers settle in (~2.6s)
  countdown: 150, //  visible 5 -> 0 (5s)
  commentCta: 66, //  "Comment your answer" climax, no reveal (~2.2s)
  loop: 40, //        comment + practice link, fading toward the hook (~1.3s)
} as const;

export const QUIZ_DURATION =
  SCENES.question + SCENES.countdown + SCENES.commentCta;

// TransitionSeries overlaps each transition, so total = sum(sequences) - sum(transitions).
// Sequences: hook, quiz, loop  ->  2 transitions between them.
export const TOTAL_DURATION =
  SCENES.hook + QUIZ_DURATION + SCENES.loop - 2 * TRANSITION;
