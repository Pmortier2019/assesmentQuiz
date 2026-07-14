import { describe, it, expect, vi, afterEach } from "vitest";
import { deleteTest, setTestFree, mapTestListItem, ApiError } from "./api";

// Regression coverage for the apiFetch response handling. A 204 No Content has
// no body, so the old `return res.json()` threw a SyntaxError on a request that
// actually succeeded (account deletion, admin test deletion, cancel
// subscription all return 204). apiFetch must treat 204 / empty bodies as a
// successful `undefined`, and still parse JSON and surface errors otherwise.
describe("apiFetch response handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // A fresh Response per call — a body can only be read once, and some tests
  // invoke the same helper twice.
  function stubFetch(make: () => Response) {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => make()));
  }

  it("resolves (does not throw) on a 204 No Content", async () => {
    stubFetch(() => new Response(null, { status: 204 }));
    // deleteTest hits DELETE /api/admin/tests/{id}, which the backend answers
    // with 204. Before the fix this rejected with a JSON SyntaxError.
    await expect(deleteTest("5")).resolves.toBeUndefined();
  });

  it("resolves on a 200 with an empty body", async () => {
    stubFetch(() => new Response("", { status: 200 }));
    await expect(deleteTest("5")).resolves.toBeUndefined();
  });

  it("still parses a JSON body on a 200", async () => {
    // A representative test-list item; proves the happy JSON path is intact.
    const body = {
      id: 7,
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
    } as Parameters<typeof mapTestListItem>[0];
    stubFetch(() => new Response(JSON.stringify(body), { status: 200 }));
    // setTestFree returns the parsed + mapped body; asserting it deep-equals the
    // mapper output proves apiFetch parsed the JSON (not that the mapper works —
    // that is covered separately in api.test.ts).
    const result = await setTestFree("7", true);
    expect(result).toEqual(mapTestListItem(body));
  });

  it("throws ApiError with the body text on a non-ok status", async () => {
    stubFetch(() => new Response("Boom", { status: 500 }));
    await expect(deleteTest("5")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      message: "Boom",
    });
    await expect(deleteTest("5")).rejects.toBeInstanceOf(ApiError);
  });
});
