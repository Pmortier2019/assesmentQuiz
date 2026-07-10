// Video question list for the Shorts pipeline.
//
// One new video = a few lines added here. The shape reuses DemoQuestion from
// the site (src/lib/professionDemo.ts) so the data model stays single-sourced:
// eyebrow, prompt, optional sequence, answers, explanation, practiceSlug, layout.
//
// We layer two video-only fields on top for the two-line hook:
//   - challenge: the large, imperative opener line. Honest and curiosity-driven,
//     never a fabricated statistic ("90% fail") — the brand voice is honest only.
//   - stakes: the small line above it, framing why the question matters. Optional;
//     when omitted it is derived from the practiceSlug so "one video = a few
//     lines" stays true. Keep it type-level honest (no invented provider names).
//
// The practiceSlug is where "link in bio" points and stays UTM-ready (issue #142).

import { DEMO_QUESTIONS, type DemoQuestion } from "@/lib/professionDemo";

export interface VideoQuestion extends DemoQuestion {
  /** Large imperative opener line. Honest curiosity, never a fabricated stat. */
  challenge: string;
  /** Small stakes line above the challenge. Falls back to a slug-derived line. */
  stakes?: string;
}

/**
 * The batch. Each entry reuses a site demo question and adds a challenge line.
 * To add a video, append one object. To use a brand-new question, spread your
 * own object of the same shape instead of a DEMO_QUESTIONS entry.
 */
export const VIDEO_QUESTIONS: VideoQuestion[] = [
  {
    ...DEMO_QUESTIONS.numerical,
    challenge: "Can you solve this in 5 seconds?",
  },
  {
    ...DEMO_QUESTIONS.logical,
    challenge: "What number comes next?",
  },
  {
    ...DEMO_QUESTIONS.data,
    challenge: "Quick mental maths test.",
  },
  {
    ...DEMO_QUESTIONS.verbal,
    challenge: "Do you actually know this word?",
  },
  {
    ...DEMO_QUESTIONS.critical,
    challenge: "Spot the flaw in this logic.",
  },
];

/**
 * The small stakes line shown above the challenge. Honest and type-level: uses
 * an explicit `stakes` if given, otherwise derives one from the practiceSlug
 * (e.g. "numerical-reasoning" -> "Standard on numerical reasoning tests.").
 */
export function stakesLine(question: VideoQuestion): string {
  if (question.stakes) return question.stakes;
  const testType = question.practiceSlug.replace(/-/g, " ");
  return `Standard on ${testType} tests.`;
}

/** Where a video's "link in bio" points. Kept UTM-ready for issue #142. */
export function ctaPath(question: VideoQuestion): string {
  return `/practice/${question.practiceSlug}`;
}

/** Stable, unique composition id for a question (used in Studio + filenames). */
export function compositionId(question: VideoQuestion, index: number): string {
  return `q-${String(index + 1).padStart(2, "0")}-${question.practiceSlug}`;
}
