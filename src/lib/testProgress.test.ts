import { describe, it, expect, beforeEach } from "vitest";
import { loadProgress, saveProgress, clearProgress, type TestProgress } from "./testProgress";

const sample: TestProgress = {
  answers: { q1: "a", q2: "c" },
  currentIndex: 1,
  startedAt: 1_700_000_000_000,
};

describe("testProgress", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("round-trips a saved attempt", () => {
    saveProgress("42", sample);
    expect(loadProgress("42")).toEqual(sample);
  });

  it("returns null when nothing is stored", () => {
    expect(loadProgress("42")).toBeNull();
  });

  it("keeps attempts for different tests isolated", () => {
    saveProgress("1", sample);
    expect(loadProgress("2")).toBeNull();
  });

  it("clears a stored attempt", () => {
    saveProgress("42", sample);
    clearProgress("42");
    expect(loadProgress("42")).toBeNull();
  });

  it("returns null for malformed stored data", () => {
    sessionStorage.setItem("assesspro_test_progress_42", "{not valid json");
    expect(loadProgress("42")).toBeNull();
  });

  it("rejects data missing required fields", () => {
    sessionStorage.setItem("assesspro_test_progress_42", JSON.stringify({ answers: {} }));
    expect(loadProgress("42")).toBeNull();
  });
});
