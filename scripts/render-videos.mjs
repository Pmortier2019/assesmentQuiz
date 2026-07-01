// Batch-render every question video to its own MP4, with metadata sidecars.
//
//   node scripts/render-videos.mjs            -> render all
//   node scripts/render-videos.mjs numerical  -> only ids containing "numerical"
//
// Per video it writes three files, all sharing the composition id (which already
// embeds the practiceSlug, e.g. q-01-numerical-reasoning):
//   <id>.mp4   the video
//   <id>.txt   human-readable copy to paste manually at upload
//   <id>.json  { title, description, tags[] } for an automation (e.g. Make.com)
//
// Output dir defaults to out/videos, or set VIDEO_OUT_DIR to render straight
// into a Google Drive-synced folder for the auto-post pipeline (Route 1).

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
const outDir = process.env.VIDEO_OUT_DIR
  ? path.resolve(process.env.VIDEO_OUT_DIR)
  : path.join(projectRoot, "out", "videos");
const filter = process.argv[2]?.toLowerCase();

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Title-cased test type from the slug, e.g. "numerical-reasoning" -> "Numerical
// Reasoning". Used in both the title and the tags.
function testTypeLabel(question) {
  return question.practiceSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// YouTube title: the challenge (the hook) first, then the test type for search.
function titleFor(question) {
  return `${question.challenge} 🧠 ${testTypeLabel(question)} #shorts`;
}

// YouTube "Tags" field keywords (no "#"). Type-specific terms first, then
// generic assessment terms. Returned as an array so JSON gets a real list and
// the .txt can join it with commas.
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
  ];
}

// The YouTube description body (no tags — those go in the Tags field). The answer
// + full "why" live here, not in the video, which is what pulls viewers into the
// comments while still delivering real value. The link carries UTM (issue #142).
function descriptionFor(question) {
  const slug = question.practiceSlug;
  const correctIndex = question.answers.findIndex((a) => a.isCorrect);
  const correct = question.answers[correctIndex];
  const letter = LETTERS[correctIndex] ?? "?";
  const hashtag = slug.replace(/-/g, "");
  const url =
    `https://www.ready-to-ace.com/practice/${slug}` +
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
  );
  return parts.join("\n");
}

// Human-readable sidecar to paste manually: the description plus a Tags block.
function txtSidecarFor(question) {
  return (
    descriptionFor(question) +
    "\n\nTags (paste into the YouTube Tags field):\n" +
    tagsFor(question).join(", ") +
    "\n"
  );
}

// Machine-readable sidecar for the auto-post pipeline (Make.com et al.).
function jsonSidecarFor(question) {
  return (
    JSON.stringify(
      {
        title: titleFor(question),
        description: descriptionFor(question),
        tags: tagsFor(question),
        privacyStatus: "public",
      },
      null,
      2,
    ) + "\n"
  );
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

    // Emit the metadata sidecars next to the MP4. The question data rides along
    // in the composition's defaultProps.
    const question = composition.defaultProps?.question;
    if (question) {
      writeFileSync(
        path.join(outDir, `${composition.id}.txt`),
        txtSidecarFor(question),
        "utf8",
      );
      writeFileSync(
        path.join(outDir, `${composition.id}.json`),
        jsonSidecarFor(question),
        "utf8",
      );
      console.log("done (+ .txt, .json)");
    } else {
      console.log("done (no question props; skipped sidecars)");
    }
  }

  console.log(`\nDone. ${targets.length} file(s) in ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
