// In-memory auth store. The access token (a credential) is deliberately NOT
// persisted to localStorage — that would make it readable by any script on the
// page (XSS). It lives in module scope for the lifetime of the tab and is
// restored on load via the httpOnly refresh cookie (see bootstrapAuth in api.ts).

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

let accessToken: string | null = null;
// Starts "loading" so the UI can wait for the initial refresh attempt instead
// of flashing a logged-out state before the session is restored.
let status: AuthStatus = "loading";

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

// A hook that wipes cached per-user data (the React Query cache) when the
// signed-in identity changes. Registered by the QueryClient provider so this
// module stays free of a React Query dependency. Invoked on logout / session
// end and on explicit sign-in, so one account's cached data (dashboard,
// results, streak, career targets…) can never leak into the next session on a
// shared device.
let cacheReset: (() => void) | null = null;

/** Register the per-user cache wipe. Called once by the QueryClient provider. */
export function registerCacheReset(fn: () => void) {
  cacheReset = fn;
}

/** Wipe cached per-user data. A safe no-op until the provider registers. */
export function resetUserCache() {
  cacheReset?.();
}

/** Subscribe to auth changes (token/status). Returns an unsubscribe fn. */
export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getAuthStatus(): AuthStatus {
  return status;
}

export function getToken(): string | null {
  return accessToken;
}

/**
 * Store the access token in memory and mark the session authenticated. User
 * data is intentionally not persisted here — it's fetched fresh from the API
 * (React Query), so callers pass only the token.
 */
export function saveAuth(token: string) {
  accessToken = token;
  status = "authenticated";
  emit();
}

export function clearAuth() {
  accessToken = null;
  status = "unauthenticated";
  // Session ended — drop any cached per-user data before the UI reacts. Covers
  // every logout path centrally (the logout button, a 401, a failed refresh,
  // account deletion), not just the explicit sign-out buttons.
  resetUserCache();
  emit();
}

/** Called by the bootstrap when the initial refresh resolves without a token. */
export function markUnauthenticated() {
  if (accessToken) return; // a concurrent login won the race — keep it
  status = "unauthenticated";
  emit();
}

function decodeJwtPayload(): Record<string, unknown> | null {
  if (!accessToken) return null;
  try {
    return JSON.parse(atob(accessToken.split(".")[1]));
  } catch {
    return null;
  }
}

/** Decode userId from the JWT payload (no signature verification — backend does that). */
export function getUserIdFromToken(): number | null {
  const payload = decodeJwtPayload();
  return payload ? Number(payload.sub) : null;
}

export function isLoggedIn(): boolean {
  return accessToken != null;
}

export function isAdmin(): boolean {
  const payload = decodeJwtPayload();
  return payload?.role === "ADMIN";
}
