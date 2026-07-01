# Shorts retention: loop-reveal design

Date: 2026-07-01
Status: Approved (design), pending implementation plan

## Goal

Increase retention and reach of the question Shorts (YouTube Shorts / TikTok /
Reels) produced by the Remotion pipeline. Primary success metric is **reach via
algorithm growth**: optimise for the signals YouTube rewards, in order —
**completion, replays, comments** — with the site link (practice page) as a
secondary funnel CTA.

Non-goals: fabricated stats ("90% fail"), YouTube Data API integration, any
automated comment pinning.

## Background

Current pipeline (`remotion/`) renders one reusable component per question.
Scene order today:

```
hook (~1.6s) -> quiz [question + 5s countdown + reveal ~3s] -> explanation (~7s) -> CTA (~3s)  ≈ 21s
```

The **7s explanation scene** is the main retention leak: it is dead time near
the end and gives everything away, so viewers swipe before it pays off.

Data available per question (`src/lib/professionDemo.ts`, `DemoQuestion`):
`eyebrow`, `prompt`, optional `sequence`, `answers[]` (with `isCorrect`),
`explanation`, `practiceSlug`, `layout`. There is **no** per-question
test/provider name — only the reasoning type (via `eyebrow` / `TYPE_LABEL`).

## YouTube policy check

Asking viewers to comment their answer is an explicitly **allowed**
call-to-action under YouTube's spam policy. The prohibited case ("engagement
bait") is low-effort content that exists *solely* to force engagement, or that
coerces/deceives. This design stays on the safe side by delivering real value
(the answer + full explanation live in the description) and using honest hooks.

Sources:
- https://support.google.com/youtube/answer/2801973 (Spam policy)
- https://support.google.com/youtube/answer/3399767 (Fake engagement policy)

## Design

### 1. Video structure — loop-reveal

New scene order:

```
hook (echte stakes + challenge, ~1.6s)
  -> quiz [question + 5s countdown]
  -> "Comment your answer!" CTA (~1.5s, at the tension peak, before reveal)
  -> answer FLASH (~0.8s, brief highlight of the correct option)
  -> seamless fade/loop back to the hook
```

Key changes vs. today:

- **Remove the 7s explanation scene.** The "why" moves off-video, into the
  video description (section 3). This is the single biggest retention gain.
- **Comment CTA before the reveal**, placed at the countdown-zero tension peak
  where viewers are most primed to respond.
- **Answer flashes briefly** — enough payoff to reward completion, too fast to
  fully satisfy curiosity, which drives replays.
- **Seamless loop:** the final frame cross-fades back to the hook so a replay
  does not read as a repeat. YouTube counts replays as separate views.
- **Total duration drops from ~21s to ~11-12s.** Shorter Shorts have a
  structurally higher completion rate, and completion is the #1 reach signal.
- **Site-link CTA is not a standalone end scene anymore.** It survives as a
  small footer during the flash/loop transition, plus in the description. This
  removes the ~3s CTA scene that gave viewers a reason to swipe.

Timing (`remotion/timing.ts`) is rebalanced accordingly. `SCENES.explanation`
is removed; a `commentCta` (~45f) and `flash` (~24f) phase are introduced.
`TOTAL_DURATION` and the transition count are recomputed. The exact frame counts
are an implementation detail to be tuned in Studio.

### 2. Hook system — two-layer (stakes + challenge)

The hook scene shows two lines instead of one:

```
line 1 (stakes, small):     "Standard on numerical-reasoning tests."
line 2 (challenge, large):  "Can you solve this in 5 seconds?"
```

Data model change on `VideoQuestion` (`remotion/questions.ts`):

- Replace the single `hook: string` with:
  - `challenge: string` — the large imperative line. **Migration: the existing
    `hook` strings become the `challenge` values verbatim.**
  - `stakes?: string` — optional small stakes line. When omitted, it falls back
    to a value derived from the question's reasoning type, e.g.
    `"Standard on ${TYPE_LABEL[type]} tests."`, so "one video = a few lines"
    stays true and only `challenge` is required.

Honesty constraint: `stakes` is type-level only (no invented provider names like
"SHL"/"CCAT"). A real per-question provider field can be added later if genuine
data exists.

Pattern-interrupt: the hook scene is kept short and leads quickly into the
puzzle; the countdown ring remains the primary visual draw.

Language of on-screen copy stays as-is (English) for now.

### 3. Off-video content — description file (no pinned comment)

The render pipeline writes, alongside each MP4, a small text file with
ready-to-paste **description** copy:

```
out/videos/<id>.txt
```

Content is generated from existing data (`prompt`, `answers`, `explanation`,
`practiceSlug`), in **English**:

```
<short prompt>
Comment your answer 👇

Correct answer: B. <explanation>

Practice this test type free → readytoace.com/practice/<slug>?utm_source=youtube&utm_medium=shorts&utm_campaign=question-shorts

#<type>reasoning #assessment #aptitudetest ...
```

Notes:

- **No pinned comment.** The correct answer + full explanation live in the
  description. The video itself still flashes the answer (payoff) and shows the
  "Comment your answer" CTA, but references no pinned comment.
- **UTM parameters are baked in**, which closes the still-open issue #142 (the
  practiceSlug is the campaign target).
- **Manual step:** the uploader pastes the description at upload time. Nothing
  else is manual. No YouTube Data API integration — and note the API cannot pin
  comments anyway (only `comments.insert`/`list` exist), so an integration would
  not remove any manual step.

## Affected code

- `remotion/timing.ts` — remove `explanation`, add `commentCta` + `flash`,
  recompute `QUIZ_DURATION` / `TOTAL_DURATION` / transitions.
- `remotion/QuestionVideo.tsx` — new scene sequence (drop ExplanationScene, add
  CommentCta + Flash + loop-back).
- `remotion/scenes/HookScene.tsx` — render two-layer stakes + challenge.
- `remotion/scenes/CtaScene.tsx` — repurpose to the small footer link / comment
  CTA (or split into CommentCtaScene + footer).
- `remotion/scenes/ExplanationScene.tsx` — removed.
- `remotion/questions.ts` — `VideoQuestion` gains `challenge` + optional
  `stakes`, with type-derived fallback; migrate existing `hook` -> `challenge`.
- `scripts/render-videos.mjs` — after each render, also emit
  `out/videos/<id>.txt` with the English description block.
- `remotion/README.md` — document the new structure, the two-layer hook, and the
  `.txt` description output.

## Open questions / follow-ups

- Exact per-phase frame timings to be tuned in Remotion Studio.
- Dutch-language variants of videos + descriptions are out of scope for this
  iteration (site has EN root + NL; revisit later).
- Optional future: per-question real provider name to strengthen the stakes
  line; `videos.insert` auto-upload if volume scales to tens/week.
