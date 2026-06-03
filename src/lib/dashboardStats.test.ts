import { describe, it, expect } from "vitest";
import { testsCompletedThisWeek, scoreImprovement } from "./dashboardStats";
import type { TestResult } from "./types";

const NOW = new Date("2026-06-03T12:00:00Z").getTime();
const daysAgo = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();

function result(partial: Partial<TestResult> & { score: number; completedAt: string }): TestResult {
  return {
    id: Math.random().toString(36).slice(2),
    testId: "t1",
    userId: "u1",
    timeTaken: 300,
    answers: [],
    strengths: [],
    weakPoints: [],
    ...partial,
  };
}

describe("testsCompletedThisWeek", () => {
  it("counts only results within the last 7 days", () => {
    const results = [
      result({ score: 80, completedAt: daysAgo(1) }),
      result({ score: 70, completedAt: daysAgo(6) }),
      result({ score: 60, completedAt: daysAgo(10) }), // too old
    ];
    expect(testsCompletedThisWeek(results, NOW)).toBe(2);
  });

  it("returns 0 with no results", () => {
    expect(testsCompletedThisWeek([], NOW)).toBe(0);
  });

  it("ignores invalid dates", () => {
    const results = [result({ score: 80, completedAt: "not-a-date" })];
    expect(testsCompletedThisWeek(results, NOW)).toBe(0);
  });
});

describe("scoreImprovement", () => {
  it("returns null with fewer than 2 results", () => {
    expect(scoreImprovement([])).toBeNull();
    expect(scoreImprovement([result({ score: 90, completedAt: daysAgo(1) })])).toBeNull();
  });

  it("compares the later half against the earlier half chronologically", () => {
    // earlier avg 50, later avg 80 → +30
    const results = [
      result({ score: 40, completedAt: daysAgo(10) }),
      result({ score: 60, completedAt: daysAgo(8) }),
      result({ score: 70, completedAt: daysAgo(2) }),
      result({ score: 90, completedAt: daysAgo(1) }),
    ];
    expect(scoreImprovement(results)).toBe(30);
  });

  it("reports a negative trend when scores drop", () => {
    const results = [
      result({ score: 90, completedAt: daysAgo(5) }),
      result({ score: 50, completedAt: daysAgo(1) }),
    ];
    expect(scoreImprovement(results)).toBe(-40);
  });

  it("is not affected by input order", () => {
    const results = [
      result({ score: 90, completedAt: daysAgo(1) }),
      result({ score: 40, completedAt: daysAgo(10) }),
    ];
    expect(scoreImprovement(results)).toBe(50);
  });
});
