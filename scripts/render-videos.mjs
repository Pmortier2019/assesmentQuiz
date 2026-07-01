// Batch-render every question video to its own MP4.
//
//   node scripts/render-videos.mjs            -> render all
//   node scripts/render-videos.mjs numerical  -> only ids containing "numerical"
//
// Output: out/videos/<composition-id>.mp4, where the id already embeds the
// practiceSlug (e.g. q-01-numerical-reasoning.mp4).

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import {
  ensureBrowser,
  getCompositions,
  renderMedia,
} from "@remotion/renderer";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, "..");
const entryPoint = path.join(projectRoot, "remotion", "index.ts");
const outDir = path.join(projectRoot, "out", "videos");
const filter = process.argv[2]?.toLowerCase();

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// YouTube "Tags" field keywords: comma-separated, no "#". Helps the video get
// found via search. Type-specific terms first, then generic assessment terms.
function tagsFor(question) {
  const testType = question.practiceSlug.replace(/-/g, " "); // e.g. "numerical reasoning"
  return [
    testType,
    `${testType} test`,
    `${testType} practice`,
    `${testType} questions`,
    "aptitude test",
    "aptitude test practice",
    "psychometric test",
    "assessment test",
    "pre-employment assessment",
    "cognitive ability test",
    "job assessment",
    "interview preparation",
    "career preparation",
    "ready to ace",
  ].join(", ");
}

// Ready-to-paste YouTube description for a video. The answer + full "why" live
// here (not in the video), which is what pulls viewers into the comments while
// still delivering real value. The practice link carries UTM tags (issue #142).
function descriptionFor(question) {
  const slug = question.practiceSlug;
  const correctIndex = question.answers.findIndex((a) => a.isCorrect);
  const correct = question.answers[correctIndex];
  const letter = LETTERS[correctIndex] ?? "?";
  const hashtag = slug.replace(/-/g, "");
  const url =
    `readytoace.com/practice/${slug}` +
    `?utm_source=youtube&utm_medium=shorts&utm_campaign=question-shorts`;

  const parts = [question.prompt];
  if (question.sequence) parts.push(question.sequence);
  parts.push(
    "",
    "Comment your answer 👇",
    "",
    `Correct answer: ${letter}. ${correct?.text ?? ""} — ${question.explanation}`,
    "",
    `Practice this test type free → ${url}`,
    "",
    `#${hashtag} #aptitudetest #assessment #psychometric #jobprep`,
    "",
    "Tags (paste into the YouTube Tags field):",
    tagsFor(question),
  );
  return parts.join("\n") + "\n";
}

// Same alias the Studio uses, so the bundle resolves the site's "@/..." imports.
const webpackOverride = (config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      "@": path.join(projectRoot, "src"),
    },
  },
});

async function main() {
  mkdirSync(outDir, { recursive: true });

  console.log("Ensuring a headless browser is available...");
  await ensureBrowser();

  console.log("Bundling Remotion project...");
  const serveUrl = await bundle({ entryPoint, webpackOverride });

  const compositions = await getCompositions(serveUrl);
  const targets = filter
    ? compositions.filter((c) => c.id.toLowerCase().includes(filter))
    : compositions;

  if (targets.length === 0) {
    console.warn(`No compositions matched "${filter}".`);
    return;
  }

  console.log(`Rendering ${targets.length} video(s) to ${outDir}\n`);

  for (const composition of targets) {
    const outputLocation = path.join(outDir, `${composition.id}.mp4`);
    process.stdout.write(`  - ${composition.id}.mp4 ... `);
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation,
    });

    // Emit the ready-to-paste description next to the MP4. The question data
    // rides along in the composition's defaultProps.
    const question = composition.defaultProps?.question;
    if (question) {
      writeFileSync(
        path.join(outDir, `${composition.id}.txt`),
        descriptionFor(question),
        "utf8",
      );
      console.log("done (+ .txt)");
    } else {
      console.log("done (no question props; skipped .txt)");
    }
  }

  console.log(`\nDone. ${targets.length} file(s) in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
