# Resend contact sync

Status: code complete, four manual steps remain (see "Before this is live").
Owner: Taylor.
Scope: `mochify-frontend` only.

Every verified account is pushed to the Resend contact list so broadcasts can be
sent from Resend without hand-importing a CSV, and so the marketing toggle means
the same thing on both sides. Each contact also carries two properties, `tier`
and `signup_date`, so segments can be built on plan and tenure without exporting
anything.

## The invariant

**D1 `profile.marketing_opt_out` is the source of truth. The Resend contact is a
mirror.** Only D1 gates a send (`abandonedCart.ts` refuses on `opted_out`), so
every write goes to D1 first and Resend second. A Resend failure is logged and
leaves a stale mirror; it can never lose an opt-out.

That direction alone is not enough. Resend requires its own
`{{{RESEND_UNSUBSCRIBE_URL}}}` in every broadcast, so a broadcast unsubscribe
flips the contact inside Resend and never touches `/unsubscribe`. Without the
write-back webhook, the abandoned-cart stream would keep mailing someone who had
just unsubscribed. That is the whole reason the webhook exists.

No loop: our outbound mirror skips writes that would be no-ops, and the webhook
writes D1 only, never back out to Resend.

## Contact properties

Both are defined in the Resend dashboard under Contacts → Properties, and both
are typed `string` — Resend only offers `string` or `number`, so there is no date
type to reach for.

| Property      | Source           | Value                                            |
| ------------- | ---------------- | ------------------------------------------------ |
| `tier`        | `profile.plan`   | `free` \| `day` \| `seller` \| `pro` \| `growth` |
| `signup_date` | `user.createdAt` | `YYYY-MM-DD`, e.g. `2026-08-20`                  |

`signup_date` is the date only, deliberately. A segment filter compares strings,
and `2026-08-20` orders correctly that way where a full ISO timestamp does not
sort usefully against a bare date typed into the dashboard.

Neither is tracked separately: every sync re-reads both from D1 and writes them
alongside `unsubscribed`, so a mirror that drifts repairs itself on the next
write rather than needing a reconciliation pass. A user with no `profile` row
reads as `free`, the same assumption the consent default makes. An unparseable
`createdAt` omits `signup_date` rather than guessing at one — a wrong date would
silently mis-target every segment built on it, where a missing one is visible.

The write skips when the contact already matches on consent **and** both
properties, which is what keeps the no-op loop with the webhook closed.

## Files

| File                                        | Role                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/lib/server/resendContacts.ts`          | `syncContact`, `syncContactFromProfile`, `mirrorMarketingConsent`, `mirrorPlan`, `removeContact` |
| `src/routes/api/webhooks/resend/+server.ts` | Write-back: `contact.updated`, `contact.deleted`, `email.complained`                             |
| `src/lib/auth.ts`                           | Signup, email verification and reactivation hooks                                                |
| `src/lib/server/unsubscribe.ts`             | `setMarketingOptOut` mirrors; `setMarketingPreference` is the D1-only half                       |
| `src/routes/dashboard/+page.server.ts`      | Toggle mirrors; `deleteAccount` removes the contact                                              |
| `src/routes/api/webhooks/polar/+server.ts`  | `mirrorPlan` on every plan change (activate, uncancel, cancel/revoke, day pass)                  |
| `src/routes/api/admin/upgrade/+server.ts`   | `mirrorPlan` after a hand-granted plan                                                           |
| `scripts/backfill-resend-contacts.mjs`      | One-off catch-up for accounts predating the sync                                                 |

## When a contact is written

| Moment                                  | Action                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| Google / magic-link signup              | Create, subscribed (verified at creation)                |
| Email + password signup                 | Nothing yet — the address is unproven                    |
| That account verifying its email        | Create, subscribed                                       |
| Dashboard toggle                        | Update `unsubscribed`                                    |
| `/unsubscribe` or one-click             | Update `unsubscribed` (one-click defers via `waitUntil`) |
| Account deleted                         | Contact removed outright                                 |
| Signing back in during the 14-day grace | Re-created at whatever consent D1 holds                  |
| Plan change (Polar or admin grant)      | Update `tier`; never creates a contact                   |
| Broadcast unsubscribe or spam complaint | Webhook writes D1; no outbound call                      |

Unverified addresses are held back deliberately. The email/password flow creates
the user row before the address is proven, and broadcasting to typo'd or
disposable addresses buys bounces on the same domain the magic links go out on.

`mirrorPlan` is the one entry point that refuses to create a contact: it returns
early unless the address is verified and the account is not soft deleted. A plan
change must not be the thing that puts someone on the marketing list, and a
first-time day-pass buyer is created by the magic link before they click it, so
that row is unverified at the moment the `order.created` webhook fires.
`afterEmailVerification` picks them up.

## Before this is live

1. **API key needs full access.** A sending-only key 401s on every contact write.
   Granted 2026-08-20; if the key is ever rotated, keep the scope.
2. **The two properties must exist first.** Create `tier` and `signup_date` in
   the Resend dashboard, both typed `string`, before deploying. Writing to a key
   that has not been defined is rejected, and because `syncContact` swallows its
   own errors that shows up as a logged `[contacts] update failed` rather than
   anything louder.
3. **Create the webhook** in the Resend dashboard against
   `https://mochify.app/api/webhooks/resend`, subscribed to `contact.updated`,
   `contact.deleted` and `email.complained`. Then
   `wrangler secret put RESEND_WEBHOOK_SECRET` with the signing secret. Until
   that secret exists the route returns 503 and Resend will retry.
4. **Backfill** the accounts that predate this:
   ```bash
   RESEND_API_KEY=re_... node scripts/backfill-resend-contacts.mjs --dry-run
   RESEND_API_KEY=re_... node scripts/backfill-resend-contacts.mjs
   ```
   Re-runnable: it reads before it writes, so a second pass changes nothing. It
   is also the repair tool if the mirror is ever suspected of drifting, and the
   only thing that fills in `tier` and `signup_date` on contacts created before
   those properties existed — they stay empty until it runs over them.

## Not covered

The 14-day purge cron lives in `mochify-worker`. Account deletion already removes
the contact here, so the cron has nothing to clean up in Resend — but if that
delete path is ever removed, the cron becomes the place that owes it.
