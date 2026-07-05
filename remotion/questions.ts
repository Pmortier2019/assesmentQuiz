// Video question list for the Shorts pipeline.
//
// One new video = a few lines added here. The shape reuses DemoQuestion from
// the site (src/lib/professionDemo.ts) so the data model stays single-sourced:
// eyebrow, prompt, optional sequence, answers, explanation, practiceSlug, layout.
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

import { DEMO_QUESTIONS, type DemoQuestion } from "@/lib/professionDemo";

export interface VideoQuestion extends DemoQuestion {
  /** Hook line above the question on frame 0. Honest curiosity, never a fabricated stat. */
  challenge: string;
  /** Optional narration file under remotion/public, e.g. "audio/vo/<slug>.mp3". */
  voiceover?: string;
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
    challenge: "5 seconds. No calculator.",
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

/** Where a video's "link in bio" points. Kept UTM-ready for issue #142. */
export function ctaPath(question: VideoQuestion): string {
  return `/practice/${question.practiceSlug}`;
}

/** Stable, unique composition id for a question (used in Studio + filenames). */
export function compositionId(question: VideoQuestion, index: number): string {
  return `q-${String(index + 1).padStart(2, "0")}-${question.practiceSlug}`;
}
