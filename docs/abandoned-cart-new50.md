# Abandoned cart recovery + NEW50 discount

Status: code complete, not yet live. Three manual steps remain, listed under
"Before the first send".
Owner: Taylor.
Scope: `mochify-frontend` only. No changes needed in `mochify-core` or the MCP worker.

## Files

| File | Role |
|---|---|
| `migrations/0001_abandoned_cart.sql` | `abandoned_checkout` table, `profile.marketing_opt_out` |
| `src/lib/server/discounts.ts` | Code minting, product scoping, plan reverse map |
| `src/lib/server/abandonedCart.ts` | Qualification, idempotent claim, conversion settle |
| `src/lib/server/emails/abandonedCart.ts` | Templates, send, schedule, cancel |
| `src/lib/server/unsubscribe.ts` | Signed opt-out tokens, opt-out write |
| `src/routes/unsubscribe/+page.svelte`, `+page.server.ts` | Confirm page and opt-out action |
| `src/routes/unsubscribe/one-click/+server.ts` | RFC 8058 one-click endpoint |
| `src/routes/api/webhooks/polar/+server.ts` | `checkout.expired` case, conversion settle |
| `src/routes/api/checkout/+server.ts` | Auto-applies a minted code from an email link |

### Two things built that the plan did not specify

1. **The emailed button auto-applies the discount.** `/api/checkout` now accepts
   `?code=`, resolves it against the user's own `abandoned_checkout` rows, and
   passes `discountId` straight to `checkouts.create`. Asking someone to copy a
   code out of an email and paste it into Polar is the single biggest drop-off in
   a redemption flow. The code is still printed in the email as a fallback. The
   lookup is scoped to the logged-in user's rows, so a leaked code is useless to
   anyone else even before Polar's `maxRedemptions` cap applies.
2. **Unsubscribe is a POST, not a GET.** Outlook Safe Links, Gmail's proxy and
   corporate security gateways fetch every URL in an inbound email, so a mutating
   GET would opt people out who never clicked. The GET renders a confirm button.
   Gmail's own unsubscribe affordance is served separately by the RFC 8058
   one-click endpoint, which is why there are two routes rather than one.

## Before the first send

1. **Apply the migration.** `wrangler d1 execute mochify-auth --remote --file=migrations/0001_abandoned_cart.sql`
2. **Tick `checkout.expired`** on the webhook endpoint in the Polar dashboard.
   The `case` is inert until this is done.
3. **Set `POSTAL_ADDRESS`** in `src/lib/server/emails/abandonedCart.ts`. It is
   empty, which renders a footer with no address. That is a PECR/CAN-SPAM gap,
   not a cosmetic one.

## Decisions taken

| Question | Decision |
|---|---|
| Trigger | Polar `checkout.expired` webhook only |
| Code model | Per-user minted single-use codes, `NEW50` prefix |
| Discount terms | 50% off first month, `duration: "once"`, monthly products only |
| Scheduling | Resend `scheduledAt`, no cron worker |

## The constraint that drives the design

Polar discounts have no per-customer and no new-customer rule. The full set of
create fields is `name`, `code`, `startsAt`, `endsAt`, `maxRedemptions`,
`products`, `duration`, `durationInMonths`, `basisPoints`, `metadata`
(`node_modules/@polar-sh/sdk/src/models/components/discountpercentagecreate.ts`).

`maxRedemptions` is a **global** cap. A shared `NEW50` with `maxRedemptions: 1`
is redeemed once by one person worldwide and is then dead for everyone else.

So single-use and new-customer-only both have to be enforced by us. We do it by
minting a fresh code per qualifying abandoner, each with `maxRedemptions: 1`.
The recipient is the only person who ever sees their code, so single-use is true
by construction, and new-customer-only holds because we only mint for users who
have never had a subscription.

### Two hard API rules

1. **Codes are alphanumeric only.** The SDK doc comment is explicit: "Must be
   between 3 and 256 characters long and contain only alphanumeric characters."
   `NEW50-K7F3QA` is rejected. Use `NEW50K7F3QA`.
2. **`checkouts.create` cannot set an expiry.** There is no `expiresAt` on
   `CheckoutCreate` in the installed SDK, so the abandon delay is whatever
   Polar's session TTL is. Measure it once in sandbox before writing "expires in
   X hours" into the email copy.

## What the existing NEW50 code should become

The code already created in Polar is not used by this flow. Pick one:

- **Recommended:** keep it, but re-scope it as a manual support grant. Set
  `products` to the monthly plan IDs and set an `endsAt`. Leave `maxRedemptions`
  unset. Do not publish it anywhere. It is then a tool for handling refund
  requests and goodwill, not a campaign code.
- Or delete it, so there is no shared string that can leak to voucher sites.

Do **not** leave a public `NEW50` at `maxRedemptions: 1`. It reads as working and
silently stops after the first redemption.

## Do we need a Cloudflare cron?

No. Every timed step in this flow is driven by a clock we do not run:

| Step | Timer | Mechanism |
|---|---|---|
| Email 1 | Polar checkout session TTL | Sent inline in the `checkout.expired` webhook |
| Email 2, +48h | Resend | `scheduledAt` on the ordinary send call |
| Cancel on conversion | Polar | `subscription.active` webhook calls `emails.cancel` |
| Reschedule | n/a | `emails.update`, `PATCH /emails/{id}` |

This is a deliberate constraint, not a coincidence. `adapter-cloudflare` exposes
only `config`, `routes`, `platformProxy` and `fallback` (`index.d.ts`), and emits
a `fetch`-only worker. There is no supported hook for a `scheduled` handler. A
cron would therefore mean standing up a **second worker** next to
`mochify-tokens`, with its own deploy pipeline, secrets, D1 and KV bindings, and
a sweep query. That is a large amount of permanent infrastructure to buy one
delayed email, which is why the design routes around it.

A cron only becomes necessary if the scope widens to:

- PostHog stall detection, for users who never reach Polar's payment page.
- The pricing-page bouncer campaign.
- Automated cleanup of expired minted discounts. Manual is fine at current
  volume.

If two of those three ever become wanted at once, that is the moment to build
the worker, and all three should then move onto it together.

## Prerequisites

1. ~~**`POLAR_ACCESS_TOKEN` needs `discounts:write`.**~~ Confirmed present on the
   current key. No action needed.
2. **Subscribe the webhook endpoint to `checkout.expired`.** The handler at
   `src/routes/api/webhooks/polar/+server.ts` currently only receives
   `subscription.*` and `order.created`. Adding the `case` in code does nothing
   until the event is ticked on in the Polar dashboard webhook config.
3. **New env vars** (`wrangler.jsonc` `vars` for non-secrets):
   - `POLAR_DISCOUNT_PRODUCTS` is not needed; reuse the existing
     `POLAR_PRODUCT_ID_SELLER_MONTHLY` and `POLAR_PRODUCT_ID_PRO_MONTHLY`.
   - `PUBLIC_APP_URL` already exists and is used for links.

## Schema

New D1 table on the `mochify-auth` database. There is no migrations directory in
this repo, so apply it with `wrangler d1 execute` the same way the existing
tables were created.

```sql
CREATE TABLE abandoned_checkout (
  id                TEXT PRIMARY KEY,        -- polar checkout id, gives idempotency
  user_id           TEXT NOT NULL,
  email             TEXT NOT NULL,
  product_id        TEXT,
  discount_id       TEXT,                    -- polar discount id we minted
  discount_code     TEXT,                    -- NEW50XXXXXX
  first_email_id    TEXT,                    -- resend id
  followup_email_id TEXT,                    -- resend id, cancellable
  converted_at      INTEGER,
  created_at        INTEGER NOT NULL
);
CREATE INDEX idx_abandoned_user ON abandoned_checkout(user_id, created_at);
CREATE INDEX idx_abandoned_discount ON abandoned_checkout(discount_id);
```

`id` being the Polar checkout id means a webhook retry cannot double-send. Insert
with `INSERT OR IGNORE` and bail if no row was written.

Also add one column to `profile` for compliance (see below):

```sql
ALTER TABLE profile ADD COLUMN marketing_opt_out INTEGER DEFAULT 0;
```

## Flow

```
user clicks upgrade
  -> /api/checkout mints a Polar checkout (already exists)
  -> user lands on Polar, does not pay
  -> Polar session times out
  -> checkout.expired webhook  <-- new
       |
       +-- resolve user, check they qualify
       +-- mint NEW50XXXXXX, maxRedemptions 1, endsAt +7d
       +-- Resend: send email 1 now
       +-- Resend: schedule email 2 at +48h
       +-- record row in abandoned_checkout
                |
                v
       user subscribes with the code
       -> subscription.active webhook (already exists)
            +-- cancel the scheduled email 2
            +-- stamp converted_at
            +-- PostHog abandoned_cart_converted
```

## Qualification

A user qualifies as new only if **all** hold:

- `checkout.expired` resolved to a known user id.
- No `profile` row at all, **or** a row with `plan = 'free'` and
  `polar_subscription_id IS NULL`. The missing-row case matters: free users may
  not have a profile row yet, which `src/routes/dashboard/+page.server.ts:184`
  already accounts for. Treating a missing row as "not eligible" would silence
  the campaign for exactly the users it targets.
- `marketing_opt_out` is falsy.
- No `abandoned_checkout` row for this user in the last 30 days. Without this, a
  user who opens and abandons checkout four times in an afternoon gets four
  emails and four live discount codes.

**Open decision: day pass buyers.** They have `plan = 'day'` and no subscription.
They have proven they will pay but have not subscribed. My recommendation is to
include them, since they are the warmest non-subscriber segment you have. It is a
one-word change to the plan check, so it can also ship as free-only first and
widen later.

## Code minting

```ts
// Crockford-style alphabet: no I, L, O, U. Alphanumeric only, per Polar's rule.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function mintCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let suffix = '';
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  return `NEW50${suffix}`;   // e.g. NEW50K7F3QA
}
```

6 characters over a 32-symbol alphabet is about 1.07 billion combinations. Codes
are single-use, product-scoped and 7-day-lived, so guessing is not a real risk;
the randomness is there to prevent collisions, not attackers.

```ts
const discount = await polar.discounts.create({
  name: `NEW50 abandoned cart (${userId})`,
  code: mintCode(),
  type: 'percentage',
  basisPoints: 5000,
  duration: 'once',
  maxRedemptions: 1,
  products: [
    env.POLAR_PRODUCT_ID_SELLER_MONTHLY,
    env.POLAR_PRODUCT_ID_PRO_MONTHLY
  ],
  endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  metadata: { user_id: userId, campaign: 'abandoned_cart' }
});
```

Scoping `products` to the two monthly IDs is what stops someone applying a
"first month half price" discount to an annual plan and taking $125 off Pro
annual. Do not omit it.

Wrap the create in the same 8s timeout pattern `/api/checkout` already uses, and
treat failure as "skip the email" rather than throwing. The webhook must still
return 200 or Polar will retry and you will mint duplicate codes.

## Email

Resend is already wired (`src/lib/auth.ts`, `src/routes/contact/+page.server.ts`),
sending from `Mochify <hello@mochify.app>`.

Email 2 is scheduled at send time rather than swept by a cron job, using Resend's
`scheduledAt`. This is why the plan needs no new worker: the SvelteKit
Cloudflare adapter emits a `fetch`-only worker
(`node_modules/@sveltejs/adapter-cloudflare/files/worker.js`), so there is no
`scheduled` handler to hang a cron trigger on without standing up a second
worker.

```ts
const first = await resend.emails.send({
  from: 'Mochify <hello@mochify.app>',
  to: email,
  subject: 'Your Mochify upgrade is still waiting',
  html: renderAbandonedCart({ code, plan, appUrl })
});

const followup = await resend.emails.send({
  from: 'Mochify <hello@mochify.app>',
  to: email,
  subject: `${code} expires in 5 days`,
  html: renderAbandonedCartFollowup({ code, plan, appUrl }),
  scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
});
```

Cancel on conversion:

```ts
await resend.emails.cancel(row.followup_email_id);   // POST /emails/{id}/cancel
```

Nothing is worse than a "you left something behind" email landing after someone
has paid, so treat this cancel as part of the conversion path, not a nice-to-have.

**Give the cancel more than one chance to run.** It is a network call with no
retry behind it: if it fails once, the follow-up ships to a paying customer. The
webhook handler already shares a `case` block across `subscription.created`,
`subscription.active` and `subscription.updated`, and Polar generally fires more
than one of those on a successful upgrade. Putting the cancel on that shared path
rather than on `subscription.active` alone gives it two or three independent
attempts at no extra cost. Make it idempotent, so cancelling an already-cancelled
email is a no-op, and clear `followup_email_id` once it succeeds.

### Copy notes

- Lead with the value, not the discount. The subject line above does that; "50%
  off!" subject lines get filtered and cheapen the product.
- State the real numbers: Seller $7.99 to $4.00 for the first month, Pro $24.99
  to $12.50. Say plainly that it renews at full price. Burying that is what
  generates chargebacks.
- Deep-link straight back into checkout for the plan they abandoned, so the code
  is the only thing they have to think about.
- House style applies: no em dashes anywhere in the copy.

### Compliance, not optional

This is marketing email, not transactional. Unlike the magic links and receipts
already being sent, it needs:

- A working unsubscribe link in every send, wired to set
  `profile.marketing_opt_out = 1`. A one-click GET route with a signed token is
  enough; do not require a login to unsubscribe.
- A postal address or equivalent sender identification in the footer.
- The `marketing_opt_out` check in the qualification step above, honoured before
  minting.

Given Mochify's privacy positioning and the GDPR-focused guide content, getting
this wrong is a brand problem as much as a legal one. Worth doing properly on the
first pass.

## Attribution

`Subscription.discountId` exists (`subscription.ts:177`), so attribution is exact
rather than inferred. In the `subscription.active` case, if `sub.discountId`
matches a row in `abandoned_checkout`, that recovery is provably yours.

PostHog events to add, alongside the existing `checkout_initiated` and
`subscription_activated`:

- `abandoned_cart_detected` (fired even when the user does not qualify, with a
  `reason` property, so you can see how much of the funnel you are declining to
  email)
- `abandoned_cart_email_sent`
- `abandoned_cart_converted` with `discount_code` and `plan`

The pairing of `checkout_initiated` and `abandoned_cart_detected` also gives you
a checkout abandonment rate, which you do not currently measure at all.

## Revenue math

At 50% off first month, monthly only:

| Plan | First month | Then | Cost of one recovery |
|---|---|---|---|
| Seller | $4.00 | $7.99/mo | $3.99 forgone |
| Pro | $12.50 | $24.99/mo | $12.49 forgone |

Against roughly £20/mo of flat infra cost, a single recovered Seller subscriber
that survives three months clears the discount several times over. The risk is
not the discount rate, it is discounting people who would have converted anyway.
`checkout.expired` limits that reasonably well, since these are people who
actively did not complete. If you widen the trigger later, revisit this.

## Cleanup

Minted discounts accumulate in Polar, one per abandoner, forever. `endsAt` makes
them inert but not invisible, and the discounts list will get noisy. Options, in
order of effort: ignore it until the list is annoying; delete expired ones by
hand periodically; or add a sweep using `polar.discounts.delete` over discounts
whose `metadata.campaign === 'abandoned_cart'` and whose `endsAt` has passed.
Not needed for launch.

## Build order

1. ~~Confirm the `discounts:write` scope on `POLAR_ACCESS_TOKEN`.~~ Done.
2. ~~Create the `abandoned_checkout` table and the `profile.marketing_opt_out`
   column.~~ Written as `migrations/0001_abandoned_cart.sql`, still to apply.
3. ~~Build the unsubscribe route first, so no marketing email can ever ship
   without it.~~ Done.
4. ~~Add `discounts.ts` and `emails/abandonedCart.ts`.~~ Done.
5. ~~Add the `checkout.expired` case to the Polar webhook handler.~~ Done.
6. ~~Add the cancel-and-stamp logic to the subscription case.~~ Done, on the
   shared created/active/updated path.
7. Enable `checkout.expired` in the Polar dashboard, pointed at sandbox first.
8. Test end to end in sandbox. This is the step that has not happened, and the
   checks below are the ones that matter:
   - The code arrives and the emailed button applies it with no typing.
   - It is **rejected on annual products**. This is the expensive failure: an
     unscoped 50% off would take $125 off Pro annual.
   - It is accepted once on monthly and rejected on a second attempt.
   - The follow-up cancels on conversion.
   - A second abandoned checkout inside 30 days sends nothing.
   - Unsubscribe works from a logged-out browser.
9. Set `POSTAL_ADDRESS`, apply the migration to `--remote`, then ship.

## Verification run on the code as written

- `npm run check`: 0 errors, 28 warnings, all 28 pre-existing and none in the new
  files.
- `eslint` on the new modules: clean. The webhook retains 3 pre-existing problems
  (2 `no-fallthrough` on the untouched subscription cases, 1 stray
  `eslint-disable`) and `+page.svelte` has 1 `no-navigation-without-resolve` on
  `href="/"`, which matches repo-wide convention: `Navigation.svelte` alone has
  15 of the same. The repo does not currently pass `npm run lint` at HEAD, so
  these were left rather than fixed as unrelated churn.
- Customer-facing copy contains no em dashes.
- Not tested at runtime: nothing here has touched a live or sandbox Polar
  account. Step 8 is real work, not a formality.

## Deliberately out of scope

- PostHog-based stall detection for users who never reach Polar's page. Needs a
  cron worker; revisit if `checkout.expired` volume turns out to be low.
- A pricing-page bouncer campaign. Different audience, different suppression
  rules, and a much higher spam risk against free users.
