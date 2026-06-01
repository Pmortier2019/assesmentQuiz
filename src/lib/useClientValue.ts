import { useSyncExternalStore } from "react";

// Stable no-op subscribe: the value is read on the client and re-read on every
// render, but the source never pushes updates of its own.
const noopSubscribe = () => () => {};

/**
 * Reads a client-only value (e.g. localStorage / auth token) in an SSR-safe way,
 * without the `set-state-in-effect` anti-pattern. During server render and the
 * first client paint it returns `serverFallback`; after hydration it returns the
 * real client value. Only use this for primitives (string/number/boolean).
 */
export function useClientValue<T>(read: () => T, serverFallback: T): T {
  return useSyncExternalStore(noopSubscribe, read, () => serverFallback);
}
