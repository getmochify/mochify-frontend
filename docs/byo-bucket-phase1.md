# Bring your own bucket — phase 1 scope

Status: proposed. Replaces the disabled "Coming soon" card in
`src/routes/dashboard/+page.svelte` (Connections section).

**Phase 1 delivers connection management only**: a paid user can add, verify,
and remove one S3-compatible bucket connection. No object processing yet — that
is phase 2. The point of shipping this alone is that it de-risks the hard part
(credential custody) behind a small, self-contained surface.

## Decisions

| Question | Decision |
|---|---|
| Phase 1 scope | Connections only (add / test / disconnect) |
| Who signs SigV4 | `mochify-tokens` worker (`../mochify-worker`) |
| Plan gating | All paid plans (`seller`, `day`, `pro`, `growth`) |
| Connections per user | One (phase 1) |

### Why the tokens worker owns the credentials

It already binds the same D1 (`mochify-auth`), already sits behind
`X-Worker-Token`, and is already reachable from the dashboard over the `TOKENS`
service binding. It is TypeScript, so SigV4 is `aws4fetch` rather than a new C++
dependency. `mochify-core` never sees a user's storage keys — in phase 2 it keeps
receiving raw bytes exactly as it does today, and the worker does the fetch/put.

The plaintext secret transits the Pages worker in memory on the way in (the form
POST lands there first) and is forwarded straight to the tokens worker over the
service binding. It is never written to D1 from this repo, never logged, and
never read back out to the browser.

## D1 table

New migration: `../mochify-worker/migrations/0003_bucket_connection.sql`.
Same DB as `user` / `session` / `profile`. Follows the existing house style
(comment header explaining every column, additive and non-destructive).

```sql
-- 0003_bucket_connection.sql
-- Per-user "bring your own bucket" connection (S3, R2, or any S3-compatible
-- endpoint). Credentials are held encrypted; only mochify-tokens can decrypt.

CREATE TABLE IF NOT EXISTS bucket_connection (
    id                TEXT PRIMARY KEY,          -- uuid
    user_id           TEXT NOT NULL,             -- user.id (no FK; D1 has FKs off by default)
    label             TEXT NOT NULL,             -- user-facing name, e.g. "Product photos"

    provider          TEXT NOT NULL,             -- 's3' | 'r2' | 'compatible'
    endpoint          TEXT,                      -- NULL for AWS; required for r2/compatible
    region            TEXT NOT NULL DEFAULT 'auto',
    bucket            TEXT NOT NULL,
    prefix            TEXT NOT NULL DEFAULT '',  -- optional key prefix, '' = whole bucket
    force_path_style  INTEGER NOT NULL DEFAULT 0,-- 0/1; MinIO and friends need 1

    access_key_id     TEXT NOT NULL,             -- identifier, stored plain, masked in UI
    secret_ciphertext TEXT NOT NULL,             -- base64 AES-256-GCM ciphertext+tag
    secret_iv         TEXT NOT NULL,             -- base64 96-bit IV, unique per write
    enc_key_version   INTEGER NOT NULL DEFAULT 1,-- lets us rotate BUCKET_ENC_KEY later

    status            TEXT NOT NULL DEFAULT 'unverified', -- 'unverified' | 'ok' | 'error'
    status_detail     TEXT,                      -- short human-readable failure reason
    last_verified_at  TEXT,                      -- ISO-8601, NULL until first successful test

    created_at        INTEGER NOT NULL,          -- epoch ms
    updated_at        INTEGER NOT NULL
);

-- One connection per user in phase 1. Multi-bucket support = DROP this index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bucket_connection_user
    ON bucket_connection(user_id);
```

### Encryption

New tokens-worker secret `BUCKET_ENC_KEY` (32 random bytes, base64) via
`wrangler secret put`. AES-256-GCM through WebCrypto, fresh IV per write,
`user_id` as additional authenticated data so a row cannot be replayed against a
different account. `enc_key_version` exists so rotation is a background re-wrap
rather than a forced reconnect.

### Deletion

Two paths need wiring, both easy to miss:

1. `deleteAccount` in `src/routes/dashboard/+page.server.ts` currently soft-deletes
   the `user` row and leaves a 14-day grace window. Storage credentials must be
   **hard-deleted immediately** at that point, not after 14 days — a deactivated
   account should not retain live keys to someone's bucket.
2. The daily purge cron in `mochify-tokens` should also drop orphaned
   `bucket_connection` rows alongside the `user` rows it already purges.

## Tokens worker endpoints

All behind the existing `X-Worker-Token` check, called from the dashboard over
the `TOKENS` service binding with a public-fetch fallback (same pattern as
`callWorker` in `src/routes/dashboard/+page.server.ts`).

| Method + path | Body | Returns |
|---|---|---|
| `GET /user/:userId/bucket` | — | metadata only, never the secret |
| `PUT /user/:userId/bucket` | connection fields + `secretAccessKey` | upserts, verifies, returns status |
| `POST /user/:userId/bucket/verify` | — | re-runs the checks, updates `status` |
| `DELETE /user/:userId/bucket` | — | `{ ok: true }` |

`GET` response shape:

```json
{
  "connected": true,
  "label": "Product photos",
  "provider": "s3",
  "bucket": "my-store-images",
  "region": "eu-west-2",
  "prefix": "raw/",
  "accessKeyIdMasked": "AKIA••••••••7Q4F",
  "status": "ok",
  "statusDetail": null,
  "lastVerifiedAt": "2026-08-05T10:14:02.000Z"
}
```

### Verification ("Test connection")

Three probes, in order, stopping at the first failure and recording a plain
message in `status_detail`:

1. **HeadBucket** — credentials valid, bucket exists, region correct. On AWS's
   `301 PermanentRedirect`, read `x-amz-bucket-region` off the response and
   auto-correct `region` instead of erroring.
2. **ListObjectsV2** (`max-keys=1`, with `prefix`) — read permission.
3. **PUT then DELETE** `<prefix>.mochify-write-check` — write and delete
   permission. Phase 2 cannot write results back without this.

Failure messages must be actionable ("Access denied — the key needs
`s3:PutObject` on this prefix"), not raw XML.

**Endpoint validation happens here and is load-bearing.** Before any probe runs,
reject an `endpoint` that is not `https`, resolves to a private, loopback,
link-local (`169.254.0.0/16`), or otherwise internal address, or carries
credentials in the URL. Store the normalised host, and re-validate on every
update rather than trusting the stored value blindly.

This is cheap in phase 1 and expensive to retrofit: in phase 2 the endpoint
becomes the target of server-side outbound requests, at which point a
user-controlled endpoint is an SSRF primitive pointed at whatever the requesting
service can reach.

## Dashboard UI

One card in the existing Connections section, replacing the disabled
"Bring your own bucket" row at `src/routes/dashboard/+page.svelte:465`. Same
`rounded-2xl border border-cocoa-milk/8 bg-white/40 p-4` shell and the existing
bucket SVG — only the right-hand control and the expanded body are new.

**Four states:**

- **Locked** (free plan) — keep the current disabled look, swap the "Coming soon"
  pill for the button becoming `Upgrade` → `/pricing`. `isPaid` in the page
  script currently derives from `pro || seller || day`; add `growth`.
- **Empty** (paid, no connection) — `Connect` button expands an inline form below
  the row. No modal; the page already does inline disclosure for the delete flow.
- **Connected** — bucket name and masked key in place of the description, a
  status dot (matcha `#66BB6A` for `ok`, red for `error`, amber for
  `unverified`), `last_verified_at` as relative time, and `Test` +
  `Disconnect` buttons.
- **Saving / testing** — buttons disabled, same pattern as `aiSaving`.

**Form fields:**

| Field | Notes |
|---|---|
| Provider | Select: Amazon S3 / Cloudflare R2 / S3-compatible |
| Bucket | Required |
| Region | Required for S3; defaults `auto` for R2 |
| Endpoint | Hidden for S3, required for R2 and compatible |
| Prefix | Optional, trailing `/` normalised on save |
| Access key ID | Required |
| Secret access key | `type="password"`, required on create; on edit, blank means "keep existing" |
| Path-style addressing | Checkbox, shown for `compatible` only |
| Label | Optional, defaults to the bucket name |

All mutations are SvelteKit form actions with `use:enhance`, matching
`setAiOptin` / `generateKey`. New actions in
`src/routes/dashboard/+page.server.ts`: `saveBucket`, `verifyBucket`,
`disconnectBucket`; each re-checks `locals.user` and the plan before calling the
worker. Server-side plan check is not optional — the client gate is cosmetic.

Disconnect gets a typed confirmation? No — a single "Are you sure?" inline
swap is proportionate here; nothing is destroyed but a credential the user can
re-add.

PostHog events, matching the existing naming: `bucket_connect_started`,
`bucket_connect_saved` (`{ provider }`), `bucket_verify_failed`
(`{ provider, reason }`), `bucket_disconnected`.

## Not in scope

- Any object processing, job queue, or progress UI (phase 2)
- S3 event notifications / auto-watch (phase 3)
- More than one connection per user
- IAM role assumption / STS — long-lived access keys only for now
- Google Drive (the sibling card stays "Coming soon")

## Follow-ups to flag

- **CSP**: no change needed. All S3 traffic is server-side from the tokens
  worker; the browser never talks to the bucket, so `connect-src` stays as is.
- **Privacy page** should gain a line stating that third-party storage
  credentials are stored encrypted and deleted immediately on account deletion.
  Worth a look from the content side before launch.
- **Docs** (`/docs`) needs a short "connect your bucket" section including the
  minimum IAM policy (`s3:ListBucket`, `s3:GetObject`, `s3:PutObject`,
  `s3:DeleteObject`, scoped to the prefix).

## Phase 2 sketch — the `/app` toggle

Not phase 1 work, recorded here so phase 1 doesn't paint it into a corner.

### It is a destination toggle, not a source toggle

"Use my bucket" reads as one switch but covers three different features:

1. **Output only** — attach local files as normal, results are written to the
   bucket instead of downloading. Genuinely boolean, drops straight into the
   existing control row, small.
2. **Input** — pick objects out of the bucket to process. That is an object
   browser (list, paginate, filter by type, multi-select), not a toggle.
3. **In place** — read and write the bucket, no local files at all. Needs the
   browser plus a job runner, since a 400-object prefix outlasts any request.

Only (1) is a toggle. Recommend shipping it as exactly that and being explicit in
the label — `SAVE TO BUCKET`, not `USE MY BUCKET` — so it never implies (2) or (3)
before those exist. Input-from-bucket then arrives later as a separate control
next to the attach button, and it will read as an addition rather than the toggle
suddenly changing meaning.

### Where it goes

`src/lib/components/PromptFormApp.svelte:2378`, the control row inside the glass
card: attach icon, divider, ZIP pill, divider, status text, tooltip, send. The
bucket pill sits as a second pill after ZIP, reusing the ZIP toggle's markup
(`sr-only` checkbox + track + dot) with the mochi pink track rather than matcha
so the two are distinguishable at a glance.

Interactions to settle:

- **ZIP + bucket are mutually exclusive in practice.** With bucket output on,
  ZIP either means nothing or means "write one archive object". Simplest honest
  behaviour: bucket on hides the ZIP pill, and the auto-ZIP at
  `AUTO_ZIP_THRESHOLD` is skipped, since the browser-blocks-many-downloads
  problem it exists to solve does not apply when nothing downloads.
- **Visibility.** Render the pill only when a connection exists and
  `status === 'ok'`. No teaser for free users here — the dashboard card is where
  the upsell belongs; a dead control in the compose bar is just noise.
- **Default.** Off, with the last choice remembered in `localStorage`. Writing
  to someone's bucket should never be the surprising default on first use.
- **Status line.** The existing status span should reflect the destination
  ("Saved 12 images to my-store-images/processed/") rather than staying silent,
  and failures need a download fallback: the result blob is already in the
  browser, so a bucket PUT failure must offer the normal download rather than
  losing the work.

### How the client learns there is a connection

New `src/routes/api/bucket/+server.ts` on the Pages worker, session
authenticated, proxying the worker's `GET /user/:userId/bucket` and returning
just `{ connected, bucket, prefix, status }`. Client side, a
`getBucketConnection()` in `src/lib/user.ts` alongside `getPlan()` — same
in-flight dedupe plus 5-minute cache, since `PromptFormApp` will ask on every
mount and the answer changes about once a quarter.

### Where the result bytes go: core PUTs to a presigned URL

Three candidate paths for getting a processed image into the bucket:

| Path | Bytes moved | Verdict |
|---|---|---|
| Browser → S3 directly, presigned | shortest | **Blocked by CSP** |
| Core → browser → worker → S3 | result crosses the wire 3× | Works, wasteful |
| Core → S3, presigned | result crosses once | **Recommended** |

Direct-from-browser is out: `connect-src` in `svelte.config.js` is pinned to
`self`, `PUBLIC_API_URL`, and `analytics.mochify.xyz`, and arbitrary
S3-compatible endpoints cannot be enumerated in a static policy. Wildcarding it
enough to cover any customer endpoint is a bad trade.

That leaves core doing the write, which is the right answer and cheaper to build
than it first looks.

**Core gets a presigned URL, never the credentials.** This preserves the phase-1
property that user storage keys stay inside the worker, and it removes the
objection that killed "core does S3" in the original gating decision: a presigned
PUT is an ordinary HTTP request with the signature in the query string, so there
is no SigV4 implementation and no `aws-sdk-cpp` in the image. `CMakeLists.txt`
and the Dockerfile pick up **zero new dependencies**.

Core already has every piece:

- `Mochify::Utils::Worker` (`../mochify-core/utils/WorkerClient.h`) — an
  authenticated `X-Worker-Token` channel to the tokens worker with a reusable
  `HttpClient`, already called on every squish for `/decrement`. The presign
  request is one more call on a path that already exists, and core already holds
  the `identifier` / `userId` it needs to make it.
- `splitUrl()` (`GenerateController.cc:88`) — splits a URL into origin and
  path+query for Drogon's `HttpClient`.
- The signed-URL fetch at `GenerateController.cc:378`, including
  `setPathEncode(false)` with the comment *"keep the signed query string
  verbatim"* — precisely the handling a presigned PUT needs, already written and
  in production.

The core-side change is roughly: one worker call, then `Get` → `Put` with a body
and `Content-Type`.

**The client sends a flag, never a URL.** This is the part to get right. The
browser passes something like `&dest=bucket&name=photo.jpg`; core asks the worker
for a presigned PUT for *that user*, and the worker derives the key from the
stored `prefix` plus a sanitised filename. If core ever accepted a destination URL
from the client it would be an open relay — anyone could point `/v1/squish` at any
host and have core PUT to it. The destination must be resolved server-side from
the stored connection, which is also what makes the phase-1 endpoint validation
above the thing standing between this design and an SSRF.

**On failure, core still returns the blob.** If the PUT fails, returning an error
alone would cost the user both the work and a token. Core should fall back to
responding with the image bytes plus a header flagging that the bucket write
failed, and the client then offers the normal download. That keeps the
happy-path bandwidth win without a failure mode that loses work.

### Mode coverage

The presign design follows the bytes, so it covers exactly the modes core
produces the output for:

| Mode | Result produced by | Bucket write |
|---|---|---|
| Image | core `/v1/squish` | Presigned PUT from core |
| PDF | core `/v1/pdf` (`PromptFormApp.svelte:1168`) | Presigned PUT from core |
| Images → PDF | core `/v1/pdf` multipart (`:1055`) | Presigned PUT when `combine` is true (one output) |
| Create / generate | core `/v1/generate` | Fan-out — ZIP of format and size variants, keys unknown up front |
| Video / audio | **the browser**, MediaBunny (`:1317`) | No path — core never holds the bytes |

PDF is the easy win: same mechanism, different controller, and the output is a
single known key whenever `combine` is true. Worth including from the start.

**Video is out, and should stay out.** The conversion is a dynamic
`import('mediabunny')` that runs entirely client-side, so there is no server-side
copy to presign. The three ways to close that gap all cost more than the feature
is worth here:

- Proxy the converted file through the worker. `MAX_VIDEO_BYTES` is 2 GB. Pushing
  gigabytes through a Worker for a niche case is the worst version of the byte
  path we just designed away.
- Presigned PUT direct from the browser. Genuinely the *right* answer for a 2 GB
  file, and the one case where the bandwidth argument is overwhelming, but it
  needs `connect-src` to name a user-controlled origin. That means moving CSP
  construction into `src/hooks.server.js` and merging with SvelteKit's generated
  policy — a real change to the security posture for one mode.
- Convert video server-side. Not a thing core does, and not worth becoming one.

So: the pill hides when `uploadMode === 'video'`, the same way the ZIP pill
already hides for `pdf` and `video` at `PromptFormApp.svelte:2378`. Bucket output
shows for `image` and `pdf`. If video-to-bucket is ever actually asked for, the
dynamic-CSP presign is the option to revisit, not the worker proxy.

Fan-out for the create flow stays unresolved: presign a batch once the output set
is known, or leave it on the download path and extend later.

The cost of this design, stated plainly: it touches all three services rather
than two, and it changes the `/v1/squish` response contract (metadata instead of
bytes when `dest=bucket` succeeds). That contract change is the argument for
deciding now rather than shipping the worker proxy first and migrating —
`PromptFormApp` would otherwise be rewritten twice.

### Open questions for phase 2

- Key naming on write: mirror the source name into the configured prefix, or
  suffix with the format (`photo.jpg` → `processed/photo.avif`)? Overwrite or
  refuse when the key exists? Refusing is safer, overwriting is what people
  expect from a "process my bucket" tool.
- Does the toggle apply to the create/generate flow (`generatedImages`) and to
  the PDF and video modes, or images only to start with?
- `PromptForm.svelte` on the homepage stays untouched. The fork exists precisely
  so `/app` can diverge, and a storage integration is exactly the kind of
  installed-app feature that justifies it.

## Rough shape of the work

| Piece | Where |
|---|---|
| Migration | `../mochify-worker/migrations/0003_bucket_connection.sql` |
| Encrypt/decrypt helper | `../mochify-worker/src/crypto.ts` (new) |
| SigV4 + probes | `../mochify-worker/src/bucket.ts` (new), `aws4fetch` dependency |
| Route wiring | `../mochify-worker/src/index.ts` |
| Load + actions | `src/routes/dashboard/+page.server.ts` |
| Card + form | `src/routes/dashboard/+page.svelte` |
| Immediate credential wipe on delete | `src/routes/dashboard/+page.server.ts` (`deleteAccount`) |
| Purge orphans | `mochify-tokens` daily cron |

The only genuinely fiddly parts are the encryption helper and the
region-redirect handling in HeadBucket; the rest is CRUD against patterns this
dashboard already uses.
