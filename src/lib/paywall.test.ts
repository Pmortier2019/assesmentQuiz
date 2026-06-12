import { describe, it, expect } from "vitest";
import { freeLimitReached, isTestBlocked, paywallReasonFor } from "./paywall";
import { FREE_TEST_LIMIT } from "./constants";

describe("freeLimitReached", () => {
  it("is false for an admin even past the limit", () => {
    expect(freeLimitReached({ isAdmin: true, isPro: false, freeTestsUsed: FREE_TEST_LIMIT + 3 })).toBe(false);
  });

  it("is false for a pro user even past the limit", () => {
    expect(freeLimitReached({ isAdmin: false, isPro: true, freeTestsUsed: FREE_TEST_LIMIT + 3 })).toBe(false);
  });

  it("is false for a free user still under the limit", () => {
    expect(freeLimitReached({ isAdmin: false, isPro: false, freeTestsUsed: FREE_TEST_LIMIT - 1 })).toBe(false);
  });

  it("is true for a free user exactly at the limit", () => {
    expect(freeLimitReached({ isAdmin: false, isPro: false, freeTestsUsed: FREE_TEST_LIMIT })).toBe(true);
  });
});

describe("isTestBlocked", () => {
  it("never blocks an admin", () => {
    expect(isTestBlocked({ isAdmin: true, isPro: false, isFree: false, freeTestsUsed: FREE_TEST_LIMIT + 5 })).toBe(false);
  });

  it("never blocks a pro user", () => {
    expect(isTestBlocked({ isAdmin: false, isPro: true, isFree: false, freeTestsUsed: FREE_TEST_LIMIT + 5 })).toBe(false);
  });

  it("allows a free test for a free user under the limit", () => {
    expect(isTestBlocked({ isAdmin: false, isPro: false, isFree: true, freeTestsUsed: FREE_TEST_LIMIT - 1 })).toBe(false);
  });

  it("blocks a pro-only test for a free user under the limit", () => {
    expect(isTestBlocked({ isAdmin: false, isPro: false, isFree: false, freeTestsUsed: 0 })).toBe(true);
  });

  it("blocks even a free test once the free limit is reached", () => {
    expect(isTestBlocked({ isAdmin: false, isPro: false, isFree: true, freeTestsUsed: FREE_TEST_LIMIT })).toBe(true);
  });
});

describe("paywallReasonFor", () => {
  it("reports pro_test while under the free limit", () => {
    expect(paywallReasonFor(FREE_TEST_LIMIT - 1)).toBe("pro_test");
  });

  it("reports free_limit once at or past the free limit", () => {
    expect(paywallReasonFor(FREE_TEST_LIMIT)).toBe("free_limit");
  });
});
