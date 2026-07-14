import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveAuth,
  clearAuth,
  resetUserCache,
  registerCacheReset,
} from "./auth";

// The per-user cache reset guards against one account's cached data (dashboard,
// results, streak…) leaking into the next session on a shared device. It must
// fire on session end (clearAuth) but NOT on a silent token refresh (saveAuth),
// which keeps the same identity and would otherwise wipe fresh data needlessly.
describe("per-user cache reset", () => {
  beforeEach(() => {
    // Reset the registered hook to a no-op between tests.
    registerCacheReset(() => {});
    clearAuth();
  });

  it("invokes the registered reset on clearAuth (logout / session end)", () => {
    const reset = vi.fn();
    registerCacheReset(reset);

    clearAuth();

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("does NOT invoke the reset on saveAuth (silent token refresh keeps identity)", () => {
    const reset = vi.fn();
    registerCacheReset(reset);

    saveAuth("header.eyJzdWIiOiIxIn0.sig");

    expect(reset).not.toHaveBeenCalled();
  });

  it("resetUserCache is a safe no-op before any hook is registered", () => {
    registerCacheReset(null as unknown as () => void);
    // Nothing registered → must not throw.
    expect(() => resetUserCache()).not.toThrow();
  });

  it("resetUserCache calls through to the registered hook", () => {
    const reset = vi.fn();
    registerCacheReset(reset);

    resetUserCache();

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
