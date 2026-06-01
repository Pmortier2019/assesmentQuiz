-- Tracks the last password change so JWTs issued before it can be rejected.
-- Nullable: existing sessions remain valid until the next password change.
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP;
