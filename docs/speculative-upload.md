# Speculative upload — overlap the NLP round trip with the upload

**Status:** Proposed (2026-08-29). No runtime changes yet — this is the design of
record to turn into tickets.
**Spans:** `mochify-frontend`, `mochify-core`, `mochify-worker`.
**Not affected:** `mochify-chrome`, `mochify-cli` (see "Compatibility").
**Prerequisite:** `mochify-core/docs/upload-session-guardrails.md` — the session
store hardening this depends on, specced to ship independently and first.

## The problem

In `PromptForm.submit()` / `PromptFormApp.submit()` the magic flow is strictly
serial:

```
Enter → getSessionToken → GET /v1/usage → POST /v1/prompt (Mistral) → upload bytes
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^
                                          nothing is on the wire during this
```

The user's bytes sit idle for the whole NLP round trip. The upload cannot start
because the output params (`type`, `types`, `sizes`, `width`, `height`,
`quality`, flags) are what the NLP call returns.

### Measured at 1.5-2s, and it grows with batch size

Observed prompt latency is **1.5-2s** (2026-08-29). On any reasonable connection
a 5MB chunked upload fits inside that window, so the upload can plausibly be
*finished* before the parse returns rather than merely started. That is the
difference between shaving a second and the flow feeling instant.

`handleNlpParse` in `mochify-worker/src/index.ts` does, serially, before Mistral:

- D1 `SELECT ... FROM session WHERE token = ?`
- `USAGE_KV.get(userId)` for the plan
- `USAGE_KV.get(nlpKvKey)` for the monthly NLP counter

then a non-streaming completion through CF AI Gateway with
`maxTokens = min(4096, max(1024, files.length * 400))` (`src/index.ts:1483`).

Output tokens dominate completion latency, and the per-file JSON the model emits
scales with file count. So a 20-file batch is not 1s, it is several — and a
20-file batch is also the case with the most bytes to push. **The payoff from
overlapping grows superlinearly with batch size**, which is the strongest
argument for doing this at all.

Note what is *not* worth reclaiming: `getDimensions` looks like a blocking decode
in the critical path, but `getImagePreview` caches per-`File` in a WeakMap and the
thumbnail `$effect` warms it at attach time. That await is already ~free.

## Why this needs a core change

`/v1/upload/init` takes the full processing spec and stores it on the
`UploadSession`; `/v1/upload/complete` carries only `?session=`.
`initUpload` even runs `parseVariantSpec` up front so a bad spec fails before
75MB of chunks go over the wire (`UploadController.cc:206-225`).

Speculative upload inverts that ordering: at Enter you have the bytes and none of
the params. So there is no zero-backend-change version of this feature.

### Deferred-params session

Minimal viable shape:

- `POST /v1/upload/init` accepts `{ totalBytes, deferred: true, ticket }` with no
  output spec. Skips the `parseVariantSpec` gate, marks the session **unclaimed**.
- Chunks stream as normal while Mistral thinks.
- `POST /v1/upload/complete` accepts an optional JSON body carrying the params.
  They populate the session, then `parseVariantSpec` → `Worker::decrement` →
  `WorkerPool::trySubmit` run byte-for-byte as they do today.

Everything downstream of `complete` is untouched. That is what makes this
tractable rather than a rewrite.

**Keep the charge at `complete`.** Today `Worker::decrement` runs there, after
validation. That means an abandoned or NLP-rejected prompt costs the user
nothing and needs no refund path. Do not "solve" abuse by charging at init — it
breaks that property and bills the innocent case.

## Abuse analysis

### The processing queue is not the risk

`WorkerPool` (25 tasks, 2GB `kMaxQueuedBytes`) is only entered at `/complete`,
*after* `Worker::decrement` succeeds. Queue entry costs a token. A caller who
never supplies a prompt cannot put anything in it. That surface is fine as-is.

### The session store RAM is the risk, and the hole is already open

`UploadSessionStore::createSession` does `buffer.reserve(totalBytes)` — real
memory committed at init, debited immediately against the server-wide budget.
Init costs **zero tokens**; it only does a `Worker::peek()` that rejects an
already-exhausted bucket.

Current constants (`utils/UploadSessionStore.h:272-275`):

| Constant | Value |
|---|---|
| `kMaxTotalBufferedBytes` | 1.5 GB server-wide |
| `kMaxSessionsPerIdentity` | 4 |
| `kMaxSessionBytes` | 75 MB |
| `kTtl` | 12 min, sliding |

So today, an anonymous caller with free ops remaining can open 4 × 75MB
sessions, send nothing, and hold 300MB for 12 minutes at no cost. **Five distinct
IPs exhaust the entire 1.5GB** and every legitimate user gets
`503 "Too many concurrent uploads"` at init.

That is true right now, before any of this work. Speculative upload does not
create the hole — it removes the headroom that currently masks it, because
legitimate traffic starts competing for the same 1.5GB. Which is the argument for
tightening as *part of* this, not for avoiding the feature.

Also note the store is write-only from the client's side: `/v1/upload/status`
returns offsets, never bytes. This is a memory-DoS surface, not free ephemeral
storage or an exfil path.

### The NLP quota is not a control here

`/v1/prompt` enforces a monthly NLP limit (3/month anonymous by hashed IP, plan
limits when authenticated). An upload-abuse actor never calls `/v1/prompt`, so
that quota constrains nothing about init. Any control has to live on the upload
path itself.

## Proposed guardrails

> **Phase 1 does not need the ticket (item 1).** It is defence in depth, not
> load-bearing: the controls that actually bound the damage are the TTL and the
> byte budgets in items 2, 3 and 5, and those are identity-independent. An
> attacker can already open sessions today via `/v1/upload/init`; `deferred`
> adds only "params optional", which is marginal. At current volume (<100
> uploads/day) a cross-repo change to harden against an attacker who is not
> attacking is the wrong order of work. Ship items 2-5, keep item 1 specced.
>
> Dropping it makes Phase 1 **core + frontend only, with no worker changes.**

### 1. Speculation ticket, minted at the edge — *deferred past Phase 1*

Rather than letting anyone open a deferred session, have the worker mint a
short-lived signed ticket that core requires for `deferred: true`:

- New worker endpoint (or an additive field on the existing `/v1/usage`
  response — see "Compatibility") that reuses the identity resolution
  `handleNlpParse` already does, then HMACs a token binding **identity, max
  bytes, max files, expiry (~2 min)**.
- Core verifies the HMAC on `deferred` inits only. Non-deferred init is
  unchanged, so the resumable path the frontend uses today keeps working.

The obvious objection is that a ticket round trip re-adds the latency we are
removing. It does not, because **the ticket is minted at file-attach time**, not
at Enter. Files are attached seconds before submit in every real flow, and that
call overlaps the thumbnail decode. By the time Enter fires, the ticket is in
hand and `init` goes out immediately.

This puts the anti-abuse decision at the edge — cheap, globally distributed,
already behind the zone's WAF — and keeps core's RAM behind a cryptographic gate.
It mirrors the existing `warmedAuth` pattern in `PromptForm.svelte:758`.

### 2. Short TTL for unclaimed sessions

12 minutes is sized for a resumable 75MB upload on a flaky uplink. A speculative
session is waiting on a ~1-4s NLP call. Give unclaimed sessions ~90s, then evict.

This is the third state of the session lifecycle the guardrails doc lays out:
**unstarted → receiving → unclaimed → claimed**. Its item 1 owns the *unstarted*
timer and ships without this feature; this adds the *unclaimed* one. Design the
state machine once, in that doc, rather than twice.

### 3. Separate sub-budget for unclaimed bytes (guardrails item 5)

Account unclaimed bytes against their own ceiling (~512MB of the 1.5GB) so
speculation can never starve the resumable-upload path it is borrowing from —
nor the `/v1/squish` traffic the extension and CLI depend on.

### 4. Abort endpoint (guardrails item 3)

`POST /v1/upload/abort?session=` (essentially `takeSession` + discard), fired on
NLP error, `blocked` verdict, user cancel, and via `navigator.sendBeacon` on
`pagehide`. Best-effort hygiene — the short TTL is the actual guarantee.

### 5. Per-identity byte budget, not a session count (guardrails item 2)

`kMaxSessionsPerIdentity = 4` is the sharpest practical blocker, not just an
abuse control. Magic flow accepts up to 25 files; one speculative session per
file means file 5 onward gets a 503 at init.

Replace the count cap with a byte budget (~150-200MB per identity). 25 × 2MB
files all fit; the 75MB-file abuser is still capped at two sessions. This also
makes `chunked-upload-followups.md` item 6 (CGNAT users sharing one salted-IP
budget) more load-bearing, so it should be revisited at the same time.

WAF rate-limiting rules on `/v1/upload/init` are available as cheap
belt-and-braces since `api.mochify.app` is proxied.

## Scope of what should speculate

**Small files are where the magic is, and they need less machinery, not more.**
The original plan gated Phase 1 to >5MB files and deferred small files to a
"batch session" (one init with a manifest of N files, per-file chunk slots). That
was solving the wrong problem, and it is dropped.

Large files use sessions for **resumability**. A 2MB file on a flaky link does
not need resuming, it needs re-sending, which costs nothing. So small files need
no chunking, no offsets, and no slot addressing:

### `POST /v1/upload/stage`

- Whole file as the raw body, **no params at all**. Returns a session id.
- One round trip: no `init`, no chunk loop. Fewer round trips than the chunked
  path, not more.
- `POST /v1/upload/complete?session=<id>` with the params JSON once the parse
  lands — the *same* deferred-complete the chunked path already needs.

`completeUpload`'s entire body is reused verbatim: validation, bomb check,
`decrement`, `WorkerPool::trySubmit`, and the existing single-blob-or-ZIP
response. The frontend's `squishFile` still returns one Blob per file, so
`CONCURRENCY_LIMIT`, client-side zipping and progress accounting are all
untouched. **Only the transport changes.**

`client_max_body_size` and `client_max_memory_body_size` are both 80M, so a
whole-file body comfortably covers anything under the chunked threshold.

Incidental win: the plan size ceilings (`kFreeSizeLimit` 20MB, `kLiteSizeLimit`
75MB) currently check a *declared* `totalBytes` at init, which a client can lie
about. Staging checks `Content-Length` and then the real body — simpler and less
spoofable. Reject on `Content-Length` before reading the body, so an oversize
upload still fails fast rather than after transfer.

Two paths remain, split on the same `CHUNK_THRESHOLD_BYTES` boundary the frontend
already branches on: **stage** for small, **deferred-chunked** for large.

### Where the magic actually lands

Speculation always reclaims the full 1.5-2s window, but how magical it feels
depends on the ratio of upload time to that window. For one to three small files
— the modal case — they are the same order, so the operation collapses to
near-instant. For a 25-file batch the upload dominates and 2s is a small
proportion of a long operation. Still worth having; just be clear that the
perceptual win is concentrated in small batches, which is exactly the target.

### Do not speculate when

- `uploadMode !== 'image'`. The imgpdf branch (`/\bpdfs?\b/i.test(prompt)`) uses
  a multipart create flow, video is processed client-side, and create mode has no
  files at all. All three are knowable at Enter, so this is a cheap pre-check.
- `navigator.connection.saveData` is set, or `effectiveType` is slow. Do not burn
  a metered connection on bytes a blocked prompt will discard.
- The cached `availableTokens` gate at the top of `submit()` already says no.

## Frontend consequences

- **Speculation failure must be silent.** A 503 or network failure on speculative
  init falls back to the current post-NLP path with no user-visible error.
  Otherwise we have traded ~1-4s of latency for a new error class.
- **Quota gates currently precede upload.** Keep the cached gate at the top of
  `submit()`; run `/v1/usage` concurrently with speculation and abort on
  shortfall. `init`'s own `peek()` stays as the backstop. Note the *second*
  stricter gate (`preflightRemaining < totalFiles`, `PromptForm.svelte:1596`)
  cannot run until the NLP parse reveals the variant count — so a speculative
  upload can be discarded by it. Acceptable: nothing was charged.
- **Progress model needs rework.** `displayPhase` treats thinking and uploading
  as sequential; under speculation they overlap and the bar will jump. This is
  real work, not a footnote.
- **Both forks.** `PromptForm.svelte` and `PromptFormApp.svelte` are separate
  files by design. Whatever lands should go in a shared module (alongside
  `uploadChunked.ts`) rather than being written twice.

## Compatibility

Verified against the other two clients:

| Client | `/v1/squish` | `/v1/upload/*` | `/v1/prompt` | `/v1/usage` |
|---|---|---|---|---|
| `mochify-chrome` | yes (`background.js:250`) | **no** | yes | yes |
| `mochify-cli` | yes (`api.rs:268`) | **no** | yes (`api.rs:206`, `:384`) | yes (`api.rs:159`) |

Consequences:

1. **Neither client touches chunked upload.** Adding an optional `deferred` field
   to `init` and an optional JSON body to `complete` is purely additive and
   invisible to both. Same for the abort endpoint.
2. **Tightening the session caps only affects chunked-upload callers**, which is
   the frontend alone. No extension or CLI impact.
3. **The sub-budget actively protects them.** Core RAM and `WorkerPool` are shared
   with `/v1/squish`; ring-fencing unclaimed bytes is what stops speculation from
   degrading extension and CLI throughput.
4. **`/v1/prompt` and `/v1/usage` response shapes must stay compatible.** Adding
   a ticket field is safe: the CLI uses no `serde(deny_unknown_fields)` anywhere,
   and the extension is JS. Removing or renaming a field is not safe.

### The CLI and extension have the same problem

Both call `/v1/prompt` and then upload, with the same dead window. The CLI feels
it worst — users batch whole directories, so `files.length * 400` max tokens is
pinned at 4096 while a lot of bytes wait. Neither can benefit from Phase 1 (they
have no chunked-upload client), but the ticket + deferred-session primitive is
deliberately transport-agnostic, so a later CLI implementation is a client change
only. Design for that; do not shape the endpoints around the browser.

## Complementary win: AI Gateway caching

The Mistral call goes through CF AI Gateway (`CF_AIG_URL`). A `cf-aig-cache-ttl`
header would make repeat identical requests near-instant. Cache key is the
request body, which includes `fileContext` (per-file format + dimensions), so hit
rate depends on prompt *and* file-shape repetition — plausible for common cases
("convert to webp" on same-sized screenshots), unproven in general.

Worth an experiment because it is a header, not an architecture. Not a substitute
for speculation: it does nothing for the first request of any shape, which is the
one users notice.

## Suggested order

Revised 2026-08-29: no worker work in Phase 1, and the guardrails' byte budget
moves up because it is a functional prerequisite, not a capacity one.

1. **Core (done):** guardrails items 1 and 4 — progress-based TTL and byte
   accounting. Deployed and verified.
2. **Core (implemented, not yet deployed):** guardrails item 2 — per-identity
   byte budget at 200MB plus the count cap raised 4 → 30. Hard prerequisite for
   speculating past the 4th file in a batch. Closes
   `chunked-upload-followups.md` item 6 in the same pass.
3. **Core:** `/v1/upload/stage` and deferred-params `complete`, plus the
   unclaimed TTL and sub-budget (guardrails item 5). No ticket — see the note
   above. Keep the handler transport-agnostic (accept `X-Api-Key`, no
   cookie/Origin dependence) so the CLI and extension can adopt it later as a
   client-only change.
4. **Frontend:** stage every file at Enter for the small path, deferred-chunked
   for >5MB, silent fallback, merged progress UI, shared module across both
   PromptForm forks.
5. **Core + frontend:** abort endpoint (guardrails item 3) and its cancel /
   `pagehide` beacon.
6. **Later, if volume justifies it:** worker ticket minting (item 1).

The batch session that used to sit at this step is **dropped** — staging makes it
unnecessary (see "Scope of what should speculate").

## Open questions

- *(Deferred with the ticket itself.)* Does it ride on `/v1/usage` (endpoint both
  other clients already know, fewer moving parts) or a dedicated endpoint?
  Leaning `/v1/usage`. And which secret signs it — reuse `INTERNAL_TOKEN`, or
  provision a dedicated one? Dedicated is better hygiene.
- Sticky routing. Deferred sessions inherit the same single-instance constraint
  documented in `UploadSessionStore.h` and `chunked-upload-followups.md` item 7.
  Speculation raises session volume, which raises the cost of getting horizontal
  scaling wrong later. Not a blocker, but it moves item 7 up the list.
