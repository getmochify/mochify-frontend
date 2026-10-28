<script lang="ts">
	import { zipBlobs } from '$lib/zipWorker';
	import { env } from '$env/dynamic/public';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		getPlan,
		getPlanSnapshot,
		getSessionToken,
		invalidatePlanCache,
		resolveRemaining,
		GUEST_QUOTA,
		FREE_PLAN_QUOTA,
		type UsageResponse
	} from '$lib/user';
	import { posthog } from '$lib/analytics';
	import { clientQuery } from '$lib/apiClient';
	// For core's images_processed event (see $lib/apiClient).
	const TOOL_CLIENT = clientQuery('tool_page');
	import { createBatchTitle, notifyBatchDone, NOTIFY_MIN_FILES } from '$lib/batchNotify';
	import NotifyMeLink from '$lib/components/NotifyMeLink.svelte';
	import { formatFileSize } from '$lib/formatSize';
	import { withRetry } from '$lib/uploadRetry';
	import {
		uploadChunked,
		CHUNK_THRESHOLD_BYTES,
		type ChunkedUploadParams
	} from '$lib/uploadChunked';
	import { wsAvailable } from '$lib/uploadWs';
	import { resolveUploadSize, effectiveSize, uploadBodyOf } from '$lib/uploadSize';
	import { checkTruncation, truncationVerdictOf } from '$lib/truncationCheck';
	import {
		uploadErrorMessage,
		type UploadErrorKey,
		readXhrErrorText,
		trackUpload413,
		readRejectLabel,
		readDetectedHeader,
		readDecoderHeader,
		trackReject
	} from '$lib/uploadError';
	import { isNetworkError } from '$lib/chunkRecovery';
	import {
		trackTransfer,
		probeReadable,
		transferProps,
		type TransferState
	} from '$lib/xhrTransfer';
	import UploadHelpLink from '$lib/components/UploadHelpLink.svelte';
	import LimitsWhy from '$lib/components/LimitsWhy.svelte';
	import { portal } from '$lib/portal';
	import { formatPrice, USD_PRICES } from '$lib/currency';
	import { getImagePreview, releaseImagePreview } from '$lib/imagePreview';
	import DayPassButton from '$lib/components/DayPassButton.svelte';
	import { recordToolUse } from '$lib/recentTools';
	import { withoutMacMetadata, MAC_METADATA_ONLY_MESSAGE } from '$lib/macMetadata';
	import {
		DAY_PASS_ACTION,
		dayPassEnabled,
		dayPassNext,
		dayPassSignIn,
		resendDayPassLink,
		startDayPassCheckout,
		type DayPassActivation
	} from '$lib/dayPass';

	const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.app';
	const WORKER_URL = env.PUBLIC_WORKER_URL || 'https://id.mochify.app';

	type FileProgress = {
		file: File;
		progress: number;
		phase: 'uploading' | 'processing' | 'downloading';
		status: 'pending' | 'processing' | 'complete' | 'error';
		error?: string;
		/** Guide section for this file's failure; drives the banner's help link. */
		errorKey?: UploadErrorKey;
		/** X-Mochify-Decoder, kept only to disambiguate the corrupt-image anchor. */
		errorDecoder?: string;
		errorRejectLabel?: string;
		/** Network failures only: what the upload had done (see xhrTransfer.ts). */
		errorTransfer?: TransferState;
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
		stripExifDefault = true,
		// Pixel-exact output. Off everywhere by default; the pages that turn it
		// on are the ones whose whole premise is a lossless re-encode (PNG→JXL),
		// where a lossy default would quietly contradict the page's own copy.
		// showLosslessOption additionally renders the toggle so a user with a
		// photographic PNG can drop back to lossy, which is much smaller for
		// photo content even though it is the wrong default for graphics.
		losslessDefault = false,
		showLosslessOption = false,
		// A long-edge resize the page opts into, shown as a switch beside Strip
		// EXIF once files are in. Equal width and height WITHOUT smartCrop fits
		// the photo inside that box, keeps its proportions and never upscales, so
		// a photo already under the target comes back untouched — the same rule
		// the square cropper relies on. A page that sets width/height in its own
		// queryParams should not also turn this on.
		showResizeOption = false,
		resizeLongEdge = 1600,
		resizeLabel = 'Resize',
		resizeDefault = true,
		// A choice of long edges instead of the single switch above, for inputs
		// with no fixed pixel size: an SVG is drawn at whichever size is picked,
		// so the page offers several and "Original" (the size the file declares)
		// as the default. Shown above the dropzone rather than with the toggles,
		// because the SVG pages' how-to has the visitor pick a size first. Uses
		// the same equal width/height box as the switch; set one or the other.
		resizeOptions = [] as number[],
		resizeOptionsLabel = 'Size'
	} = props;
	const uid = $props.id();
	const resizeGroupName = `resize-${uid}`;
	const hasOutputOverride = $derived('output' in props);

	let stripExif: boolean = $state(stripExifDefault);
	let resizeLongEdgeOn: boolean = $state(resizeDefault);
	// 0 = Original: no width/height sent, so the file keeps its own size.
	let resizeChoice: number = $state(0);
	const resizeTarget = $derived(resizeOptions.length > 0 ? resizeChoice : resizeLongEdge);
	const resizeApplies = $derived(
		resizeOptions.length > 0
			? resizeChoice > 0
			: showResizeOption && resizeLongEdgeOn && resizeLongEdge > 0
	);
	let smartCompress: boolean = $state(false);
	let lossless: boolean = $state(losslessDefault);
	let isDragging: boolean = $state(false);

	// A file we accepted the type of but cannot convert on this plan. It still
	// gets a card in the tray — silently discarding the user's drop is what made
	// the size ceiling feel like a bug rather than a plan limit — but it is held
	// apart from selectedFiles so it never enters the upload pipeline.
	type BlockedFile = {
		file: File;
		size: number;
		/** Over the paid ceiling: no plan takes it, so no route is offered. */
		overMax: boolean;
		thumbnailUrl?: string;
	};

	let selectedFiles: File[] = $state([]);
	let fileProgress: FileProgress[] = $state([]);
	let oversizedFiles: BlockedFile[] = $state([]);
	// Legal files the batch cap (or the monthly allowance) kept out of this
	// batch. They used to be sliced off and dropped, so a guest who dropped ten
	// had to find and re-pick seven of them; now they wait, frosted, and move
	// into selectedFiles as room opens (see refillFromQueue). Never uploaded
	// from here: only selectedFiles enters the pipeline.
	type QueuedFile = { file: File; thumbnailUrl?: string };
	let queuedFiles: QueuedFile[] = $state([]);

	// The queue ships as the `batch-queue` PostHog experiment, so the copy
	// review running on these banners keeps a clean control arm. 'control'
	// gets the pre-queue uploader: overflow discarded (holdInQueue lets go of
	// it), the old trim notice and copy (legacyTrim), no re-check on return.
	// Anything else, flags failing to load included, gets the queue. Read on
	// the first overflow, so exposure is counted only for cap-hit sessions.
	// $state so the test-arm copy (content-ops handoff 2026-10-23-batch-queue-
	// messages) re-renders once the variant resolves.
	let queueEnabled = $state(true);
	let queueVariant: Promise<void> | null = null;
	function resolveQueueVariant(): Promise<void> {
		queueVariant ??= posthog.getFeatureFlag('batch-queue').then((variant) => {
			queueEnabled = variant !== 'control';
		});
		return queueVariant;
	}
	// Control arm only: the pre-queue trim notice's two numbers, cleared at the
	// same points it always was (a new ingest, a removal, a run, a reset).
	let legacyTrim: { staged: number; offered: number } | null = $state(null);
	let imageType: string = $state(output);
	// Only these three encoders can emit pixel-exact bytes — the backend 400s a
	// lossless request naming jpg or avif. The type selector can move the output
	// off JXL after the toggle has been set, so both the param and the toggle
	// itself are gated on the CURRENT format rather than on the user's intent.
	const LOSSLESS_FORMATS = ['jxl', 'webp', 'png'];
	const losslessApplies = $derived(LOSSLESS_FORMATS.includes(imageType));
	let isLoading: boolean = $state(false);
	// Hard rejections only: unsupported type, unreadable, or a failed run.
	// Batch truncation and oversize both have their own dedicated UI (the
	// batch-cap banner and the per-file error card), so neither lands here.
	let errorMessage: string = $state('');
	// Which guide section answers the message currently in the banner. Kept
	// beside errorMessage rather than derived from it: the message is prose that
	// gets reworded, the key is the stable thing the help link is built from.
	let errorKey: UploadErrorKey | undefined = $state(undefined);
	let errorDecoder: string | undefined = $state(undefined);
	// Mirrors the run-local hitRateLimit so the success banner (which is where a
	// 429 actually surfaces, alongside the files that did convert) can offer the
	// allowance explainer after the run has finished.
	let quotaExhausted: boolean = $state(false);
	let successMessage: string = $state('');
	let totalOriginalSize: number = $state(0);
	let fileInputElement: HTMLInputElement;
	// Two at once, so the next file uploads while core processes the previous
	// one; upload bandwidth is shared, so more would not upload any faster. Kept
	// below /flow's 4 because this runs on the public solution pages, mostly for
	// anonymous users, against the same 4 core workers. Files are pulled by a
	// pool (a slow file does not hold up a whole batch), and the bar shows one
	// phase for the run (see setPhase in compressImage).
	const CONCURRENT_UPLOADS = 2;

	// ---- Tier limits ------------------------------------------------------
	// Guest and Free share the per-batch and per-file ceilings; the only thing
	// an account buys is the monthly allowance (3 -> 25). Only a paid plan lifts
	// the batch and file-size caps, which is why the batch-cap upsell has to
	// offer Pro and cannot promise anything from signing up.
	const BATCH_LIMIT_STANDARD = 3;
	const BATCH_LIMIT_PAID = 25;
	const FILE_SIZE_LIMIT_STANDARD = 20 * 1024 * 1024;
	const FILE_SIZE_LIMIT_PAID = 75 * 1024 * 1024;
	// Files past the batch cap are held in the queue rather than discarded, up
	// to this many. A queued File is a handle, not its bytes, so this is cheap;
	// it is sized to hif-to-jpg's camera-shoot drops (mean 52 files per cap hit,
	// max 1,710, content-ops 2026-10-19 baseline). Only the first QUEUE_VISIBLE
	// get a (frosted) thumbnail decoded for them.
	const QUEUE_HOLD_LIMIT = 500;
	const QUEUE_VISIBLE = 4;
	// What $2 actually buys, in the unit the count walls are denominated in.
	// Named because the Day Pass has to be explained wherever it is offered:
	// "Day Pass" tells a first-time visitor nothing, "100 conversions in 24
	// hours" tells them whether it solves the problem in front of them.
	const DAY_PASS_OPS = 100;
	// Seller's monthly allowance, quoted on the batch-cap box for drops too big
	// for a Day Pass. Keep in step with /pricing.
	const SELLER_OPS = 300;
	// The next tier's allowance, quoted to a subscriber who runs out. Keep in
	// step with /pricing and the tokens worker's PLAN_LIMITS.
	const PRO_OPS = 1200;
	const GROWTH_OPS = 5000;

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
	const dayPassPrice = $derived(
		formatPrice(localPrices?.prices?.dayPass ?? DAY_PASS_USD, priceCurrency)
	);
	const cheapestPlanPrice = $derived(
		formatPrice(localPrices?.prices?.sellerMonthly ?? CHEAPEST_PAID_MONTHLY_USD, priceCurrency)
	);
	// Quoted by the batch-cap box for drops bigger than Seller's month.
	const proPlanPrice = $derived(
		formatPrice(localPrices?.prices?.proMonthly ?? USD_PRICES.proMonthly, priceCurrency)
	);
	const growthPlanPrice = $derived(
		formatPrice(localPrices?.prices?.growthMonthly ?? USD_PRICES.growthMonthly, priceCurrency)
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
	// Monthly ops for an authenticated plan, as reported by /api/usage — not a
	// local copy of the pricing table. Guests get GUEST_QUOTA instead. This is the
	// caller's own allowance, so never quote it in a signup offer: use FREE_PLAN_QUOTA.
	let planQuota = $state(25);

	// The single tier value every limit and every string keys off.
	//
	// Plan is tested first: getPlan() only ever answers non-'free' for a caller
	// with a session, so a paid plan implies authentication even in the window
	// before getSessionToken() resolves — checking isAuthed first would briefly
	// demote a Pro user to guest limits on mount. isAuthed then separates guest
	// from free, which plan alone cannot do, since getPlan() answers 'free' for
	// signed-out callers too.
	const userTier: UserTier = $derived(plan !== 'free' ? 'pro' : isAuthed ? 'free' : 'guest');
	// The limit messages split the paid tier further: a Day Pass holder's
	// allowance is the pass, and a subscriber is never offered a Day Pass
	// (their route is the next tier up). Limits themselves still key off userTier.
	type LimitTier = 'guest' | 'free' | 'day' | 'seller' | 'pro' | 'growth';
	const limitTier = $derived((userTier === 'pro' ? plan : userTier) as LimitTier);
	const isSubscriber = $derived(
		limitTier === 'seller' || limitTier === 'pro' || limitTier === 'growth'
	);
	const batchLimit = $derived(userTier === 'pro' ? BATCH_LIMIT_PAID : BATCH_LIMIT_STANDARD);
	const maxFileSize = $derived(
		userTier === 'pro' ? FILE_SIZE_LIMIT_PAID : FILE_SIZE_LIMIT_STANDARD
	);
	const maxFileSizeMb = $derived(Math.round(maxFileSize / 1024 / 1024));
	const paidFileSizeMb = FILE_SIZE_LIMIT_PAID / 1024 / 1024;
	const monthlyQuota = $derived(userTier === 'guest' ? GUEST_QUOTA : planQuota);

	// Gates the usage badge. Both lookups are async and the initial state reads
	// as a guest, so rendering before they settle would flash "3 guest uploads
	// remaining this month" at a signed-in Pro user — on a funnel page, the one
	// number they'd be most annoyed to see misreported.
	let tierResolved: boolean = $state(false);

	$effect(() => {
		Promise.all([getPlanSnapshot(), getSessionToken()]).then(([snapshot, jwt]) => {
			plan = snapshot.plan;
			planQuota = snapshot.quota;
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

	// What the last ingest staged versus what it was offered, when the monthly
	// allowance cut the tray: a guest with 1 upload left who drops 3 gets 1
	// staged. Held as a pair so the banner can name both numbers, and cleared by
	// anything that invalidates them: a new ingest, a manual removal, a run, or
	// a reset. The batch cap needs no such pair: the queue itself is the record.
	let allowanceTrim = $state<{ staged: number; offered: number } | null>(null);

	let showSignupCta = $state(false);
	let showUpgradeCta = $state(false);
	let shaking = $state(false);
	let showUsageHint = $state(false);

	// Buyers come back to whichever page they were converting on, with the
	// converter's own query params intact. The endpoint validates this and adds
	// `day_pass_success=1` itself, so the toast below can't be faked by a link.
	const dayPassReturnTo = $derived(dayPassNext(page.url));
	// Signups from here come back here, files and converter included. A bare
	// /auth/register fell back to /dashboard, which sells Flow instead.
	const registerHref = $derived(`/auth/register?next=${encodeURIComponent(dayPassReturnTo)}`);

	// Submitted by handleButtonClick, which offers the pass without a CTA of its
	// own (the main action button doubles as one for an oversized file). Every
	// other surface renders its own DayPassButton.
	let dayPassDirectForm: HTMLFormElement | undefined = $state();

	// Whether this page may offer the Day Pass at all: the host page has to opt
	// in AND the pass has to be live. Named once because every upsell surface has
	// to ask, and a surface that forgets either half either hides a live offer or
	// posts to a checkout that isn't configured.
	const dayPassOffered = $derived(!!showDayPass && dayPassEnabled());

	let dayPassSuccess = $state(false);
	$effect(() => {
		if (page.url.searchParams.has('day_pass_success')) {
			dayPassSuccess = true;
			const clean = new URL(page.url.href);
			clean.searchParams.delete('day_pass_success');
			history.replaceState({}, '', clean.toString());
		}
	});

	// Payment completed in the checkout overlay, so this page (and any files on
	// it) is still here. A guest with no account is signed in by `activateDayPass`
	// before this runs, and a signed-in buyer needs nothing: either way the
	// webhook grants the plan within seconds, so poll for it instead of waiting
	// for a focus change that may never come. A guest whose email already has an
	// account signs in (in a new tab, so the files stay) and the focus re-check
	// unlocks this one; only the leftover cases still depend on the magic link.
	let dayPassPaidAuthed = $state(false);
	let dayPassNeedsSignIn = $state(false);
	// The paid checkout, for "Resend the link" (see `resendDayPassLink`).
	let paidCheckoutUrl: string | null = $state(null);
	let resendState: { text: string; again?: boolean } | null = $state(null);
	let resending = $state(false);
	async function resendLink() {
		if (!paidCheckoutUrl || resending) return;
		resending = true;
		resendState = await resendDayPassLink(paidCheckoutUrl);
		resending = false;
	}
	function handleDayPassPaid(checkoutUrl: string, activation: DayPassActivation) {
		dayPassSuccess = true;
		if (activation === 'signed_in') isAuthed = true;
		dayPassPaidAuthed = isAuthed;
		dayPassNeedsSignIn = !isAuthed && activation === 'sign_in';
		paidCheckoutUrl = checkoutUrl;
		resendState = null;
		if (!isAuthed) return;
		let tries = 0;
		const poll = async () => {
			await recheckTier();
			if ((userTier === 'pro' && !insufficientTokens) || ++tries >= 10) return;
			setTimeout(poll, 3000);
		};
		setTimeout(poll, 2000);
	}

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

	// Thumbnails are generated async (one decode via the shared imagePreview
	// cache) but fileProgress/oversizedFiles are populated synchronously, so
	// each card starts with no thumbnailUrl and these fill it in once ready.
	// Both no-op for files already carrying a URL, so re-running processFiles()
	// on an unchanged file (e.g. re-ingesting an already-staged batch) doesn't
	// kick off a redundant decode.
	function attachFileProgressThumbnail(file: File) {
		getImagePreview(file).then((preview) => {
			if (!preview.thumbUrl) return;
			const fp = fileProgress.find((x) => x.file === file);
			if (fp && !fp.thumbnailUrl) fp.thumbnailUrl = preview.thumbUrl;
		});
	}

	function attachBlockedThumbnail(file: File) {
		getImagePreview(file).then((preview) => {
			if (!preview.thumbUrl) return;
			const blocked = oversizedFiles.find((x) => x.file === file);
			if (blocked && !blocked.thumbnailUrl) blocked.thumbnailUrl = preview.thumbUrl;
		});
	}

	// Only the visible head of the queue is decoded; the rest sit behind the
	// "+N" tile and get theirs when they move up.
	function attachQueuedThumbnails() {
		queuedFiles.slice(0, QUEUE_VISIBLE).forEach(({ file, thumbnailUrl }) => {
			if (thumbnailUrl) return;
			getImagePreview(file).then((preview) => {
				if (!preview.thumbUrl) return;
				const held = queuedFiles.find((q) => q.file === file);
				if (held && !held.thumbnailUrl) held.thumbnailUrl = preview.thumbUrl;
			});
		});
	}

	// Front for files sent back out of the tray (they were next in line), back
	// for a new drop's overflow. Anything past QUEUE_HOLD_LIMIT is let go.
	function holdInQueue(items: QueuedFile[], end: 'front' | 'back') {
		if (!queueEnabled) {
			items.forEach((q) => releaseImagePreview(q.file));
			return;
		}
		const next = end === 'front' ? [...items, ...queuedFiles] : [...queuedFiles, ...items];
		next.slice(QUEUE_HOLD_LIMIT).forEach((q) => releaseImagePreview(q.file));
		queuedFiles = next.slice(0, QUEUE_HOLD_LIMIT);
		attachQueuedThumbnails();
	}

	function removeQueued(file: File) {
		releaseImagePreview(file);
		queuedFiles = queuedFiles.filter((q) => q.file !== file);
		attachQueuedThumbnails();
	}

	// A 429 mid-run: whatever did not convert goes back to the front of the
	// queue, where it was dropped before the queue existed. Completed entries'
	// previews are the caller's to release.
	function returnUnfinishedToQueue() {
		holdInQueue(
			fileProgress
				.filter((fp) => fp.status !== 'complete')
				.map((fp) => ({ file: fp.file, thumbnailUrl: fp.thumbnailUrl })),
			'front'
		);
		selectedFiles = [];
		fileProgress = [];
	}

	// Moves the head of the queue into the tray whenever the tray has room: after
	// a run, after a removal. Staged, not started: the visitor still presses
	// Convert, so the cap stays one press per batch rather than vanishing.
	//
	// The allowance rule is the same one processFiles applies to a fresh drop:
	// some uploads left but fewer than staged trims back to what they cover; at
	// zero the tray fills anyway, so the allowance box can offer the routes.
	function refillFromQueue(): number {
		const room = batchLimit - selectedFiles.length;
		if (room <= 0 || queuedFiles.length === 0) return 0;
		const pulled = queuedFiles.slice(0, room);
		queuedFiles = queuedFiles.slice(room);
		selectedFiles = [...selectedFiles, ...pulled.map((q) => q.file)];
		fileProgress = [
			...fileProgress,
			...pulled.map((q) => ({
				file: q.file,
				progress: 0,
				phase: 'uploading' as const,
				status: 'pending' as const,
				thumbnailUrl: q.thumbnailUrl
			}))
		];
		pulled.forEach((q) => {
			if (!q.thumbnailUrl) attachFileProgressThumbnail(q.file);
		});
		totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
		if (
			hasCheckedTokens &&
			Number.isFinite(availableTokens) &&
			availableTokens > 0 &&
			selectedFiles.length > availableTokens
		) {
			trimToAvailable();
		}
		attachQueuedThumbnails();
		posthog.capture('batch_queue_refilled', {
			pulled: pulled.length,
			queued: queuedFiles.length,
			tier: userTier
		});
		return pulled.length;
	}

	async function processFiles(allFiles: File[]) {
		// Await both before applying any limit, so paid-user ceilings (25 files,
		// 75MB) are in force immediately rather than after files have already
		// been sliced to standard-tier defaults. userTier/batchLimit/maxFileSize
		// are derived, so they re-read correctly the moment these land.
		const [snapshot, resolvedJwt] = await Promise.all([getPlanSnapshot(), getSessionToken()]);
		plan = snapshot.plan;
		planQuota = snapshot.quota;
		isAuthed = !!resolvedJwt;

		// A fresh ingest supersedes the previous one's trim notice.
		allowanceTrim = null;
		legacyTrim = null;

		// Rejections raised by THIS ingest, committed in one place at the end.
		// They used to be written straight to errorMessage and read back later,
		// which meant a clean drop re-committed the previous drop's message: add a
		// .txt, then add a valid photo, and "1 file(s) not supported" stayed up
		// over a batch that was fine. One ingest now produces exactly one banner
		// state, and every exit path goes through commitIngestNotices.
		const rejections: { text: string; key?: UploadErrorKey }[] = [];

		function commitIngestNotices() {
			errorMessage = rejections.map((r) => r.text).join(' ');
			// First keyed rejection wins the help link: an ingest that rejects on
			// two different grounds is rare, and one link beats two competing ones.
			errorKey = rejections.find((r) => r.key)?.key;
			successMessage = '';
		}

		const { kept, skipped: metadataSkipped } = withoutMacMetadata(allFiles);
		allFiles = kept;
		if (allFiles.length === 0 && metadataSkipped > 0) {
			rejections.push({ text: MAC_METADATA_ONLY_MESSAGE, key: 'unsupported_format' });
			commitIngestNotices();
			return;
		}

		const invalidFiles = allFiles.filter((f) => {
			const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
			return !ACCEPTED_MIME_TYPES.has(f.type) && !ACCEPTED_EXTENSIONS.has(ext);
		});
		if (invalidFiles.length > 0) {
			rejections.push({
				text: `${invalidFiles.length} file(s) not supported. Accepted: JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF, JXL, GIF, SVG.`,
				key: 'unsupported_format'
			});
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
						overMax: r.size.size > FILE_SIZE_LIMIT_PAID,
						thumbnailUrl: undefined as string | undefined
					}));
				// Capped like the staging tray: a drop of fifty large files should
				// make the point, not fill the card with identical error rows. The
				// ones past the cap never get a thumbnail decoded for them at all
				// (nothing to revoke — see attachBlockedThumbnail below).
				const room = Math.max(0, batchLimit - oversizedFiles.length);
				const accepted = newlyBlocked.slice(0, room);
				oversizedFiles = [...oversizedFiles, ...accepted];
				accepted.forEach((b) => attachBlockedThumbnail(b.file));
				posthog.capture('file_size_blocked', {
					error_key: 'file_too_large',
					files: oversized.length,
					limit_mb: maxFileSizeMb,
					tier: userTier
				});
			}
			if (unreadable.length > 0) {
				rejections.push({
					text: `${unreadable.length} file${unreadable.length !== 1 ? 's' : ''} couldn't be read and ${unreadable.length === 1 ? 'was' : 'were'} skipped. If it's stored in iCloud or a cloud drive, open the original to download it first, then try again.`,
					key: 'incomplete_image'
				});
			}
			allFiles = resolved
				.filter((r) => !r.size.unreadable && !r.size.exceededLimit)
				.map((r) => r.file);
			if (allFiles.length === 0) {
				commitIngestNotices();
				return;
			}
		}

		// Bytes that stop before the container says they should. OBSERVE ONLY: the
		// files still upload. See the same block in PromptFormApp for why blocking
		// on this signal was wrong, and $lib/truncationCheck for what it measures.
		for (const f of allFiles) {
			const trunc = await checkTruncation(f);
			if (!trunc.truncated) continue;
			posthog.capture('upload_truncated_preflight', {
				container: trunc.container ?? 'unknown',
				reason: trunc.reason ?? 'unknown',
				short_by: trunc.shortBy ?? -1,
				size: f.size,
				surface: 'manual'
			});
		}

		// Queued files count as already added: re-dropping one must not stage a
		// second copy of it ahead of the queue.
		const existingFileKeys = new Set(
			[...selectedFiles, ...queuedFiles.map((q) => q.file)].map((f) => `${f.name}-${f.size}`)
		);
		const newFiles = allFiles.filter((f) => !existingFileKeys.has(`${f.name}-${f.size}`));

		// Everything that could be staged if there were no cap, then what the cap
		// allows now. The rest is held in the queue, not dropped.
		const eligibleFiles = [...selectedFiles, ...newFiles];
		const combinedFiles = eligibleFiles.slice(0, batchLimit);
		const addedCount = combinedFiles.length - selectedFiles.length;
		const overflow = eligibleFiles.slice(batchLimit);

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
				thumbnailUrl: undefined
			};
		});
		combinedFiles.forEach(attachFileProgressThumbnail);
		totalOriginalSize = combinedFiles.reduce((sum, file) => sum + file.size, 0);

		// A cap overflow is not a rejection — the files are legal, there are just
		// too many for one batch on this tier — so they wait in the queue under
		// the batch box rather than the red error slot. Rejections raised earlier
		// in this ingest still go to the error banner, because they name files
		// that are not in the tray at all: the one outcome a user cannot diagnose
		// from what's on screen in front of them.
		if (addedCount === 0 && newFiles.length === 0) {
			// No key: nothing failed, so there is nothing for the guide to explain.
			rejections.push({ text: 'All selected files are already in the list.' });
		} else if (overflow.length > 0) {
			await resolveQueueVariant();
			if (!queueEnabled) {
				legacyTrim = { staged: combinedFiles.length, offered: eligibleFiles.length };
			}
			holdInQueue(
				overflow.map((file) => ({ file })),
				'back'
			);
			// Name kept for continuity with the pre-queue baseline; `dropped` now
			// counts files queued rather than discarded.
			posthog.capture('batch_cap_trimmed', {
				error_key: 'batch_trimmed',
				cap: batchLimit,
				dropped: overflow.length,
				queued: queuedFiles.length,
				tier: userTier,
				queue: queueEnabled
			});
		}
		commitIngestNotices();

		// Deliberately after truncation: sufficiency is judged against what is
		// actually staged (capped at batchLimit), never the raw dropped count, so
		// a 5-file drop on a 3-file plan asks for 3 operations and not 5.
		await checkTokenLimit();

		// Some uploads left but fewer than staged: stage what the allowance
		// covers, the way the batch cap does, and let the allowance box say so.
		// At zero there is nothing to stage, so the tray stays as dropped and the
		// box offers the routes instead.
		if (
			hasCheckedTokens &&
			Number.isFinite(availableTokens) &&
			availableTokens > 0 &&
			selectedFiles.length > availableTokens
		) {
			const offered = legacyTrim?.offered ?? selectedFiles.length + queuedFiles.length;
			trimToAvailable();
			allowanceTrim = { staged: selectedFiles.length, offered };
		}
	}

	// Decimal MB to one place, so a size reads the same as in Finder (26.6MB,
	// not the 25.32 MiB formatFileSize gives). The limits are enforced in MiB,
	// to match core (utils/PlanLimits.h), which is ~5% more than the MB the copy
	// states: the copy can under-promise but never over-promise.
	function sizeMb(bytes: number): string {
		return `${(bytes / 1_000_000).toFixed(1)}MB`;
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
				: limitTier === 'day'
					? `${monthlyUploadsRemaining} / ${monthlyQuota} Day Pass uploads left`
					: `${monthlyUploadsRemaining} / ${monthlyQuota} monthly uploads left`
	);

	// The two limits are routinely confused with each other — users read "3" on
	// the badge and assume it is the batch cap, or trim to 3 and expect the
	// monthly count to stop falling. Say which is which, in the same breath.
	//
	// The reset clause used to say "on the 1st" for every tier, which is wrong
	// across the board: guest and free buckets are a rolling 30-day window
	// seeded on first use after the last one expired (TokenBucket.ts), not
	// calendar-anchored, and paid buckets reset on the Polar subscription's
	// billing date (see api/webhooks/polar), not the 1st either.
	const resetClause = $derived(
		userTier === 'guest'
			? 'Guest uploads are counted against your IP address and reset 30 days after you start using them'
			: userTier === 'free'
				? 'Your monthly allowance resets 30 days after you start using it'
				: 'Your monthly allowance resets on your billing date'
	);
	const usageHint = $derived(
		`${resetClause}. Separately, you can stage up to ${batchLimit} files (${maxFileSizeMb}MB each) in one go. That is a per-batch cap, not a monthly one, so you can run batch after batch until the monthly total runs out.`
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

	// Secondary action on the token wall: convert what the allowance covers
	// instead of paying. The overflow goes back to the front of the queue, with
	// its thumbnails, rather than being discarded.
	function trimToAvailable() {
		if (!Number.isFinite(availableTokens)) return;
		if (selectedFiles.length <= trimTarget) return;
		holdInQueue(
			fileProgress
				.slice(trimTarget)
				.map((fp) => ({ file: fp.file, thumbnailUrl: fp.thumbnailUrl })),
			'front'
		);
		selectedFiles = selectedFiles.slice(0, trimTarget);
		fileProgress = fileProgress.slice(0, trimTarget);
		totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
		posthog.capture('token_wall_trimmed', { kept: trimTarget, tier: userTier, auto: true });
	}

	// Drop one blocked card. Kept separate from removeFile because the two lists
	// are separate: nothing here indexes into fileProgress.
	function removeOversized(files: File[]) {
		const drop = new Set(files);
		files.forEach((f) => releaseImagePreview(f));
		oversizedFiles = oversizedFiles.filter((b) => !drop.has(b.file));
	}

	const hasOversized = $derived(oversizedFiles.length > 0);
	// Over this tier's limit but within 75MB: a Day Pass or a paid plan takes
	// these. Only a guest or free account can have any.
	const inBandFiles = $derived(oversizedFiles.filter((b) => !b.overMax));
	// Over 75MB: nothing takes these, so their rows carry no route and the
	// unlock button does not count them.
	const overMaxFiles = $derived(oversizedFiles.filter((b) => b.overMax));
	const sizeRouteOffered = $derived(
		dayPassOffered && inBandFiles.length > 0 && (limitTier === 'guest' || limitTier === 'free')
	);

	// Backstop for the paths that never fire a dragover: the file picker, and
	// files handed over by a parent surface.
	$effect(() => {
		if (stagedCount > 0 || hasOversized) loadLocalPrices();
	});

	// Everything the user handed us was oversized — there is nothing to convert,
	// so the CTA becomes the upgrade that would make the batch convertible.
	const blockedByFileSize = $derived(hasOversized && stagedCount === 0);

	// The allowance box's primary route. Guests and free accounts get the Day
	// Pass (it is the only thing that converts today), as does a pass holder
	// who has used theirs up. Subscribers never do: their route is the next tier.
	//
	// A pass holder only once the pass is used up: a second pass reseeds the
	// bucket at 100 rather than adding to it, so buying one with uploads still
	// left would throw those away.
	const allowanceDayPass = $derived(
		dayPassOffered &&
			(limitTier === 'guest' ||
				limitTier === 'free' ||
				(limitTier === 'day' && Number.isFinite(availableTokens) && availableTokens <= 0))
	);
	const nextTier = $derived(
		limitTier === 'seller'
			? { name: 'Pro', ops: PRO_OPS }
			: limitTier === 'pro'
				? { name: 'Growth', ops: GROWTH_OPS }
				: null
	);
	// What this tier's monthly allowance is called in the allowance box.
	const allowanceTotal = $derived(
		limitTier === 'guest' ? GUEST_QUOTA : limitTier === 'day' ? DAY_PASS_OPS : monthlyQuota
	);

	// The CTA states the outcome and the format, and recounts as thumbnails are
	// removed. 'jpeg' is normalised to JPG so the button matches the extension
	// the user actually receives.
	const outputLabel = $derived((imageType === 'jpeg' ? 'jpg' : imageType).toUpperCase());
	const convertLabel = $derived(
		`Convert ${stagedCount} image${stagedCount !== 1 ? 's' : ''} to ${outputLabel}`
	);

	// ---- Queue copy (test arm) ---------------------------------------------
	// content-ops handoff 2026-10-23-batch-queue-messages. Files converted on
	// this page this visit, across runs, so the post-batch lines can say
	// "{done} done, {N} to go"; {N} is everything still here, batch and queue.
	let doneThisVisit = $state(0);
	const filesLeft = $derived(stagedCount + queuedFiles.length);
	// A pass is 100 uploads, so "all {N}" is only promised when it covers them.
	const passCovers = (n: number) => (n > DAY_PASS_OPS ? `${DAY_PASS_OPS} of them` : `all ${n}`);
	// The batch-cap box offers a guest or free account the route that fits the
	// number of files dropped (content-ops handoff 2026-10-26-batch-cap-box-
	// routes-by-drop-size): the pass while it covers the drop, in one batch or
	// in batches of 25, then the smallest plan whose month holds it. One "25
	// per batch" line for every drop read as "not enough" at 60 files, and
	// offered a pass covering a quarter of a 400-file drop.
	type CapRoute = 'pass_one_batch' | 'pass_batches' | 'seller' | 'pro' | 'growth';
	const capRoute = (n: number): CapRoute =>
		n <= BATCH_LIMIT_PAID
			? 'pass_one_batch'
			: n <= DAY_PASS_OPS
				? 'pass_batches'
				: n <= SELLER_OPS
					? 'seller'
					: n <= PRO_OPS
						? 'pro'
						: 'growth';
	// The box's clicks carry the drop size and what was offered, so the click
	// rate per band reads straight off the click.
	const capClick = (n: number, planOffered: string) => ({
		trigger: 'batch_cap_banner',
		source: 'batch_cap_box',
		files_dropped: n,
		plan_offered: planOffered
	});
	// Change 4: shown once in this tab after a signup or a pass unlocks the queue.
	let unlockNote = $state('');

	// ---- Banner state -----------------------------------------------------
	// Everything below derives from staged files and the token count. Nothing
	// here is assigned imperatively, so no banner can outlive the state that
	// produced it: remove a file and the whole chain re-evaluates.

	type Banner =
		| { kind: 'error'; text: string }
		| { kind: 'allowance'; k: number; n: number }
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
			: allowanceTrim
				? { kind: 'allowance', k: allowanceTrim.staged, n: allowanceTrim.offered }
				: insufficientTokens
					? { kind: 'allowance', k: trimTarget, n: stagedCount }
					: queuedFiles.length > 0 || legacyTrim
						? { kind: 'batch-cap' }
						: hasCheckedTokens && stagedCount > 0 && monthlyUploadsRemaining > 0
							? { kind: 'limits-ok' }
							: null
	);

	// Change 2: a guest who has converted something, used the month, and still
	// has files here. The moment with the most intent, so the pass is primary.
	const guestWallWithQueue = $derived(
		queueEnabled &&
			limitTier === 'guest' &&
			activeBanner?.kind === 'allowance' &&
			activeBanner.k === 0 &&
			doneThisVisit > 0 &&
			filesLeft > 0
	);

	function handleButtonClick() {
		if (isLoading) return;

		if (blockedByFileSize) {
			// Files over 75MB have no route, so a tray of only those has no action.
			if (inBandFiles.length === 0) return;
			if (sizeRouteOffered) {
				posthog.capture('day_pass_cta_clicked', {
					trigger: 'button_click_file_size',
					source: 'size_row'
				});
				// Opens the checkout as an overlay on this page. The hidden form below
				// is only the fallback now — see `startDayPassCheckout`.
				void startDayPassCheckout({
					next: dayPassReturnTo,
					trigger: 'button_click_file_size',
					fallbackForm: dayPassDirectForm,
					onPaid: handleDayPassPaid
				});
			} else {
				// A free account does not lift the size limit, so a guest is not
				// sent to sign up for it: the modal's paid route is the fix.
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
			// Mirrors the allowance box's primary route (see allowanceButtonLabel).
			if (allowanceDayPass) {
				posthog.capture('day_pass_cta_clicked', {
					trigger: 'button_click_no_tokens',
					source: 'allowance_box'
				});
				void startDayPassCheckout({
					next: dayPassReturnTo,
					trigger: 'button_click_no_tokens',
					fallbackForm: dayPassDirectForm,
					onPaid: handleDayPassPaid
				});
			} else if (!isAuthed) {
				posthog.capture('signup_cta_clicked', {
					trigger: 'button_click_no_tokens',
					source: 'allowance_box'
				});
				void goto(registerHref);
			} else {
				posthog.capture('upgrade_cta_clicked', {
					trigger: 'button_click_no_tokens',
					source: 'allowance_box'
				});
				void goto('/pricing');
			}
			return;
		}

		compressImage();
	}

	function resolveContentType(file: File): string {
		if (file.type) return file.type;
		const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
		const MIME_BY_EXT: Record<string, string> = {
			heic: 'image/heic',
			heif: 'image/heif',
			hif: 'image/heif',
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			webp: 'image/webp',
			avif: 'image/avif',
			jxl: 'image/jxl',
			gif: 'image/gif',
			svg: 'image/svg+xml'
		};
		return MIME_BY_EXT[ext] ?? 'application/octet-stream';
	}

	// `auto` is a paid run carrying on into the queue (see continueDrain).
	async function compressImage(auto = false) {
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
		// Set again only by a run that finishes cleanly with more queued.
		continueDrain = false;

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

		// One drain, however many runs the queue takes, is one finish to announce.
		if (!auto) {
			drainStart = { at: Date.now(), files: 0 };
			// A signup's note stands until they press Convert; a pass's until its run ends.
			if (!unlockNote.startsWith('Day Pass')) unlockNote = '';
		}
		drainStart.files += selectedFiles.length;

		posthog.capture('manual_compress_started', {
			files: selectedFiles.length,
			format: imageType,
			authed: !!jwt,
			// Separates "converted the trimmed 3" from an ordinary start in the
			// limit-box reads; the boxes' own CTAs carry the same source.
			...(auto
				? { source: 'queue_auto' }
				: activeBanner?.kind === 'batch-cap'
					? { source: 'batch_cap_box' }
					: activeBanner?.kind === 'allowance'
						? { source: 'allowance_box' }
						: hasOversized
							? { source: 'size_row' }
							: {})
		});

		errorMessage = '';
		errorKey = undefined;
		errorDecoder = undefined;
		successMessage = '';
		allowanceTrim = null;
		legacyTrim = null;
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
			quotaExhausted = false;
			const totalBytes = selectedFiles.reduce((sum, f) => sum + effectiveSize(f), 0);
			let uploadedBytes = 0;

			// With two files in flight they are usually in different phases (one
			// uploading while the other processes), and writing processPhase from
			// both made the bar flick between them. Each file records its own phase
			// and the bar shows the earliest stage any in-flight file is in: the
			// batch's upload progress first, then a download, then processing.
			// Nothing in flight (between one file and the next) keeps the last value
			// rather than flashing the bar away.
			const filePhases: Record<number, 'uploading' | 'processing' | 'downloading'> = {};
			const showPhase = () => {
				for (const p of ['uploading', 'downloading', 'processing'] as const) {
					if (Object.values(filePhases).includes(p)) {
						processPhase = p;
						return;
					}
				}
			};
			const setPhase = (index: number, phase: 'uploading' | 'processing' | 'downloading') => {
				filePhases[index] = phase;
				showPhase();
			};

			const processFile = async (index: number) => {
				const file = selectedFiles[index];
				fileProgress[index].status = 'processing';

				try {
					const ALLOWED_FORMATS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'jxl']);
					const safeType = ALLOWED_FORMATS.has(imageType) ? imageType : 'jpg';

					let blob: Blob;
					// With WebSocket available every file takes the resumable path,
					// as on /flow: the bytes go over the socket (a drop costs one
					// 64 KB frame, not the file), and core holds the result until
					// it has downloaded. Same params as /v1/squish, solution-page
					// queryParams included. Where WebSocket is blocked, large files
					// fall back to 1 MB HTTP chunks inside uploadChunked and small
					// ones keep the single POST below.
					if (effectiveSize(file) > CHUNK_THRESHOLD_BYTES || wsAvailable()) {
						let lastLoaded = 0;
						const chunkedParams: ChunkedUploadParams = {
							type: safeType,
							stripExif: stripExif ? '1' : '0'
						};
						if (smartCompress) chunkedParams.smartCompress = '1';
						if (lossless && LOSSLESS_FORMATS.includes(safeType)) chunkedParams.lossless = '1';
						if (resizeApplies) {
							chunkedParams.width = String(resizeTarget);
							chunkedParams.height = String(resizeTarget);
						}
						if (queryParams)
							new URLSearchParams(queryParams).forEach((v, k) => (chunkedParams[k] = v));

						blob = await uploadChunked(uploadBodyOf(file), API_URL, chunkedParams, {
							jwt,
							client: TOOL_CLIENT,
							transport: 'ws',
							holdResult: true,
							onUploadProgress: (loaded) => {
								const delta = loaded - lastLoaded;
								lastLoaded = loaded;
								uploadedBytes += delta;
								uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
							},
							onPhaseChange: (phase) => {
								setPhase(index, phase);
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
									const transfer = trackTransfer(xhr, effectiveSize(file));
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
										setPhase(index, 'uploading');
										uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
									});

									xhr.upload.addEventListener('load', () => {
										uploadedBytes += effectiveSize(file) - lastLoaded;
										lastLoaded = effectiveSize(file);
										uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
										setPhase(index, 'processing');
										downloadPercent = 0;
									});

									xhr.addEventListener('progress', (e) => {
										setPhase(index, 'downloading');
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
														detected: readDetectedHeader(xhr),
														decoder: readDecoderHeader(xhr),
														// What the add-time pre-flight thought of this same file.
														// Joined with `decoder` above, this is the whole question:
														// of the corrupt-image rejections, how many did the
														// container already declare short, and how many short
														// files never got rejected at all.
														preflightTruncated: truncationVerdictOf(file)?.truncated,
														file
													});
												}
												const { message, key } = uploadErrorMessage(
													xhr.status,
													serverText,
													rejectLabel
												);
												const error: any = new Error(message);
												error.status = xhr.status;
												error.errorKey = key;
												// The decoder's own sentence splits corrupt-image into a
												// truly truncated file vs a decode gap on our side; it
												// rides along on the help-link event for that anchor only.
												error.decoder = readDecoderHeader(xhr);
												error.rejectLabel = rejectLabel;
												reject(error);
											})();
										}
									});

									xhr.addEventListener('error', () => {
										rollback();
										const error: any = new Error('Network error');
										error.retryable = true;
										error.errorKey = 'network_error';
										error.transfer = transfer();
										reject(error);
									});
									xhr.addEventListener('abort', () => {
										rollback();
										reject(new Error('Upload cancelled'));
									});

									const squishParams = new URLSearchParams({
										type: safeType,
										stripExif: stripExif ? '1' : '0'
									});
									if (smartCompress) squishParams.append('smartCompress', '1');
									if (lossless && LOSSLESS_FORMATS.includes(safeType))
										squishParams.append('lossless', '1');
									if (resizeApplies) {
										squishParams.set('width', String(resizeTarget));
										squishParams.set('height', String(resizeTarget));
									}
									if (queryParams)
										new URLSearchParams(queryParams).forEach((v, k) => squishParams.append(k, v));
									xhr.open('POST', `${API_URL}/v1/squish?${squishParams}&${TOOL_CLIENT}`);
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
						quotaExhausted = true;
						fileProgress[index].error = 'Rate limit exceeded';
						fileProgress[index].errorKey = 'quota_exhausted';
						if (!jwt) {
							showSignupCta = true;
							posthog.capture('signup_cta_shown', { trigger: 'rate_limit' });
						} else {
							showUpgradeCta = true;
							posthog.capture('upgrade_cta_shown', { trigger: 'rate_limit' });
						}
					} else {
						fileProgress[index].error = error instanceof Error ? error.message : 'Unknown error';
						fileProgress[index].errorKey = error?.errorKey;
						fileProgress[index].errorDecoder = error?.decoder;
						fileProgress[index].errorRejectLabel = error?.rejectLabel;
						// After the last retry: can the browser still read the file at
						// all? A file it cannot read fails every attempt identically,
						// which is the Android picker case xhrTransfer.ts describes.
						if (error?.transfer)
							fileProgress[index].errorTransfer = {
								...error.transfer,
								file_readable: await probeReadable(uploadBodyOf(file))
							};
					}
				} finally {
					delete filePhases[index];
					showPhase();
				}
			};

			// A pool rather than fixed batches: each worker takes the next file as
			// soon as its last one is done, so one slow file never holds its
			// partner's slot idle. A 429 stops both workers taking NEW files; a
			// file already in flight still finishes. processFile never rejects (it
			// records every failure on fileProgress), so Promise.all is safe.
			let nextFile = 0;
			const worker = async () => {
				while (!hitRateLimit && nextFile < selectedFiles.length) await processFile(nextFile++);
			};
			await Promise.all(
				Array.from({ length: Math.min(CONCURRENT_UPLOADS, selectedFiles.length) }, worker)
			);

			const successfulFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'complete');
			const failedFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'error');

			if (successfulFiles.length === 0) {
				if (hitRateLimit) {
					// Nothing converted, so the whole tray goes back in line rather
					// than being dropped; the refill re-stages it under the
					// allowance box once the token check reports zero.
					returnUnfinishedToQueue();
					await checkTokenLimit();
					refillFromQueue();
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
				const firstFailure = fileProgress.find((fp) => fp.error);
				const allFailed: any = new Error(firstFailure?.error ?? 'All files failed to convert');
				// No per-file key means nothing classified the failure, which is the
				// should-be-unreachable fallback: send those readers to the guide's
				// "Processing Failed" section rather than to a bare scroll.
				allFailed.errorKey = firstFailure?.errorKey ?? 'processing_failed';
				allFailed.decoder = firstFailure?.errorDecoder;
				allFailed.rejectLabel = firstFailure?.errorRejectLabel;
				allFailed.transfer = firstFailure?.errorTransfer;
				throw allFailed;
			}

			// Held rather than downloaded here: a paid run that carries on into the
			// queue adds to the same download (see flushResults in the finally).
			const extension = imageType === 'jpeg' ? 'jpg' : imageType;
			selectedFiles.forEach((file, i) => {
				if (fileProgress[i].status !== 'complete') return;
				heldResults.push({
					name: `${file.name.replace(/\.[^/.]+$/, '')}.${extension}`,
					blob: compressedBlobs[i]
				});
			});

			// Compare against the successful files' original sizes only, so failed
			// files don't inflate the reported savings.
			const successfulOriginalSize = successfulFiles.reduce((sum, f) => sum + f.size, 0);
			drainTotals.runs += 1;
			drainTotals.files += successfulFiles.length;
			doneThisVisit += successfulFiles.length;
			drainTotals.original += successfulOriginalSize;
			drainTotals.compressed += totalCompressedSize;

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

			if (successfulFiles.length > 0) recordToolUse(page.url.pathname);
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
						successfulOriginalSize ? ((delta / successfulOriginalSize) * 100).toFixed(1) : '0.0'
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
						: `Done! ${selectedFiles.length} images optimized. Saved ${deltaSize} total.`;
				}
			}

			if (hitRateLimit) {
				fileProgress.forEach((fp) => {
					if (fp.status === 'complete') releaseImagePreview(fp.file);
				});
				returnUnfinishedToQueue();
			} else {
				// Only revoke thumbnails for entries being removed — failed/pending
				// files stay in the list and still need theirs.
				fileProgress.forEach((fp) => {
					if (fp.status === 'complete') releaseImagePreview(fp.file);
				});
				selectedFiles = selectedFiles.filter((_, i) => fileProgress[i].status !== 'complete');
				fileProgress = fileProgress.filter((fp) => fp.status !== 'complete');
			}
			totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

			if (fileInputElement) fileInputElement.value = '';
			await checkTokenLimit();
			// After the token check, so the refill applies the fresh allowance.
			const pulled = refillFromQueue();

			// A paid tier runs straight through the queue: they bought the pass or
			// plan so as not to press Convert per batch. Free tiers keep the press,
			// which is the thing the Day Pass removes. Any failure, a 429 or an
			// allowance that cannot cover the refill stops the run for the
			// visitor to look at; carrying on would retry a failing file forever.
			continueDrain =
				userTier === 'pro' &&
				pulled > 0 &&
				failedFiles.length === 0 &&
				!hitRateLimit &&
				!insufficientTokens;
		} catch (error) {
			const failureKey: UploadErrorKey | undefined =
				(error as any)?.errorKey ?? (isNetworkError(error) ? 'network_error' : undefined);
			// The diagnosis rides on the failure itself, so one event says which
			// case it was without joining upload_reject by session. The fuller
			// record (pre-flight, HEIF items, file) is on that upload_reject.
			posthog.capture('manual_compress_failed', {
				error_key: failureKey ?? 'unknown',
				error: error instanceof Error ? error.message : String(error),
				reject_label: (error as any)?.rejectLabel ?? 'unknown',
				decoder: (error as any)?.decoder ?? 'unknown',
				...transferProps(error)
			});
			// An interrupted/offline fetch (Safari's "Load failed") is an expected
			// network condition, not a code bug — the breadcrumb above and the
			// error message below cover it; don't report it as an exception.
			if (!isNetworkError(error)) posthog.captureException(error);
			errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
			errorKey = failureKey;
			errorDecoder = (error as any)?.decoder;
		} finally {
			// Every exit path downloads what it holds unless the queue run is
			// carrying on, and even then a full part goes out (RESULTS_PER_ZIP).
			if (!continueDrain) {
				await flushResults(true);
				// Only for a run that emptied tray and queue: anything left behind
				// (a failure, a 429) keeps the last run's message, which says so.
				if (drainTotals.runs > 1 && selectedFiles.length === 0 && queuedFiles.length === 0)
					successMessage = drainSummary();
				drainTotals = { runs: 0, files: 0, original: 0, compressed: 0 };
				unlockNote = '';
				// Anything left in the tray after a run is a failure or a 429.
				const ok = !errorMessage && fileProgress.every((fp) => fp.status === 'complete');
				batchTitle.finish(ok);
				notifyBatchDone({
					surface: 'manual',
					ok,
					body: (ok ? successMessage : errorMessage || successMessage) || 'Your batch finished.',
					files: drainStart.files,
					startedAt: drainStart.at
				});
			} else if (heldResults.length >= RESULTS_PER_ZIP) {
				await flushResults(false);
			}
			isLoading = false;
			processPhase = 'idle';
			isRetrying = false;
			if (continueDrain) void compressImage(true);
		}
	}

	// Converted files waiting to be downloaded. One run of a free tier flushes
	// at its end, as before; a paid run through the queue keeps adding until
	// the queue is empty, so a 52-file shoot is one zip, not three. Past
	// RESULTS_PER_ZIP the results go out as numbered parts, because every held
	// blob is in memory and a 1,700-file drop held whole would take the tab
	// down. 100 is also the Day Pass allowance, so a pass holder gets one zip.
	const RESULTS_PER_ZIP = 100;
	let heldResults: { name: string; blob: Blob }[] = [];
	let zipPart = 0;
	// Not reactive: only ever read when a run finishes.
	let continueDrain = false;
	let drainTotals = { runs: 0, files: 0, original: 0, compressed: 0 };
	// Also not reactive: when the drain began and how many files it has run,
	// for the finished-batch notification.
	let drainStart = { at: 0, files: 0 };

	// The run's count in the tab title, for a visitor who switched away.
	const batchTitle = createBatchTitle();
	$effect(() => {
		if (!isLoading) return;
		const done = fileProgress.filter(
			(fp) => fp.status === 'complete' || fp.status === 'error'
		).length;
		batchTitle.progress(done, fileProgress.length);
	});
	$effect(() => () => batchTitle.reset());

	async function flushResults(final: boolean) {
		const entries = heldResults;
		heldResults = [];
		if (entries.length === 0) {
			if (final) zipPart = 0;
			return;
		}
		if (final && zipPart === 0 && entries.length === 1) {
			downloadBlob(entries[0].blob, entries[0].name);
		} else {
			// Runs from compressImage's finally, so it must not throw: a throw
			// there would leave isLoading latched and the button dead.
			try {
				const zipBlob = await zipBlobs(entries);
				const name =
					final && zipPart === 0
						? 'compressed-images.zip'
						: `compressed-images-part-${++zipPart}.zip`;
				downloadBlob(zipBlob, name);
			} catch (error) {
				posthog.captureException(error);
				errorMessage = 'Your images converted, but the zip could not be built. Please try again.';
			}
		}
		if (final) zipPart = 0;
	}

	// The per-run message would only describe the last batch of a queue run.
	function drainSummary(): string {
		const delta = drainTotals.original - drainTotals.compressed;
		return delta < 0
			? `Done! ${drainTotals.files} images processed. ${formatFileSize(drainTotals.compressed)} total.`
			: `Done! ${drainTotals.files} images optimized. Saved ${formatFileSize(delta)} total.`;
	}

	// The signup and the Day Pass both happen in another tab: register is a
	// link, checkout opens its own tab, and an anonymous pass is activated by a
	// magic link from the buyer's inbox. This tab, which holds the files, used
	// to stay on the guest limits until a reload, and a reload loses the files.
	// So when the visitor comes back with files waiting and something to
	// unlock, the tier is read again: a signup lifts the allowance (the press
	// per batch stays), a Day Pass or plan lifts the cap and starts the run.
	let recheckingTier = false;
	async function recheckTier() {
		if (!queueEnabled || recheckingTier || isLoading) return;
		if (stagedCount === 0 && queuedFiles.length === 0) return;
		if (userTier === 'pro' && !insufficientTokens) return;
		recheckingTier = true;
		try {
			const before = userTier;
			const wasBlocked = insufficientTokens;
			invalidatePlanCache();
			const [snapshot, jwt] = await Promise.all([getPlanSnapshot(), getSessionToken()]);
			plan = snapshot.plan;
			planQuota = snapshot.quota;
			isAuthed = !!jwt;
			// Re-read the allowance even on an unchanged tier: a subscriber who
			// topped up with a pass stays 'pro' but is no longer blocked.
			await checkTokenLimit();
			const upgraded = userTier !== before && (before === 'guest' || userTier === 'pro');
			if (!upgraded && !(wasBlocked && !insufficientTokens)) return;
			if (isLoading) return;
			allowanceTrim = null;
			legacyTrim = null;
			refillFromQueue();
			const here = selectedFiles.length + queuedFiles.length;
			const files = `${here} file${here !== 1 ? 's' : ''}`;
			if (limitTier === 'day' && !insufficientTokens)
				unlockNote = `Day Pass active. Converting your ${files} now.`;
			else if (before === 'guest' && userTier === 'free')
				unlockNote = `You're signed in: ${FREE_PLAN_QUOTA} uploads a month. Your ${files} ${here !== 1 ? 'are' : 'is'} still here.`;
			posthog.capture('queue_unlocked', {
				from: before,
				to: userTier,
				staged: selectedFiles.length,
				queued: queuedFiles.length
			});
			if (userTier === 'pro' && selectedFiles.length > 0 && !insufficientTokens) {
				void compressImage(true);
			}
		} finally {
			recheckingTier = false;
		}
	}

	$effect(() => {
		const onReturn = () => {
			if (document.visibilityState === 'visible') void recheckTier();
		};
		document.addEventListener('visibilitychange', onReturn);
		window.addEventListener('focus', onReturn);
		return () => {
			document.removeEventListener('visibilitychange', onReturn);
			window.removeEventListener('focus', onReturn);
		};
	});

	// Leaving mid-run would throw away results that were already charged for.
	$effect(() => {
		if (!isLoading) return;
		const warn = (e: BeforeUnloadEvent) => {
			if (heldResults.length === 0 && !continueDrain) return;
			e.preventDefault();
		};
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	});

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
		fileProgress.forEach((fp) => releaseImagePreview(fp.file));
		oversizedFiles.forEach((b) => releaseImagePreview(b.file));
		queuedFiles.forEach((q) => releaseImagePreview(q.file));
		selectedFiles = [];
		fileProgress = [];
		oversizedFiles = [];
		queuedFiles = [];
		totalOriginalSize = 0;
		errorMessage = '';
		errorKey = undefined;
		errorDecoder = undefined;
		allowanceTrim = null;
		legacyTrim = null;
		successMessage = '';
		unlockNote = '';
		doneThisVisit = 0;
		imageType = output;
		if (fileInputElement) fileInputElement.value = '';
	}

	function removeFile(index: number) {
		releaseImagePreview(fileProgress[index].file);
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		fileProgress = fileProgress.filter((_, i) => i !== index);
		totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

		// The allowance notice names a staged count that this removal has just
		// made wrong, so it goes. Everything else re-evaluates on its own:
		// insufficientTokens and the CTA counter both derive from stagedCount,
		// and skip notices refer to files that never entered the tray at all.
		allowanceTrim = null;
		legacyTrim = null;
		// The freed slot goes to the next queued file. Not mid-run: the run
		// indexes into selectedFiles.
		if (!isLoading) refillFromQueue();
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
	<!-- Fallback target for the Day Pass offer made by the main action button
	     (see handleButtonClick). A form rather than a link because the checkout
	     is POST-only: the hosted Polar URL this replaced minted a real checkout
	     session on every crawl. Submitted natively only if the JSON fetch in
	     `startDayPassCheckout` fails. -->
	{#if dayPassOffered}
		<form
			bind:this={dayPassDirectForm}
			method="POST"
			action={DAY_PASS_ACTION}
			target="_blank"
			rel="noopener noreferrer"
			class="hidden"
		>
			<input type="hidden" name="next" value={dayPassReturnTo} />
			<input type="hidden" name="trigger" value="button_click_file_size" />
		</form>
	{/if}

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
		<div
			class="m-4 flex items-start gap-3 rounded-2xl border border-[#F06292]/20 bg-[#FFF5F7] px-4 py-4 sm:m-6"
		>
			<div
				class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F06292]/10"
			>
				<svg class="h-4 w-4 text-[#F06292]" fill="currentColor" viewBox="0 0 20 20">
					<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
					<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
				</svg>
			</div>
			<div class="min-w-0 flex-1">
				{#if dayPassPaidAuthed}
					<p class="text-sm font-black text-[#4A2C2C]">Payment received</p>
					<p class="mt-0.5 text-xs text-[#6C3F31]/70">
						Your Day Pass switches on in a few seconds: 100 image ops for 24 hours.
					</p>
				{:else if dayPassNeedsSignIn}
					<p class="text-sm font-black text-[#4A2C2C]">Payment received. Sign in to use it</p>
					<p class="mt-0.5 text-xs text-[#6C3F31]/70">
						That email already has a Mochify account, and your Day Pass is on it.
						<a
							href={dayPassSignIn()}
							target="_blank"
							class="font-extrabold text-[#F06292] underline underline-offset-2">Sign in</a
						>{#if stagedCount + queuedFiles.length > 0}, then come back to this tab and your files
							pick up here{/if}.
					</p>
				{:else}
					<p class="text-sm font-black text-[#4A2C2C]">Payment received. Check your email</p>
					<p class="mt-0.5 text-xs text-[#6C3F31]/70">
						We've sent a magic link to activate your Day Pass. Click it to unlock 100 image ops for
						24 hours.{#if stagedCount + queuedFiles.length > 0}
							Your files stay here and pick up when you come back to this tab.{/if}
					</p>
					{#if paidCheckoutUrl}
						<button
							type="button"
							onclick={resendLink}
							disabled={resending || (resendState !== null && !resendState.again)}
							class="mt-1.5 text-xs font-extrabold text-[#F06292] underline underline-offset-2 disabled:cursor-default disabled:no-underline disabled:opacity-80"
						>
							{resending ? 'Sending…' : (resendState?.text ?? 'Resend the link')}
						</button>
					{/if}
				{/if}
			</div>
			<button
				onclick={() => (dayPassSuccess = false)}
				aria-label="Dismiss"
				class="flex-shrink-0 text-[#875F42]/40 transition-colors hover:text-[#875F42]"
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
		</div>
	{/if}

	{#if resizeOptions.length > 0}
		<div
			class="flex flex-wrap items-center gap-2 border-b border-pink-50 px-4 py-3 sm:px-6"
			role="radiogroup"
			aria-label={resizeOptionsLabel}
		>
			<span class="mr-1 text-xs font-semibold text-[#6C3F31]">{resizeOptionsLabel}</span>
			{#each [0, ...resizeOptions] as opt (opt)}
				<label class="cursor-pointer">
					<input
						type="radio"
						name={resizeGroupName}
						value={opt}
						bind:group={resizeChoice}
						disabled={isLoading}
						class="peer sr-only"
					/>
					<span
						class="inline-block rounded-full border border-pink-100 px-3 py-1 text-xs font-bold text-[#6C3F31] transition-colors peer-checked:border-[#F06292] peer-checked:bg-[#F06292] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#F06292]/40 peer-disabled:opacity-60 hover:border-[#F06292]/50"
						>{opt === 0 ? 'Original' : opt}</span
					>
				</label>
			{/each}
		</div>
	{/if}

	<!-- The thumbnails and empty-state blocks both stay mounted and toggle via CSS
         (not {#if}/{:else}). With a conditional swap, the <label for="file-input">
         that opens the picker unmounts the instant the first file lands, and iOS
         Safari drops that first selection — you'd have to pick again. Keeping both
         <label> triggers permanently mounted (as PromptForm does) fixes it. -->
	<div
		class="relative flex flex-wrap items-center gap-3 px-4 pt-6 pb-3 sm:px-6"
		class:hidden={selectedFiles.length === 0 && queuedFiles.length === 0}
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
								releaseImagePreview(fp.file);
								fp.thumbnailUrl = undefined;
							}}
						/>
					{:else}
						<div
							class="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-xl bg-white/40"
						>
							<svg
								class="h-5 w-5 text-[#FFB3C6]"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
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
						class="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#F06292] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-red-500"
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

		<!-- The queue: files past the batch cap, waiting for the next batch.
             Frosted so they read as "yours, not yet" rather than as part of this
             batch; the batch box below says what moves them. -->
		{#each queuedFiles.slice(0, QUEUE_VISIBLE) as queued (queued.file)}
			<div class="group relative flex-shrink-0" title="{queued.file.name} (next batch)">
				<div
					class="relative h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-pink-200 bg-[#FDFBF7] p-1"
				>
					{#if queued.thumbnailUrl}
						<img
							src={queued.thumbnailUrl}
							alt="{queued.file.name}, waiting for the next batch"
							width="64"
							height="64"
							draggable="false"
							class="h-full w-full scale-110 rounded-xl object-cover opacity-60 blur-[3px]"
						/>
					{:else}
						<div class="h-full w-full rounded-xl bg-pink-50"></div>
					{/if}
					<div class="absolute inset-0 flex items-center justify-center">
						<svg
							class="h-5 w-5 text-[#F06292]/80 drop-shadow-sm"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</div>
				</div>
				<button
					onclick={() => removeQueued(queued.file)}
					class="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#F06292] opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-110 hover:bg-white hover:text-red-500 focus-visible:opacity-100"
					title="Remove file"
					aria-label="Remove {queued.file.name}"
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
			</div>
		{/each}
		{#if queuedFiles.length > QUEUE_VISIBLE}
			<div
				class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-[#FFF9FB] text-sm font-black text-[#F06292]/80"
				title="{queuedFiles.length - QUEUE_VISIBLE} more waiting for the next batch"
			>
				+{queuedFiles.length - QUEUE_VISIBLE}
			</div>
		{/if}

		<!-- Add more -->
		<label
			for="file-input"
			class="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-[#FFF9FB] text-[#F06292]/70 transition-all hover:scale-105 hover:border-[#F06292] hover:text-[#F06292]"
			aria-label="Add more images"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
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
		class:hidden={selectedFiles.length > 0 || queuedFiles.length > 0}
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
         outside the staging tray because they are not staged. Two kinds, kept
         apart because only one has a fix: over this tier's limit but within
         75MB (a Day Pass or a paid plan takes it), and over 75MB (nothing does,
         so the row says so and offers no route; selling a pass against it was
         a false promise). Three or more in-band files collapse to one line. -->
	{#snippet blockedThumb(blocked: BlockedFile)}
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
					onerror={() => {
						releaseImagePreview(blocked.file);
						blocked.thumbnailUrl = undefined;
					}}
				/>
			{:else}
				<div
					class="flex h-full w-full items-center justify-center rounded-lg text-[7px] font-bold tracking-wide text-[#EF5350] uppercase"
				>
					{blocked.file.name.split('.').pop()}
				</div>
			{/if}
		</div>
	{/snippet}
	{#snippet removeBlocked(files: File[], label: string)}
		<button
			onclick={() => removeOversized(files)}
			class="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-red-400 transition-colors hover:bg-white hover:text-red-600"
			aria-label={label}
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
	{/snippet}
	<!-- The batch-cap box's route for a guest or free account, by drop size
	     (see capRoute). Both batch-queue arms render it: the control as pill
	     buttons, the test arm as links, because there Convert is the only
	     primary action. -->
	{#snippet capRouteBlock(n: number, buttons: boolean)}
		{@const route = capRoute(n)}
		{@const primary = buttons
			? 'rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]'
			: 'cursor-pointer text-left text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]'}
		{@const arrow = buttons ? '' : ' ›'}
		{@const link =
			'cursor-pointer text-left text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]'}
		{@const facts = 'text-xs font-medium text-[#6C3F31]/70'}
		{@const freshFree =
			limitTier === 'free' ? ` When it ends, your free ${FREE_PLAN_QUOTA} starts fresh.` : ''}
		{@const noSignup = limitTier === 'guest' ? 'No signup needed. ' : ''}
		{#if route === 'pass_batches' && dayPassOffered}
			<p class="mt-1 text-xs font-bold text-cocoa-deep">
				Your {n} files fit in a Day Pass: {DAY_PASS_OPS} uploads today, {BATCH_LIMIT_PAID} at a time.
			</p>
		{:else if route === 'seller'}
			<p class="mt-1 text-xs font-bold text-cocoa-deep">
				{n} files is more than a Day Pass covers ({DAY_PASS_OPS} in 24 hours). Seller converts {SELLER_OPS}
				a month, {BATCH_LIMIT_PAID} at a time.
			</p>
		{:else if route === 'pro'}
			<p class="mt-1 text-xs font-bold text-cocoa-deep">
				{n} files is more than Seller's {SELLER_OPS} a month. Pro converts {PRO_OPS.toLocaleString(
					'en-US'
				)}
				a month, {BATCH_LIMIT_PAID} at a time.
			</p>
		{:else if route === 'growth'}
			<p class="mt-1 text-xs font-bold text-cocoa-deep">
				{n.toLocaleString('en-US')} files is more than Pro's {PRO_OPS.toLocaleString('en-US')} a month.
				Growth converts {GROWTH_OPS.toLocaleString('en-US')} a month, {BATCH_LIMIT_PAID} at a time.
			</p>
		{/if}
		<div class="mt-1.5 flex flex-col items-start gap-1 sm:max-w-sm">
			{#if route === 'pass_one_batch' || route === 'pass_batches'}
				{#if dayPassOffered}
					<DayPassButton
						onPaid={handleDayPassPaid}
						trigger="batch_cap_banner"
						source="batch_cap_box"
						properties={{ files_dropped: n, plan_offered: 'day_pass' }}
						class={primary}
					>
						{route === 'pass_one_batch'
							? `Day Pass (${dayPassPrice}): all ${n} in one batch`
							: `Convert all ${n} with a Day Pass (${dayPassPrice})`}{arrow}
					</DayPassButton>
					<p class={facts}>
						{route === 'pass_one_batch'
							? `${noSignup}${DAY_PASS_OPS} uploads today, ${BATCH_LIMIT_PAID} at a time, files up to ${paidFileSizeMb}MB.${freshFree}`
							: `${noSignup}Lasts 24 hours; files up to ${paidFileSizeMb}MB.${freshFree}`}
					</p>
					{#if route === 'pass_batches'}
						<a
							href="/pricing"
							onclick={() => posthog.capture('upgrade_cta_clicked', capClick(n, 'seller'))}
							class={link}
						>
							Converting this many every month? Seller is {SELLER_OPS} a month, {BATCH_LIMIT_PAID} at
							a time.
						</a>
					{/if}
				{:else}
					<a
						href="/pricing"
						onclick={() => posthog.capture('upgrade_cta_clicked', capClick(n, 'seller'))}
						class={primary}
					>
						Upgrade from {cheapestPlanPrice}/mo for {BATCH_LIMIT_PAID} at a time{arrow}
					</a>
				{/if}
				{#if limitTier === 'guest'}
					<a
						href={registerHref}
						onclick={() => posthog.capture('signup_cta_clicked', capClick(n, 'signup'))}
						class={link}
					>
						Or sign up free: {FREE_PLAN_QUOTA} uploads a month, {BATCH_LIMIT_STANDARD} at a time
					</a>
				{/if}
			{:else}
				{@const offer =
					route === 'seller'
						? { name: 'Seller', price: cheapestPlanPrice, ops: SELLER_OPS }
						: route === 'pro'
							? { name: 'Pro', price: proPlanPrice, ops: PRO_OPS }
							: { name: 'Growth', price: growthPlanPrice, ops: GROWTH_OPS }}
				<a
					href="/pricing"
					onclick={() => posthog.capture('upgrade_cta_clicked', capClick(n, route))}
					class={primary}
				>
					{offer.name} ({offer.price}/mo): {offer.ops.toLocaleString('en-US')} a month{arrow}
				</a>
				<p class={facts}>Files up to {paidFileSizeMb}MB.</p>
				{#if route === 'seller' && dayPassOffered}
					<DayPassButton
						onPaid={handleDayPassPaid}
						trigger="batch_cap_banner"
						source="batch_cap_box"
						properties={{ files_dropped: n, plan_offered: 'day_pass' }}
						class={link}
					>
						Or a Day Pass ({dayPassPrice}) for {DAY_PASS_OPS} of them today, {BATCH_LIMIT_PAID} at a time
					</DayPassButton>
				{/if}
			{/if}
		</div>
	{/snippet}

	{#snippet sizeRoute()}
		{#if sizeRouteOffered}
			<DayPassButton
				onPaid={handleDayPassPaid}
				trigger="file_size_card"
				source="size_row"
				class="underline underline-offset-2 hover:text-red-900"
			>
				Day Pass ({dayPassPrice}): files up to {paidFileSizeMb}MB
			</DayPassButton>
		{:else}
			<a
				href="/pricing"
				onclick={() =>
					posthog.capture('upgrade_cta_clicked', { trigger: 'file_size_card', source: 'size_row' })}
				class="underline underline-offset-2 hover:text-red-900"
			>
				Seller and Pro: {paidFileSizeMb}MB files
			</a>
		{/if}
	{/snippet}
	{#if hasOversized}
		<div class="flex flex-col gap-2 px-4 sm:px-6 {stagedCount === 0 ? 'pt-4' : 'pt-3'}">
			{#if inBandFiles.length >= 3}
				<div
					class="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5"
				>
					{@render blockedThumb(inBandFiles[0])}
					<div class="min-w-0 flex-1 text-xs font-bold text-red-700">
						{inBandFiles.length} files are over the {maxFileSizeMb}MB free limit ({inBandFiles
							.map((b) => sizeMb(b.size))
							.join(', ')}).
						{@render sizeRoute()}
						<LimitsWhy errorKey="file_too_large" surface="file_size_card" class="ml-1.5" />
					</div>
					{@render removeBlocked(
						inBandFiles.map((b) => b.file),
						`Remove the ${inBandFiles.length} files over ${maxFileSizeMb}MB`
					)}
				</div>
			{:else}
				{#each inBandFiles as blocked (blocked.file.name + blocked.file.size)}
					<div
						class="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5"
					>
						{@render blockedThumb(blocked)}
						<div class="min-w-0 flex-1">
							<p class="truncate text-xs font-bold text-[#4A2C2C]">{blocked.file.name}</p>
							<div class="mt-0.5 text-xs font-bold text-red-700">
								Over the {maxFileSizeMb}MB free limit ({sizeMb(blocked.size)}).
								{@render sizeRoute()}
								<LimitsWhy errorKey="file_too_large" surface="file_size_card" class="ml-1.5" />
							</div>
						</div>
						{@render removeBlocked([blocked.file], `Remove ${blocked.file.name}`)}
					</div>
				{/each}
			{/if}
			{#each overMaxFiles as blocked (blocked.file.name + blocked.file.size)}
				<div
					class="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5"
				>
					{@render blockedThumb(blocked)}
					<div class="min-w-0 flex-1">
						<p class="truncate text-xs font-bold text-[#4A2C2C]">{blocked.file.name}</p>
						<div class="mt-0.5 text-xs font-bold text-red-700">
							This file is {sizeMb(blocked.size)}. No plan takes files over {paidFileSizeMb}MB;
							resize or compress it on your computer first.
							<LimitsWhy errorKey="file_too_large" surface="file_size_card" class="ml-1.5" />
						</div>
					</div>
					{@render removeBlocked([blocked.file], `Remove ${blocked.file.name}`)}
				</div>
			{/each}
			{#if sizeRouteOffered}
				<!-- Once under the rows, not per row: what the pass is, then the
                     subscription for anyone who will hit this every month. -->
				<p class="px-1 text-xs font-medium text-[#6C3F31]/70">
					{limitTier === 'guest'
						? 'The Day Pass needs no signup.'
						: `When the Day Pass ends, your free ${FREE_PLAN_QUOTA} starts fresh.`}
					Or
					<a
						href="/pricing"
						onclick={() =>
							posthog.capture('upgrade_cta_clicked', {
								trigger: 'file_size_card',
								source: 'size_row'
							})}
						class="font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
						>Seller and Pro: {paidFileSizeMb}MB files every month.</a
					>
				</p>
			{/if}
		</div>
	{/if}

	<!-- Toggles -->
	{#if (showExifOption || showSmartMode || showResizeOption || (showLosslessOption && losslessApplies)) && selectedFiles.length > 0}
		<div class="flex flex-wrap gap-x-6 gap-y-3 px-4 pt-3 pb-3 sm:px-6">
			{#if showResizeOption}
				<label class="group flex cursor-pointer items-center gap-2.5 select-none">
					<input type="checkbox" bind:checked={resizeLongEdgeOn} class="sr-only" />
					<div
						class="relative h-5 w-10 rounded-full transition-all duration-300 {resizeLongEdgeOn
							? 'bg-[#F06292] shadow-[0_0_0_1px_#F06292]'
							: 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}"
					>
						<div
							class="absolute top-[3px] left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-300 {resizeLongEdgeOn
								? 'translate-x-5'
								: ''}"
						></div>
					</div>
					<span
						class="text-xs font-semibold text-[#6C3F31] transition-colors group-hover:text-[#4A2C2C]"
						>{resizeLabel}</span
					>
				</label>
			{/if}
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
			{#if showLosslessOption && losslessApplies}
				<label class="group flex cursor-pointer items-center gap-2.5 select-none">
					<input type="checkbox" bind:checked={lossless} class="sr-only" />
					<div
						class="relative h-5 w-10 rounded-full transition-all duration-300 {lossless
							? 'bg-[#F06292] shadow-[0_0_0_1px_#F06292]'
							: 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}"
					>
						<div
							class="absolute top-[3px] left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-300 {lossless
								? 'translate-x-5'
								: ''}"
						></div>
					</div>
					<span
						class="text-xs font-semibold text-[#6C3F31] transition-colors group-hover:text-[#4A2C2C]"
						>Lossless</span
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

	<!-- After a signup or a pass unlocks the queue in this tab (Change 4 of the
         queue handoff). Gives way to the run's own success message. -->
	{#if unlockNote && !successMessage}
		<div
			class="mx-4 mb-3 rounded-2xl border border-green-100 bg-[#F0FDF4] px-4 py-3 text-xs font-bold text-[#33691E] sm:mx-6"
			role="status"
		>
			{unlockNote}
		</div>
	{/if}

	<!-- Success is orthogonal to the banner chain: it only exists after a run,
         when every ingest-time condition has already been cleared. -->
	{#if successMessage}
		<div
			class="mx-4 mb-3 flex items-start gap-2 rounded-2xl border border-green-100 bg-[#F0FDF4] px-4 py-3 sm:mx-6"
		>
			<svg
				class="mt-0.5 h-4 w-4 flex-shrink-0 text-[#66BB6A]"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"
				/>
			</svg>
			<div class="flex flex-col gap-1">
				<p class="text-xs font-bold text-[#33691E]">{successMessage}</p>
				{#if quotaExhausted}
					<UploadHelpLink
						errorKey="quota_exhausted"
						surface="rate_limit_notice"
						label="What does this mean?"
						class="self-start text-[#33691E]"
					/>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Single banner slot. Exactly one of these renders (see activeBanner):
         error > allowance > batch-cap > limits-ok. A trimmed batch is a
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
					{#if limitTier === 'guest'}
						<p class="text-xs font-bold text-[#33691E]">{usageLabel}.</p>
						<p class="text-xs font-medium text-[#33691E]/80">
							Up to {batchLimit} files per batch, {maxFileSizeMb}MB each. This batch uses {stagedCount}
							of your monthly uploads.
						</p>
					{:else}
						<p class="text-xs font-bold text-[#33691E]">
							{Math.max(0, monthlyUploadsRemaining - stagedCount)} uploads left
							{limitTier === 'day' ? 'on your Day Pass' : 'this month'} after this batch.
						</p>
						<p class="text-xs font-medium text-[#33691E]/80">
							Up to {batchLimit} files per batch, {maxFileSizeMb}MB each.
						</p>
					{/if}
				{:else if activeBanner.kind === 'batch-cap'}
					<!-- What happened, the route that fixes it, one line of facts about
                         that route, the secondary route, the fallback (content-ops
                         handoff 2026-10-20-uploader-limit-messages). It opens on the
                         count rather than the restriction: the first draft led with
                         "3 are also your uploads for this month", which a guest read
                         as "3 is all you get" before learning an account gives 25.

                         Only a paid plan or a Day Pass raises the per-batch cap, so
                         signing up is offered for what it actually buys (the monthly
                         allowance), never as a way round the cap. Subscribers are
                         never offered a Day Pass. -->
					{@const k = legacyTrim?.staged ?? stagedCount}
					{@const n = legacyTrim?.offered ?? stagedCount + queuedFiles.length}
					{#if !legacyTrim}
						<!-- Test arm of batch-queue: content-ops handoff
						     2026-10-23-batch-queue-messages, Changes 1 and 3. Before
						     anything has converted, Convert is the only primary action,
						     so routes are links here; after a batch the line counts
						     what is done and what is left. -->
						{@const q = queuedFiles.length}
						{@const afterBatch = doneThisVisit > 0 && limitTier !== 'day' && userTier !== 'pro'}
						<p class="text-xs font-bold text-cocoa-deep">
							{#if afterBatch}
								{doneThisVisit} done, {n} to go. The next {k}
								{k === 1 ? 'is' : 'are'} ready.
							{:else}
								{k} of your {n} files {k === 1 ? 'is' : 'are'} in this batch.
								{#if limitTier === 'guest'}
									Convert {k === 1 ? 'it' : 'these'} free now; the other {q} wait here for a free account
									or a Day Pass.
								{:else if limitTier === 'free'}
									The next {BATCH_LIMIT_STANDARD} line up after each one{#if hasCheckedTokens}; you
										have {monthlyUploadsRemaining} uploads left this month{/if}.
								{:else}
									The rest follow on their own, {BATCH_LIMIT_PAID} at a time.
								{/if}
							{/if}
						</p>
						{#if limitTier === 'guest' || limitTier === 'free'}
							{@render capRouteBlock(n, false)}
						{:else if limitTier === 'day' && hasCheckedTokens && n > monthlyUploadsRemaining}
							<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
								More than your pass covers?
								<a
									href="/pricing"
									onclick={() =>
										posthog.capture('upgrade_cta_clicked', {
											trigger: 'batch_cap_banner',
											source: 'batch_cap_box'
										})}
									class="font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
									>Seller is {SELLER_OPS} uploads a month.</a
								>
							</p>
						{/if}
					{:else}
						<p class="text-xs font-bold text-cocoa-deep">
							{k} of your {n} files {k === 1 ? 'is' : 'are'} in this batch.
							{#if limitTier === 'guest'}
								Free converts {BATCH_LIMIT_STANDARD} at a time. Without an account that's also the monthly
								total; a free account makes it {FREE_PLAN_QUOTA} a month.
							{:else if limitTier === 'free'}
								Free converts {BATCH_LIMIT_STANDARD} at a time{#if hasCheckedTokens}; you have {monthlyUploadsRemaining}
									uploads left this month{/if}.
							{:else if limitTier === 'day'}
								The Day Pass converts {BATCH_LIMIT_PAID} at a time{#if hasCheckedTokens}; you have {monthlyUploadsRemaining}
									uploads left on it{/if}.
							{:else}
								Your plan converts {BATCH_LIMIT_PAID} at a time{#if hasCheckedTokens}; you have {monthlyUploadsRemaining}
									uploads left this month{/if}.
							{/if}
						</p>
						{#if limitTier === 'guest' || limitTier === 'free'}
							{@render capRouteBlock(n, true)}
							<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
								{#if legacyTrim}
									{limitTier === 'guest'
										? `Or convert ${k === 1 ? 'this one' : `these ${k}`} now and come back with an account or a Day Pass for the rest.`
										: `Or convert ${k === 1 ? 'this one' : `these ${k}`} now and drop the next ${BATCH_LIMIT_STANDARD} after.`}
								{:else}
									{limitTier === 'guest'
										? `Or convert ${k === 1 ? 'this one' : `these ${k}`} now. The rest stay here for when you have an account or a Day Pass.`
										: `Or convert ${k === 1 ? 'this one' : `these ${k}`} now. The next ${BATCH_LIMIT_STANDARD} line up straight after.`}
								{/if}
							</p>
						{:else}
							<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
								{#if legacyTrim}
									Convert {k === 1 ? 'this one' : `these ${k}`}, then drop the rest.
								{:else}
									Convert {k === 1 ? 'this one' : `these ${k}`}. The rest line up straight after.
								{/if}
							</p>
							{#if limitTier === 'day' && hasCheckedTokens && n > monthlyUploadsRemaining}
								<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
									More than your pass covers?
									<a
										href="/pricing"
										onclick={() =>
											posthog.capture('upgrade_cta_clicked', {
												trigger: 'batch_cap_banner',
												source: 'batch_cap_box'
											})}
										class="font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
										>Seller is {SELLER_OPS} uploads a month.</a
									>
								</p>
							{/if}
						{/if}
					{/if}
					<LimitsWhy
						errorKey="batch_trimmed"
						surface="batch_cap_banner"
						label={legacyTrim ? 'Why was my batch trimmed?' : `Why ${batchLimit} at a time?`}
						class="mt-1.5 self-start text-[#8D6E63]"
					/>
				{:else if activeBanner.kind === 'allowance'}
					<!-- The monthly allowance (or the pass's 100) cannot cover what was
                         dropped. Same shape as the batch box. At zero nothing was
                         staged for conversion; above zero the tray was trimmed to what
                         the allowance covers (see processFiles), and the box says so.

                         Guests, free accounts and pass holders lead with the Day Pass,
                         the one route that converts today. Subscribers are never
                         offered one; their route is the next tier. -->
					{@const k = activeBanner.k}
					{@const n = activeBanner.n}
					{#if guestWallWithQueue}
						<!-- Change 2 of the queue handoff: something converted, the month
						     is used, files are waiting. Replaces "Nothing has been
						     uploaded", which is false right after a successful batch. -->
						<p class="text-xs font-bold text-cocoa-deep">
							{doneThisVisit} done, {filesLeft} to go.
						</p>
						<div class="mt-1.5 flex flex-col items-start gap-1">
							<DayPassButton
								onPaid={handleDayPassPaid}
								trigger="token_wall_banner"
								source="allowance_box"
								class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
							>
								Convert {passCovers(filesLeft)} now: Day Pass ({dayPassPrice})
							</DayPassButton>
							<p class="text-xs font-medium text-[#6C3F31]/70">
								No signup needed. {DAY_PASS_OPS} uploads today, {BATCH_LIMIT_PAID} at a time, files up
								to
								{paidFileSizeMb}MB.
							</p>
							<a
								href={registerHref}
								onclick={() =>
									posthog.capture('signup_cta_clicked', {
										trigger: 'token_wall_banner',
										source: 'allowance_box'
									})}
								class="text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
							>
								Or sign up free: {FREE_PLAN_QUOTA} uploads a month, {BATCH_LIMIT_STANDARD} at a time
							</a>
							<p class="text-xs font-medium text-[#6C3F31]/70">
								Your {filesLeft} file{filesLeft !== 1 ? 's' : ''} stay here while you do either.
							</p>
						</div>
					{:else}
						<p class="text-xs font-bold text-cocoa-deep">
							{#if k === 0}
								{#if limitTier === 'guest'}
									You've used your {GUEST_QUOTA} free uploads for this month without an account. Nothing
									has been uploaded.
								{:else if limitTier === 'free'}
									{#if queueEnabled && doneThisVisit > 0 && filesLeft > 0}
										{doneThisVisit} done, {filesLeft} to go. You've used your {allowanceTotal} free uploads
										for this month.
									{:else}
										You've used your {allowanceTotal} free uploads for this month. Nothing has been uploaded.
									{/if}
								{:else if limitTier === 'day'}
									Your Day Pass has used its {DAY_PASS_OPS} uploads.
								{:else if nextTier}
									You've used this month's {allowanceTotal.toLocaleString('en-US')} uploads. {nextTier.name}
									is {nextTier.ops.toLocaleString('en-US')} a month.
								{:else}
									You've used this month's {allowanceTotal.toLocaleString('en-US')} uploads; the allowance
									resets on your billing date.
								{/if}
							{:else}
								{k} of your {n} files {k === 1 ? 'is' : 'are'} in this batch;
								{#if limitTier === 'guest'}
									{k === 1 ? "it's your last free upload" : "they're your last free uploads"} this month
									without an account.
								{:else if limitTier === 'free'}
									{k === 1 ? "it's your last free upload" : "they're your last free uploads"} this month.
								{:else if limitTier === 'day'}
									{k === 1
										? "it's the last upload on your Day Pass."
										: "they're the last uploads on your Day Pass."}
								{:else}
									{k === 1
										? "it's your last upload this month."
										: "they're your last uploads this month."}
									{#if nextTier}
										{nextTier.name} is {nextTier.ops.toLocaleString('en-US')} a month.
									{/if}
								{/if}
							{/if}
						</p>

						<div class="mt-1.5 flex flex-wrap items-start gap-x-3 gap-y-2">
							{#if allowanceDayPass}
								<DayPassButton
									onPaid={handleDayPassPaid}
									trigger="token_wall_banner"
									source="allowance_box"
									class="rounded-full bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-3.5 py-1.5 text-xs font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(240,98,146,0.5)]"
								>
									{limitTier === 'guest'
										? `Day Pass (${dayPassPrice}): ${DAY_PASS_OPS} uploads today, no signup needed`
										: limitTier === 'free'
											? `Day Pass (${dayPassPrice}): ${DAY_PASS_OPS} uploads today, then your free ${FREE_PLAN_QUOTA} starts fresh`
											: `New Day Pass (${dayPassPrice}): another ${DAY_PASS_OPS} uploads today`}
								</DayPassButton>
							{/if}
							{#if limitTier === 'guest'}
								<a
									href={registerHref}
									onclick={() =>
										posthog.capture('signup_cta_clicked', {
											trigger: 'token_wall_banner',
											source: 'allowance_box'
										})}
									class="py-1.5 text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
								>
									Sign up free: {FREE_PLAN_QUOTA} uploads a month
								</a>
							{:else if limitTier !== 'growth'}
								<a
									href="/pricing"
									onclick={() =>
										posthog.capture('upgrade_cta_clicked', {
											trigger: 'token_wall_banner',
											source: 'allowance_box'
										})}
									class="py-1.5 text-xs font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
								>
									{limitTier === 'free'
										? `Or Seller: ${SELLER_OPS} a month, ${BATCH_LIMIT_PAID} per batch, ${paidFileSizeMb}MB files.`
										: limitTier === 'day'
											? `For regular volume, Seller is ${SELLER_OPS} a month.`
											: 'Compare plans'}
								</a>
							{/if}
						</div>
						{#if limitTier === 'day' && k === 0}
							<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
								Or your free {FREE_PLAN_QUOTA} starts fresh when this pass ends.
							</p>
						{:else if k === 0 && limitTier === 'guest'}
							<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
								Or wait for the monthly reset.
							</p>
						{:else if k > 0}
							<p class="mt-1 text-xs font-medium text-[#6C3F31]/70">
								{#if stagedCount > k}
									Or
									<button
										type="button"
										onclick={trimToAvailable}
										class="cursor-pointer font-bold text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
										>trim to {k} file{k !== 1 ? 's' : ''}</button
									>
									and convert {k === 1 ? 'it' : 'them'} now.
								{:else}
									Or convert {k === 1 ? 'this one' : `these ${k}`} now.
								{/if}
							</p>
						{/if}
						<LimitsWhy
							errorKey="quota_exhausted"
							surface="token_wall_banner"
							class="mt-1.5 self-start text-[#8D6E63]"
						/>
					{/if}
				{:else}
					<p
						class="text-xs font-bold {activeBanner.kind === 'error'
							? 'text-red-700'
							: 'text-cocoa-deep'}"
					>
						{activeBanner.text}
					</p>
					<!-- The banner has no auto-dismiss: it stands until the next
                         action, so the link is still here when the reader comes
                         back from the guide. Shown only when something actually
                         failed - a duplicate-files notice has nothing to explain. -->
					{#if activeBanner.kind === 'error' && errorKey}
						<UploadHelpLink
							{errorKey}
							surface="manual_banner"
							decoder={errorKey === 'incomplete_image' ? errorDecoder : undefined}
							class="mt-1 self-start text-red-700"
						/>
					{/if}
				{/if}
			</div>
		</div>
	{/if}

	<!-- Also mounts on a tray of nothing-but-blocked files: that is precisely the
         state whose only way forward is the size upsell, and gating this block on
         selectedFiles alone used to make blockedByFileSize unreachable. -->
	{#if stagedCount > 0 || hasOversized}
		<!-- Submit / CTA button. Absent when the tray holds only files over 75MB:
             no plan takes them, so there is no action to offer. -->
		<div class="px-4 pb-4 sm:px-6" class:hidden={blockedByFileSize && inBandFiles.length === 0}>
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
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span
						>Converting {stagedCount} image{stagedCount !== 1 ? 's' : ''} to {outputLabel}…{#if queuedFiles.length > 0}
							({queuedFiles.length} queued){/if}</span
					>

					<!-- Active CTAs instead of a dead disabled state -->
				{:else if insufficientTokens}
					<svg
						class="h-4 w-4 transition-transform group-hover:scale-110"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<!-- Mirrors the banner's primary action rather than competing with
                     it. It used to say "Unlock with Day Pass — $2" while the banner
                     underneath offered a free account, so the two loudest elements
                     on the card pushed different products at the same moment. -->
					<span>
						{guestWallWithQueue
							? `Convert ${passCovers(filesLeft)} with a Day Pass (${dayPassPrice})`
							: allowanceDayPass
								? `Get a Day Pass to convert ${stagedCount} image${stagedCount !== 1 ? 's' : ''}`
								: !isAuthed
									? `Create free account to convert ${stagedCount} image${stagedCount !== 1 ? 's' : ''}`
									: 'See plans to continue'}
					</span>
				{:else if blockedByFileSize}
					<svg
						class="h-4 w-4 transition-transform group-hover:scale-110"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<!-- Counts only the 20-75MB files: nothing unlocks one over 75MB. -->
					<span>
						{sizeRouteOffered
							? `Unlock ${
									inBandFiles.length === oversizedFiles.length
										? `${inBandFiles.length} file${inBandFiles.length !== 1 ? 's' : ''}`
										: `${inBandFiles.length} of ${oversizedFiles.length} files`
								} with a Day Pass (${dayPassPrice}): files up to ${paidFileSizeMb}MB`
							: `Upgrade for ${paidFileSizeMb}MB files`}
					</span>
				{:else}
					<svg
						class="h-4 w-4 {stagedCount > 0 ? 'transition-transform group-hover:scale-110' : ''}"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
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
						<div
							class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] shadow-[0_0_10px_rgba(240,98,146,0.5)] transition-all duration-300 ease-out"
							style="width: {uploadPercent}%"
						></div>
					{:else if processPhase === 'processing'}
						<div
							class="animate-shimmer absolute inset-0 bg-gradient-to-r from-[#A5D6A7] via-[#66BB6A] to-[#A5D6A7] bg-[length:200%_100%] opacity-80"
						></div>
					{:else if processPhase === 'downloading'}
						<div
							class="h-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] shadow-[0_0_10px_rgba(165,214,167,0.5)] transition-all duration-300 ease-out"
							style="width: {downloadPercent}%"
						></div>
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
						{#if fileProgress.length + queuedFiles.length >= NOTIFY_MIN_FILES}
							· <NotifyMeLink surface="manual" />
						{/if}
					{:else if stagedCount > 0 || hasOversized}
						<!-- "in this batch", not "ready": nothing has been processed. -->
						{#if stagedCount > 0}
							{stagedCount} in this batch
						{/if}
						{#if queuedFiles.length > 0}
							· {queuedFiles.length} waiting
						{/if}
						{#if inBandFiles.length > 0}
							{#if stagedCount > 0}·{/if}
							{inBandFiles.length} over {maxFileSizeMb}MB
						{/if}
						{#if overMaxFiles.length > 0}
							{#if stagedCount > 0 || inBandFiles.length > 0}·{/if}
							{overMaxFiles.length} over {paidFileSizeMb}MB
						{/if}
						{#if stagedCount > 1 || hasOversized || queuedFiles.length > 0}
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
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]"
				>
					<svg
						class="h-6 w-6 text-[#F06292]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				{#if hasOversized}
					<h3 class="mb-2 text-lg font-bold text-[#4A2C2C]">File too large</h3>
					<p class="mb-6 text-sm leading-relaxed text-cocoa-milk/70">
						Your plan supports files up to {maxFileSizeMb}MB. Every paid plan handles up to {paidFileSizeMb}MB,
						from {cheapestPlanPrice}/mo, or a {dayPassPrice} Day Pass covers it for 24 hours.
					</p>
					<div class="flex flex-col gap-3">
						{#if dayPassOffered}
							<DayPassButton
								onPaid={handleDayPassPaid}
								trigger="upgrade_modal_file_size"
								class="block w-full rounded-2xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
							>
								Day Pass ({dayPassPrice}): files up to {paidFileSizeMb}MB
							</DayPassButton>
						{/if}
						<a
							href="/pricing"
							class="block rounded-2xl {dayPassOffered
								? 'border border-cocoa-milk/15 text-cocoa-deep hover:border-mochi-pink/30 hover:bg-[#FFF5F7] hover:text-mochi-pink'
								: 'bg-linear-to-br from-[#FF9EBB] to-mochi-pink text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]'} px-6 py-3 text-center text-sm font-black transition-all"
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
					<h3 class="mb-2 text-lg font-bold text-[#4A2C2C]">Monthly limit reached</h3>
					<p class="mb-6 text-sm leading-relaxed text-cocoa-milk/70">
						You've used your full image quota for this month. Upgrade for a higher limit, or wait
						for your monthly reset.
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
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]"
				>
					<svg
						class="h-6 w-6 text-[#F06292]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-bold text-[#4A2C2C]">Limit reached</h3>

				{#if dayPassOffered}
					<!-- Reached now only by a 429 or by a click that beat the token
                         check, both of which are count walls. The pitch is therefore
                         the count: this used to sell "75MB files and larger batches",
                         which are real Day Pass benefits but answer a limit this user
                         did not hit. Order matches the banner, free account first. -->
					<p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
						You've used your {GUEST_QUOTA} guest uploads for this month. A free account gives you {FREE_PLAN_QUOTA}
						a month. Or a Day Pass is {DAY_PASS_OPS} conversions in 24 hours for {dayPassPrice},
						with no subscription and no signup needed.
					</p>
					<div class="flex flex-col gap-3">
						<a
							href={registerHref}
							class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
						>
							Create free account for {FREE_PLAN_QUOTA}/mo
						</a>
						<DayPassButton
							onPaid={handleDayPassPaid}
							trigger="limit_reached_modal"
							class="block w-full rounded-2xl border border-[#875F42]/15 px-6 py-3 text-center text-sm font-bold text-[#6C3F31] transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
						>
							Day Pass ({dayPassPrice}): {DAY_PASS_OPS} uploads today
						</DayPassButton>
					</div>
				{:else}
					<p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
						Without an account you get 3 free images per month. Create a free account for 25
						images/month, or upgrade for even more.
					</p>
					<div class="flex flex-col gap-3">
						<a
							href={registerHref}
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
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-6px);
		}
		40% {
			transform: translateX(6px);
		}
		60% {
			transform: translateX(-4px);
		}
		80% {
			transform: translateX(4px);
		}
	}
	.animate-shake {
		animation: shake 0.4s ease-in-out;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
	.animate-shimmer {
		animation: shimmer 1.8s ease-in-out infinite;
	}
</style>
