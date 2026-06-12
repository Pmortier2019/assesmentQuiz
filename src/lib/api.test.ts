import { describe, it, expect } from "vitest";
import {
  mapTestType,
  mapDifficulty,
  mapTestTypeToBackend,
  mapDifficultyToBackend,
  mapTestListItem,
  mapSubmitResponse,
} from "./api";

// ─── Enum mappers ─────────────────────────────────────────────────────────────

describe("mapTestType", () => {
  it("maps a known backend type to its frontend value", () => {
    expect(mapTestType("NUMERICAL_REASONING")).toBe("numerical_reasoning");
    expect(mapTestType("PERSONALITY_WORK_STYLE")).toBe("personality");
  });

  it("falls back to numerical_reasoning for an unknown type", () => {
    expect(mapTestType("SOMETHING_NEW")).toBe("numerical_reasoning");
    expect(mapTestType("")).toBe("numerical_reasoning");
  });

  it("round-trips with mapTestTypeToBackend", () => {
    expect(mapTestTypeToBackend(mapTestType("CODING_CHALLENGE"))).toBe("CODING_CHALLENGE");
    expect(mapTestType(mapTestTypeToBackend("personality"))).toBe("personality");
  });
});

describe("mapDifficulty", () => {
  it("maps EASY/MEDIUM/HARD to the frontend scale", () => {
    expect(mapDifficulty("EASY")).toBe("beginner");
    expect(mapDifficulty("MEDIUM")).toBe("intermediate");
    expect(mapDifficulty("HARD")).toBe("advanced");
  });

  it("falls back to beginner for an unknown difficulty", () => {
    expect(mapDifficulty("EXTREME")).toBe("beginner");
  });

  it("round-trips with mapDifficultyToBackend", () => {
    expect(mapDifficultyToBackend(mapDifficulty("HARD"))).toBe("HARD");
  });
});

// ─── mapTestListItem ──────────────────────────────────────────────────────────

function listItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 42,
    title: "Numerical Reasoning",
    description: "A test",
    type: "NUMERICAL_REASONING",
    difficulty: "MEDIUM",
    language: "EN",
    isFree: true,
    isGeneratedByAI: false,
    estimatedTimeMinutes: 20,
    questionCount: 10,
    displayQuestionCount: 8,
    createdAt: "2026-06-01T10:00:00",
    ...overrides,
  } as Parameters<typeof mapTestListItem>[0];
}

describe("mapTestListItem", () => {
  it("maps core fields, stringifies the id and lowercases the language", () => {
    const t = mapTestListItem(listItem());
    expect(t.id).toBe("42");
    expect(t.type).toBe("numerical_reasoning");
    expect(t.difficulty).toBe("intermediate");
    expect(t.language).toBe("en");
    expect(t.estimatedTime).toBe(20);
    expect(t.questionCount).toBe(10);
    expect(t.displayQuestionCount).toBe(8);
  });

  it("defaults the optional collections to empty arrays when absent", () => {
    const t = mapTestListItem(listItem());
    expect(t.questions).toEqual([]);
    expect(t.tags).toEqual([]);
    expect(t.targetRoles).toEqual([]);
    expect(t.targetIndustries).toEqual([]);
    expect(t.recommendedForCompanies).toEqual([]);
    expect(t.skillsMeasured).toEqual([]);
    expect(t.isRecommended).toBe(false);
  });

  it("passes through provided collections and flags", () => {
    const t = mapTestListItem(listItem({
      targetRoles: ["Analyst"],
      skillsMeasured: ["Math"],
      category: "COGNITIVE",
      subcategory: "Reasoning",
      isRecommended: true,
    }));
    expect(t.targetRoles).toEqual(["Analyst"]);
    expect(t.skillsMeasured).toEqual(["Math"]);
    expect(t.category).toBe("COGNITIVE");
    expect(t.subcategory).toBe("Reasoning");
    expect(t.isRecommended).toBe(true);
  });
});

// ─── mapSubmitResponse ────────────────────────────────────────────────────────

function submit(overrides: Record<string, unknown> = {}) {
  return {
    resultId: 7,
    testId: 42,
    userId: 3,
    score: 80,
    totalQuestions: 5,
    correctAnswers: 4,
    timeTakenSeconds: 120,
    feedback: "Well done",
    tips: ["Practice more"],
    completedAt: "2026-06-10T12:00:00",
    questionResults: [
      {
        questionId: 1,
        questionText: "Q1",
        explanation: "because",
        selectedAnswerOptionId: 11,
        isCorrect: true,
        answerOptions: [
          { id: 12, answerText: "B", isCorrect: false, orderIndex: 2 },
          { id: 11, answerText: "A", isCorrect: true, orderIndex: 1 },
        ],
      },
    ],
    ...overrides,
  } as Parameters<typeof mapSubmitResponse>[0];
}

describe("mapSubmitResponse", () => {
  it("maps the result and stringifies ids", () => {
    const r = mapSubmitResponse(submit());
    expect(r.id).toBe("7");
    expect(r.testId).toBe("42");
    expect(r.userId).toBe("3");
    expect(r.score).toBe(80);
    expect(r.timeTaken).toBe(120);
    expect(r.aiFeedback).toBe("Well done");
    expect(r.tips).toEqual(["Practice more"]);
  });

  it("sorts answer options by orderIndex", () => {
    const r = mapSubmitResponse(submit());
    expect(r.questionResults?.[0].answerOptions.map((a) => a.id)).toEqual(["11", "12"]);
  });

  it("keeps a null selection as null and yields an empty selectedAnswerId", () => {
    const r = mapSubmitResponse(submit({
      questionResults: [
        { questionId: 1, questionText: "Q1", explanation: "", selectedAnswerOptionId: null, isCorrect: false, answerOptions: [] },
      ],
    }));
    expect(r.questionResults?.[0].selectedAnswerOptionId).toBeNull();
    expect(r.answers[0].selectedAnswerId).toBe("");
  });

  it("defaults missing tips and questionResults to empty arrays", () => {
    const r = mapSubmitResponse(submit({ tips: undefined, questionResults: undefined }));
    expect(r.tips).toEqual([]);
    expect(r.questionResults).toEqual([]);
    expect(r.answers).toEqual([]);
  });

  it("falls back to a timestamp when completedAt is missing", () => {
    const r = mapSubmitResponse(submit({ completedAt: undefined }));
    expect(r.completedAt).toBeTruthy();
    expect(() => new Date(r.completedAt).toISOString()).not.toThrow();
  });
});
