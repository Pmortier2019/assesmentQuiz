// Persists an in-progress test attempt so a refresh, tab crash or accidental
// back-navigation doesn't wipe out answers mid-test. Scoped per testId and kept
// in sessionStorage so it lives for the browser session but never leaks between
// tabs/visits the way localStorage would.

export interface TestProgress {
  /** Map of questionId → selected answerId. */
  answers: Record<string, string>;
  /** Index of the question the user was last on. */
  currentIndex: number;
  /** Absolute epoch ms when the attempt started — timer is derived from this. */
  startedAt: number;
}

const keyFor = (testId: string) => `assesspro_test_progress_${testId}`;

export function loadProgress(testId: string): TestProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(keyFor(testId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as TestProgress).startedAt === "number" &&
      typeof (parsed as TestProgress).currentIndex === "number" &&
      typeof (parsed as TestProgress).answers === "object" &&
      (parsed as TestProgress).answers !== null
    ) {
      return parsed as TestProgress;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProgress(testId: string, progress: TestProgress) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(keyFor(testId), JSON.stringify(progress));
  } catch {
    // storage full or unavailable (private mode) — degrade silently
  }
}

export function clearProgress(testId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(keyFor(testId));
  } catch {
    // ignore
  }
}
