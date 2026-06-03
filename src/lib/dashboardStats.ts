import type { TestResult } from "./types";

// Derives dashboard trend figures from the user's real results, instead of the
// hardcoded numbers the dashboard used to show. Each function returns null /
// 0 when there isn't enough data, so the UI can hide a badge rather than
// inventing a figure.

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const completedAtMs = (r: TestResult) => new Date(r.completedAt).getTime();

/** Count of tests completed within the last 7 days. */
export function testsCompletedThisWeek(results: TestResult[], now: number = Date.now()): number {
  return results.filter((r) => {
    const t = completedAtMs(r);
    return Number.isFinite(t) && t <= now && now - t < WEEK_MS;
  }).length;
}

/**
 * Average-score improvement in percentage points: the later half of the user's
 * results compared to the earlier half (chronologically). Returns null when
 * there are fewer than 2 results — not enough to claim any trend.
 */
export function scoreImprovement(results: TestResult[]): number | null {
  if (results.length < 2) return null;
  const sorted = [...results].sort((a, b) => completedAtMs(a) - completedAtMs(b));
  const mid = Math.floor(sorted.length / 2);
  const avg = (rs: TestResult[]) => rs.reduce((s, r) => s + r.score, 0) / rs.length;
  return Math.round(avg(sorted.slice(mid)) - avg(sorted.slice(0, mid)));
}
