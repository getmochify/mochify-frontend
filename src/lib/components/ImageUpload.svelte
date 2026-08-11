<script lang="ts">
    import { zip } from 'fflate';
    import { env } from '$env/dynamic/public';
    import { page } from '$app/state';
    import { getPlan, getSessionToken, resolveRemaining, GUEST_QUOTA, type UsageResponse } from '$lib/user';
    import { posthog } from '$lib/analytics';
    import { withRetry } from '$lib/uploadRetry';
    import { uploadChunked, CHUNK_THRESHOLD_BYTES, type ChunkedUploadParams } from '$lib/uploadChunked';
    import { resolveUploadSize, effectiveSize, uploadBodyOf } from '$lib/uploadSize';
    import { uploadErrorMessage, readXhrErrorText, trackUpload413, readRejectLabel, readDetectedHeader, trackReject } from '$lib/uploadError';
    import { isNetworkError } from '$lib/chunkRecovery';
    import { portal } from '$lib/portal';

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
        showDayPass = false
    } = props;
    const hasOutputOverride = $derived('output' in props);

    let stripExif: boolean = $state(true);
    let smartCompress: boolean = $state(false);
    let isDragging: boolean = $state(false);

    let selectedFiles: File[] = $state([]);
    let fileProgress: FileProgress[] = $state([]);
    let imageType: string = $state(output);
    let isLoading: boolean = $state(false);
    // Hard rejections only: unsupported type, oversized, unreadable, or a failed
    // run. Batch truncation is NOT stored here — it goes to the toast.
    let errorMessage: string = $state('');
    let successMessage: string = $state('');
    let totalOriginalSize: number = $state(0);
    let fileInputElement: HTMLInputElement;
    let MAX_FILES = $state(3);
    const CONCURRENT_UPLOADS = 1;
    let MAX_INDIVIDUAL_FILE_SIZE = $state(20 * 1024 * 1024); // 20MB, 75MB for pro/day
    let planQuota = $state(25); // expected ops quota for authenticated users; anon gets GUEST_QUOTA
    // Kept alongside MAX_FILES because the token wall needs the tier itself, not
    // just the limits it implies: getPlan() answers 'free' for signed-out callers
    // too, so plan alone cannot tell a guest from a free account (see warningTier).
    let plan: 'free' | 'seller' | 'pro' | 'day' | 'growth' = $state('free');
    $effect(() => {
        getPlan().then((p) => {
            plan = p;
            MAX_FILES = p === 'free' ? 3 : 25;
            MAX_INDIVIDUAL_FILE_SIZE = (p === 'pro' || p === 'day' || p === 'seller' || p === 'growth') ? 75 * 1024 * 1024 : 20 * 1024 * 1024;
            planQuota = p === 'pro' ? 1200 : p === 'seller' ? 300 : p === 'day' ? 500 : p === 'growth' ? 5000 : 25;
        });
    });

    // Batch-cap trims get a transient toast rather than a banner slot. Keeping
    // them out of activeBanner is the whole point: once the thumbnails render the
    // trim is self-evident, whereas the banner is reserved for the token wall,
    // the one message that carries a conversion action. Two amber boxes saying
    // different things about the same drop is what this replaces.
    let toastMessage: string = $state('');
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    function showToast(message: string) {
        toastMessage = message;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => (toastMessage = ''), 4500);
    }
    $effect(() => () => clearTimeout(toastTimer));

    let showSignupCta = $state(false);
    let showUpgradeCta = $state(false);
    let isFileSizeError = $state(false);
    let shaking = $state(false);

    const dayPassCheckoutUrl = $derived(
        (() => {
            if (!env.PUBLIC_POLAR_DAY_PASS_URL) return ''
            const u = new URL(page.url.href)
            u.searchParams.set('day_pass_success', '1')
            return `${env.PUBLIC_POLAR_DAY_PASS_URL}?successUrl=${encodeURIComponent(u.toString())}`
        })()
    )

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

    // Token limit tracking
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
        // Await plan so paid-user limits (25 files, 75MB) are applied immediately,
        // not after files are already sliced to free-tier defaults.
        plan = await getPlan();
        MAX_FILES = plan === 'free' ? 3 : 25;
        MAX_INDIVIDUAL_FILE_SIZE = (plan === 'pro' || plan === 'day' || plan === 'seller' || plan === 'growth') ? 75 * 1024 * 1024 : 20 * 1024 * 1024;

        // Rejections raised by THIS ingest, committed in one place at the end.
        // They used to be written straight to errorMessage and read back later,
        // which meant a clean drop re-committed the previous drop's message: add a
        // .txt, then add a valid photo, and "1 file(s) not supported" stayed up
        // over a batch that was fine. One ingest now produces exactly one banner
        // state, and every exit path goes through commitIngestNotices.
        const rejections: string[] = [];
        let hasOversizeRejection = false;

        function commitIngestNotices() {
            errorMessage = rejections.join(' ');
            isFileSizeError = hasOversizeRejection;
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
            allFiles.map(async (f) => ({ file: f, size: await resolveUploadSize(f, MAX_INDIVIDUAL_FILE_SIZE) }))
        );
        // Files we can't read at all (size===0 and the stream gave us nothing):
        // no upload path can succeed, so drop them up front with a clear reason
        // rather than letting them fail as a confusing server error.
        const unreadableFiles = resolved.filter((r) => r.size.unreadable);
        const oversizedFiles = resolved.filter((r) => !r.size.unreadable && r.size.exceededLimit);

        if (unreadableFiles.length > 0 || oversizedFiles.length > 0) {
            if (oversizedFiles.length > 0) {
                rejections.push(`${oversizedFiles.length} file${oversizedFiles.length !== 1 ? 's' : ''} exceeded the ${MAX_INDIVIDUAL_FILE_SIZE / 1024 / 1024}MB limit and ${oversizedFiles.length === 1 ? 'was' : 'were'} skipped.`);
                // Only the oversize case offers an upgrade path; an unreadable file
                // isn't a plan-limit problem, so don't trigger the size-upsell UI.
                hasOversizeRejection = true;
            }
            if (unreadableFiles.length > 0) {
                rejections.push(`${unreadableFiles.length} file${unreadableFiles.length !== 1 ? 's' : ''} couldn't be read and ${unreadableFiles.length === 1 ? 'was' : 'were'} skipped. If it's stored in iCloud or a cloud drive, open the original to download it first, then try again.`);
            }
            allFiles = resolved.filter((r) => !r.size.unreadable && !r.size.exceededLimit).map((r) => r.file);
            if (allFiles.length === 0) {
                commitIngestNotices();
                return;
            }
        }

        const existingFileKeys = new Set(selectedFiles.map((f) => `${f.name}-${f.size}`));
        const newFiles = allFiles.filter((f) => !existingFileKeys.has(`${f.name}-${f.size}`));

        const combinedFiles = [...selectedFiles, ...newFiles].slice(0, MAX_FILES);
        const addedCount = combinedFiles.length - selectedFiles.length;

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

        // The cap is applied silently by the slice above; all the user gets is a
        // toast confirming what was staged. Rejections raised earlier in this
        // ingest still go to the banner, because they name files the user handed
        // us that are not in the list at all — that is the one outcome a user
        // cannot diagnose from the thumbnails in front of them.
        if (addedCount === 0 && newFiles.length === 0) {
            rejections.push('All selected files are already in the list.');
        } else if (selectedFiles.length >= MAX_FILES && allFiles.length > addedCount) {
            const dropped = allFiles.length - addedCount;
            showToast(
                MAX_FILES === 3
                    ? `Free and guest batches are capped at ${MAX_FILES} files. Staging first ${MAX_FILES} items.`
                    : `Batches are capped at ${MAX_FILES} files. Staging first ${MAX_FILES} items.`
            );
            posthog.capture('batch_cap_trimmed', { cap: MAX_FILES, dropped, authed: isAuthenticated });
        }
        commitIngestNotices();

        // Deliberately after truncation: sufficiency is judged against what is
        // actually staged (capped at MAX_FILES), never the raw dropped count, so
        // a 5-file drop on a 3-file plan asks for 3 operations and not 5.
        await checkTokenLimit();
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    $effect(() => {
        if (hasOutputOverride) {
            imageType = output;
        }
    });

    // Pre-flight token check
    let isAuthenticated: boolean = $state(false);
    $effect(() => {
        getSessionToken().then((jwt) => {
            isAuthenticated = !!jwt;
        });
    });

    const stagedCount = $derived(selectedFiles.length);

    // Show plan quota on first visit before the bucket is seeded (availableTokens = Infinity)
    const displayTokens = $derived(
        Number.isFinite(availableTokens) ? availableTokens : (isAuthenticated ? planQuota : GUEST_QUOTA)
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

    // Which wall the user is standing at, and therefore which way out we offer.
    // A guest converts by creating an account; a free account is already past
    // that, so its only route is paying. Splitting on isAuthenticated rather than
    // plan is deliberate — getPlan() reports 'free' for signed-out callers, so a
    // plan-only check would offer a guest the upgrade page and a free user the
    // signup page, which is exactly backwards.
    const warningTier: 'guest' | 'free' | 'paid' = $derived(
        !isAuthenticated ? 'guest' : plan === 'free' ? 'free' : 'paid'
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
        posthog.capture('token_wall_trimmed', { kept: trimTarget, tier: warningTier });
    }

    // All dropped files were oversized — nothing left to compress
    const blockedByFileSize = $derived(isFileSizeError && stagedCount === 0);

    // ---- Banner state -----------------------------------------------------
    // Everything below derives from staged files and the token count. Nothing
    // here is assigned imperatively, so no banner can outlive the state that
    // produced it: remove a file and the whole chain re-evaluates.

    type Banner =
        | { kind: 'error'; text: string }
        | { kind: 'tokens-short' }
        | { kind: 'tokens-ok' }
        | null;

    // One banner at a time, picked by severity. The batch cap no longer competes
    // for this slot (it toasts instead), so the amber state now means exactly one
    // thing: you do not have the tokens for what is staged. That is what makes
    // the conversion CTA inside it unambiguous.
    //
    // Order: a rejection (nothing we can do with those bytes) outranks the token
    // wall (fixable by paying or trimming), which outranks the all-clear.
    const activeBanner: Banner = $derived(
        errorMessage
            ? { kind: 'error', text: errorMessage }
            : insufficientTokens
              ? { kind: 'tokens-short' }
              : hasCheckedTokens && stagedCount > 0 && displayTokens > 0
                ? { kind: 'tokens-ok' }
                : null
    );

    function handleButtonClick() {
        if (isLoading) return;

        if (blockedByFileSize) {
            if (!isAuthenticated && showDayPass && env.PUBLIC_POLAR_DAY_PASS_URL) {
                posthog.capture('day_pass_cta_clicked', { trigger: 'button_click_file_size' });
                window.open(dayPassCheckoutUrl, '_blank', 'noopener,noreferrer');
            } else if (!isAuthenticated) {
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
        if (insufficientTokens) {
            if (isAuthenticated) {
                showUpgradeCta = true;
                posthog.capture('upgrade_cta_shown', { trigger: 'button_click_no_tokens' });
            } else {
                showSignupCta = true;
                posthog.capture('signup_cta_shown', { trigger: 'button_click_no_tokens' });
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
        isFileSizeError = false;
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
            const reduction = ((1 - totalCompressedSize / successfulOriginalSize) * 100).toFixed(1);
            const spaceSaved = formatFileSize(successfulOriginalSize - totalCompressedSize);

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
                successMessage = `${successfulFiles.length} of ${selectedFiles.length} squished. Saved ${spaceSaved}. ${failedFiles.length} failed.`;
            } else {
                posthog.capture('manual_compress_completed', {
                    files: successfulFiles.length,
                    reduction: parseFloat(reduction),
                    format: imageType,
                    space_saved_bytes: totalOriginalSize - totalCompressedSize
                });
                successMessage =
                    selectedFiles.length === 1
                        ? `Squished! Saved ${spaceSaved} (${reduction}% smaller).`
                        : `Done! ${selectedFiles.length} images optimised. Saved ${spaceSaved} total.`;
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
        selectedFiles = [];
        fileProgress = [];
        totalOriginalSize = 0;
        errorMessage = '';
        isFileSizeError = false;
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

        // Nothing to clear here any more: the cap notice is a toast that expires
        // on its own, and insufficientTokens derives from stagedCount so it
        // re-evaluates as the list shrinks. Skip notices are left alone, since
        // they refer to files that never entered the list at all and
        // isFileSizeError still drives the size upsell.
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

    <!-- Batch-cap toast. Lives inside the card so it can't collide with a page-level
         toast, and is aria-live so the trim is announced even though it never
         occupies the banner slot. -->
    {#if toastMessage}
        <div
            class="animate-toast-in pointer-events-none absolute inset-x-4 bottom-4 z-30 flex justify-center sm:inset-x-6"
            role="status"
            aria-live="polite"
        >
            <div
                class="flex items-center gap-2 rounded-2xl bg-[#4A2C2C]/90 px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(74,44,44,0.35)] backdrop-blur-sm"
            >
                <svg class="h-4 w-4 shrink-0 text-[#FFD54F]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                        clip-rule="evenodd"
                    />
                </svg>
                {toastMessage}
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
                <p class="mt-0.5 text-xs text-[#6C3F31]/70">We've sent a magic link to activate your Day Pass. Click it to unlock 500 image ops for 24 hours.</p>
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
                {types} · max {MAX_FILES} files, {MAX_INDIVIDUAL_FILE_SIZE / 1024 / 1024}MB each
            </p>
        </label>

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
         error > tokens-short > truncated > tokens-ok. A trimmed batch is a
         notice, not a failure, so only 'error' gets the red treatment. -->
    {#if activeBanner}
        <div
            class="mx-4 mb-3 flex items-start gap-2 rounded-2xl border px-4 py-3 sm:mx-6 {activeBanner.kind ===
            'error'
                ? 'border-red-100 bg-red-50'
                : activeBanner.kind === 'tokens-ok'
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
            {:else if activeBanner.kind === 'tokens-ok'}
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
                {#if activeBanner.kind === 'tokens-ok'}
                    <p class="text-xs font-bold text-[#33691E]">
                        {displayTokens} token{displayTokens !== 1 ? 's' : ''} available
                    </p>
                {:else if activeBanner.kind === 'tokens-short'}
                    <!-- One sentence stating the shortfall, then exactly two ways out:
                         a primary action that raises the limit and a secondary that
                         lowers the batch to fit. The copy splits on warningTier, not
                         on availableTokens === 0, because "create an account" and
                         "upgrade" are different offers and only one applies to any
                         given user. -->
                    <p class="text-xs font-bold text-cocoa-deep">
                        {#if warningTier === 'guest'}
                            You have {availableTokens} guest token{availableTokens !== 1 ? 's' : ''} left, but {stagedCount}
                            file{stagedCount !== 1 ? 's' : ''} staged.
                        {:else if warningTier === 'free'}
                            You've used your {planQuota} monthly tokens ({availableTokens} remaining).
                        {:else}
                            You have {availableTokens} image{availableTokens !== 1 ? 's' : ''} left this month, but {stagedCount}
                            file{stagedCount !== 1 ? 's' : ''} staged.
                        {/if}
                    </p>

                    <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {#if warningTier === 'guest'}
                            <a
                                href="/auth/register"
                                onclick={() => posthog.capture('signup_cta_clicked', { trigger: 'token_wall_banner' })}
                                class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                            >
                                Create Free Account for 25/mo
                            </a>
                        {:else if warningTier === 'free'}
                            <a
                                href="/pricing"
                                onclick={() => posthog.capture('upgrade_cta_clicked', { trigger: 'token_wall_banner' })}
                                class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
                            >
                                Get Day Pass ($2) or Upgrade
                            </a>
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

    {#if selectedFiles.length > 0}
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
                        : selectedFiles.length > 0
                            ? 'cursor-pointer bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(240,98,146,0.5)]'
                            : 'cursor-not-allowed border border-[#875F42]/15 bg-white/40 text-[#875F42]/60'}"
        >
            {#if isLoading}
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Squishing{selectedFiles.length > 1 ? ` ${selectedFiles.length} images` : ''}…</span>
            
            <!-- Active CTAs instead of a dead disabled state -->
            {:else if insufficientTokens}
                <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span>
                    {!isAuthenticated && showDayPass && env.PUBLIC_POLAR_DAY_PASS_URL
                        ? 'Unlock with Day Pass — $2'
                        : !isAuthenticated
                            ? 'Create free account to unlock'
                            : 'Upgrade plan to continue'}
                </span>
            {:else if blockedByFileSize}
                <svg class="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span>
                    {!isAuthenticated && showDayPass && env.PUBLIC_POLAR_DAY_PASS_URL
                        ? 'Unlock with Day Pass — $2 · 75MB files'
                        : !isAuthenticated
                            ? 'Create free account to unlock'
                            : 'Upgrade for 75MB files'}
                </span>
                
            {:else}
                <svg
                    class="h-4 w-4 {selectedFiles.length > 0 ? 'transition-transform group-hover:scale-110' : ''}"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>Squish{selectedFiles.length > 1 ? ` ${selectedFiles.length} images as ZIP` : ' your image'}</span>
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
            {:else if selectedFiles.length > 0}
                {selectedFiles.length}
                {selectedFiles.length === 1 ? 'image' : 'images'} ready
                {#if selectedFiles.length > 1}
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
                {#if isFileSizeError}
                    <h3 class="mb-2 text-lg font-black text-[#4A2C2C]">File too large</h3>
                    <p class="mb-6 text-sm leading-relaxed text-cocoa-milk/70">
                        Your plan supports files up to 20MB. Upgrade to Pro or grab a Day Pass to process files up to 75MB.
                    </p>
                    <div class="flex flex-col gap-3">
                        {#if showDayPass && env.PUBLIC_POLAR_DAY_PASS_URL}
                            <a
                                href={dayPassCheckoutUrl}
                                target="_blank" rel="noopener noreferrer"
                                class="block rounded-2xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
                            >
                                Get Day Pass — $2 · 75MB files
                            </a>
                        {/if}
                        <a
                            href="/pricing"
                            class="block rounded-2xl {showDayPass && env.PUBLIC_POLAR_DAY_PASS_URL ? 'border border-cocoa-milk/15 text-cocoa-deep hover:border-mochi-pink/30 hover:bg-[#FFF5F7] hover:text-mochi-pink' : 'bg-linear-to-br from-[#FF9EBB] to-mochi-pink text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]'} px-6 py-3 text-center text-sm font-black transition-all"
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
                
                {#if showDayPass && env.PUBLIC_POLAR_DAY_PASS_URL}
                    <p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
                        You've hit the guest limit. Get a Day Pass for instant access to 75MB files and larger batches, or create a free account for a smaller monthly allowance.
                    </p>
                    <div class="flex flex-col gap-3">
                        <a
                            href={dayPassCheckoutUrl}
                            class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
                        >
                            Get Day Pass — $2
                        </a>
                        <a
                            href="/auth/register"
                            class="block rounded-2xl border border-[#875F42]/15 px-6 py-3 text-center text-sm font-bold text-[#6C3F31] transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
                        >
                            Create free account (Max 20MB)
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

    @keyframes toast-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .animate-toast-in {
        animation: toast-in 0.2s ease-out;
    }
    @media (prefers-reduced-motion: reduce) {
        .animate-toast-in { animation: none; }
    }

    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    .animate-shimmer {
        animation: shimmer 1.8s ease-in-out infinite;
    }
</style>