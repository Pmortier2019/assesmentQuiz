// Video question list for the Shorts pipeline.
//
// One new video = a few lines added here. The shape reuses DemoQuestion from
// the site (src/lib/professionDemo.ts) so the data model stays single-sourced:
// eyebrow, prompt, optional sequence, answers, explanation, practiceSlug, layout.
//
// These questions are deliberately HARDER than the site's homepage demo. The
// hero demo (professionDemo.ts) stays easy so a first-time visitor gets an
// early win; the videos need a real "aha" and comment-bait, so we author each
// one here instead of spreading a DEMO_QUESTIONS entry. Every practiceSlug still
// matches a real practice page so the CTA link and metadata stay correct.
//
// We layer two video-only fields on top:
//   - challenge: the hook line shown above the question on frame 0, and the
//     start of the YouTube title. Honest and curiosity-driven, never a
//     fabricated statistic ("90% fail") — the brand voice is honest only.
//   - voiceover: optional path (under remotion/public) to a narration file,
//     e.g. "audio/vo/data-interpretation.mp3". Silent videos read as ads in
//     the Shorts feed, so add one when you can (any TTS with a decent voice).
//
// The practiceSlug is where "link in bio" points and stays UTM-ready (issue #142).

import { type DemoQuestion } from "@/lib/professionDemo";

export interface VideoQuestion extends DemoQuestion {
  /** Hook line above the question on frame 0. Honest curiosity, never a fabricated stat. */
  challenge: string;
  /** Optional narration file under remotion/public, e.g. "audio/vo/<slug>.mp3". */
  voiceover?: string;
}

/**
 * The batch. One harder question per reasoning type. Each has a single trap
 * answer that looks right at a glance, which is what drives the comments.
 */
export const VIDEO_QUESTIONS: VideoQuestion[] = [
  {
    eyebrow: "Numerical reasoning",
    challenge: "The obvious answer is wrong.",
    prompt: "After a 20% discount, a jacket costs $60. What was the original price?",
    answers: [
      { id: "a", text: "$72", isCorrect: false },
      { id: "b", text: "$75", isCorrect: true },
      { id: "c", text: "$70", isCorrect: false },
      { id: "d", text: "$80", isCorrect: false },
    ],
    explanation:
      "The $60 is 80% of the original, so divide instead of adding back: 60 ÷ 0.8 = $75 (and $75 × 0.8 = $60 checks out). Adding 20% onto $60 gives $72, the trap, because the discount came off a larger number.",
    practiceSlug: "numerical-reasoning",
    layout: "grid",
  },
  {
    eyebrow: "Number series",
    challenge: "This isn't a math pattern.",
    prompt: "Which number comes next?",
    sequence: "1, 11, 21, 1211, 111221, ?",
    answers: [
      { id: "a", text: "312211", isCorrect: true },
      { id: "b", text: "122111", isCorrect: false },
      { id: "c", text: "13112221", isCorrect: false },
      { id: "d", text: "111222", isCorrect: false },
    ],
    explanation:
      "Read each line aloud instead of doing arithmetic. 111221 is 'three 1s, two 2s, one 1', which writes as 312211. Every term describes the digits of the term before it, so it is a reading pattern, not a sum.",
    practiceSlug: "logical-reasoning",
    layout: "grid",
  },
  {
    eyebrow: "Data interpretation",
    challenge: "Percent or percentage points?",
    prompt: "A team's conversion rate rose from 4% to 5%. By how much did it increase?",
    sequence: "Conversion: 4% → 5%",
    answers: [
      { id: "a", text: "1%", isCorrect: false },
      { id: "b", text: "20%", isCorrect: false },
      { id: "c", text: "25%", isCorrect: true },
      { id: "d", text: "5%", isCorrect: false },
    ],
    explanation:
      "The rate went up by 1 point, but the increase is relative to where it started: 1 ÷ 4 = 0.25, so 25%. '1%' confuses points with percent, and '20%' wrongly divides by the new value (5) instead of the old one (4).",
    practiceSlug: "data-interpretation",
    layout: "grid",
  },
  {
    eyebrow: "Verbal reasoning",
    challenge: "Do you really know this word?",
    prompt: "Which word is closest in meaning to “laconic”?",
    answers: [
      { id: "a", text: "Concise", isCorrect: true },
      { id: "b", text: "Talkative", isCorrect: false },
      { id: "c", text: "Relaxed", isCorrect: false },
      { id: "d", text: "Careless", isCorrect: false },
    ],
    explanation:
      "“Laconic” means using very few words, so “concise” is the closest match. “Relaxed” plays on the similar-sounding “laid back”, and “talkative” is its opposite.",
    practiceSlug: "verbal-reasoning",
    layout: "grid",
  },
  {
    eyebrow: "Critical reasoning",
    challenge: "What is wrong with this argument?",
    prompt:
      "A café says: 'Since we added jazz, sales rose 15%, so jazz boosts sales.' Which is the strongest objection?",
    answers: [
      {
        id: "a",
        text: "Other things may have changed at the same time, such as the season or prices.",
        isCorrect: true,
      },
      { id: "b", text: "A 15% rise is too small to matter.", isCorrect: false },
      { id: "c", text: "Not every customer enjoys jazz.", isCorrect: false },
      { id: "d", text: "The café should test classical music instead.", isCorrect: false },
    ],
    explanation:
      "The argument assumes jazz alone caused the rise, but other factors could have shifted at the same time. That confound is the real weakness; the other options never challenge the cause-and-effect claim.",
    practiceSlug: "critical-reasoning",
    layout: "list",
  },
];

/** Where a video's "link in bio" points. Kept UTM-ready for issue #142. */
export function ctaPath(question: VideoQuestion): string {
  return `/practice/${question.practiceSlug}`;
}

/** Stable, unique composition id for a question (used in Studio + filenames). */
export function compositionId(question: VideoQuestion, index: number): string {
  return `q-${String(index + 1).padStart(2, "0")}-${question.practiceSlug}`;
}
