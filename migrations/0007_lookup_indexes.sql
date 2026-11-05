-- Indexes for lookups that were scanning whole tables.
--
-- Apply with:
--   wrangler d1 execute mochify-auth --local  --file=migrations/0007_lookup_indexes.sql
--   wrangler d1 execute mochify-auth --remote --file=migrations/0007_lookup_indexes.sql
--
-- Additive and safe to apply at any time, before or after any deploy: no code
-- names these indexes, and every statement is IF NOT EXISTS, so applying it
-- twice is a no-op.

-- The Polar and Resend webhooks match emails case-insensitively
-- (`lower(email) = lower(?)`), because the address comes back from a third
-- party. The UNIQUE index on user.email cannot serve a lower() comparison, so
-- each of those lookups read every user row. SQLite uses an expression index
-- when the WHERE clause repeats the indexed expression exactly.
CREATE INDEX IF NOT EXISTS idx_user_email_lower ON user(lower(email));

-- Better Auth's tables were created without its secondary indexes: session and
-- account had only their id/token autoindexes, verification only its id.
--
-- session.userId: sign-out-everywhere on account delete, the purge cron, and
-- better-auth's own revoke/list-sessions paths all filter on it.
CREATE INDEX IF NOT EXISTS idx_session_user ON session(userId);

-- account.userId: better-auth reads a user's accounts on sign-in and linking,
-- and the purge cron deletes by it.
CREATE INDEX IF NOT EXISTS idx_account_user ON account(userId);

-- verification.identifier: every magic-link click and email verification looks
-- its token up by identifier, and expired rows accumulate in this table.
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
