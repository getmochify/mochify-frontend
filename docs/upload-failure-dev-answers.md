# Dev answers — "Why did my upload fail?" (research brief sections 3 and 4)

**Answers to:** `why-did-my-upload-fail.md` (raised 2026-09-14) · **Answered:** 2026-09-15
**Repos read:** `mochify-core` @ `3d93360`, `mochify-frontend` @ `6400aac` (= `origin/main`), `mochify-worker`
**Method:** source of record is the code on `main` in all three repos, plus one live probe against `api.mochify.app`.

Confidence markers used throughout:

- **[code]** read directly off `main`, file and line cited.
- **[live]** verified against production today.
- **[posthog]** the code is confirmed but the _share_ or _rate_ needs a query the brief's author can run.
- **[decision]** not a fact question; needs the operator.

### Headline: section 3 is materially out of date

Section 3 is sourced from a July handoff. Six of its eight bullets have changed since, and two of them change what the guide says. Read section 3 corrections below **before** section 4, because three of the brief's questions (4.1a, 4.1c, 4.2b) are already answered by work that shipped in August and September.

The two that matter most:

1. **The "incomplete" error is no longer a 413.** It is a **422 `corrupt-image`**, and the guide's error-to-cause mapping has to follow that.
2. **The single biggest cause of that bucket was our bug, not the user's file.** Tiled HEICs (every modern iPhone still) were failing at _header parse_ because libheif's default security limits reject a 5x9 tile grid. Fixed 2026-08-11. The `corrupt-image` counts in the brief's 30-day window are contaminated by that and by a second over-broad match still present today.

---

## Section 3 corrections

| July claim                                                                             | Status now                         | Detail                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Files ≤8MB single-shot, >8MB chunked                                                   | **Changed**                        | Threshold is **5MB**, not 8MB. Lowered deliberately once offline-resume landed, because the 5-8MB band is exactly what hurts on a slow mobile uplink. `uploadChunked.ts:31`                                                                                                                |
| Session ceiling 75MB                                                                   | **Confirmed**                      | `kMaxSessionBytes = 75MB`, `UploadSessionStore.h:340`. Drogon's transport cap is 80M (`config.yaml:271`).                                                                                                                                                                                  |
| Sessions have a TTL with a 60s eviction sweep                                          | **Confirmed, and now three TTLs**  | 12 min sliding while receiving (`kTtl`), **180s** if no bytes yet (`kUnstartedTtl`), **120s** once all bytes are in but params have not arrived (`kUnclaimedTtl`). `UploadSessionStore.h:341-395`; sweep `main.cc:212-216`.                                                                |
| `withRetry`: 3 attempts, xhr status 0 + {408, 502, 503, 504, 520-524}                  | **Confirmed unchanged**            | `uploadRetry.ts:13,46`. Deterministic 4xx and processing 500s still not retried.                                                                                                                                                                                                           |
| Part A (offset resume + `GET /v1/upload/status`) "pending build + deploy verification" | **Live**                           | See 4.2b.                                                                                                                                                                                                                                                                                  |
| "Incomplete" message is the rewrite of a raw `413 Failed to read image dimensions`     | **Superseded**                     | That 413 no longer exists for this case. `ImageBombProtection::rejectionFor` now maps an unreadable header to **422 `corrupt-image`** (`ImageBombProtection.h:70-85`); 413 is reserved for genuine oversize. The old 413 branch in `uploadError.ts:33-45` is now dead code for this cause. |
| "Log the underlying libvips exception … not actioned"                                  | **Done**                           | Shipped 2026-08-21 (`5749027`) and extended 2026-09-14 (`fc15f82`). See 4.1a.                                                                                                                                                                                                              |
| Charging: decrement before the controller, no refund on 503/413                        | **Confirmed still current**        | `TokenLimiter.cc:26-29`. But a working refund mechanism now exists elsewhere in core. See 4.7.                                                                                                                                                                                             |
| Magic-byte fast-fail → 415                                                             | **Confirmed, and now diagnosable** | 415 now carries `X-Mochify-Detected` (length + first 12 bytes hex + ftyp brands) and is logged server-side. `ImageController.cc:105-121`.                                                                                                                                                  |
| Ledger §2 accepted formats                                                             | **Incomplete**                     | Missing **GIF** and **SVG**, both accepted. See 4.3a.                                                                                                                                                                                                                                      |

Also worth knowing before writing: **the message quoted in the brief's PostHog table no longer exists verbatim.** The em dash was removed on 2026-09-14 (`67cc761`): it now reads "This image looks incomplete. If it's stored in iCloud, open it in Photos or Preview first to download the full-resolution original, then try again." Still iCloud-only, so the section 6 reword ask stands.

---

## 4.1 "This image looks incomplete" (now a 422, not a 413)

### a. Is the libvips exception logged, and what is the truncated-vs-unparseable split?

**Logged, yes — three ways.** [code]

- `ImageDimensions.openError` captures the decoder's own sentence at the header-read catch site, sanitised to printable ASCII and capped at 300 bytes (`ImageBombProtection.h:180-200`, `ImageValidator::sanitizeForHeader`).
- It is written to the log (`ImageController.cc:137-141`) **and** returned to the client as `X-Mochify-Decoder`, which the frontend reads and forwards to PostHog as the `decoder` property on `upload_reject` (`uploadError.ts:82-96`, `trackReject`).
- Since `fc15f82` (2026-09-14) the _decode-time_ rejections in `SquishPipeline.h` emit the same header, not just the header-read ones.

`X-Mochify-Decoder` is confirmed in the live `Access-Control-Expose-Headers` list. [live]

**The split cannot be computed for the brief's window, and this is the important caveat.** The `decoder` property only started carrying signal partway through it, and the decode-time half landed on the window's last day. What you can do now:

- **Now available:** break `upload_reject` where `reject_label = corrupt-image` down by the **`decoder`** property. `heifload_buffer: bad seek to N` means a decoder chased a tile offset past the end of the bytes present — genuinely short file. Anything else (an unsupported profile, a named box that failed to parse) means a **full-length file we could not decode**, which is our problem, not the user's.
- **Better, from today:** a client-side pre-flight now runs on every added file and reads the container's own declared length before upload (`truncationCheck.ts`). It fires `upload_truncated_preflight`, and its verdict is attached to any later server rejection as `preflight_truncated` on `upload_reject` (`ImageUpload.svelte:484-495, 957`). Joining those two is the direct answer to this question. It shipped 2026-09-14, so **data starts now** — give it 14 days.

**Guide implication:** do not lead section 1 with either cause yet. Lead with the user-actionable one (cloud placeholders and interrupted copies, which covers both readings), and add the diagnosis-led split when the 14 days of joined data exist.

One thing the pre-flight already establishes, measured against production and worth knowing before you write "the file didn't finish transferring": **a HEIC missing 950 bytes off its `mdat` still decoded to a full JPEG.** libheif tolerates a short tail. "Short" and "rejected" are not the same population, so the guide should not promise that a re-download fixes it every time.

### b. 22 of 31 on Windows — cloud placeholders or dropped connections?

**Nothing in the request can currently distinguish them, and the client-side signals point away from the placeholder theory as _usually_ stated.** [code]

- There is no `Content-Length`-versus-actual comparison to appeal to: `/v1/squish` receives the whole body or the request fails. Drogon does not hand the controller a short body labelled as long.
- The _classic_ OneDrive/iCloud-for-Windows placeholder symptom is already handled and does not reach this error. `resolveUploadSize` detects `file.size === 0` and re-reads the real bytes so the upload sends real content; files that read as nothing at all are dropped at the door with their own message (`ImageUpload.svelte:432-439`). A `size === 0` placeholder therefore never becomes an "incomplete" rejection.
- What is left is the harder case: a file that reports a **plausible non-zero size but materialises short** — a copy still in progress, or a provider that streams a partial. That is exactly what `truncationCheck.ts` was built to catch, and `upload_truncated_preflight` carries `container`, `reason`, `short_by` and `size`, which is enough to characterise it.

**Guide implication:** the message's Windows problem is real and the reword in section 6 item 1 is correct and should ship. But write the section around **"a file that is still arriving on your machine, or has not fully downloaded from cloud storage"** rather than naming a mechanism we have not yet proven. The advice (right-click → Always keep on this device; or copy to the desktop first; or wait for the copy to finish) is right for every candidate cause, which is why it is safe to give ahead of the diagnosis.

### c. The full-size HEICs with brands `heix, mif1, miaf, MiHA, jpeg, SHIF` — recognised?

**Yes. This was a decode gap on our side, and it is largely fixed — but a second, still-live bug means the bucket is not trustworthy.** [code]

**The fixed part.** `getImageDimensions` is the first thing to touch an uploaded buffer, and until 2026-08-11 it opened HEIF under libheif's default security limits. Those limits reject an ordinary tiled HEIC **at header-parse time**: an iPhone still is a 5x9 tile grid, i.e. 45 `iref` references against a default cap of 16. Width came back as -1 → `Unreadable` → the user was told their perfectly intact photo "appears incomplete". The fix (`4b73a31`, 2026-08-11) passes `unlimited=true` for ISO-BMFF buffers, gated on the shared `isIsoBmff` predicate. `ImageBombProtection.h:126-145`.

The brief's window (2026-08-15 to 2026-09-14) starts **four days after that fix**, so it should be mostly clean — but only mostly, and the brands in the brief are consistent with tiled multi-codec captures, so **re-run the count split by week** before treating any of it as a current rate.

**The still-live part, and this is the one to act on.** `isCorruptImageError` matches the bare string `"heifload"` (`ImageProcessor.h:71-76`). That is libheif's whole error domain. So **any** libheif failure — an unsupported profile, an unhandled bit depth, a codec we do not have — is classified `corrupt-image` and the user is told their image is incomplete. `X-Mochify-Decoder` is what separates them, and it is why that header was added; until the `decoder` breakdown is run, **the `corrupt-image` count is an upper bound on truncation, not a measurement of it.**

Note on `brands=... jpeg ...`: a compatible brand of `jpeg` advertises JPEG-coded tiles rather than HEVC. Our libheif is built with HEVC (`libde265`/`x265`) and AV1 (`dav1d`/`aom`) decoders (`Dockerfile.base:11-12`), and a missing plugin _is_ correctly split out as a 500 `codec-missing` when libheif says "No decoding plugin" (`ImageProcessor.h:122-132`) — but that check only runs on the **decode-time** path. A codec problem that surfaces during the **header read** has no such branch and lands in `corrupt-image`. That is a real gap and it is listed in the dev-work section below.

**Guide implication:** do **not** put this variant in the guide. It is ours to fix. The guide's `#incomplete-image` section should carry a "if this keeps happening on a photo you know is fine, tell us and include the file type" line pointing at `/contact`, which is the honest route for a decode gap.

### d. Can the allowance be described as untouched for this error?

**No.** A 422 `corrupt-image` from `/v1/squish` is charged, because `TokenLimiter` decrements before the controller runs (`TokenLimiter.cc:26-29`, `ImageController.h:14`). See 4.7.

Two exceptions worth knowing, because they are the shape of the fix:

- **`/v1/upload/stage` charges nothing.** It runs the format check and the bomb check over the complete body and can reject with the same `corrupt-image` 422, with no token cost — tokens are charged at `complete`. So on the Magic Flow's speculative path (files ≤5MB), this rejection is already free.
- **`/v1/upload/init` charges nothing either.** Same reason.

So the honest statement is surface-dependent: **free on Magic Flow's staged path, charged on Manual Settings.** That is not a distinction a guide can reasonably explain, which is an argument for fixing it rather than documenting it.

---

## 4.2 "Network error"

### a. Which code path produces that exact string?

**Your guess is right, and the string is narrower than the brief assumes.** [code]

`"Network error"` is thrown at exactly four places, all of them an `xhr` `error` event (transport drop, status 0), all tagged `retryable: true`:

- `uploadChunked.ts:156` (init), `:217` (chunk), `:299` (complete) — the >5MB path.
- `ImageUpload.svelte:971` — the Manual Settings single-shot `/v1/squish` path.

**It never comes from Magic Flow.** `PromptFormApp`'s own drop message is "Lost connection while processing _filename_ — check your internet and try again." (`PromptFormApp.svelte:1956-1962`), which does not appear in the brief's tables at all. So:

- `Network error` (39 events) = **Manual Settings**, plus the chunked path on either surface.
- Magic Flow's `Load failed` x12 is Safari's wording for a failed **`fetch()`**, and the only `fetch()` calls in that flow before an upload starts are `/v1/usage` and `/v1/prompt` on the worker. **Those 12 events are a failed prompt-parse round trip, not a failed upload.** The guide should not file them under `#network-error` advice about large files and Wi-Fi; "Load failed" on Magic Flow means we could not reach the service to interpret the prompt. Retrying is the right advice, but for a different reason.

Reaching the string means `withRetry` exhausted its attempts: 3 attempts, ~1s then ~2s backoff plus up to 400ms jitter.

### b. Is Part A (offset-based resume) deployed and verified live?

**Yes. Verified in production today.** [live]

```
GET https://api.mochify.app/v1/upload/status?session=doesnotexist
→ 404 {"error":"Upload session not found or expired."}
```

That is the handler's own JSON body (`UploadController.cc:1013`), not a route-miss, so the endpoint is deployed and serving. The client half has been on `main` since `8c5d4d0` (2026-07-23) and has been edited by seven later commits through 2026-09-14; `main` and `origin/main` are level.

**So the guide may say that uploads over 5MB resume from where they stopped.** Be precise about what that means, because the mechanism is better than "resume" implies and its limits matter:

- `offset` is the server-confirmed contiguous high-water mark. Each chunk is sent from exactly there, and re-sending the same chunk at the same offset is safe — the server no-ops bytes it already has (`uploadChunked.ts:452-470`).
- Going **offline** mid-upload pauses rather than fails, and waits up to **5 minutes** for the browser to come back, then resumes from the high-water mark (`OFFLINE_MAX_WAIT_MS`, `uploadChunked.ts:37`, `withReconnect`).
- The half-uploaded bytes live only in the server's RAM under a **12-minute sliding TTL**. A stall longer than that loses the session; the client then does **one** full restart from zero and, if that is lost too, surfaces the error (`MAX_SESSION_RESTARTS = 1`, `uploadChunked.ts:395`).

Wording that is true: _"Above 5MB we upload in pieces, so a dropped connection costs at most the piece in flight, and if you go offline we wait up to five minutes and pick up where we stopped. Leave it much longer than ten minutes and the upload starts over."_

### c. Is there a per-request timeout, and what is it?

**Nothing we impose on the client, and nothing on an active transfer at the origin.** [code]

- No `xhr.timeout` is set anywhere in the upload paths.
- Drogon's `idle_connection_timeout: 60` (`config.yaml:243`) applies to an _idle_ keep-alive connection, not a transfer in progress.
- `client_max_body_size: 80M` (`config.yaml:271`) is a size limit, not a clock.

The remaining wall clock is **Cloudflare's proxy**, which fronts `api.mochify.app` [live]. Cloudflare's documented limit is 100 seconds for the origin to start responding, surfaced as a **524**; 524 is already in the retry set, which is consistent with us having seen it. I have not confirmed the exact configured value from the dashboard, so **treat 100s as "Cloudflare's documented default, not verified for our zone"** and check it before it goes in the ledger.

**Guide implication:** the mechanism matters for the advice. A 5MB single-shot POST on a slow mobile uplink can plausibly run into a wall clock; a 5MB **chunk** on the resumable path is a fresh request with a fresh clock. So _"fewer files at once, and switch to Wi-Fi for large files"_ is the right advice, and it is right for a concrete reason rather than folklore. Note that Manual Settings already uploads **one file at a time** (`CONCURRENT_UPLOADS = 1`), so "upload fewer at once" helps by shortening the run, not by reducing parallelism.

### d. What does the user see while `withRetry` is retrying, and during the offline wait?

**An amber banner — on three of the four paths. The fourth is silent, and it is the busiest one.** [code]

Where the callback is wired, the user sees a persistent amber strip with a pulsing warning glyph, `role="status"` and `aria-live="polite"`:

- Manual Settings, chunked (>5MB): **"Unstable connection detected. Pausing and retrying…"** (`ImageUpload.svelte:2022-2031`)
- Magic Flow, all paths: **"Unstable connection. Pausing and retrying…"** (`PromptFormApp.svelte:2631-2639`)

The same banner covers the offline wait, because `withReconnect` signals the retry state on entering the offline branch too (`uploadChunked.ts:357-363`).

**The gap:** Manual Settings' single-shot `/v1/squish` path (files ≤5MB — the majority of uploads, and the one that produces most of the 39 `Network error` events) calls `withRetry` **without** the `onRetry` callback (`ImageUpload.svelte:883-996`). So on that path all three attempts happen with **no indication at all**; the user watches a progress bar and then gets a bare "Network error" roughly 3 seconds later than they otherwise would have.

**Guide implication:** you cannot write "you would have seen us retrying" as a general statement. Either write it conditionally ("on larger files you may have seen…"), or — better — get the one-line fix below shipped and then write it plainly. It is a two-argument change to one call site.

### e. After 3 failed attempts, is the allowance charged?

**On the single-shot path: once per attempt that reached the server, which can be up to 3.** [code]

`TokenLimiter` charges on request admission, before the controller. A transport drop _after_ the request was accepted has already been charged. Three attempts against a 503 or a 52x therefore cost up to **3 tokens** for zero output — the July finding, unchanged. See 4.7.

On the chunked and staged paths, **nothing is charged** unless `/v1/upload/complete` is reached, so a failure during the upload phase is free.

---

## 4.3 "Invalid Format: Unknown or unsupported image format"

### a. The definitive accepted-upload list

**One list, enforced in one place, for every surface.** [code] `ImageValidator::validate`, `ImageValidator.h:264-267`:

**Accepted:** PNG, JPEG/JPG, WebP, AVIF, HEIF/HEIC (including camera `.HIF`), JPEG XL, **GIF**, **SVG**.

Ledger §2 is missing **GIF** and **SVG**. Both are genuinely accepted: GIF decodes via vips's bundled libnsgif at `n=1`, so an animated GIF yields its first frame (`ImageValidator.h:137-142`).

Detection is by **magic bytes, never extension**, and for the HEIF family by the full `ftyp` brand list (major brand _plus_ every compatible brand), which is what makes vendor camera `.HIF` files work (`ftypBrands`, `ImageValidator.h:65-90`).

**Explicitly detected and refused, with a specific message** (`unsupportedFormatHint`, `ImageValidator.h:227-235`):

| Format | Message                                                                   | Why                                                   |
| ------ | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| TIFF   | "TIFF images aren't supported yet — export as PNG or JPEG and try again." | vips build has no libtiff                             |
| BMP    | "BMP images aren't supported — export as PNG or JPEG and try again."      | vips reads BMP only via magick, disabled in our build |
| PDF    | "PDF files aren't images — use the /v1/pdf endpoint instead."             | PDFs have their own endpoint                          |

**The brief's edge cases, answered:** TIFF no, BMP no, GIF **yes** (first frame), SVG **yes**, camera RAW **no** (`.CR3`/`.ARW`/`.RAF`/`.NEF` are not detected at all and fall into the generic "Unknown or unsupported" message), PSD **no**. Animated WebP/AVIF/PNG are accepted as _input_ by container — output is a still.

**Per surface:**

| Surface                                | Client-side gate                                                                                                       | Effective answer            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Web app (`/`, `/flow`, `/solutions/*`) | Yes — MIME set + extension set, `ImageUpload.svelte:324-347`, `PromptFormApp.svelte:390-410`                           | Same list, filtered earlier |
| Chrome extension                       | **None** — posts whatever blob it lifted off the page (`background.js:250-252`)                                        | Server list only            |
| CLI / MCP                              | **None** — maps known extensions to a MIME type, everything else goes as `application/octet-stream` (`api.rs:254-262`) | Server list only            |

So the server list **is** the answer for every surface; the web app just fails faster. Note the extension list accepts `.hif` explicitly, which is the right call.

**One copy defect to fix while you are here:** the web app's client-side rejection reads "Accepted: JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF, JXL, SVG." — it **omits GIF**, which is accepted by both the client sets and the server (`ImageUpload.svelte:415-417`).

### b. Client-side or server-side string?

**The string in PostHog is the server's.** [code] Core builds `"Invalid Format: " + validation.reason` as the 415 body (`ImageController.cc:112`), and the client passes any non-empty 415 body through verbatim (`uploadError.ts:47`). "Unknown or unsupported image format" is `ImageValidator`'s own `reason` for an unrecognised signature (`ImageValidator.h:253`).

**Both exist, with different wording.** The client-side gate produces a _different_, plural, count-based message — "N file(s) not supported. Accepted: …" — and those files never upload, so they generate no `upload_reject` and no `manual_compress_failed`. The client gate keys on **MIME type or file extension**; the server keys on **magic bytes**. That mismatch is exactly the trap in 4.3c: rename a non-image to `.jpg` and the client waves it through for the server to refuse.

**Guide implication:** `#unsupported-format` needs to serve both strings, and the "N file(s) not supported" one is the more common user experience (it is a drag-and-drop mistake, caught instantly). Quote both.

### c. `bplist00`, AppleDouble sidecars, and the "EVAL" cluster

**Drag-and-drop from a Mac, and unzipping a Mac-made zip on Windows, are the likely routes — and the client gate cannot stop either.** [code]

- **AppleDouble `._` sidecars** (`00051607 … Mac `): created by macOS on non-HFS volumes and in zips. Unzipped on Windows they appear as `._DSC1234.JPG` — extension `jpg`, so the client's extension check **passes them**, the upload happens, and the server refuses on magic bytes. Textbook. Windows' own Explorer hides nothing here, and a "select all" in the extracted folder picks them up.
- **`bplist00`** (macOS binary plist): the shape of an iCloud Drive `.filename.icloud` stub and of various app metadata files. Same route — dragged from a Finder window alongside the real photos.
- **The `44332211 … 4556414c` ("EVAL") cluster: not recognised.** Honest answer. The structure is suggestive though: `0x44332211` is `0x11223344` written little-endian, the classic endianness sentinel that proprietary/internal container formats start with, and "EVAL" sits at offset 8 where a four-character-code would go. Combined with 360-915KB sizes across several users, the most likely story is a **derivative or cache file from inside an application's library folder**, not a photo. Same user error as the other two, different app.

**To identify it properly** (cheap, and the machinery is already there): `X-Mochify-Detected` already gives length + first 12 bytes + brands, and the frontend already forwards it as `detected` on `upload_reject`. Add the **file extension** and the first ~32 bytes to that property and the next occurrence names itself. Listed in dev work below.

**Guide implication:** this is the brief's own best insight and the data supports it — §2.4 point 2 is correct. The fix is "pick the actual photo", and the section should name the three concrete traps: files starting with `._` after unzipping a Mac-made archive, anything dragged out of an app's library or cache folder, and RAW files (which are a genuine format gap, not a mistake, and should route to `/contact` or a tool page rather than being called an error).

---

## 4.4 "Too many concurrent uploads" and rate limiting

### a. What is the cap, and what is it keyed on?

**It is three caps, all on upload _sessions_, and the number in the July docs is stale.** [code] `UploadSessionStore::createSession`, `UploadSessionStore.h:122-165`:

| Cap                       | Value                      | Scope        |
| ------------------------- | -------------------------- | ------------ |
| `kMaxSessionsPerIdentity` | **30** concurrent sessions | per identity |
| `kMaxBytesPerIdentity`    | **200MB** declared         | per identity |
| `kMaxTotalBufferedBytes`  | **1.5GB**                  | server-wide  |
| `kMaxSessionBytes`        | 75MB                       | per session  |

Any of the three failing returns `503 "Too many concurrent uploads. Please retry shortly."` with **`Retry-After: 5`** (`UploadController.cc:245-252` for init, `:396-403` for stage).

**Keyed on `identifier`**, which is `sha256(userId)` for a signed-in caller and `sha256(IP + salt)` for an anonymous one (`AuthResolver.h:88,171`). So: **per account** when signed in, **per IP** when not. No tier differentiation on these caps — the tier shows up only in the 75MB-vs-20MB per-file ceiling.

**Does a 25-file batch trip it? No, on either surface.**

- Manual Settings uploads **one file at a time** (`CONCURRENT_UPLOADS = 1`, `ImageUpload.svelte:110`) — note this contradicts `CLAUDE.md`, which still says 2.
- Magic Flow stages at most **6** at once (`STAGE_CONCURRENCY = 6`, `uploadStage.ts:40`), chosen partly to stay inside this very 200MB budget.
- Files ≤5MB on Manual Settings do not create a session at all — they go single-shot to `/v1/squish`, where the cap does not apply.

**So where did the 9 events come from?** Almost certainly the **old cap of 4**. `kMaxSessionsPerIdentity` was `4` from 2026-07-13 until **2026-08-29**, when `5424992` raised it to 30 and added the byte budget. The brief's window (2026-08-15 to 2026-09-14) straddles that change. **Split those 9 events by date** — the prediction is that all or nearly all fall before 2026-08-29, in which case the cap is a fixed bug and does not belong in the guide as a live limit.

A second, unrelated 503 exists and must not be conflated: when the processing queue is saturated, `/v1/squish` returns `503 "Mochify is at capacity. Please retry in 1s."` with **`Retry-After: 1`** (`ImageController.cc:252-259`). Different message, different cause, different wait.

### b. `manual_compress_rate_limited` — what limit, what message, what wait?

**Not a rate limit. It is the monthly allowance running out mid-batch.** [code]

The flag is set when any file in the batch comes back **429** (`ImageUpload.svelte:1004-1005`), which is the monthly quota response from `TokenLimiter` (`TokenLimiter.cc:74-83`), not a per-second limiter. The batch loop then breaks, the successful files are downloaded, and the user sees:

> "Rate limit reached! Downloaded N successful conversion(s). M file(s) remain."

plus the upgrade CTA (`ImageUpload.svelte:1094-1100`). There is **no wait that helps** — the allowance resets monthly.

**The copy is actively misleading and should change.** "Rate limit reached" tells the user to wait; the truth is "you have used this month's uploads". Two other 429 strings are wrong in the same family:

- `uploadError.ts:48` returns the bare string `'Rate limit exceeded'` for any 429, discarding the server's much better body ("Monthly limit reached. Sign up for a free account to get more operations."). That is a one-line fix: pass the body through like every other status does.
- `/v1/upload/init` and `/v1/upload/stage` tell a **signed-out** user to "Upgrade for more operations", where `/v1/squish` correctly tells them to "Sign up for a free account" (`UploadController.cc:143` vs `TokenLimiter.cc:79`). A guest being asked to upgrade before being offered the free tier is a funnel bug, not just a copy one.

**Guide implication:** `#too-many-uploads` should cover the genuine 503s, and the 429 belongs in an allowance section, not a rate-limit one. Do not tell anyone to "wait a minute" for a 429.

### c. Is `Retry-After` sent, and does the client honour it?

**Sent on both 503s. Not honoured — and the client is faster than it anyway.** [code]

| Response                           | `Retry-After` |
| ---------------------------------- | ------------- |
| 503 session caps (init/stage)      | 5             |
| 503 queue saturated (`/v1/squish`) | 1             |
| 429 monthly quota                  | **none**      |

`withRetry` ignores the header and uses its own fixed backoff: ~1s, then ~2s, plus up to 400ms jitter (`uploadRetry.ts:63-75`). For the `Retry-After: 1` case that is correct or generous. For `Retry-After: 5` the client retries **sooner than asked**, three times, and can burn the whole budget inside ~3 seconds while the condition it is waiting on has not cleared. Worth fixing (honour the header when present, capped), and cheap.

**Guide implication:** "it retries itself, three times, within a few seconds" is the accurate line for both 503s. If all three fail, waiting ten seconds and pressing convert again genuinely helps for the queue-saturation 503.

---

## 4.5 The rare ones

### a. `All files failed to convert`, `Processing Failed`, `Something went wrong on our end`

**Three different things, and "try again" is the right advice for only two.** [code]

**`All files failed to convert`** (3 events, 3 users) is a **fallback that should be unreachable.** It fires only when nothing is marked complete **and** nothing carries an error — i.e. the per-file result writes went missing (`ImageUpload.svelte:1032-1052`). The cause was diagnosed as client-side re-entrancy on bulk uploads and fixed; a temporary breadcrumb (`manual_compress_all_failed_debug`) is still in place to confirm the fix in the field, capturing the per-file statuses and blob sizes. If any of those 3 events carry the breadcrumb, that is a live regression worth a look before the guide ships. **This string should not get a guide section** — it means "we lost track", and the honest advice is retry once then contact us. Fold it into `#processing-failed`.

**`Processing Failed`** (2 events, 1 user) is core's body for its two **500** classes (`ImageProcessor.h:128-151`):

- `engine-error` — the deliberate catch-all for an **unclassified** decode failure. This bucket exists precisely so that a new engine bug shows up as a trend; it is logged at ERROR.
- `codec-missing` — a libheif decoder plugin absent at runtime. Ours, not the user's, and it would show as 100% of HEIF uploads failing.

Both are genuinely our fault. "Try again" is weak advice (a deterministic decode failure will fail again) but harmless; the section should route to `/contact` quickly.

**`Something went wrong on our end — please try again in a moment.`** (1 event) is **Magic Flow's prompt-parse error**, not an upload error: it is returned when `/v1/prompt` answers 5xx for a reason other than unusable model output (`PromptFormApp.svelte:889-898`). Its sibling, for unusable output, is "Couldn't quite understand that — try again, or rephrase and resubmit." Retrying **is** correct here — the model runs at temperature 0.2, so the same prompt can succeed on a second attempt.

### b. `Upload session not found or already completed.` — TTL, and does activity extend it?

**404 from `/v1/upload/complete` (`UploadController.cc:679-687`). It covers four cases deliberately collapsed:** unknown id, identity mismatch, expiry, and a **double-complete** (the session is removed atomically on first success, so a duplicate cannot double-charge).

**TTLs, and whether activity extends them** (`ttlFor`, `UploadSessionStore.h:385-395`):

| State                                                                    | TTL                                     | Extended by activity?                                                                                     |
| ------------------------------------------------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Receiving** — at least one chunk in                                    | **12 min**, sliding from `lastActivity` | **Yes**, every chunk refreshes it                                                                         |
| **Unstarted** — reserved, no bytes yet                                   | **180s**                                | **No.** Only a real chunk promotes it; `GET /v1/upload/status` deliberately does not touch `lastActivity` |
| **Unclaimed** — all bytes in, params not yet sent (the speculative path) | **120s**                                | No                                                                                                        |

Eviction sweeps every 60s (`main.cc:212-216`), so the real ceiling is the TTL plus up to a minute. `/v1/upload/init` reports `expiresInSeconds` as the **180s** unstarted value, not 12 minutes, which is correct and worth not contradicting in the guide.

**Guide wording that is true:** _"If an upload stalls for more than about twelve minutes we let it go and you will need to start it again. On the Magic Flow, if you leave a submitted prompt sitting for more than two minutes before it finishes, the same thing happens."_ Do **not** write a single "N minutes" number; there are three, and the one a user is most likely to hit (the 120s unclaimed window) is the shortest.

One more thing the guide can say honestly: a **504/404 during the upload phase** triggers exactly one automatic full restart from zero before the user sees anything (`MAX_SESSION_RESTARTS = 1`).

---

## 4.6 Batch trimming and file size

### a. What does the user see when a batch is trimmed to 3?

**A dedicated inline banner, not a toast, and it does not disappear.** [code] `ImageUpload.svelte:1762-1817`.

It is deliberately _not_ in the red error slot, because the files are legal — there are just too many for the tier. Structure:

> **"Staging 3 of 12 files. Guest and free batches are capped at 3 files per batch."**
> _(a guest reads "Guest and free batches are"; a Free account reads "The free tier is"; a paid account reads "Batches are")_
>
> — then a pink pill: **"Day Pass ($2) for 25 at a time"**, or **"Upgrade from $7.99/mo for 25 at a time"** where the Day Pass is not offered
> — for guests only, a second link: **"Sign up free for 25 uploads a month"**
> — then: **"Or convert these 3 now and drop the rest in a second batch."**

**Guests and Free accounts are treated identically for the cap** (both 3) — which is why the copy offers signup as the _monthly allowance_ answer and the paid plans as the _cap_ answer. That distinction is deliberate and the guide should preserve it: signing up free does **not** raise the batch cap.

`batchLimit` is `25` for **any** paid plan and `3` otherwise (`ImageUpload.svelte:178-179`; `userTier === 'pro'` means "any paid plan", including Day Pass, Seller and Growth). Ledger §4 is correct.

Nothing is uploaded for the trimmed files — they are sliced off before staging (`:504`), so the honest line for the guide's §6 is "nothing happened to them, and they did not count against your allowance".

### b. `file_size_blocked` — client-side? Exact message? Limits still live?

**Client-side, before any upload, and the file stays visible.** [code] `ImageUpload.svelte:445-466`, card at `:1548-1600`.

The oversize file gets its **own red card** in the list (with a thumbnail, dimmed) rather than a banner, so the user never has to match a count to a missing file:

> **"Exceeds 20MB limit (34.2 MB). Day Pass ($2) for files up to 75MB"**
> _(or "Upgrade for files up to 75MB" where the Day Pass is not offered)_

It never joins `selectedFiles`, so it cannot be uploaded. The number of these cards is itself capped at `batchLimit` so a drop of fifty large files makes the point without filling the panel.

**Limits confirmed live on both sides.** Client: 20MB standard / 75MB paid (`ImageUpload.svelte:119-120`). Server, independently: `kFreeSizeLimit = 20MB`, `kLiteSizeLimit = 75MB` (`PlanLimits.h:16-17`), enforced at `ImageController.cc:60-71` and again on the session paths. Ledger §4 is correct as of today.

Note the client check runs against **resolved** size, not `file.size` — a cloud file that misreports `size === 0` gets its real bytes measured first (`resolveUploadSize`), so the 20MB gate cannot be bypassed by a placeholder and, equally, a placeholder is not falsely blocked.

---

## 4.7 Allowance charging on failure

### a. Is that still the current behaviour?

**It was, until 2026-09-15 — refund-on-failure is now implemented (not yet deployed).** See `mochify-core/docs/refund-on-failure.md` for the shape, the trade-off and the ship checklist. The charge still happens on admission (that ordering is the TOCTOU fix and stays); what changed is that every post-admission failure now hands the credit back. Deploy the **worker first** or refunds silently no-op.

The behaviour described below is what shipped code did before that change, and is still what production does until core is rebuilt and deployed. [code]

`TokenLimiter` is a Drogon filter on `/v1/squish` (`ImageController.h:14`) and decrements before the controller runs. Its own comment states the rule: _"No refund on pipeline failure — same charge-before-processing semantics the single-variant path has always had."_ (`TokenLimiter.cc:26-29`). Multi-variant requests are charged their deduped variant count, atomically, up front.

What is charged with no output, today:

| Failure                                                                       | Charged?                                                  |
| ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| 422 `corrupt-image` (the "incomplete" message) via `/v1/squish`               | **Yes**                                                   |
| 415 unsupported format via `/v1/squish`                                       | **Yes**                                                   |
| 503 queue saturated                                                           | **Yes** — and up to **3x** through client retry           |
| 500 `engine-error` / `codec-missing`                                          | **Yes**                                                   |
| Anything on `/v1/upload/stage` or `/init`, including a `corrupt-image` reject | **No** — charged only at `complete`                       |
| 429 monthly quota                                                             | No (nothing left to charge)                               |
| 400 malformed params                                                          | No — rejected before the charge (`TokenLimiter.cc:37-49`) |

**The new, decisive fact: a working refund mechanism already exists in core.** `GenerateController` reserves credits up front and refunds them on every failure path via `Worker::decrement(..., -cost, ...)` — the worker's decrement has no sign check, so a negative cost adds tokens back — hopping onto the IO loop first and logging a failed refund rather than discarding it (`GenerateController.cc:239-260`). It was built for exactly this problem ("a failed generation would cost the user for nothing") and it is proven in production.

So option (iii) in 4.7b is **not a rewrite**. It is calling an existing, tested pattern from `/v1/squish`'s failure paths. That materially changes the cost side of the decision.

### b. What may the guide say publicly?

**[decision] — operator's call, but the engineering constraint that shaped the options has gone, so here is a recommendation rather than a neutral menu.**

**Recommend (iii): refund server-side, then say "failed uploads are never charged."**

Reasons, in order of weight:

1. **The fix is cheap and the pattern is proven.** Wrap the reject paths in `ImageController::squishImage` and the queue-saturation 503 in the same `refundAndFail` shape `GenerateController` already uses. The 503 is the most urgent of them: it is _entirely_ our capacity problem and it can currently cost 3 tokens.
2. **Option (ii) needs a support path that can credit accounts, and there isn't one.** "Contact us and we'll put it right" is a promise; nothing in the dashboard or the worker exposes a manual credit today. Writing that line would be committing the operator to build it.
3. **Option (i) reads worst.** The brief is right that a user hitting two errors in a row will look at their counter. The counter is visible in the app, so silence is not neutral — it is the user discovering it themselves.
4. **The current behaviour is already inconsistent in a way that is impossible to document honestly.** The same rejection is free on Magic Flow's staged path and charged on Manual Settings. Any public statement short of "never charged" would have to explain that, and no user should have to care.

**If the operator chooses not to fix it now**, the guide should take option (i) — say nothing — rather than (ii), and `#allowance` should be omitted entirely per the brief's own plan. Do not publish a promise the support path cannot keep.

**If (iii) ships**, the guide line is one sentence and needs no hedging: _"A failed upload does not use your allowance."_ Sequence it so the refund is deployed **before** the guide goes live.

---

## 4.8 Wiring the dynamic help

### a. Can each failure carry a stable machine key?

**Yes, and it is a smaller change than the brief assumes, because the mapping already happens in one function.** [code]

Every user-facing message on the upload paths is produced by `uploadErrorMessage(status, serverText, rejectLabel)` in `src/lib/uploadError.ts`. That single function already branches on exactly the distinctions the proposed keys encode, and already receives the server's `X-Mochify-Reject` label. Changing its return from `string` to `{ message, key }` gives every caller the key with no new plumbing and no risk of the two drifting.

The server side is already there too: `X-Mochify-Reject` is a **stable machine slug by design** (`ImageProcessor.h:91-103` — "that label is what makes the tail measurable"), it is exposed via CORS [live], and the frontend already reads it and sends it to PostHog as `reject_label` on `upload_reject`.

Today, by contrast, `manual_compress_failed` and `magic_flow_failed` carry **only a free-text `error` string** (`ImageUpload.svelte:1155-1157`, `PromptFormApp.svelte:2355-2357`) — which is why the brief had to build its inventory by grouping on prose. So the ask is right and worth doing.

**On the proposed key list, three notes:**

- `network_error` should distinguish **transport drop** from **prompt-parse failure**. Per 4.2a these are different errors with different advice, and Magic Flow's `Load failed` is the latter. Suggest `network_error` and `nlp_unreachable`.
- `rate_limited` is the wrong name for what fires: it is a monthly-allowance exhaustion, not a rate limit (4.4b). Suggest `quota_exhausted`, and keep `rate_limited` free in case a real limiter is ever added.
- Add `corrupt_image_decoder` or carry the `decoder` value as a **property alongside** `error_key = incomplete_image`. Per 4.1c the `corrupt-image` label covers two unrelated failures, and the guide anchor is only correct for one of them. Without this the `help_link_clicked` numbers for that anchor will be uninterpretable in exactly the way the brief is trying to escape.

**`batch_cap_trimmed` and `file_size_blocked` already carry structured properties** (`cap`, `dropped`, `tier`; `files`, `limit_mb`, `tier`), so those two need only the `error_key` added for consistency.

### b. Where would the "What can I do?" link render, and how long does it stay?

**Neither of the brief's two options, and this is good news for the guide's structure.** [code]

Nothing in these paths uses a toast. The failure surfaces are all **persistent and inline**:

| Failure                | Surface                                                      | Lifetime                                |
| ---------------------- | ------------------------------------------------------------ | --------------------------------------- |
| Upload/convert failure | `errorMessage` in the red banner (`ImageUpload.svelte:1162`) | Until the next action — no auto-dismiss |
| Batch cap trim         | Dedicated amber/pink banner (4.6a)                           | Until the next ingest                   |
| Oversize file          | Its own red card, per file, in the list (4.6b)               | Until the user removes it               |
| Magic Flow failure     | `showStatus('error', …)` panel                               | Until the next submit                   |

So the link can sit **directly under the message text**, it will still be there when the user comes back from reading, and **the first line does not have to carry the fix**. Sections can be as long as they need to be. The per-file oversize card is the one tight space — a short "Why?" link is better there than "What can I do?".

### c. `help_link_clicked` and `retry_after_help`

**Both straightforward.** [code]

- `help_link_clicked` with `error_key`: a `posthog.capture` in the link's `onclick`, following the established pattern (`upgrade_cta_clicked`, `signup_cta_clicked` both do exactly this with a `trigger` property).
- **Do not add `retry_after_help`.** Reuse the existing events instead: `manual_compress_started` / `magic_flow_started` already fire on every attempt, so "a start event from the same person within N minutes of a `help_link_clicked`" is a PostHog-side question, not a new instrumentation one. Adding a client event for it would duplicate state the funnel already has and risk the two disagreeing.

One caveat that will affect the numbers: the analytics loader is deliberately deferred via `requestIdleCallback` with a 3s timeout (`analytics.ts:42-45`). A click within the first moments of a page load could be lost. Not material for a link the user reaches after a failure, but worth knowing before treating small counts as exact.

---

## Dev work this surfaced (additions to the brief's section 6)

Ordered by what blocks the guide, then by cost. Items 1-4 are section 6's existing asks with their real status; 5-11 are new.

| #   | Item                                                                                                                                                                            | Repo            | Blocks guide?                                         | Size                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| 1   | **Reword the "incomplete" message** to cover cloud storage generally, not iCloud alone                                                                                          | frontend        | **Yes** — §1                                          | 1 line (`uploadError.ts:26-31`)                             |
| 2   | **Error keys + `help_link_clicked`** — change `uploadErrorMessage` to return `{ message, key }`, add `error_key` to the five events                                             | frontend        | **Yes** — the whole mechanism                         | Small, one central function                                 |
| 3   | **Log the libvips exception**                                                                                                                                                   | core            | No — **already done** (`5749027`, extended `fc15f82`) | Done                                                        |
| 4   | **Confirm Part A deploy state** and close the July handoff                                                                                                                      | core            | No — **confirmed live today**                         | Close the doc                                               |
| 5   | **Refund on failure** — `helpers/TokenRefund.h` callback wrapper on all four charged endpoints, plus a clamping `POST /refund` on the worker                                    | core + worker   | **Yes if 4.7 = (iii)**                                | **Done 2026-09-15**, pending build + deploy                 |
| 6   | **Split `corrupt-image`**: add a missing-codec check to the _header-read_ path, so a decode gap stops being reported as "your file is incomplete"                               | core            | **Yes** — decides §1's honesty                        | Small (`isMissingCodecError` exists, just not called there) |
| 7   | **Wire `onRetry` on Manual Settings' single-shot path** so retries are visible on the busiest path                                                                              | frontend        | **Yes** — §2 claims we retry                          | 2 args at `ImageUpload.svelte:883`                          |
| 8   | **Fix the 429 copy**: pass the server's body through instead of `'Rate limit exceeded'`; rename "Rate limit reached!"; stop telling signed-out users to "Upgrade" on init/stage | frontend + core | **Yes** — §4 vs §8 boundary                           | 3 small edits                                               |
| 9   | **Honour `Retry-After`** in `withRetry` when present, capped                                                                                                                    | frontend        | No                                                    | Small                                                       |
| 10  | **Widen the 415 diagnostic**: add file extension and first ~32 bytes to `detected`, to name the "EVAL" cluster                                                                  | frontend        | No                                                    | Small                                                       |
| 11  | **Add GIF to the client-side accepted-formats copy**                                                                                                                            | frontend        | Minor — §3                                            | 1 line                                                      |

Plus two stale-doc fixes, worth doing so the next reader is not misled the way section 3 was: `CLAUDE.md` says upload concurrency is 2 (it is 1) and the chunk threshold is 5MB in one place while `docs/chunked-upload-followups.md` still documents `kMaxSessionsPerIdentity = 4` (it is 30, with a 200MB byte budget, since 2026-08-29).

---

## PostHog queries this answer sheet asks for

Four questions the code cannot answer. All are re-cuts of data already collected.

1. **`upload_reject` where `reject_label = corrupt-image`, broken down by `decoder`.** Splits genuine truncation from our decode gaps. Decides whether §1 leads with "didn't finish transferring" or "we couldn't read it" — 4.1a, 4.1c.
2. **The same, split by week.** Confirms the 2026-08-11 tiled-HEIC fix landed and tells you how much of the brief's 44 events predate it — 4.1c.
3. **`upload_reject` joined to `upload_truncated_preflight` on `preflight_truncated`.** The direct truncated-vs-unparseable measurement. **Needs ~14 days from 2026-09-14** — 4.1a.
4. **The 9 `Too many concurrent uploads` events, split by date around 2026-08-29.** If they all predate it, the cap that caused them no longer exists and the limit should not appear in the guide — 4.4a.

## What the guide may state as fact today

Safe to write now, all verified in code and dated here:

- Two upload paths, split at **5MB**. Above it, uploads are resumable and survive going offline for up to 5 minutes.
- Automatic retry: **3 attempts**, ~1s and ~2s backoff plus jitter, on transport drops and gateway errors only. Never on a rejected file — re-sending it would fail identically.
- Session expiry: ~**12 minutes** of stall while transferring; **2 minutes** for a submitted Magic Flow prompt whose params have not landed.
- Accepted uploads: **PNG, JPEG/JPG, WebP, AVIF, HEIC/HEIF (incl. camera .HIF), JPEG XL, GIF, SVG** — by file content, not extension. TIFF, BMP, PDF and camera RAW are not accepted.
- File size: **20MB** Free and guest, **75MB** Seller/Pro/Day Pass/Growth — checked in the browser before any upload.
- Batch: **3** for guests and Free (identical), **25** on any paid plan. Trimmed files are not uploaded and do not count against the allowance.
- Guest allowance: **3 per month by IP**. Free account: 25/month.
- Zero retention: chunked uploads are reassembled in RAM only, never written to disk or object storage.

Do **not** write yet, pending the items above:

- Any claim about **what share** of "incomplete" errors are truncation (4.1a, needs the query).
- Any claim that the user **saw** us retrying (item 7).
- Any claim about the **allowance** on failure — the code now refunds, but say nothing until it is deployed and verified (4.7).
- The "Too many concurrent uploads" cap as a **live** limit (4.4a, likely already fixed).
- The `corrupt-image` **HEIC variant** as a user-facing limitation (item 6 — it is ours).
