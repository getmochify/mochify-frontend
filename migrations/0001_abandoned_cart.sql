-- Abandoned cart recovery + NEW50 minted discounts.
-- See docs/abandoned-cart-new50.md.
--
-- Apply with:
--   wrangler d1 execute mochify-auth --local  --file=migrations/0001_abandoned_cart.sql
--   wrangler d1 execute mochify-auth --remote --file=migrations/0001_abandoned_cart.sql

-- `id` is the Polar checkout id, not a surrogate key. That is what makes the
-- webhook idempotent: Polar retries checkout.expired on any non-2xx, and without
-- a natural key each retry would mint a second live discount code and send a
-- second email.
CREATE TABLE IF NOT EXISTS abandoned_checkout (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL,
  email             TEXT NOT NULL,
  product_id        TEXT,
  plan              TEXT,
  billing           TEXT,
  discount_id       TEXT,
  discount_code     TEXT,
  first_email_id    TEXT,
  followup_email_id TEXT,
  converted_at      INTEGER,
  created_at        INTEGER NOT NULL
);

-- Supports the 30-day "have we already emailed this person" suppression check.
CREATE INDEX IF NOT EXISTS idx_abandoned_user ON abandoned_checkout(user_id, created_at);

-- Supports conversion attribution from Subscription.discountId, and the
-- code lookup that lets /api/checkout auto-apply the discount from an email link.
CREATE INDEX IF NOT EXISTS idx_abandoned_discount ON abandoned_checkout(discount_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_code ON abandoned_checkout(discount_code);

-- Marketing opt-out. Everything Resend sends today is transactional (magic
-- links, receipts, verification) and needs no opt-out; abandoned cart email is
-- marketing and does. D1 has no `ADD COLUMN IF NOT EXISTS`, so this statement
-- errors harmlessly if the migration is applied twice.
ALTER TABLE profile ADD COLUMN marketing_opt_out INTEGER DEFAULT 0;
