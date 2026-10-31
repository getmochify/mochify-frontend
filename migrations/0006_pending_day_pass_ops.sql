-- Which pass a parked order bought: the Day Pass (100 uploads) or Day Pass+
-- (300). NULL is a row parked before this column existed, which can only be a
-- Day Pass.
--
-- Apply BEFORE deploying the code that writes it (the webhook's INSERT names
-- the column, and fails without it):
--   wrangler d1 execute mochify-auth --local  --file=migrations/0006_pending_day_pass_ops.sql
--   wrangler d1 execute mochify-auth --remote --file=migrations/0006_pending_day_pass_ops.sql
ALTER TABLE pending_day_pass ADD COLUMN ops_limit INTEGER;
