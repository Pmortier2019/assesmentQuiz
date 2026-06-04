import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUser,
  getTests,
  getUserResults,
  getPreparationPath,
  getRecommendedTests,
  type TestFilters,
} from "./api";

// ─── Query keys ────────────────────────────────────────────────────────────
// Centralised so components and mutations (e.g. test generation) invalidate
// the exact same keys the hooks below read from.

export const queryKeys = {
  currentUser: ["currentUser"] as const,
  userResults: ["userResults"] as const,
  preparationPath: ["preparationPath"] as const,
  recommendedTests: ["recommendedTests"] as const,
  tests: {
    all: ["tests"] as const,
    list: (filters: TestFilters) => ["tests", filters] as const,
  },
};

// ─── Hooks ───────────────────────────────────────────────────────────────────
// Thin wrappers over the existing api.ts functions. Caching, dedup, background
// revalidation and retries come from the shared QueryClient defaults.

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
  });
}

export function useUserResults() {
  return useQuery({
    queryKey: queryKeys.userResults,
    queryFn: getUserResults,
  });
}

export function useTests(filters: TestFilters = {}) {
  return useQuery({
    queryKey: queryKeys.tests.list(filters),
    queryFn: () => getTests(filters),
  });
}

/**
 * Preparation path is only relevant once the user has career targets. The
 * `enabled` flag lets it run in parallel with the recommended-tests query
 * (both fire as soon as the user resolves) instead of in a serial waterfall.
 */
export function usePreparationPath(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.preparationPath,
    queryFn: getPreparationPath,
    enabled,
  });
}

export function useRecommendedTests(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.recommendedTests,
    queryFn: getRecommendedTests,
    enabled,
  });
}
