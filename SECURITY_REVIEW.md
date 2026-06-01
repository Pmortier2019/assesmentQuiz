# Security Review — AssessPro backend

_Date: 2026-06-01 · Branch: `fix/idor-authorization`_

The recurring root cause across the API was that the backend trusted the
`userId` supplied by the client (URL path, query string, or request body)
instead of deriving it from the authenticated JWT principal. One controller
(`SubscriptionController`) already did this correctly; the rest did not.

## Findings

| # | Finding | Severity | Endpoint(s) | Status |
|---|---------|----------|-------------|--------|
| 1 | IDOR — any logged-in user could read/modify any other user's data | 🔴 Critical | `/api/users/**` | ✅ Fixed |
| 2 | IDOR write — submit results/XP on behalf of any user | 🔴 Critical | `POST /api/tests/{id}/submit` | ✅ Fixed |
| 3 | Paywall + free-limit bypass via client-supplied `userId` | 🔴 Critical | `GET /api/tests/{id}` | ✅ Fixed |
| 9 | Info leak — any user's recommendations were public | 🟡 Medium | `GET /api/tests/recommended/{userId}` | ✅ Fixed |
| 5 | No rate limiting (brute force / email bombing) | 🟠 High | all `/api/auth/**` | ✅ Fixed |
| 6 | JWT: no revocation, role baked in token, 30-day lifetime | 🟠 High | auth flow | ✅ Fixed |
| 7 | Webhook HMAC compare not constant-time | 🟡 Medium | `POST /api/webhooks/lemonsqueezy` | ✅ Fixed |
| 8 | Password reset does not invalidate sessions; no strength check | 🟡 Medium | `/api/auth/reset-password` | ✅ Fixed |
| 11 | Leaderboard / admin stats load all rows into memory | 🔵 Low | `GET /api/leaderboard` | ✅ Fixed |
| 4 | User enumeration on register (409 leaked existence) | 🟠 High | `POST /api/auth/register` | ✅ Fixed |
| 10 | Long-lived JWT stored in `localStorage` (XSS-exposed) | 🟡 Medium | frontend | ◑ Mitigated |

> Note: `AdminController` **is** correctly protected (`/api/admin/**` → `hasRole("ADMIN")`).
> The `// TODO: Protect this endpoint` comments there are stale and can be removed.

## Fixes applied in this branch (#1, #2, #3, #9)

The fix pattern is uniform: **the user is taken from `auth.getPrincipal()`**,
never from client input.

- **`SecurityConfig`** — only the public catalogue list `GET /api/tests` stays
  anonymous. Test detail and per-user `tests` routes now require a valid JWT.
- **`UserController`** — every `/api/users/{userId}/**` endpoint now calls
  `requireOwner(auth, userId)` (admins may access any user; others only their own).
- **`TestController.getTest`** — resolves access against the JWT user instead of a
  `?userId=` query param (closed the paywall/free-limit bypass).
- **`TestController.submitTest`** + **`TestService.submitTest`** — result is always
  recorded for the authenticated user; `userId` removed from `SubmitTestRequest`.
- **`TestController.getRecommended`** — route changed to `/api/tests/recommended/me`
  and driven by the JWT user.
- **Frontend `api.ts`** — updated to the new endpoints (dropped client-supplied
  `userId` from test detail, submit body, and recommended route).

Verified: `mvnw compile` and `tsc --noEmit` both pass.

## Hardening applied in this branch (#5, #6, #7, #8, #11)

- **#5 Rate limiting** — new `RateLimitFilter` throttles `POST /api/auth/**` per
  client IP: 20/min for general auth, 5/10min for the email-sending endpoints
  (`forgot-password`, `resend-verification`). In-memory / per-instance; returns 429
  with `Retry-After`. Uses `Fly-Client-IP` (non-spoofable) as the key.
- **#6 Token revocation + live role** — `JwtAuthFilter` now loads the user per request
  and (a) rejects tokens whose `iat` predates `User.passwordChangedAt`, (b) rejects
  tokens for deleted users, (c) reads the role from the DB so a demotion takes effect
  immediately instead of after 30 days.
- **#7 Constant-time HMAC** — webhook signature compared with `MessageDigest.isEqual`.
- **#8 Reset hardening** — `reset-password` validates password strength (`@Size(min=8)`)
  and sets `passwordChangedAt`, so a reset logs out every existing session.
  New Flyway migration `V4__password_changed_at.sql`.
- **#11 Leaderboard** — added `findTopByDateRange(...)` so the "all types" board is
  sorted/limited in the DB instead of loading every row into memory.

## Token + cookie rework applied in this branch (#4, #6, #10)

Auth now uses **short-lived access tokens + a refresh token in an httpOnly cookie**,
which is the recommended pattern for a cross-site SPA (Vercel frontend ↔ Fly backend).

- **Access token** — JWT, default 120 min (`app.auth.access-token-ttl-minutes`),
  `type:"access"`, sent via `Authorization: Bearer`. Carries a much smaller theft
  window than the old 30 days.
- **Refresh token** — JWT, default 30 days (`app.auth.refresh-token-ttl-days`),
  `type:"refresh"`, delivered as `Set-Cookie: refresh_token=...; HttpOnly; Secure;
  SameSite=None; Path=/api/auth`. Not readable by JS, so XSS can no longer steal the
  durable credential. Rejected if presented as an API bearer token.
- **`POST /api/auth/refresh`** — reads the cookie, honours the `passwordChangedAt`
  cutoff, and issues a fresh access token (rotating the cookie). **`POST /api/auth/logout`**
  clears the cookie. Login / verify-email / admin-bootstrap all set it.
- **`JwtAuthFilter`** loads the user per request (role from DB; rejects refresh tokens,
  deleted users, and tokens predating a password change).
- **`AuthenticationEntryPoint`** now returns **401** for unauthenticated requests (was
  403) so the client can transparently refresh; authenticated-but-forbidden stays 403.
- **Frontend** — `apiFetch` sends `credentials: "include"` and transparently refreshes
  once on a 401 before retrying; `logout()` calls the backend to clear the cookie.
- **#4** — `register` no longer reveals whether an email exists: it returns the same
  "check your email" response either way and emails the existing owner a "you already
  have an account" notice.

Cookie attributes are environment-driven: prod defaults to `Secure; SameSite=None`;
the `dev` profile uses `Secure=false; SameSite=Lax` for `http://localhost`.

> Verified live (dev profile, H2): login → refresh cookie set (`HttpOnly; Path=/api/auth;
> Max-Age=30d`), `/api/auth/refresh` issues a new token, refresh-token-as-bearer → 401,
> protected endpoints → 401 without a token, public list → 200, rate limit → 429 after 20.

### Residual / future hardening
- The **access token** is still kept in `localStorage` (now short-lived) so the
  existing synchronous route guards keep working. Moving it fully into memory needs an
  auth-context refactor of the guards/navbar/sidebar — a worthwhile but larger change.
- **⚠️ Must be verified on a real deploy:** cross-site cookies only work over HTTPS with
  `SameSite=None; Secure`. Test login + refresh on a Vercel preview against the Fly
  backend before shipping to production, and confirm `CORS_ALLOWED_ORIGINS` lists the
  exact frontend origin (CORS `allowCredentials` is already enabled).
- `login` still returns `403 EMAIL_NOT_VERIFIED`, but only after a *correct* password,
  so its enumeration value is low.
