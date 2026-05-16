const TOKEN_KEY = "assesspro_token";
const USER_KEY  = "assesspro_user";

export function saveAuth(token: string, user: object) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

function decodeJwtPayload(): Record<string, unknown> | null {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

/** Decode userId from JWT payload (no signature verification — backend does that). */
export function getUserIdFromToken(): number | null {
  const payload = decodeJwtPayload();
  return payload ? Number(payload.sub) : null;
}

export function isAdmin(): boolean {
  const payload = decodeJwtPayload();
  return payload?.role === "ADMIN";
}
