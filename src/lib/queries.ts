import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
    list: (filters: TestFilters) => ["tests", "list", filters] as const,
    infinite: (filters: TestFilters) => ["tests", "infinite", filters] as const,
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
 * Paginated test library with "load more" semantics. Each page is fetched
 * server-side (search/filter/paging all live in the query key), so changing a
 * filter starts a fresh paginated query and `fetchNextPage` appends the next
 * page instead of re-downloading everything.
 */
export function useTestsInfinite(filters: TestFilters = {}, pageSize = 12) {
  return useInfiniteQuery({
    queryKey: queryKeys.tests.infinite(filters),
    queryFn: ({ pageParam }) => getTests(filters, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
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
