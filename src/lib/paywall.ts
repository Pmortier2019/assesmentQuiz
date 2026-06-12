import { FREE_TEST_LIMIT } from "./constants";

/**
 * Pure paywall-guard logic, extracted from the test-taking page so it can be
 * unit-tested in isolation. These mirror the conditions enforced server-side;
 * the frontend uses them to pre-check (skip a doomed request) and to render the
 * paywall instead of the test.
 */

export type PaywallReason = "free_limit" | "pro_test";

/**
 * True once a non-pro, non-admin user has spent their free-test allowance.
 * Used as a pre-check before fetching a test, since every test is then blocked.
 */
export function freeLimitReached(opts: {
  isAdmin: boolean;
  isPro: boolean;
  freeTestsUsed: number;
}): boolean {
  const { isAdmin, isPro, freeTestsUsed } = opts;
  return !isAdmin && !isPro && freeTestsUsed >= FREE_TEST_LIMIT;
}

/**
 * Whether access to a specific test should be blocked by the paywall.
 * Admins and Pro users are never blocked; everyone else is blocked by a
 * pro-only test or once their free allowance is used up.
 */
export function isTestBlocked(opts: {
  isAdmin: boolean;
  isPro: boolean;
  isFree: boolean;
  freeTestsUsed: number;
}): boolean {
  const { isAdmin, isPro, isFree, freeTestsUsed } = opts;
  if (isAdmin || isPro) return false;
  return !isFree || freeTestsUsed >= FREE_TEST_LIMIT;
}

/**
 * Which paywall message applies. A reached free limit takes precedence over the
 * pro-only reason, matching the order the page renders them in.
 */
export function paywallReasonFor(freeTestsUsed: number): PaywallReason {
  return freeTestsUsed >= FREE_TEST_LIMIT ? "free_limit" : "pro_test";
}
