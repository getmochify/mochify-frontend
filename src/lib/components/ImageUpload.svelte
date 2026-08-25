<script lang="ts">
    import { zip } from 'fflate';
    import { env } from '$env/dynamic/public';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { getPlan, getSessionToken, resolveRemaining, GUEST_QUOTA, type UsageResponse } from '$lib/user';
    import { posthog } from '$lib/analytics';
    import { withRetry } from '$lib/uploadRetry';
    import { uploadChunked, CHUNK_THRESHOLD_BYTES, type ChunkedUploadParams } from '$lib/uploadChunked';
    import { resolveUploadSize, effectiveSize, uploadBodyOf } from '$lib/uploadSize';
    import { uploadErrorMessage, readXhrErrorText, trackUpload413, readRejectLabel, readDetectedHeader, trackReject } from '$lib/uploadError';
    import { isNetworkError } from '$lib/chunkRecovery';
    import { portal } from '$lib/portal';
    import { formatPrice } from '$lib/currency';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.app';
    const WORKER_URL = env.PUBLIC_WORKER_URL || 'https://id.mochify.app';

    type FileProgress = {
        file: File;
        progress: number;
        phase: 'uploading' | 'processing' | 'downloading';
        status: 'pending' | 'processing' | 'complete' | 'error';
        error?: string;
        thumbnailUrl?: string;
    };

    const props = $props();
    let {
        types = '.JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF, .JXL',
        showTypes = true,
        output = 'jpg',
        class: className = '',
        queryParams = '',
        showExifOption = false,
        showSmartMode = false,
        showDayPass = false,
        // Stripping metadata is the safe default everywhere except the camera
        // pages: a photographer converting HIF wants ISO, shutter, lens and
        // copyright to survive the trip to JPEG. Those pages opt out, which does
        // mean GPS rides along too, so the Strip EXIF toggle is always shown
        // alongside it.
        stripExifDefault = true
    } = props;
    const hasOutputOverride = $derived('output' in props);

    let stripExif: boolean = $state(stripExifDefault);
    let smartCompress: boolean = $state(false);
    let isDragging: boolean = $state(false);

    // A file we accepted the type of but cannot convert on this plan. It still
    // gets a card in the tray — silently discarding the user's drop is what made
    // the size ceiling feel like a bug rather than a plan limit — but it is held
    // apart from selectedFiles so it never enters the upload pipeline.
    type BlockedFile = {
        file: File;
        size: number;
        thumbnailUrl?: string;
    };

    let selectedFiles: File[] = $state([]);
    let fileProgress: FileProgress[] = $state([]);
    let oversizedFiles: BlockedFile[] = $state([]);
    let imageType: string = $state(output);
    let isLoading: boolean = $state(false);
    // Hard rejections only: unsupported type, unreadable, or a failed run.
    // Batch truncation and oversize both have their own dedicated UI (the
    // batch-cap banner and the per-file error card), so neither lands here.
    let errorMessage: string = $state('');
    let successMessage: string = $state('');
    let totalOriginalSize: number = $state(0);
    let fileInputElement: HTMLInputElement;
    const CONCURRENT_UPLOADS = 1;

    // ---- Tier limits ------------------------------------------------------
    // Guest and Free share the per-batch and per-file ceilings; the only thing
    // an account buys is the monthly allowance (3 -> 25). Only a paid plan lifts
    // the batch and file-size caps, which is why the batch-cap upsell has to
    // offer Pro and cannot promise anything from signing up.
    const BATCH_LIMIT_STANDARD = 3;
    const BATCH_LIMIT_PAID = 25;
    const FILE_SIZE_LIMIT_STANDARD = 20 * 1024 * 1024;
    const FILE_SIZE_LIMIT_PAID = 75 * 1024 * 1024;
    // What $2 actually buys, in the unit the count walls are denominated in.
    // Named because the Day Pass has to be explained wherever it is offered:
    // "Day Pass" tells a first-time visitor nothing, "100 conversions in 24
    // hours" tells them whether it solves the problem in front of them.
    const DAY_PASS_OPS = 100;

    // Prices in cents, the unit Polar quotes. These are what everyone sees
    // unless Polar holds a price in the visitor's own currency: this component
    // renders on prerendered pages, so the country is only knowable after
    // hydration (see /api/prices).
    const DAY_PASS_USD = 200;
    const CHEAPEST_PAID_MONTHLY_USD = 799;

    type LocalPrices = { currency: string; prices: Record<string, number> };
    let localPrices = $state<LocalPrices | null>(null);
    let pricesRequested = false;

    const priceCurrency = $derived(localPrices?.currency ?? 'usd');
    const dayPassPrice = $derived(formatPrice(localPrices?.prices?.dayPass ?? DAY_PASS_USD, priceCurrency));
    const cheapestPlanPrice = $derived(
        formatPrice(localPrices?.prices?.sellerMonthly ?? CHEAPEST_PAID_MONTHLY_USD, priceCurrency)
    );

    // Deliberately lazy. Every price string below sits inside an upgrade wall,
    // a batch-cap banner or the file-too-large modal, none of which can appear
    // before the visitor hands us files — so fetching here keeps the price
    // ahead of the first wall while sparing the request on every landing-page
    // view. Failure is silent: USD is already on screen and stays.
    async function loadLocalPrices() {
        if (pricesRequested) return;
        pricesRequested = true;
        try {
            const res = await fetch('/api/prices');
            if (!res.ok) return;
            const body = (await res.json()) as { pricing: LocalPrices | null };
            if (body.pricing) localPrices = body.pricing;
        } catch {
            /* stay on USD */
        }
    }

    type UserTier = 'guest' | 'free' | 'pro';

    let plan: 'free' | 'seller' | 'pro' | 'day' | 'growth' = $state('free');
    let isAuthed: boolean = $state(false);
    let planQuota = $state(25); // monthly ops for an authenticated plan; guests get GUEST_QUOTA

    // The single tier value every limit and every string keys off.
    //
    // Plan is tested first: getPlan() only ever answers non-'free' for a caller
    // with a session, so a paid plan implies authentication even in the window
    // before getSessionToken() resolves — checking isAuthed first would briefly
    // demote a Pro user to guest limits on mount. isAuthed then separates guest
    // from free, which plan alone cannot do, since getPlan() answers 'free' for
    // signed-out callers too.
    const userTier: UserTier = $derived(plan !== 'free' ? 'pro' : isAuthed ? 'free' : 'guest');
    const batchLimit = $derived(userTier === 'pro' ? BATCH_LIMIT_PAID : BATCH_LIMIT_STANDARD);
    const maxFileSize = $derived(userTier === 'pro' ? FILE_SIZE_LIMIT_PAID : FILE_SIZE_LIMIT_STANDARD);
    const maxFileSizeMb = $derived(Math.round(maxFileSize / 1024 / 1024));
    const paidFileSizeMb = FILE_SIZE_LIMIT_PAID / 1024 / 1024;
    const monthlyQuota = $derived(userTier === 'guest' ? GUEST_QUOTA : planQuota);

    // Gates the usage badge. Both lookups are async and the initial state reads
    // as a guest, so rendering before they settle would flash "3 guest uploads
    // remaining this month" at a signed-in Pro user — on a funnel page, the one
    // number they'd be most annoyed to see misreported.
    let tierResolved: boolean = $state(false);

    $effect(() => {
        Promise.all([getPlan(), getSessionToken()]).then(([p, jwt]) => {
            plan = p;
            planQuota = p === 'pro' ? 1200 : p === 'seller' ? 300 : p === 'day' ? DAY_PASS_OPS : p === 'growth' ? 5000 : 25;
            isAuthed = !!jwt;
            tierResolved = true;
            // Signed-in only, deliberately. For someone with an account the
            // remaining count is a budget they already know they have, and
            // showing it on arrival is useful. For a guest it is a scarcity
            // number attached to a product they have not tried yet, which is
            // more likely to close the tab than to convert; their count is
            // fetched on first drop instead (see processFiles). It also keeps
            // the anonymous majority of landing-page traffic, bots and bounces
            // included, from costing a /v1/usage call per pageview.
            if (jwt) void checkTokenLimit();
        });
    });

    // What the last ingest staged versus what it was offered, when the batch cap
    // forced a trim. Held as a pair rather than a boolean so the banner can name
    // both numbers ("Staging 3 of 8"), and cleared by anything that invalidates
    // those numbers: a new ingest, a manual removal, or a reset.
    let batchTrim: { staged: number; offered: number } | null = $state(null);

    let showSignupCta = $state(false);
    let showUpgradeCta = $state(false);
    let shaking = $state(false);
    let showUsageHint = $state(false);

    const dayPassCheckoutUrl = $derived(
        (() => {
            if (!env.PUBLIC_POLAR_DAY_PASS_URL) return ''
            const u = new URL(page.url.href)
            u.searchParams.set('day_pass_success', '1')
            return `${env.PUBLIC_POLAR_DAY_PASS_URL}?successUrl=${encodeURIComponent(u.toString())}`
        })()
    )

    // Whether this page may offer the Day Pass at all: the host page has to opt
    // in AND the checkout URL has to be configured. Named once because every
    // upsell surface has to ask, and a surface that forgets either half either
    // hides a live offer or links to an empty checkout.
    const dayPassOffered = $derived(!!showDayPass && !!env.PUBLIC_POLAR_DAY_PASS_URL)

    let dayPassSuccess = $state(false)
    $effect(() => {
        if (page.url.searchParams.has('day_pass_success')) {
            dayPassSuccess = true
            const clean = new URL(page.url.href)
            clean.searchParams.delete('day_pass_success')
            history.replaceState({}, '', clean.toString())
        }
    })

    let processPhase: 'idle' | 'uploading' | 'processing' | 'downloading' = $state('idle');
    let uploadPercent: number = $state(0);
    let downloadPercent: number = $state(0);
    // True while a chunked upload is stalled in withRetry's backoff loop after
    // a network drop. Drives the amber "unstable connection" banner.
    let isRetrying: boolean = $state(false);

    // Monthly-allowance tracking. Seeded on mount for signed-in users and on
    // first drop for everyone else — see the tier effect above.
    let availableTokens: number = $state(0);
    let hasCheckedTokens: boolean = $state(false);

    function handleFileSelect() {
        if (!fileInputElement?.files?.length) return;
        const selected = Array.from(fileInputElement.files);
        fileInputElement.value = '';
        processFiles(selected);
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        isDragging = true;
        // Earliest possible signal that files are coming. Staging alone would
        // be late enough in the ordinary case, but a batch that trips the cap
        // on arrival renders its banner in the same tick as the drop.
        loadLocalPrices();
    }

    function handleDragLeave(event: DragEvent) {
        event.preventDefault();
        if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
            isDragging = false;
        }
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        isDragging = false;
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            processFiles(Array.from(event.dataTransfer.files));
        }
    }

    async function checkTokenLimit(): Promise<void> {
        try {
            const jwt = await getSessionToken();
            const response = await fetch(`${WORKER_URL}/v1/usage`, {
                headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
            });
            if (!response.ok) {
                throw new Error('Failed to check token limit');
            }
            const data = (await response.json()) as UsageResponse;
            availableTokens = resolveRemaining(data, !jwt);
            hasCheckedTokens = true;
        } catch (error) {
            console.error('Token check failed:', error);
            hasCheckedTokens = false;
        }
    }

    // Keep in sync with core's ImageValidator allowlist (utils/ImageValidator.h).
    // Anything accepted here that core rejects becomes a 415 the user can't
    // understand; anything core accepts that's missing here is silently
    // unreachable — which is how GIF sat unsupported despite decoding fine.
    const ACCEPTED_MIME_TYPES = new Set([
        'image/jpeg',
        'image/heic',
        'image/heif',
        'image/avif',
        'image/png',
        'image/jxl',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ]);
    const ACCEPTED_EXTENSIONS = new Set([
        'jpg',
        'jpeg',
        'heic',
        'heif',
        'hif',
        'avif',
        'png',
        'jxl',
        'webp',
        'gif',
        'svg'
    ]);

    const OUTPUT_FORMAT_MAP: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/avif': 'avif',
        'image/jxl': 'jxl'
    };

    function detectOutputFormat(file: File): string {
        if (OUTPUT_FORMAT_MAP[file.type]) return OUTPUT_FORMAT_MAP[file.type];
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        return OUTPUT_FORMAT_MAP[`image/${ext}`] ?? (ext === 'jpg' || ext === 'jpeg' ? 'jpg' : 'jpg');
    }

    // HEIC/HEIF/HIF are camera container formats that no mainstream browser can
    // decode, so a blob-URL <img> for them renders as a broken thumbnail. Skip the
    // object URL entirely and let the placeholder icon show instead. Other formats
    // (e.g. JXL, which only Safari renders) are caught by the <img> onerror fallback.
    const UNPREVIEWABLE_EXTENSIONS = new Set(['heic', 'heif', 'hif']);
    const UNPREVIEWABLE_MIME = new Set(['image/heic', 'image/heif']);
    function isUnpreviewableImage(file: File): boolean {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        return UNPREVIEWABLE_MIME.has(file.type) || UNPREVIEWABLE_EXTENSIONS.has(ext);
    }

    async function processFiles(allFiles: File[]) {
        // Await both before applying any limit, so paid-user ceilings (25 files,
        // 75MB) are in force immediately rather than after files have already
        // been sliced to standard-tier defaults. userTier/batchLimit/maxFileSize
        // are derived, so they re-read correctly the moment these land.
        const [resolvedPlan, resolvedJwt] = await Promise.all([getPlan(), getSessionToken()]);
        plan = resolvedPlan;
        isAuthed = !!resolvedJwt;

        // A fresh ingest supersedes the previous one's trim notice.
        batchTrim = null;

        // Rejections raised by THIS ingest, committed in one place at the end.
        // They used to be written straight to errorMessage and read back later,
        // which meant a clean drop re-committed the previous drop's message: add a
        // .txt, then add a valid photo, and "1 file(s) not supported" stayed up
        // over a batch that was fine. One ingest now produces exactly one banner
        // state, and every exit path goes through commitIngestNotices.
        const rejections: string[] = [];

        function commitIngestNotices() {
            errorMessage = rejections.join(' ');
            successMessage = '';
        }

        const invalidFiles = allFiles.filter((f) => {
            const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
            return !ACCEPTED_MIME_TYPES.has(f.type) && !ACCEPTED_EXTENSIONS.has(ext);
        });
        if (invalidFiles.length > 0) {
            rejections.push(`${invalidFiles.length} file(s) not supported. Accepted: JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF, JXL, SVG.`);
            allFiles = allFiles.filter((f) => {
                const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
                return ACCEPTED_MIME_TYPES.has(f.type) || ACCEPTED_EXTENSIONS.has(ext);
            });
            if (allFiles.length === 0) {
                commitIngestNotices();
                return;
            }
        }

        // Resolve true sizes before the guard: files picked from cloud providers
        // can misreport size===0, which would otherwise slip past this check and
        // the chunk routing below. resolveUploadSize measures real bytes when
        // needed (and caches them so the upload sends real content).
        const resolved = await Promise.all(
            allFiles.map(async (f) => ({ file: f, size: await resolveUploadSize(f, maxFileSize) }))
        );
        // Files we can't read at all (size===0 and the stream gave us nothing):
        // no upload path can succeed, so drop them up front with a clear reason
        // rather than letting them fail as a confusing server error.
        const unreadable = resolved.filter((r) => r.size.unreadable);
        const oversized = resolved.filter((r) => !r.size.unreadable && r.size.exceededLimit);

        if (unreadable.length > 0 || oversized.length > 0) {
            // Oversize is a plan limit, not a rejection: the file stays visible as
            // its own card carrying the ceiling it broke and the upgrade that
            // clears it. It never joins selectedFiles, so it cannot be uploaded.
            if (oversized.length > 0) {
                const alreadyBlocked = new Set(oversizedFiles.map((b) => `${b.file.name}-${b.file.size}`));
                const newlyBlocked = oversized
                    .filter((r) => !alreadyBlocked.has(`${r.file.name}-${r.file.size}`))
                    .map((r) => ({
                        file: r.file,
                        size: r.size.size,
                        thumbnailUrl: isUnpreviewableImage(r.file) ? undefined : URL.createObjectURL(r.file)
                    }));
                // Capped like the staging tray: a drop of fifty large files should
                // make the point, not fill the card with identical error rows. The
                // ones past the cap are revoked immediately rather than leaked.
                const room = Math.max(0, batchLimit - oversizedFiles.length);
                newlyBlocked.slice(room).forEach((b) => {
                    if (b.thumbnailUrl) URL.revokeObjectURL(b.thumbnailUrl);
                });
                oversizedFiles = [...oversizedFiles, ...newlyBlocked.slice(0, room)];
                posthog.capture('file_size_blocked', {
                    files: oversized.length,
                    limit_mb: maxFileSizeMb,
                    tier: userTier
                });
            }
            if (unreadable.length > 0) {
                rejections.push(`${unreadable.length} file${unreadable.length !== 1 ? 's' : ''} couldn't be read and ${unreadable.length === 1 ? 'was' : 'were'} skipped. If it's stored in iCloud or a cloud drive, open the original to download it first, then try again.`);
            }
            allFiles = resolved.filter((r) => !r.size.unreadable && !r.size.exceededLimit).map((r) => r.file);
            if (allFiles.length === 0) {
                commitIngestNotices();
                return;
            }
        }

        const existingFileKeys = new Set(selectedFiles.map((f) => `${f.name}-${f.size}`));
        const newFiles = allFiles.filter((f) => !existingFileKeys.has(`${f.name}-${f.size}`));

        // Everything that could be staged if there were no cap, then what the cap
        // actually allows. The banner reports both numbers, so they're named here
        // rather than recovered from lengths further down.
        const eligibleFiles = [...selectedFiles, ...newFiles];
        const combinedFiles = eligibleFiles.slice(0, batchLimit);
        const addedCount = combinedFiles.length - selectedFiles.length;
        const droppedByCap = eligibleFiles.length - combinedFiles.length;

        if (!hasOutputOverride && selectedFiles.length === 0 && newFiles.length > 0) {
            imageType = detectOutputFormat(newFiles[0]);
        }

        selectedFiles = combinedFiles;
        fileProgress = combinedFiles.map((file) => {
            const existing = fileProgress.find((fp) => fp.file === file);
            if (existing) return existing;
            return {
                file,
                progress: 0,
                phase: 'uploading' as const,
                status: 'pending' as const,
                thumbnailUrl: isUnpreviewableImage(file) ? undefined : URL.createObjectURL(file)
            };
        });
        totalOriginalSize = combinedFiles.reduce((sum, file) => sum + file.size, 0);

        // A cap trim is not a rejection — the files are legal, there are just too
        // many for this tier — so it gets its own banner with the upsell rather
        // than the red error slot. Rejections raised earlier in this ingest still
        // go to the error banner, because they name files that are not in the
        // tray at all: the one outcome a user cannot diagnose from what's on
        // screen in front of them.
        if (addedCount === 0 && newFiles.length === 0) {
            rejections.push('All selected files are already in the list.');
        } else if (droppedByCap > 0) {
            batchTrim = { staged: combinedFiles.length, offered: eligibleFiles.length };
            posthog.capture('batch_cap_trimmed', {
                cap: batchLimit,
                dropped: droppedByCap,
                tier: userTier
            });
        }
        commitIngestNotices();

        // Deliberately after truncation: sufficiency is judged against what is
        // actually staged (capped at batchLimit), never the raw dropped count, so
        // a 5-file drop on a 3-file plan asks for 3 operations and not 5.
        await checkTokenLimit();
    }

    // Formats a magnitude, signed. Math.log of a negative is NaN, which used to
    // cascade into `sizes[NaN]` and render the string "NaN undefined" whenever a
    // caller passed a negative size delta. Callers now pass magnitudes, but the
    // guard stays because a silent NaN here surfaces as user-facing copy.
    function formatFileSize(bytes: number): string {
        if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
        const sign = bytes < 0 ? '-' : '';
        const abs = Math.abs(bytes);
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        // Clamped so anything past GB keeps a unit instead of indexing off the end.
        const i = Math.min(Math.floor(Math.log(abs) / Math.log(k)), sizes.length - 1);
        return sign + Math.round((abs / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    $effect(() => {
        if (hasOutputOverride) {
            imageType = output;
        }
    });

    const stagedCount = $derived(selectedFiles.length);

    // Uploads left in the current calendar month. Falls back to the tier's full
    // quota on first visit, before the bucket is seeded (availableTokens = Infinity).
    const monthlyUploadsRemaining = $derived(
        Number.isFinite(availableTokens) ? availableTokens : monthlyQuota
    );

    // Usage copy is tier-specific because the number means something different in
    // each case: a guest's 3 is an anonymous allowance tied to their IP, a free
    // account's 25 is a quota they own, and a paid quota is large enough that the
    // fraction matters more than the remainder.
    const usageLabel = $derived(
        userTier === 'guest'
            ? `${monthlyUploadsRemaining} guest upload${monthlyUploadsRemaining !== 1 ? 's' : ''} remaining this month`
            : userTier === 'free'
              ? `${monthlyUploadsRemaining} / ${monthlyQuota} free monthly uploads left`
              : `${monthlyUploadsRemaining} / ${monthlyQuota} monthly uploads left`
    );

    // The two limits are routinely confused with each other — users read "3" on
    // the badge and assume it is the batch cap, or trim to 3 and expect the
    // monthly count to stop falling. Say which is which, in the same breath.
    const usageHint = $derived(
        `${userTier === 'guest' ? 'Guest uploads are counted per month against your IP address and reset' : 'Your monthly allowance resets'} on the 1st. Separately, you can stage up to ${batchLimit} files (${maxFileSizeMb}MB each) in one go. That is a per-batch cap, not a monthly one, so you can run batch after batch until the monthly total runs out.`
    );

    // Applies to signed-in users too. This used to be guest-only, which meant an
    // account holder out of operations got no warning at all: they filled a
    // batch, waited out the upload, and took a 429 from the server. Telling them
    // before the upload is strictly better, and it is the same check either way.
    //
    // Safe against false positives by construction: an unseeded bucket resolves
    // to Infinity (see checkTokenLimit) so Number.isFinite screens it out, and a
    // failed check leaves hasCheckedTokens false, which fails open.
    const insufficientTokens = $derived(
        hasCheckedTokens &&
            stagedCount > 0 &&
            Number.isFinite(availableTokens) &&
            stagedCount > availableTokens
    );

    // How many staged files the remaining tokens can actually cover. Only
    // meaningful while insufficientTokens holds, which already guarantees a
    // finite count strictly below stagedCount.
    const trimTarget = $derived(Number.isFinite(availableTokens) ? Math.max(0, availableTokens) : 0);

    // Secondary action on the token wall: drop the overflow instead of paying.
    // Revokes the thumbnails it discards, matching removeFile — a trim that
    // leaked object URLs would be a slow bleed on exactly the users who trim
    // repeatedly rather than convert.
    function trimToAvailable() {
        if (!Number.isFinite(availableTokens)) return;
        if (selectedFiles.length <= trimTarget) return;
        fileProgress.slice(trimTarget).forEach((fp) => {
            if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
        });
        selectedFiles = selectedFiles.slice(0, trimTarget);
        fileProgress = fileProgress.slice(0, trimTarget);
        totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        posthog.capture('token_wall_trimmed', { kept: trimTarget, tier: userTier });
    }

    // Drop one blocked card. Kept separate from removeFile because the two lists
    // are separate: nothing here indexes into fileProgress.
    function removeOversized(index: number) {
        const blocked = oversizedFiles[index];
        if (blocked?.thumbnailUrl) URL.revokeObjectURL(blocked.thumbnailUrl);
        oversizedFiles = oversizedFiles.filter((_, i) => i !== index);
    }

    const hasOversized = $derived(oversizedFiles.length > 0);

    // Backstop for the paths that never fire a dragover: the file picker, and
    // files handed over by a parent surface.
    $effect(() => {
        if (stagedCount > 0 || hasOversized) loadLocalPrices();
    });

    // Everything the user handed us was oversized — there is nothing to convert,
    // so the CTA becomes the upgrade that would make the batch convertible.
    const blockedByFileSize = $derived(hasOversized && stagedCount === 0);

    // The CTA states the outcome and the format, and recounts as thumbnails are
    // removed. 'jpeg' is normalised to JPG so the button matches the extension
    // the user actually receives.
    const outputLabel = $derived((imageType === 'jpeg' ? 'jpg' : imageType).toUpperCase());
    const convertLabel = $derived(
        `Convert ${stagedCount} image${stagedCount !== 1 ? 's' : ''} to ${outputLabel}`
    );

    // ---- Banner state -----------------------------------------------------
    // Everything below derives from staged files and the token count. Nothing
    // here is assigned imperatively, so no banner can outlive the state that
    // produced it: remove a file and the whole chain re-evaluates.

    type Banner =
        | { kind: 'error'; text: string }
        | { kind: 'tokens-short' }
        | { kind: 'batch-cap' }
        | { kind: 'limits-ok' }
        | null;

    // One banner at a time, picked by severity. Oversize no longer competes for
    // this slot — it renders per-file, on the card that broke the limit, which is
    // the only place that can name the offending file without listing names.
    //
    // Order: a rejection (nothing we can do with those bytes) outranks the
    // monthly wall (you cannot convert what is staged), which outranks the batch
    // trim (you can convert what is staged, just not all of it at once), which
    // outranks the all-clear.
    const activeBanner: Banner = $derived(
        errorMessage
            ? { kind: 'error', text: errorMessage }
            : insufficientTokens
              ? { kind: 'tokens-short' }
              : batchTrim
                ? { kind: 'batch-cap' }
                : hasCheckedTokens && stagedCount > 0 && monthlyUploadsRemaining > 0
                  ? { kind: 'limits-ok' }
                  : null
    );

    function handleButtonClick() {
        if (isLoading) return;

        if (blockedByFileSize) {
            if (!isAuthed && dayPassOffered) {
                posthog.capture('day_pass_cta_clicked', { trigger: 'button_click_file_size' });
                window.open(dayPassCheckoutUrl, '_blank', 'noopener,noreferrer');
            } else if (!isAuthed) {
                showSignupCta = true;
                posthog.capture('signup_cta_shown', { trigger: 'button_click_file_size' });
            } else {
                showUpgradeCta = true;
                posthog.capture('upgrade_cta_shown', { trigger: 'button_click_file_size' });
            }
            return;
        }

        // Shake only if they literally haven't added files
        if (selectedFiles.length === 0) {
            shaking = true;
            setTimeout(() => (shaking = false), 400);
            return;
        }

        // Intercept the click when they lack the operations for this batch.
        // Signing up is not a fix for someone already signed in, so send them to
        // the upgrade path instead.
        //
        // Guests go straight to registration rather than through the signup
        // modal: the banner directly above this button already states both
        // offers in full, so the dialog would restate the choice the user just
        // made and charge them a second click for it. The modal still serves
        // its other callers (a 429, and the race guard in compressImage for a
        // click that beats the token check).
        if (insufficientTokens) {
            if (isAuthed) {
                showUpgradeCta = true;
                posthog.capture('upgrade_cta_shown', { trigger: 'button_click_no_tokens' });
            } else {
                posthog.capture('signup_cta_clicked', { trigger: 'button_click_no_tokens' });
                void goto('/auth/register');
            }
            return;
        }

        compressImage();
    }

    function resolveContentType(file: File): string {
        if (file.type) return file.type;
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const MIME_BY_EXT: Record<string, string> = {
            heic: 'image/heic', heif: 'image/heif', hif: 'image/heif',
            jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
            webp: 'image/webp', avif: 'image/avif', jxl: 'image/jxl',
            gif: 'image/gif', svg: 'image/svg+xml'
        };
        return MIME_BY_EXT[ext] ?? 'application/octet-stream';
    }

    async function compressImage() {
        // Hard re-entrancy guard. handleButtonClick already checks isLoading, but
        // the button was only aria-disabled (still clickable) and isLoading used to
        // latch late — after the awaits below — leaving a window where a second
        // activation started an overlapping run that rebuilt fileProgress mid-flight
        // and wiped the first run's completions (surfaced as "All files failed to
        // convert" on uploads that actually succeeded).
        if (isLoading) return;
        if (selectedFiles.length === 0) {
            errorMessage = 'Please select at least one image';
            return;
        }

        // Latch before any await so no second activation can slip through the gap.
        // Cleared in the finally below and on the guest-quota early-return path.
        isLoading = true;

        const jwt = await getSessionToken();
        const uploadPlan = await getPlan();

        // Guest-quota race guard: the token check is async, and a fast click can
        // beat it — falling straight through handleButtonClick's insufficientTokens
        // gate (which needs hasCheckedTokens) and firing an upload the server only
        // rejects. Resolve the check here so an out-of-quota guest bails cleanly to
        // the signup CTA instead of sending a doomed upload (which surfaced as a
        // spurious "Network error").
        if (!jwt) {
            if (!hasCheckedTokens) await checkTokenLimit();
            if (Number.isFinite(availableTokens) && selectedFiles.length > availableTokens) {
                showSignupCta = true;
                posthog.capture('signup_cta_shown', { trigger: 'button_click_no_tokens' });
                isLoading = false;
                return;
            }
        }

        posthog.capture('manual_compress_started', {
            files: selectedFiles.length,
            format: imageType,
            authed: !!jwt
        });

        errorMessage = '';
        successMessage = '';
        batchTrim = null;
        processPhase = 'uploading';
        uploadPercent = 0;
        downloadPercent = 0;
        isRetrying = false;

        fileProgress = selectedFiles.map((file) => ({
            file,
            progress: 0,
            phase: 'uploading' as const,
            status: 'pending' as const,
            thumbnailUrl: fileProgress.find((fp) => fp.file === file)?.thumbnailUrl
        }));

        try {
            let totalCompressedSize = 0;
            const compressedBlobs: Blob[] = new Array(selectedFiles.length);
            let hitRateLimit = false;
            const totalBytes = selectedFiles.reduce((sum, f) => sum + effectiveSize(f), 0);
            let uploadedBytes = 0;

            const processFile = async (index: number) => {
                const file = selectedFiles[index];
                fileProgress[index].status = 'processing';

                try {
                    const ALLOWED_FORMATS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'jxl']);
                    const safeType = ALLOWED_FORMATS.has(imageType) ? imageType : 'jpg';

                    let blob: Blob;
                    if (effectiveSize(file) > CHUNK_THRESHOLD_BYTES) {
                        // Large file on a possibly-flaky connection: upload in
                        // ~5MB chunks (each independently retried) instead of
                        // one whole-file POST. See src/lib/uploadChunked.ts.
                        let lastLoaded = 0;
                        const chunkedParams: ChunkedUploadParams = { type: safeType, stripExif: stripExif ? '1' : '0' };
                        if (smartCompress) chunkedParams.smartCompress = '1';
                        if (queryParams) new URLSearchParams(queryParams).forEach((v, k) => (chunkedParams[k] = v));

                        blob = await uploadChunked(uploadBodyOf(file), API_URL, chunkedParams, {
                            jwt,
                            onUploadProgress: (loaded) => {
                                const delta = loaded - lastLoaded;
                                lastLoaded = loaded;
                                uploadedBytes += delta;
                                uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                            },
                            onPhaseChange: (phase) => {
                                processPhase = phase;
                                if (phase === 'downloading') downloadPercent = 0;
                            },
                            onDownloadProgress: (loaded, total) => {
                                downloadPercent = Math.round((loaded / total) * 100);
                            },
                            onRetryStateChange: (retrying) => {
                                isRetrying = retrying;
                            }
                        });
                    } else {
                        blob = await withRetry(
                            () =>
                                new Promise<Blob>((resolve, reject) => {
                                    const xhr = new XMLHttpRequest();
                                    let lastLoaded = 0;
                                    // Undo this attempt's contribution to the shared batch counter so
                                    // a retried upload doesn't double-count.
                                    const rollback = () => {
                                        uploadedBytes -= lastLoaded;
                                        lastLoaded = 0;
                                        uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                                    };

                                    xhr.upload.addEventListener('progress', (e) => {
                                        const delta = e.loaded - lastLoaded;
                                        lastLoaded = e.loaded;
                                        uploadedBytes += delta;
                                        processPhase = 'uploading';
                                        uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                                    });

                                    xhr.upload.addEventListener('load', () => {
                                        uploadedBytes += effectiveSize(file) - lastLoaded;
                                        lastLoaded = effectiveSize(file);
                                        uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                                        processPhase = 'processing';
                                        downloadPercent = 0;
                                    });

                                    xhr.addEventListener('progress', (e) => {
                                        processPhase = 'downloading';
                                        if (e.lengthComputable) {
                                            downloadPercent = Math.round((e.loaded / e.total) * 100);
                                        }
                                    });

                                    xhr.addEventListener('load', () => {
                                        if (xhr.status >= 200 && xhr.status < 300) {
                                            resolve(xhr.response);
                                        } else {
                                            rollback();
                                            // Surface the server's own message (e.g. the plan-specific
                                            // 413 text) instead of a bare "Server error: 413", and log
                                            // the reported-vs-resolved size so we can confirm whether a
                                            // misreported cloud-file size drove the oversize upload.
                                            void (async () => {
                                                const serverText = await readXhrErrorText(xhr);
                                                const rejectLabel = readRejectLabel(xhr);
                                                if (xhr.status === 413) {
                                                    trackUpload413({
                                                        reportedSize: file.size,
                                                        resolvedSize: effectiveSize(file),
                                                        plan: uploadPlan
                                                    });
                                                }
                                                // Pipeline-classified rejections (corrupt-image, jpeg-missing-dht,
                                                // engine-error) carry a label; capture the field rate per class.
                                                // `detected` carries the server's header-bytes diagnostic, which is
                                                // the only way to tell WHICH file type an unsupported-format 415 was
                                                // — core decides that from magic bytes before any decoder runs, so
                                                // there is nothing else downstream to inspect.
                                                if (rejectLabel) {
                                                    trackReject({
                                                        label: rejectLabel,
                                                        status: xhr.status,
                                                        source: 'squish',
                                                        plan: uploadPlan,
                                                        detected: readDetectedHeader(xhr)
                                                    });
                                                }
                                                const error: any = new Error(uploadErrorMessage(xhr.status, serverText, rejectLabel));
                                                error.status = xhr.status;
                                                reject(error);
                                            })();
                                        }
                                    });

                                    xhr.addEventListener('error', () => {
                                        rollback();
                                        const error: any = new Error('Network error');
                                        error.retryable = true;
                                        reject(error);
                                    });
                                    xhr.addEventListener('abort', () => {
                                        rollback();
                                        reject(new Error('Upload cancelled'));
                                    });

                                    const squishParams = new URLSearchParams({ type: safeType, stripExif: stripExif ? '1' : '0' });
                                    if (smartCompress) squishParams.append('smartCompress', '1');
                                    if (queryParams) new URLSearchParams(queryParams).forEach((v, k) => squishParams.append(k, v));
                                    xhr.open('POST', `${API_URL}/v1/squish?${squishParams}`);
                                    xhr.setRequestHeader('Content-Type', resolveContentType(file));
                                    if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                                    xhr.responseType = 'blob';
                                    xhr.send(uploadBodyOf(file));
                                }),
                            'manual_squish'
                        );
                    }

                    compressedBlobs[index] = blob;
                    totalCompressedSize += blob.size;
                    fileProgress[index].status = 'complete';
                } catch (error: any) {
                    fileProgress[index].status = 'error';
                    if (error.status === 429) {
                        hitRateLimit = true;
                        fileProgress[index].error = 'Rate limit exceeded';
                        if (!jwt) {
                            showSignupCta = true;
                            posthog.capture('signup_cta_shown', { trigger: 'rate_limit' });
                        } else {
                            showUpgradeCta = true;
                            posthog.capture('upgrade_cta_shown', { trigger: 'rate_limit' });
                        }
                    } else {
                        fileProgress[index].error = error instanceof Error ? error.message : 'Unknown error';
                    }
                }
            };

            batchLoop: for (let i = 0; i < selectedFiles.length; i += CONCURRENT_UPLOADS) {
                const batch = [];
                for (let j = i; j < Math.min(i + CONCURRENT_UPLOADS, selectedFiles.length); j++) {
                    batch.push(processFile(j));
                }
                await Promise.allSettled(batch);
                if (hitRateLimit) break batchLoop;
            }

            const successfulFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'complete');
            const failedFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'error');

            if (successfulFiles.length === 0) {
                if (hitRateLimit) {
                    fileProgress.forEach((fp) => {
                        if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
                    });
                    selectedFiles = [];
                    fileProgress = [];
                    return;
                }
                // Diagnostic: this throw fires only when nothing is marked complete
                // AND nothing carries an error — i.e. the per-file result writes went
                // missing. Capture the state so an occurrence tells us whether the
                // blobs actually came back (uploads succeeded but results were wiped)
                // vs a genuine all-fail. Remove once the "All files failed" reports stop.
                posthog.capture('manual_compress_all_failed_debug', {
                    statuses: fileProgress.map((fp) => fp.status),
                    blobSizes: compressedBlobs.map((b) => b?.size ?? null),
                    selected: selectedFiles.length,
                    hitRateLimit
                });
                const firstError = fileProgress.find((fp) => fp.error)?.error;
                throw new Error(firstError ?? 'All files failed to convert');
            }

            if (successfulFiles.length === 1) {
                const index = selectedFiles.findIndex((_, i) => fileProgress[i].status === 'complete');
                const nameWithoutExt = successfulFiles[0].name.replace(/\.[^/.]+$/, '');
                const extension = imageType === 'jpeg' ? 'jpg' : imageType;
                downloadBlob(compressedBlobs[index], `${nameWithoutExt}.${extension}`);
            } else {
                const zipData: Record<string, Uint8Array> = {};
                await Promise.all(
                    selectedFiles.map(async (file, i) => {
                        if (fileProgress[i].status !== 'complete') return;
                        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                        const extension = imageType === 'jpeg' ? 'jpg' : imageType;
                        const buffer = await compressedBlobs[i].arrayBuffer();
                        zipData[`${nameWithoutExt}.${extension}`] = new Uint8Array(buffer);
                    })
                );

                const zipContent = await new Promise<Uint8Array>((resolve, reject) => {
                    zip(zipData, { level: 0 }, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                downloadBlob(
                    new Blob([zipContent.buffer as ArrayBuffer], { type: 'application/zip' }),
                    'compressed-images.zip'
                );
            }

            // Compare against the successful files' original sizes only, so failed
            // files don't inflate the reported savings.
            const successfulOriginalSize = successfulFiles.reduce((sum, f) => sum + f.size, 0);

            // Output is not always smaller, and when it isn't that is usually the
            // point rather than a failure: hdr=generate attaches a gain map, a
            // resize can scale up, and PNG output from a photographic source grows
            // almost every time. So the delta is signed (positive = saved) and the
            // copy below is picked off its sign. Reporting it plainly beats hiding
            // the box, which would leave a successful conversion with no
            // confirmation that anything happened at all.
            const delta = successfulOriginalSize - totalCompressedSize;
            const grew = delta < 0;
            // Guarded: successfulFiles can only be empty on paths that don't reach
            // here, but a 0 denominator would put Infinity into the copy.
            const changePct = successfulOriginalSize
                ? Math.abs((delta / successfulOriginalSize) * 100).toFixed(1)
                : '0.0';
            const deltaSize = formatFileSize(Math.abs(delta));
            const finalSize = formatFileSize(totalCompressedSize);

            if (hitRateLimit) {
                const pendingFiles = fileProgress.filter((fp) => fp.status === 'pending').length;
                posthog.capture('manual_compress_rate_limited', {
                    files: successfulFiles.length,
                    format: imageType
                });
                successMessage = `Rate limit reached! Downloaded ${successfulFiles.length} successful conversion(s). ${pendingFiles} file(s) remain.`;
            } else if (failedFiles.length > 0) {
                posthog.capture('manual_compress_completed', {
                    files: successfulFiles.length,
                    failed: failedFiles.length,
                    format: imageType
                });
                successMessage = `${successfulFiles.length} of ${selectedFiles.length} squished. ${grew ? `Now ${finalSize}.` : `Saved ${deltaSize}.`} ${failedFiles.length} failed.`;
            } else {
                posthog.capture('manual_compress_completed', {
                    files: successfulFiles.length,
                    // Signed, so growth stays visible in analytics rather than being
                    // flattened to a positive "reduction".
                    reduction: parseFloat(
                        successfulOriginalSize
                            ? ((delta / successfulOriginalSize) * 100).toFixed(1)
                            : '0.0'
                    ),
                    format: imageType,
                    space_saved_bytes: totalOriginalSize - totalCompressedSize
                });
                const single = selectedFiles.length === 1;
                if (delta === 0) {
                    successMessage = single
                        ? `Done! Size unchanged (${finalSize}).`
                        : `Done! ${selectedFiles.length} images processed. ${finalSize} total, size unchanged.`;
                } else if (grew) {
                    // "processed" rather than "optimised": the file got bigger, and
                    // claiming otherwise next to a larger number reads as a bug.
                    successMessage = single
                        ? `Done! Your image is now ${finalSize} (${changePct}% larger).`
                        : `Done! ${selectedFiles.length} images processed. ${finalSize} total (${changePct}% larger).`;
                } else {
                    successMessage = single
                        ? `Squished! Saved ${deltaSize} (${changePct}% smaller).`
                        : `Done! ${selectedFiles.length} images optimised. Saved ${deltaSize} total.`;
                }
            }

            if (hitRateLimit) {
                fileProgress.forEach((fp) => {
                    if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
                });
                selectedFiles = [];
                fileProgress = [];
            } else {
                // Only revoke thumbnails for entries being removed — failed/pending
                // files stay in the list and still need theirs.
                fileProgress.forEach((fp) => {
                    if (fp.status === 'complete' && fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
                });
                selectedFiles = selectedFiles.filter((_, i) => fileProgress[i].status !== 'complete');
                fileProgress = fileProgress.filter((fp) => fp.status !== 'complete');
            }
            totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

            if (fileInputElement) fileInputElement.value = '';
            await checkTokenLimit();
        } catch (error) {
            posthog.capture('manual_compress_failed', {
                error: error instanceof Error ? error.message : String(error)
            });
            // An interrupted/offline fetch (Safari's "Load failed") is an expected
            // network condition, not a code bug — the breadcrumb above and the
            // error message below cover it; don't report it as an exception.
            if (!isNetworkError(error)) posthog.captureException(error);
            errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
        } finally {
            isLoading = false;
            processPhase = 'idle';
            isRetrying = false;
        }
    }

    function downloadBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        if (!filename.includes('.')) {
            const extension = imageType === 'jpeg' ? 'jpg' : imageType;
            a.download = `${filename}.${extension}`;
        } else {
            a.download = filename;
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function resetForm() {
        fileProgress.forEach((fp) => {
            if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
        });
        oversizedFiles.forEach((b) => {
            if (b.thumbnailUrl) URL.revokeObjectURL(b.thumbnailUrl);
        });
        selectedFiles = [];
        fileProgress = [];
        oversizedFiles = [];
        totalOriginalSize = 0;
        errorMessage = '';
        batchTrim = null;
        successMessage = '';
        imageType = output;
        if (fileInputElement) fileInputElement.value = '';
    }

    function removeFile(index: number) {
        if (fileProgress[index].thumbnailUrl) {
            URL.revokeObjectURL(fileProgress[index].thumbnailUrl!);
        }
        selectedFiles = selectedFiles.filter((_, i) => i !== index);
        fileProgress = fileProgress.filter((_, i) => i !== index);
        totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

        // The trim notice names a staged count that this removal has just made
        // wrong ("Staging 3 of 8" over a tray of two), so it goes. Everything
        // else re-evaluates on its own: insufficientTokens and the CTA counter
        // both derive from stagedCount, and skip notices refer to files that
        // never entered the tray at all.
        batchTrim = null;
    }

    const formats = [
        { value: 'jpg', label: 'JPEG' },
        { value: 'png', label: 'PNG' },
        { value: 'webp', label: 'WebP' },
        { value: 'avif', label: 'AVIF' },
        { value: 'jxl', label: 'JXL' }
    ];
</script>

<div
    class={`relative w-full overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 ${isDragging ? 'border-[#F06292] ring-2 ring-[#F06292]/25' : 'border-pink-50'} ${className}`.trim()}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="region"
    aria-label="Upload images"
>
    <!-- Hidden file input -->
    <input
        bind:this={fileInputElement}
        id="file-input"
        type="file"
        accept=".jpg,.jpeg,.heic,.heif,.hif,.avif,.png,.jxl,.webp,.gif,.svg,image/jpeg,image/heic,image/heif,image/avif,image/png,image/jxl,image/webp,image/gif,image/svg+xml"
        multiple
        onchange={handleFileSelect}
        class="sr-only"
    />

    <!-- Drag overlay -->
    {#if isDragging}
        <div
            class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[2rem] bg-white/40 backdrop-blur-md"
        >
            <div
                class="mb-3 flex h-14 w-14 animate-bounce items-center justify-center rounded-2xl bg-white/90 shadow-xl shadow-pink-200/50"
            >
                <svg
                    class="h-6 w-6 text-[#F06292]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                </svg>
            </div>
            <p class="text-lg font-bold tracking-tight text-[#4A2C2C] drop-shadow-md">
                Drop it like it's hot
            </p>
        </div>
    {/if}

    <!-- Remaining-uploads badge. Sits above the dropzone rather than in the footer
         so it reads as a property of the tool and not a footnote on the run. The
         hint carries the distinction the number alone cannot: monthly total vs
         per-batch cap.

         Shown on arrival to signed-in users, and only once files are staged to
         guests: a guest who has not tried the converter yet is the one visitor a
         scarcity count is most likely to lose. By the time they have committed
         files, the same number is answering a question they are actually asking. -->
    {#if hasCheckedTokens && tierResolved && (isAuthed || stagedCount > 0)}
        <div class="flex items-center gap-2 border-b border-pink-50 bg-[#FDFBF7] px-4 py-2 sm:px-6">
            <span
                class="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#6C3F31] shadow-[0_0_0_1px_rgba(135,95,66,0.12)]"
            >
                <span
                    class="h-1.5 w-1.5 rounded-full {monthlyUploadsRemaining > 0
                        ? 'bg-[#66BB6A]'
                        : 'bg-[#EF5350]'}"
                ></span>
                {usageLabel}
            </span>

            <div class="relative flex items-center">
                <button
                    type="button"
                    onclick={() => (showUsageHint = !showUsageHint)}
                    onblur={() => (showUsageHint = false)}
                    aria-expanded={showUsageHint}
                    aria-label="How the upload limits work"
                    class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#875F42]/50 transition-colors hover:bg-white hover:text-[#F06292]"
                >
                    <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>

                {#if showUsageHint}
                    <div
                        class="absolute top-full left-0 z-30 mt-2 w-64 rounded-2xl border border-pink-100 bg-white p-3 text-xs leading-relaxed font-medium text-[#6C3F31] shadow-[0_8px_24px_rgba(74,44,44,0.14)]"
                        role="tooltip"
                    >
                        {usageHint}
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    {#if dayPassSuccess}
        <div class="m-4 sm:m-6 flex items-start gap-3 rounded-2xl border border-[#F06292]/20 bg-[#FFF5F7] px-4 py-4">
            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F06292]/10">
                <svg class="h-4 w-4 text-[#F06292]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-black text-[#4A2C2C]">Payment received — check your email</p>
                <p class="mt-0.5 text-xs text-[#6C3F31]/70">We've sent a magic link to activate your Day Pass. Click it to unlock 100 image ops for 24 hours.</p>
            </div>
            <button onclick={() => (dayPassSuccess = false)} aria-label="Dismiss" class="flex-shrink-0 text-[#875F42]/40 hover:text-[#875F42] transition-colors">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    {/if}

    <!-- The thumbnails and empty-state blocks both stay mounted and toggle via CSS
         (not {#if}/{:else}). With a conditional swap, the <label for="file-input">
         that opens the picker unmounts the instant the first file lands, and iOS
         Safari drops that first selection — you'd have to pick again. Keeping both
         <label> triggers permanently mounted (as PromptForm does) fixes it. -->
    <div
        class="relative flex flex-wrap items-center gap-3 px-4 pt-6 pb-3 sm:px-6"
        class:hidden={selectedFiles.length === 0}
    >
            {#each fileProgress as fp, index}
                <div class="group relative flex-shrink-0">
                    <div class="h-16 w-16 overflow-hidden rounded-2xl border border-pink-100 bg-[#FDFBF7] p-1">
                        {#if fp.thumbnailUrl}
                            <img
                                src={fp.thumbnailUrl}
                                alt={fp.file.name}
                                width="64"
                                height="64"
                                draggable="false"
                                class="h-full w-full rounded-xl object-cover"
                                onerror={() => {
                                    if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
                                    fp.thumbnailUrl = undefined;
                                }}
                            />
                        {:else}
                            <div class="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-white/40">
                                <svg class="h-5 w-5 text-[#FFB3C6]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                    />
                                </svg>
                                <span class="text-[7px] font-bold tracking-wide text-[#FFB3C6] uppercase">
                                    {fp.file.name.split('.').pop()}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <!-- Status badge -->
                    {#if fp.status === 'complete'}
                        <div
                            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#81C784] shadow-sm"
                        >
                            <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    {:else if fp.status === 'error'}
                        <div
                            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#EF5350] shadow-sm"
                        >
                            <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    {:else if fp.status === 'processing'}
                        <div
                            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F06292] shadow-sm"
                        >
                            <svg class="h-3 w-3 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                    {/if}

                    <!-- Remove button -->
                    {#if fp.status !== 'processing'}
                        <button
                            onclick={() => removeFile(index)}
                            class="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#F06292] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 hover:scale-110"
                            title="Remove file"
                        >
                            <svg
                                class="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                stroke-width="3"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    {/if}
                </div>
            {/each}

            <!-- Add more -->
            <label
                for="file-input"
                class="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-[#FFF9FB] text-[#F06292]/70 transition-all hover:scale-105 hover:border-[#F06292] hover:text-[#F06292]"
                aria-label="Add more images"
            >
                <svg
                    class="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </label>

            <div class="absolute right-8 bottom-0 left-8">
                <div
                    class="h-[1px] w-full bg-gradient-to-r from-transparent via-[#875F42]/15 to-transparent"
                ></div>
                <div
                    class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
                ></div>
            </div>
        </div>
        <!-- Empty state -->
        <label
            for="file-input"
            class="group m-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-200 px-6 py-10 text-center transition-colors hover:border-[#F06292] hover:bg-[#FFF9FB] sm:m-6"
            class:hidden={selectedFiles.length > 0}
        >
            <div
                class="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F3] transition-transform duration-200 group-hover:scale-105"
            >
                <svg
                    class="h-6 w-6 text-[#F06292]/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                </svg>
            </div>
            <p class="text-sm font-semibold text-[#4A2C2C]">
                Drop images here or <span class="text-[#F06292]">browse</span>
            </p>
            <p class="text-xs text-[#6C3F31]/60">
                {types} · max {batchLimit} files per batch, {maxFileSizeMb}MB each
            </p>
        </label>

    <!-- Blocked cards: files we accepted but cannot convert on this plan. Rendered
         outside the staging tray because they are not staged — they carry the
         ceiling they broke and the upgrade that clears it, on the card itself,
         so the user never has to match a count in a banner to a missing file. -->
    {#if hasOversized}
        <div class="flex flex-col gap-2 px-4 sm:px-6 {stagedCount === 0 ? 'pt-4' : 'pt-3'}">
            {#each oversizedFiles as blocked, index (blocked.file.name + blocked.file.size)}
                <div
                    class="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5"
                >
                    <div
                        class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-red-200 bg-white p-0.5"
                    >
                        {#if blocked.thumbnailUrl}
                            <img
                                src={blocked.thumbnailUrl}
                                alt={blocked.file.name}
                                width="40"
                                height="40"
                                draggable="false"
                                class="h-full w-full rounded-lg object-cover opacity-60"
                            />
                        {:else}
                            <div
                                class="flex h-full w-full items-center justify-center rounded-lg text-[7px] font-bold tracking-wide text-[#EF5350] uppercase"
                            >
                                {blocked.file.name.split('.').pop()}
                            </div>
                        {/if}
                    </div>

                    <div class="min-w-0 flex-1">
                        <p class="truncate text-xs font-bold text-[#4A2C2C]">{blocked.file.name}</p>
                        <!-- One link, pointed at whichever offer actually clears this
                             file. Where the Day Pass is live it is the exact answer to
                             the size ceiling ($2, same {paidFileSizeMb}MB) and a far
                             smaller ask than a subscription, so it wins the slot; the
                             modal behind this same condition already leads with it. -->
                        <p class="mt-0.5 text-xs font-bold text-red-700">
                            Exceeds {maxFileSizeMb}MB limit ({formatFileSize(blocked.size)}).
                            {#if dayPassOffered}
                                <a
                                    href={dayPassCheckoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onclick={() =>
                                        posthog.capture('day_pass_cta_clicked', { trigger: 'file_size_card' })}
                                    class="underline underline-offset-2 hover:text-red-900"
                                >
                                    Day Pass ({dayPassPrice}) for files up to {paidFileSizeMb}MB
                                </a>
                            {:else}
                                <a
                                    href="/pricing"
                                    onclick={() =>
                                        posthog.capture('upgrade_cta_clicked', { trigger: 'file_size_card' })}
                                    class="underline underline-offset-2 hover:text-red-900"
                                >
                                    Upgrade for up to {paidFileSizeMb}MB
                                </a>
                            {/if}
                        </p>
                    </div>

                    <button
                        onclick={() => removeOversized(index)}
                        class="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-red-400 transition-colors hover:bg-white hover:text-red-600"
                        aria-label="Remove {blocked.file.name}"
                    >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Toggles -->
    {#if (showExifOption || showSmartMode) && selectedFiles.length > 0}
        <div class="flex flex-wrap gap-x-6 gap-y-3 px-4 pt-3 pb-3 sm:px-6">
            {#if showExifOption}
                <label class="group flex cursor-pointer items-center gap-2.5 select-none">
                    <input type="checkbox" bind:checked={stripExif} class="sr-only" />
                    <div
                        class="relative h-5 w-10 rounded-full transition-all duration-300 {stripExif
                            ? 'bg-[#F06292] shadow-[0_0_0_1px_#F06292]'
                            : 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}"
                    >
                        <div
                            class="absolute top-[3px] left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-300 {stripExif
                                ? 'translate-x-5'
                                : ''}"
                        ></div>
                    </div>
                    <span
                        class="text-xs font-semibold text-[#6C3F31] transition-colors group-hover:text-[#4A2C2C]"
                        >Strip EXIF</span
                    >
                </label>
            {/if}
            {#if showSmartMode}
                <label class="group flex cursor-pointer items-center gap-2.5 select-none">
                    <input type="checkbox" bind:checked={smartCompress} class="sr-only" />
                    <div
                        class="relative h-5 w-10 rounded-full transition-all duration-300 {smartCompress
                            ? 'bg-[#66BB6A] shadow-[0_0_0_1px_#66BB6A]'
                            : 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}"
                    >
                        <div
                            class="absolute top-[3px] left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-300 {smartCompress
                                ? 'translate-x-5'
                                : ''}"
                        ></div>
                    </div>
                    <span
                        class="text-xs font-semibold text-[#6C3F31] transition-colors group-hover:text-[#4A2C2C]"
                        >Smart Mode</span
                    >
                </label>
            {/if}
        </div>
    {/if}

    <!-- Success is orthogonal to the banner chain: it only exists after a run,
         when every ingest-time condition has already been cleared. -->
    {#if successMessage}
        <div
            class="mx-4 mb-3 flex items-center gap-2 rounded-2xl border border-green-100 bg-[#F0FDF4] px-4 py-3 sm:mx-6"
        >
            <svg class="h-4 w-4 flex-shrink-0 text-[#66BB6A]" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                />
            </svg>
            <p class="text-xs font-bold text-[#33691E]">{successMessage}</p>
        </div>
    {/if}

    <!-- Single banner slot. Exactly one of these renders (see activeBanner):
         error > tokens-short > batch-cap > limits-ok. A trimmed batch is a
         notice, not a failure, so only 'error' gets the red treatment. -->
    {#if activeBanner}
        <div
            class="mx-4 mb-3 flex items-start gap-2 rounded-2xl border px-4 py-3 sm:mx-6 {activeBanner.kind ===
            'error'
                ? 'border-red-100 bg-red-50'
                : activeBanner.kind === 'limits-ok'
                  ? 'border-green-100 bg-[#F0FDF4]'
                  : 'border-amber-100 bg-amber-50'}"
        >
            {#if activeBanner.kind === 'error'}
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#EF5350]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                    />
                </svg>
            {:else if activeBanner.kind === 'limits-ok'}
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#66BB6A]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                    />
                </svg>
            {:else}
                <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#F57C00]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
            {/if}

            <div class="flex flex-col gap-1">
                {#if activeBanner.kind === 'limits-ok'}
                    <!-- The all-clear doubles as the caps reminder: the allowance the
                         run will draw from, then the two ceilings it must fit inside.
                         Stating them here, while files are staged, is what stops the
                         batch cap from being discovered by hitting it. -->
                    <p class="text-xs font-bold text-[#33691E]">
                        {usageLabel}
                    </p>
                    <p class="text-xs font-medium text-[#33691E]/80">
                        Up to {batchLimit} files per batch, {maxFileSizeMb}MB each.
                        This batch uses {stagedCount} of your monthly uploads.
                    </p>
                {:else if activeBanner.kind === 'batch-cap'}
                    <!-- A cap trim, with the honest version of the upsell. Only a paid
                         plan raises the per-batch cap: guest and free are both capped
                         at 3, so offering "sign up" as a way to convert all at once
                         would be a promise the free tier does not keep. Guests still
                         get the signup link, labelled with what it actually buys
                         (the monthly allowance), below the offer that fixes the cap. -->
                    <p class="text-xs font-bold text-cocoa-deep">
                        Staging {batchTrim?.staged} of {batchTrim?.offered} files.
                        {userTier === 'guest'
                            ? 'Guest and free batches are'
                            : userTier === 'free'
                              ? 'The free tier is'
                              : 'Batches are'} capped at {batchLimit} files per batch.
                    </p>
                    {#if userTier !== 'pro'}
                        <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                            <!-- Every non-free plan carries the same 25-file batch, so a
                                 Day Pass is a real answer to this cap rather than a
                                 consolation prize, and the cheapest subscription that
                                 lifts it is Seller, not Pro. Both slots quote the true
                                 entry price for the limit in front of the user: naming
                                 Pro here asked $24.99 for something $7.99 buys, and
                                 contradicted the pricing page's own comparison table. -->
                            {#if dayPassOffered}
                                <a
                                    href={dayPassCheckoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onclick={() =>
                                        posthog.capture('day_pass_cta_clicked', { trigger: 'batch_cap_banner' })}
                                    class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                                >
                                    Day Pass ({dayPassPrice}) for {BATCH_LIMIT_PAID} at a time
                                </a>
                            {:else}
                                <a
                                    href="/pricing"
                                    onclick={() =>
                                        posthog.capture('upgrade_cta_clicked', { trigger: 'batch_cap_banner' })}
                                    class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                                >
                                    Upgrade from {cheapestPlanPrice}/mo for {BATCH_LIMIT_PAID} at a time
                                </a>
                            {/if}
                            {#if userTier === 'guest'}
                                <a
                                    href="/auth/register"
                                    onclick={() =>
                                        posthog.capture('signup_cta_clicked', { trigger: 'batch_cap_banner' })}
                                    class="text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
                                >
                                    Sign up free for {planQuota} uploads a month
                                </a>
                            {/if}
                        </div>
                        <p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
                            Or convert these {batchTrim?.staged} now and drop the rest in a second batch.
                        </p>
                    {/if}
                {:else if activeBanner.kind === 'tokens-short'}
                    <!-- One sentence stating the shortfall, then the ways out. The copy
                         splits on userTier, not on availableTokens === 0, because
                         "create an account" and "upgrade" are different offers and only
                         one applies to any given user.

                         Both offers are stated here, in full, because this is the last
                         surface before money changes hands: a $2 charge should never be
                         the first place someone learns what they are buying. -->
                    <p class="text-xs font-bold text-cocoa-deep">
                        {#if userTier === 'guest'}
                            {availableTokens} of your {GUEST_QUOTA} guest uploads remain this month, but {stagedCount}
                            file{stagedCount !== 1 ? 's' : ''} {stagedCount !== 1 ? 'are' : 'is'} staged. A free
                            account gives you {planQuota} a month.
                        {:else if userTier === 'free'}
                            You've used your {monthlyQuota} free monthly uploads ({availableTokens} left), but {stagedCount}
                            file{stagedCount !== 1 ? 's' : ''} {stagedCount !== 1 ? 'are' : 'is'} staged.
                        {:else}
                            {availableTokens} of your {monthlyQuota} monthly uploads remain, but {stagedCount}
                            file{stagedCount !== 1 ? 's' : ''} {stagedCount !== 1 ? 'are' : 'is'} staged.
                        {/if}
                    </p>

                    <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {#if userTier === 'guest'}
                            <!-- Free account leads, and the Day Pass is the aside. This
                                 user needs a handful more uploads; an account gives them
                                 25 for nothing, and both paths cost the same email and
                                 magic link. Charging $2 for the slower fix to a problem
                                 the free tier already solves would read as a trick. -->
                            <a
                                href="/auth/register"
                                onclick={() => posthog.capture('signup_cta_clicked', { trigger: 'token_wall_banner' })}
                                class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                            >
                                Create free account for {planQuota}/mo
                            </a>
                            {#if dayPassOffered}
                                <a
                                    href={dayPassCheckoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onclick={() =>
                                        posthog.capture('day_pass_cta_clicked', { trigger: 'token_wall_banner' })}
                                    class="text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
                                >
                                    or Day Pass, {dayPassPrice} for {DAY_PASS_OPS} conversions in 24h
                                </a>
                            {/if}
                        {:else if userTier === 'free'}
                            <!-- Running out of a monthly allowance is a recurring-need
                                 signal by construction, so the subscription leads here
                                 and the pass is the "just today" escape hatch. Per op the
                                 pass undercuts every plan several times over; putting it
                                 first in front of someone who has just demonstrated
                                 monthly demand would train them to never subscribe. -->
                            <a
                                href="/pricing"
                                onclick={() => posthog.capture('upgrade_cta_clicked', { trigger: 'token_wall_banner' })}
                                class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                            >
                                Upgrade from {cheapestPlanPrice}/mo
                            </a>
                            {#if dayPassOffered}
                                <a
                                    href={dayPassCheckoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onclick={() =>
                                        posthog.capture('day_pass_cta_clicked', { trigger: 'token_wall_banner' })}
                                    class="text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
                                >
                                    or just today, Day Pass {dayPassPrice} for {DAY_PASS_OPS} conversions
                                </a>
                            {/if}
                        {:else}
                            <a
                                href="/pricing"
                                onclick={() => posthog.capture('upgrade_cta_clicked', { trigger: 'token_wall_banner' })}
                                class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                            >
                                Upgrade for more images
                            </a>
                        {/if}

                        <!-- Hidden at zero tokens: "Trim to 0 files" would just empty
                             the tray, which is not an offer worth making. -->
                        {#if trimTarget > 0}
                            <button
                                type="button"
                                onclick={trimToAvailable}
                                class="cursor-pointer text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
                            >
                                Trim to {trimTarget} file{trimTarget !== 1 ? 's' : ''}
                            </button>
                        {/if}
                    </div>
                {:else}
                    <p
                        class="text-xs font-bold {activeBanner.kind === 'error'
                            ? 'text-red-700'
                            : 'text-cocoa-deep'}"
                    >
                        {activeBanner.text}
                    </p>
                {/if}

            </div>
        </div>
    {/if}

    <!-- Also mounts on a tray of nothing-but-blocked files: that is precisely the
         state whose only way forward is the size upsell, and gating this block on
         selectedFiles alone used to make blockedByFileSize unreachable. -->
    {#if stagedCount > 0 || hasOversized}
    <!-- Submit / CTA button -->
    <div class="px-4 pb-4 sm:px-6">
        <button
            onclick={handleButtonClick}
            disabled={isLoading}
            aria-disabled={isLoading}
            class="group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold transition-all duration-300
                {shaking ? 'animate-shake' : ''}
                {isLoading
                    ? 'cursor-wait border border-[#875F42]/15 bg-white/40 text-[#875F42]/60'
                    : insufficientTokens || blockedByFileSize
                        ? 'cursor-pointer bg-gradient-to-br from-[#FFD54F] to-[#FFCA28] text-[#5D4037] shadow-[0_4px_16px_rgba(255,202,40,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,202,40,0.5)]'
                        : stagedCount > 0
                            ? 'cursor-pointer bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(240,98,146,0.5)]'
                            : 'cursor-not-allowed border border-[#875F42]/15 bg-white/40 text-[#875F42]/60'}"
        >
            {#if isLoading}
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Converting {stagedCount} image{stagedCount !== 1 ? 's' : ''} to {outputLabel}…</span>

            <!-- Active CTAs instead of a dead disabled state -->
            {:else if insufficientTokens}
                <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <!-- Mirrors the banner's primary action rather than competing with
                     it. It used to say "Unlock with Day Pass — $2" while the banner
                     underneath offered a free account, so the two loudest elements
                     on the card pushed different products at the same moment. -->
                <span>
                    {!isAuthed
                        ? `Create free account to convert ${stagedCount} image${stagedCount !== 1 ? 's' : ''}`
                        : 'Upgrade plan to continue'}
                </span>
            {:else if blockedByFileSize}
                <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span>
                    {!isAuthed && dayPassOffered
                        ? `Unlock with Day Pass — ${dayPassPrice} · ${paidFileSizeMb}MB files`
                        : !isAuthed
                            ? 'Create free account to unlock'
                            : `Upgrade for ${paidFileSizeMb}MB files`}
                </span>

            {:else}
                <svg
                    class="h-4 w-4 {stagedCount > 0 ? 'transition-transform group-hover:scale-110' : ''}"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <!-- States the outcome and the format, and recounts live as
                     thumbnails are removed. Multi-file runs still arrive as a ZIP;
                     that is a delivery detail the success line covers, not
                     something the CTA needs to lead with. -->
                <span>{convertLabel}</span>
            {/if}
        </button>
    </div>

    <!-- Footer tray -->
    <div>
    {#if isLoading && isRetrying}
        <div
            class="flex items-center gap-2 border-t border-amber-200/70 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800 sm:px-6"
            role="status"
            aria-live="polite"
        >
            <span class="animate-pulse">⚠️</span>
            Unstable connection detected. Pausing and retrying…
        </div>
    {/if}
    {#if isLoading}
        <div class="relative h-1 overflow-hidden bg-pink-50">
            {#if processPhase === 'uploading'}
                <div class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] shadow-[0_0_10px_rgba(240,98,146,0.5)] transition-all duration-300 ease-out" style="width: {uploadPercent}%"></div>
            {:else if processPhase === 'processing'}
                <div class="animate-shimmer absolute inset-0 bg-gradient-to-r from-[#A5D6A7] via-[#66BB6A] to-[#A5D6A7] bg-[length:200%_100%] opacity-80"></div>
            {:else if processPhase === 'downloading'}
                <div class="h-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] shadow-[0_0_10px_rgba(165,214,167,0.5)] transition-all duration-300 ease-out" style="width: {downloadPercent}%"></div>
            {/if}
        </div>
    {/if}
    <div
        class="flex items-center justify-between gap-3 border-t border-pink-50 bg-[#FDFBF7] px-4 py-2.5 sm:px-6"
    >
        {#if showTypes && !hasOutputOverride}
            <div class="flex flex-wrap items-center gap-1.5">
                {#each formats as fmt}
                    <button
                        onclick={() => (imageType = fmt.value)}
                        class="cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-all duration-200 {imageType ===
                        fmt.value
                            ? 'bg-[#F06292] text-white shadow-sm'
                            : 'border border-[#875F42]/20 bg-white/50 text-[#6C3F31] hover:bg-white/70 hover:text-[#F06292]'}"
                    >
                        {fmt.label}
                    </button>
                {/each}
            </div>
        {:else}
            <span></span>
        {/if}

        <span class="flex-shrink-0 text-xs font-medium whitespace-nowrap text-[#6C3F31]/70">
            {#if isLoading}
                {#if processPhase === 'uploading'}
                    Uploading… ({uploadPercent}%)
                {:else if processPhase === 'processing'}
                    <span class="animate-pulse">⬡</span> Processing…
                {:else if processPhase === 'downloading'}
                    Saving…
                {/if}
            {:else if stagedCount > 0 || hasOversized}
                {#if stagedCount > 0}
                    {stagedCount}
                    {stagedCount === 1 ? 'image' : 'images'} ready
                {/if}
                {#if stagedCount > 0 && hasOversized}·{/if}
                {#if hasOversized}
                    {oversizedFiles.length} over {maxFileSizeMb}MB
                {/if}
                {#if stagedCount > 1 || hasOversized}
                    · <button
                        onclick={resetForm}
                        class="cursor-pointer text-[#F06292]/70 transition-colors hover:text-[#F06292]"
                        >clear all</button
                    >
                {/if}
            {/if}
        </span>
    </div>
    </div>
    {/if}
</div>

{#if showUpgradeCta}
    <div
        use:portal
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onclick={() => (showUpgradeCta = false)}
        onkeydown={(e) => e.key === 'Escape' && (showUpgradeCta = false)}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            role="presentation"
            onclick={(e) => e.stopPropagation()}
        >
            <button
                onclick={() => (showUpgradeCta = false)}
                aria-label="Close"
                class="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#875F42]/50 transition-all hover:bg-[#FFF5F7] hover:text-[#875F42]"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]">
                    <svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                {#if hasOversized}
                    <h3 class="mb-2 text-lg font-black text-[#4A2C2C]">File too large</h3>
                    <p class="mb-6 text-sm leading-relaxed text-cocoa-milk/70">
                        Your plan supports files up to {maxFileSizeMb}MB. Every paid plan handles up to {paidFileSizeMb}MB, from {cheapestPlanPrice}/mo, or a {dayPassPrice} Day Pass covers it for 24 hours.
                    </p>
                    <div class="flex flex-col gap-3">
                        {#if dayPassOffered}
                            <a
                                href={dayPassCheckoutUrl}
                                target="_blank" rel="noopener noreferrer"
                                class="block rounded-2xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
                            >
                                Get Day Pass — {dayPassPrice} · 75MB files
                            </a>
                        {/if}
                        <a
                            href="/pricing"
                            class="block rounded-2xl {dayPassOffered ? 'border border-cocoa-milk/15 text-cocoa-deep hover:border-mochi-pink/30 hover:bg-[#FFF5F7] hover:text-mochi-pink' : 'bg-linear-to-br from-[#FF9EBB] to-mochi-pink text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]'} px-6 py-3 text-center text-sm font-black transition-all"
                        >
                            Upgrade plan
                        </a>
                        <button
                            onclick={() => (showUpgradeCta = false)}
                            class="cursor-pointer rounded-2xl border border-cocoa-milk/15 px-6 py-3 text-center text-sm font-bold text-cocoa-deep transition-all hover:border-mochi-pink/30 hover:bg-[#FFF5F7] hover:text-mochi-pink"
                        >
                            Dismiss
                        </button>
                    </div>
                {:else}
                    <h3 class="mb-2 text-lg font-black text-[#4A2C2C]">Monthly limit reached</h3>
                    <p class="mb-6 text-sm leading-relaxed text-cocoa-milk/70">
                        You've used your full image quota for this month. Upgrade for a higher limit, or your quota resets at the start of next month.
                    </p>
                    <div class="flex flex-col gap-3">
                        <a
                            href="/pricing"
                            class="block rounded-2xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
                        >
                            Upgrade plan
                        </a>
                        <button
                            onclick={() => (showUpgradeCta = false)}
                            class="cursor-pointer rounded-2xl border border-cocoa-milk/15 px-6 py-3 text-center text-sm font-bold text-cocoa-deep transition-all hover:border-mochi-pink/30 hover:bg-[#FFF5F7] hover:text-mochi-pink"
                        >
                            Dismiss
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

{#if showSignupCta}
    <div
        use:portal
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onclick={() => (showSignupCta = false)}
        onkeydown={(e) => e.key === 'Escape' && (showSignupCta = false)}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            role="presentation"
            onclick={(e) => e.stopPropagation()}
        >
            <button
                onclick={() => (showSignupCta = false)}
                aria-label="Close"
                class="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#875F42]/50 transition-all hover:bg-[#FFF5F7] hover:text-[#875F42]"
            >
                <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="text-center">
                <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]">
                    <svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 class="mb-2 text-lg font-black text-[#4A2C2C]">Limit reached</h3>
                
                {#if dayPassOffered}
                    <!-- Reached now only by a 429 or by a click that beat the token
                         check, both of which are count walls. The pitch is therefore
                         the count: this used to sell "75MB files and larger batches",
                         which are real Day Pass benefits but answer a limit this user
                         did not hit. Order matches the banner, free account first. -->
                    <p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
                        You've used your {GUEST_QUOTA} guest uploads for this month. A free account gives you {planQuota} a month. Or a Day Pass is {DAY_PASS_OPS} conversions in 24 hours for {dayPassPrice}, with no subscription and no account needed.
                    </p>
                    <div class="flex flex-col gap-3">
                        <a
                            href="/auth/register"
                            class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
                        >
                            Create free account for {planQuota}/mo
                        </a>
                        <a
                            href={dayPassCheckoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="block rounded-2xl border border-[#875F42]/15 px-6 py-3 text-center text-sm font-bold text-[#6C3F31] transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
                        >
                            Day Pass — {dayPassPrice} for {DAY_PASS_OPS} conversions
                        </a>
                    </div>
                {:else}
                    <p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
                        Without an account you get 3 free images per month. Create a free account for 25 images/month, or upgrade for even more.
                    </p>
                    <div class="flex flex-col gap-3">
                        <a
                            href="/auth/register"
                            class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
                        >
                            Create free account
                        </a>
                        <a
                            href="/pricing"
                            class="block rounded-2xl border border-[#875F42]/15 px-6 py-3 text-center text-sm font-bold text-[#6C3F31] transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
                        >
                            See plans
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
    }
    .animate-shake {
        animation: shake 0.4s ease-in-out;
    }

    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    .animate-shimmer {
        animation: shimmer 1.8s ease-in-out infinite;
    }
</style>