# Save to Google Drive — scope

Status: proposed. Replaces the disabled "Coming soon" card in
`src/routes/dashboard/+page.svelte:600` (Connections section).

Sibling of `byo-bucket-phase1.md`, and deliberately narrower: **output only**.
A paid user connects one Google account, and results are written into a Mochify
folder in their Drive instead of downloading. No reading from Drive, no folder
browser, no Picker. Same shape as `SAVE TO BUCKET`, different destination.

## The thing that makes this cheap

`helpers/BucketDelivery.h` in core is destination-agnostic already. It asks the
tokens worker for a URL, PUTs the response body at it, and turns a 2xx into a
receipt. It never knew what S3 was.

A Drive resumable upload is the same contract:

```
worker:  POST https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable
         Authorization: Bearer <user access token>
         { "name": "photo.avif", "parents": ["<folder id>"] }
      -> 200, Location: <session URI>          # valid one week

core:    PUT <session URI>, Content-Length: N, body = the bytes
      -> 200 with the file resource
```

So the worker swaps `presignPut()` for "mint a resumable session" and everything
downstream of it is unchanged. Core's job stays: get URL, PUT, fall back to a
download on failure.

### The one unknown to spike first

Google documents the initiating POST as authorized, and documents the session
URI as a week-long capability, but does **not** state whether the subsequent PUT
still needs the `Authorization` header. GCS documents its equivalent session URI
as acting as the credential; Drive's docs are silent.

Fifteen minutes with a real token settles it, and it changes one thing:

- **PUT works bare** — core never holds a Google credential. Property preserved,
  no change to `PresignResult`.
- **PUT needs the bearer** — the worker returns `{ url, headers: {...} }` and
  `BucketDelivery::deliver` adds them (it already sets `Content-Type`; this is
  an optional header map, ~15 lines). Core then briefly holds a 1-hour
  `drive.file`-scoped access token. Weaker than the S3 property, but still not
  the refresh token, and still not something core can point anywhere it likes.

Spike this before writing the worker module — it is the only thing in this plan
that can change the design.

## Decisions

| Question                    | Decision                                                                  |
| --------------------------- | ------------------------------------------------------------------------- |
| Scope                       | Output only. No Drive-as-source, no Picker.                               |
| OAuth scope                 | `drive.file` only                                                         |
| Who holds the refresh token | tokens worker (`../mochify-worker`), sealed with the existing `crypto.ts` |
| Connection record           | New `drive_connection` table, **not** better-auth's `account` row         |
| Destination folder          | A "Mochify" folder the app creates. No folder picking.                    |
| Plan gating                 | Subscriptions only: `seller`, `pro`, `growth`. **Not** Day Pass.          |
| Connections per user        | One                                                                       |

### Why `drive.file` and not `drive`

`drive.file` is classified **non-sensitive**: basic OAuth verification, no
third-party security assessment (CASA). Full `drive` is _restricted_ and pulls in
an annual paid audit. For write-only output there is nothing `drive` buys us.

The constraint that comes with it: `drive.file` grants access only to files the
app created, or that the user hands it through the Google Picker. That is why
the destination is a folder we create rather than one the user names. Picking an
existing folder later means the Picker API, which means loading Google's JS in
the browser — a phase-2 cost, not a phase-1 one.

### Why not reuse better-auth's Google account row

Tempting: `socialProviders.google` is already configured in `src/lib/auth.ts`,
better-auth 1.6.25 has `linkSocial` with extra scopes, `getAccessToken` with
refresh, and `account.encryptOAuthTokens`. It would be a lot less code.

Two things kill it:

1. **The worker cannot read it.** `encryptOAuthTokens` seals with
   `BETTER_AUTH_SECRET` in better-auth's own format. The tokens worker (which is
   what core calls) would need that secret and a reimplementation of
   `symmetricDecrypt` to get at the refresh token.
2. **Sign-in and authorization would share one row.** A later plain Google
   sign-in can rewrite the scope and tokens on that account, silently breaking
   Drive output with no user-visible cause.

A separate `drive_connection` row owned by the worker keeps the bucket's
property — core and the Pages app never hold long-lived user credentials — and
keeps "signed in with Google" and "authorized Drive writes" as the genuinely
different things they are.

Reuse the existing Google Cloud **project and OAuth client**, though. Only a new
redirect URI and the added scope are needed there.

## D1 table

`../mochify-worker/migrations/0004_drive_connection.sql`, same DB, same house
style as `0003`.

```sql
CREATE TABLE IF NOT EXISTS drive_connection (
    id                TEXT PRIMARY KEY,
    user_id           TEXT NOT NULL,
    google_email      TEXT,                      -- shown in the card, not used for auth
    google_sub        TEXT,                      -- stable account id
    folder_id         TEXT NOT NULL,             -- the Mochify folder we created
    folder_name       TEXT NOT NULL DEFAULT 'Mochify',

    refresh_ciphertext TEXT NOT NULL,            -- AES-256-GCM, user_id as AAD
    refresh_iv         TEXT NOT NULL,
    enc_key_version    INTEGER NOT NULL DEFAULT 1,

    status            TEXT NOT NULL DEFAULT 'unverified',
    status_detail     TEXT,
    last_verified_at  TEXT,
    created_at        INTEGER NOT NULL,
    updated_at        INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_drive_connection_user
    ON drive_connection(user_id);
```

Access tokens are not stored. They are cheap to mint and live an hour; caching
one in the isolate for its lifetime is fine, persisting it is not.

## OAuth flow

The Pages app knows who is signed in; the worker holds the secrets. Split it the
way the bucket splits the secret access key:

1. `GET /api/drive/connect` (Pages, session-authenticated) redirects to Google
   with `scope=drive.file`, `access_type=offline`, `prompt=consent`, and a
   signed `state` carrying the user id.
2. Google redirects to `GET /api/drive/callback` (Pages). It verifies `state`,
   then forwards `{ code }` to the worker over the `TOKENS` binding.
3. The worker exchanges the code, seals the refresh token, creates the "Mochify"
   folder, records the row, and runs the verify probe.
4. Pages redirects back to `/dashboard`.

`prompt=consent` is not optional: without it Google will decline to reissue a
refresh token for an account that has already granted the scope, and the
connection silently has nothing to refresh with.

### Worker endpoints

Mirrors the bucket set, behind the same `X-Worker-Token`.

| Method + path                      | Returns                                              |
| ---------------------------------- | ---------------------------------------------------- |
| `GET /user/:userId/drive`          | metadata only (email, folder name, status)           |
| `POST /user/:userId/drive`         | `{ code }` — exchange, seal, create folder, verify   |
| `POST /user/:userId/drive/verify`  | re-probe, update `status`                            |
| `POST /user/:userId/drive/session` | the presign equivalent: mint a resumable session URI |
| `DELETE /user/:userId/drive`       | revoke at Google, then delete the row                |

`/drive/session` reuses `handlePresignUserBucket`'s gates verbatim, including the
deny-by-default plan check: **a missing `plan` must fail closed.** That bug was
already found and fixed once on the bucket path; do not reintroduce it here.

## Plan gating

Four places look like gates. Two are:

| Layer                    | Where                                 | Load-bearing                                         |
| ------------------------ | ------------------------------------- | ---------------------------------------------------- |
| Card state               | `+page.svelte` `canUseStorage`        | No — cosmetic                                        |
| Connect / verify actions | `+page.server.ts` `assertStoragePlan` | **Yes** — stops a connection being created           |
| Compose-bar pill         | `connected && status === 'ok'`        | No — infers entitlement from the connection existing |
| `/drive/session`         | worker `BUCKET_PLANS`                 | **Yes** — the only thing that catches a downgrade    |

The pill's inference ("a verified connection can only exist for an account that
was entitled to make one") stops being true the moment someone downgrades, which
is the entire reason the worker gate exists. Deny-by-default there is not a
detail: an absent `plan` field once skipped the check and handed a free user a
working write.

**Day Pass is excluded** (2026-09-14). The sets were narrowed to
`['seller', 'pro', 'growth']` in both repos at the same time, and the frontend
constant was renamed `PAID_PLANS` → `STORAGE_PLANS` because `day` _is_ paid — it
just is not entitled to this.

The reason is not only that a 24-hour unlock should not leave a destination
writable for months. It is that **a Day Pass is not reliably attached to an
account at all**, and a storage connection inherently is:

- The pass is bought signed-out by design. `api/checkout/+server.ts:206` supports
  an anonymous caller explicitly, where the subscription path redirects to
  `/auth/register`.
- The account is created only when the buyer clicks the magic link. better-auth's
  `signInMagicLink` writes a verification token, not a `user` row — creation
  happens in the verify handler.

So the published guide's "a $2, 24-hour, no-account unlock" is accurate and
should not be reworded.

There is a third reason, found while checking the second: **nothing expires
`plan='day'`.** No cron downgrades it, and `quota_period_end` only shortens the
token bucket's TTL rather than gating the plan, so once it lapses the bucket
reseeds at the stored 100 ops on the 30-day default. Under the old gate that
made a $2 one-time purchase a permanent bucket-write entitlement. Tracked
separately as a billing bug; the gate should stay narrow regardless of how it is
fixed, because a destination outliving its plan is exactly the failure mode.

Disconnect stays ungated, server-side and in the UI. Someone who downgrades must
always be able to remove their own credentials.

### Drive needs one gate the bucket does not

An access key stops working when the row is deleted. An OAuth grant does not —
it persists at Google until revoked. So a downgrade should **revoke and delete**
the Drive connection rather than just refusing new writes: add it to the
subscription-cancelled path in `src/routes/api/webhooks/polar/+server.ts`
alongside the plan change. Without that, a cancelled subscriber leaves a live
`drive.file` grant to Mochify sitting in their Google account indefinitely.

### Verify probe

Cheaper than the bucket's three probes. Refresh the access token, `GET` the
folder by id (catches a user who trashed or deleted it), upload and delete a
zero-byte `.mochify-write-check`. Failures become plain sentences, including the
one that will actually happen in the wild: `storageQuotaExceeded` → "Your Google
Drive is full."

## Behaviour differences from S3 worth deciding now

- **Drive does not overwrite by name.** Two uploads of `photo.avif` into one
  folder produce two files, where S3 replaces the object. Matching S3 means a
  `files.list` lookup and a PATCH per write. Recommend allowing duplicates in
  v1, and saying so in the card copy, rather than paying a round-trip per image
  for a semantic Drive users do not expect anyway.
- **Writes consume the user's storage quota**, not ours. Core's existing
  fall-back-to-download already makes a full Drive non-destructive; the worker
  just has to phrase it well.
- **Consent can be revoked outside our UI.** Any refresh that comes back
  `invalid_grant` should flip `status` to `error` with "Reconnect Google Drive",
  which the compose bar already reads (`status === 'ok'` gates the pill).

## Work, by repo

### `../mochify-worker`

- `migrations/0004_drive_connection.sql`
- `src/drive.ts` (new): token exchange, refresh, folder create, resumable
  session mint, verify probes, error humanising
- `src/index.ts`: five routes above; add `DELETE FROM drive_connection` to the
  immediate credential wipe at the account-deletion path (alongside the existing
  `bucket_connection` delete, `index.ts:281`) and to the daily purge cron
- Secrets: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (the existing client), and
  reuse `BUCKET_ENC_KEY` or add `DRIVE_ENC_KEY`

### `../mochify-core`

Nine call sites, all mechanical:

- `ImageController.cc:75` — accept `dest=drive` as well as `dest=bucket`
- `UploadController.cc` — five `session.dest == "bucket"` comparisons
- `utils/WorkerClient.h` — carry `dest` so it calls `/drive/session` or
  `/bucket/presign`
- `helpers/BucketDelivery.h` — only if the spike says the PUT needs headers

### `mochify-frontend` (this repo)

- `src/routes/api/drive/+server.ts` — summary for the compose bar, mirroring
  `api/bucket/+server.ts`
- `src/routes/api/drive/connect/+server.ts` and `callback/+server.ts`
- `src/lib/user.ts` — `getDriveConnection()` beside `getBucketConnection()`,
  same dedupe-and-5-minute-cache shape
- `src/routes/dashboard/+page.svelte:600` — replace the "Coming soon" card with
  a real one, reusing the bucket card's four states
- `src/routes/dashboard/+page.server.ts` — `connectDrive` / `verifyDrive` /
  `disconnectDrive` actions, each re-checking plan server-side
- `src/lib/components/PromptFormApp.svelte` — the pill becomes a destination
  rather than a boolean (below)

## The compose-bar pill

`saveToBucket` is a boolean today. With two destinations it wants to be
`destination: 'download' | 'bucket' | 'drive'`, with `BUCKET_PREF_KEY`
(`mochify:saveToBucket`) migrated to a value rather than a flag — read the old
key once and treat `'1'` as `'bucket'` so nobody's remembered preference is lost.

Most users will only ever connect one, so the pill should stay a plain toggle
whose label names whatever is connected (`BUCKET` / `DRIVE`). Only when both are
connected does it need a chooser, and a click-to-cycle label is proportionate
there; a second control in that row is not.

`bucketStored` and the status line generalise: "Saved 12 images to Mochify in
Google Drive".

## Lead time: start the console work first

Everything above is a week or so of building. The thing that can block a launch
by longer than that is Google, so open it first:

- Add `drive.file` to the OAuth consent screen's registered scopes and check
  what that does to the app's current verification state. Sign-in already works
  in production, so the consent screen is published; adding a scope can trigger
  a re-review even for a non-sensitive one.
- Confirm the app is **not** in Testing publishing status. Testing-mode refresh
  tokens expire after seven days, which would present as "Drive worked all week
  and broke on Monday" and is miserable to debug after the fact.

## Not in scope

- Reading from Drive, folder picking, the Picker API
- Shared drives, multiple Google accounts, more than one folder
- Video output (same reasoning as the bucket: MediaBunny runs in the browser and
  core never holds those bytes)
- Any change to CSP. All Drive traffic is server-side and the OAuth hop is a
  top-level navigation. Note that this repo currently sets no CSP at all —
  `CLAUDE.md` still describes one in `svelte.config.js`, which is stale.

## Follow-ups

- Privacy page: the bucket line about third-party credentials needs to cover
  Google tokens and immediate deletion on disconnect and account deletion.
- `/guides/bring-your-own-bucket-s3-r2` and the pricing feature list both say
  "bucket" where they will mean "your own storage".
- PostHog: `drive_connect_started`, `drive_connect_saved`,
  `drive_verify_failed` (`{ reason }`), `drive_disconnected`.
