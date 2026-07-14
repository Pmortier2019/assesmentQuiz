// Synthesize the audio assets for the question videos into remotion/public/audio.
//
//   node scripts/generate-video-audio.mjs   (or: npm run video:audio)
//
// Everything is generated from code so the repo needs no licensed samples:
//   tick.wav         soft countdown tick (one per second)
//   tick-urgent.wav  sharper tick for the last seconds
//   chime.wav        two-note chime when the timer runs out
//   bed.wav          ~12s ambient pad under the whole video (loop-safe edges)
//
// The files are committed; re-run this script only when tweaking the sound.
// Voiceovers are NOT generated here: drop per-question MP3s into
// remotion/public/audio/vo/ and reference them via `voiceover` in questions.ts.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "remotion", "public", "audio");

const SAMPLE_RATE = 44100;

/** Wrap float samples (-1..1) in a 16-bit mono PCM WAV buffer. */
function toWav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(s * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

function seconds(n) {
  return Math.round(n * SAMPLE_RATE);
}

/** Percussive tick: a short decaying sine with a 2ms attack to avoid clicks. */
function tick({ freq, duration = 0.06, decay = 60, gain = 0.55 }) {
  const n = seconds(duration);
  const out = new Float64Array(n);
  const attack = seconds(0.002);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(1, i / attack) * Math.exp(-t * decay);
    out[i] = Math.sin(2 * Math.PI * freq * t) * env * gain;
  }
  return out;
}

/** Two-note chime (A5 then D6) with long tails; marks "time's up". */
function chime() {
  const n = seconds(1.0);
  const out = new Float64Array(n);
  const notes = [
    { freq: 880.0, start: 0, gain: 0.4 },
    { freq: 1174.66, start: 0.14, gain: 0.34 },
  ];
  for (const note of notes) {
    const from = seconds(note.start);
    const attack = seconds(0.004);
    for (let i = from; i < n; i++) {
      const t = (i - from) / SAMPLE_RATE;
      const env = Math.min(1, (i - from) / attack) * Math.exp(-t * 5);
      // A touch of the 2nd harmonic makes it bell-like instead of beepy.
      out[i] +=
        (Math.sin(2 * Math.PI * note.freq * t) +
          0.25 * Math.sin(2 * Math.PI * note.freq * 2 * t)) *
        env *
        note.gain;
    }
  }
  return out;
}

/**
 * ~12s ambient pad: a low A-minor-ish chord with slightly detuned pairs and
 * slow amplitude LFOs so it breathes. Faded at both edges so the loop-back
 * replay never pops. Mixed quiet; it sits UNDER the ticks and any voiceover.
 */
function bed(duration = 12.5) {
  const n = seconds(duration);
  const out = new Float64Array(n);
  const voices = [
    { freq: 110.0, gain: 0.30, lfo: 0.09 }, // A2
    { freq: 110.7, gain: 0.22, lfo: 0.07 }, // A2 detuned
    { freq: 164.81, gain: 0.20, lfo: 0.05 }, // E3
    { freq: 220.0, gain: 0.14, lfo: 0.11 }, // A3
    { freq: 261.63, gain: 0.10, lfo: 0.06 }, // C4
  ];
  const edge = seconds(0.9);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (const v of voices) {
      const breathe = 0.75 + 0.25 * Math.sin(2 * Math.PI * v.lfo * t);
      s += Math.sin(2 * Math.PI * v.freq * t) * v.gain * breathe;
    }
    const fadeIn = Math.min(1, i / edge);
    const fadeOut = Math.min(1, (n - i) / edge);
    out[i] = s * 0.28 * fadeIn * fadeOut;
  }
  return out;
}

mkdirSync(path.join(outDir, "vo"), { recursive: true });

const assets = {
  "tick.wav": tick({ freq: 1050 }),
  "tick-urgent.wav": tick({ freq: 1400, decay: 50, gain: 0.7 }),
  "chime.wav": chime(),
  "bed.wav": bed(),
};

for (const [name, samples] of Object.entries(assets)) {
  const file = path.join(outDir, name);
  writeFileSync(file, toWav(samples));
  console.log(`  ${name}  (${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
}

console.log(`\nDone. Assets in ${outDir}`);
