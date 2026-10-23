-- Day Passes bought by an email that has no account yet.
--
-- Apply with:
--   wrangler d1 execute mochify-auth --local  --file=migrations/0005_pending_day_pass.sql
--   wrangler d1 execute mochify-auth --remote --file=migrations/0005_pending_day_pass.sql
--
-- A first-time buyer's account is created by the magic-link plugin when they
-- click the activation link, which is after Polar's order.created webhook has
-- run. The webhook used to look the email up, find no user and stop, so the
-- buyer paid and got a free account. It now parks the order here, and the
-- user-create hook in $lib/auth grants the pass when that email's account is
-- created (see $lib/server/dayPassGrant).
--
-- One row per email: a second pass bought before the first is activated
-- replaces the row, and activation grants one 24-hour pass. Rows are deleted
-- when granted.
CREATE TABLE IF NOT EXISTS pending_day_pass (
	email TEXT PRIMARY KEY,
	order_id TEXT NOT NULL,
	created_at INTEGER NOT NULL
);
