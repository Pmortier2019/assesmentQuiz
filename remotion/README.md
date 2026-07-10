# Question videos (Remotion)

Short vertical question videos (1080x1920, ~12s, 30fps) for YouTube Shorts,
TikTok and Reels, generated from the site's assessment questions.

One reusable component renders every video; only the data changes. It uses a
**loop** shape tuned for completion, replays and comments:
**hook (stakes + challenge) → question → 5s countdown → "Comment your answer" →
loop back to the hook**, joined by cross-fades. The top and bottom 15% are kept
clear of essential content because the Shorts/TikTok/Reels UI overlays them.

The correct answer is **never shown on-screen** — it lives, with the "why", in a
ready-to-paste description each render writes (see below). Withholding it on-video
is what pulls viewers into the comments, while the description still delivers the
real value (keeps it YouTube-policy safe — asking for comments is an allowed CTA;
empty engagement bait is not).

## Add a video

Append one entry to `VIDEO_QUESTIONS` in `remotion/questions.ts`. The shape is
the site's `DemoQuestion` (from `src/lib/professionDemo.ts`) plus a two-line
hook:

```ts
{
  ...DEMO_QUESTIONS.numerical, // or a brand-new object of the same shape
  challenge: "Can you solve this in 5 seconds?", // large line, honest, no fake stats
  stakes: "Standard on the SHL test.",           // optional small line above it
}
```

Only `challenge` is required. When `stakes` is omitted it is derived from the
`practiceSlug` (e.g. `numerical-reasoning` → "Standard on numerical reasoning
tests."), so a new video is still just a couple of lines. Keep `stakes`
type-level honest — don't invent a provider name you can't back up.

That is all. A composition and a batch-render entry appear automatically.

## Preview and render

```bash
npm run video:studio          # open Remotion Studio to preview/scrub
npm run video:render          # render every video to out/videos/*.mp4
npm run video:render numerical  # only ids containing "numerical"
```

Output per video: `out/videos/<id>.mp4` plus two metadata sidecars,
`<id>.txt` and `<id>.json`, e.g. `q-01-numerical-reasoning.*`. The id embeds the
`practiceSlug`.

The `.txt` is the ready-to-paste YouTube copy: the short prompt, a
"Comment your answer" line, the correct answer + full explanation, the practice
link with UTM tags baked in (`utm_source=youtube&utm_medium=shorts&
utm_campaign=question-shorts`, closing the issue #142 approach), and a **Tags**
block (comma-separated, no `#`) for YouTube's Tags field. Paste the description +
tags at upload. (There is no pinned comment and no YouTube API: the Data API
can't pin comments anyway.)

The `.json` (`{ title, description, tags[], privacyStatus }`) drives an
**auto-posting pipeline** so you don't paste at all: render into a Google
Drive-synced folder and let a Make.com scenario upload one Short per day. Set the
output folder with `VIDEO_OUT_DIR=/path/to/drive/folder npm run video:render`.
Full setup in [`docs/video-auto-post-make.md`](../docs/video-auto-post-make.md).

`out/` is gitignored, so rendered files are not committed. The first render
downloads a headless browser once. A `Page.bringToFront ... Target closed`
line can print between renders; it is a benign Remotion warning and does not
affect the output.
