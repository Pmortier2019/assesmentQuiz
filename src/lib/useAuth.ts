"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getAuthStatus, isAdmin, type AuthStatus } from "./auth";

export interface AuthState {
  status: AuthStatus;
  /** True once a session is confirmed. False while loading or logged out. */
  loggedIn: boolean;
  isAdmin: boolean;
}

/**
 * Subscribes to the in-memory auth store so components re-render when the
 * session is restored (or cleared). SSR and the first client paint both see
 * "loading", avoiding a hydration mismatch.
 */
export function useAuth(): AuthState {
  const status = useSyncExternalStore(subscribe, getAuthStatus, () => "loading" as AuthStatus);
  return {
    status,
    loggedIn: status === "authenticated",
    isAdmin: status === "authenticated" && isAdmin(),
  };
}
