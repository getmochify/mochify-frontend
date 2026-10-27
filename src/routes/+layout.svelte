<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import { page, updated } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { posthog } from '$lib/analytics';
	import { ogImageFor, ogAltFor, ogSizeFor } from '$lib/og/cards.js';
	import BlobBackground from '$lib/components/BlobBackground.svelte';
	let { children, data } = $props();

	// Identify the signed-in user centrally, on every authenticated load. This is
	// the ONLY place Google/magic-link logins get identified: those flows redirect
	// off-page (accounts.google.com) so they can't call identify() inline the way
	// the email login/register pages do. Without this, an OAuth user keeps their
	// pre-login anonymous distinct_id forever while the same human on the email
	// path becomes an identified person — so PostHog counts one human as several.
	// Keyed by email to match the existing inline identify() calls (no split), and
	// guarded so it fires once per user rather than on every navigation.
	// Stale-build guard. After a deploy, an open tab still runs the old build,
	// and that build's route chunks are gone from the CDN (and, once the new
	// service worker activates, from its cache too), so its next client-side
	// navigation fails with "Importing a module script failed". hooks.client.ts
	// recovers from that with one reload, but Safari's back-forward cache
	// restores the stale page from memory after it, and the repeat failure
	// lands inside the reload cooldown and gets reported. Better not to fail
	// at all: once SvelteKit knows a new version is live (polled, see
	// version.pollInterval in svelte.config.js), turn the next navigation into
	// a full page load, which always fetches current HTML and chunks.
	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

	// A page restored from the back-forward cache, or a tab coming back into
	// view, may have sat out several deploys; check now rather than waiting
	// for the next poll, so the very next click is already a full load.
	$effect(() => {
		const check = () => void updated.check();
		const onPageShow = (event: PageTransitionEvent) => {
			if (event.persisted) check();
		};
		const onVisibility = () => {
			if (document.visibilityState === 'visible') check();
		};
		window.addEventListener('pageshow', onPageShow);
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			window.removeEventListener('pageshow', onPageShow);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});

	let identifiedEmail: string | null = null;
	$effect(() => {
		if (!browser) return;
		const email = data.user?.email;
		if (email && email !== identifiedEmail) {
			posthog.identify(email, { email });
			identifiedEmail = email;
		}
	});

	const BLOB_ROUTES = new Set([
		'/',
		'/flow',
		'/v2launch',
		'/v3launch',
		'/pricing',
		'/ebay-seller',
		'/vinted-seller',
		'/avif-to-jpg',
		'/avif-to-jpegxl',
		'/heic-to-jpeg',
		'/jpg-to-jpegxl',
		'/auth/login',
		'/auth/register',
		'/auth/forgot-password',
		'/auth/reset-password',
		'/contact',
		'/chrome-extension',
		'/mcp',
		'/guides',
	]);

	// Guides paint their own top-only wash, which scrolls away with the page;
	// the site-wide blobs are fixed and would track the reader down an article,
	// so only the /guides index (in BLOB_ROUTES) gets them.
	// Error pages too: a 404 can sit at any path, so the list can never match it.
	const showBlobs = $derived(
		BLOB_ROUTES.has(page.url.pathname) ||
			page.url.pathname.startsWith('/solutions') ||
			page.error !== null
	);

	// Build-time OG card for this route (falls back to the generic card).
	// Pages set their own og:description; og:title is mirrored from <title> in
	// hooks.server.ts, and the shared image is injected here
	// so we don't have to repeat it across ~90 routes. See src/lib/og/cards.js.
	const ogImage = $derived(ogImageFor(page.url.pathname));
	const ogAlt = $derived(ogAltFor(page.url.pathname));
	const ogSize = $derived(ogSizeFor(page.url.pathname));

	// Variable fonts: one file per face covers every weight, so font-black and
	// font-extrabold get the real 800/900 instead of a browser-faked bold (the
	// static Nunito set stopped at 700). Nothing is preloaded: four preloads
	// raced the render-blocking stylesheet and cost ~350ms of first paint on a
	// throttled phone (measured 2026-10-20). The metric-matched fallbacks in
	// layout.css stop the swap from shifting the layout instead.
	// The static @fontsource packages stay installed for scripts/generate-og.js.
	import '@fontsource-variable/outfit/wght.css';
	import '@fontsource-variable/nunito/wght.css';
</script>

<svelte:head>
	<link rel="canonical" href="https://mochify.app{page.url.pathname}" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content={String(ogSize.width)} />
	<meta property="og:image:height" content={String(ogSize.height)} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content={ogAlt} />
	<meta name="twitter:image" content={ogImage} />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="Mochify" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />

	<link rel="dns-prefetch" href="https://api.mochify.app">
	<link rel="preconnect" href="https://api.mochify.app" crossorigin="anonymous">

	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": "https://mochify.app/#organization",
		"name": "Mochify",
		"url": "https://mochify.app",
		"logo": {
			"@type": "ImageObject",
			"url": "https://mochify.app/logo.png"
		},
		"email": "hello@mochify.app",
		"address": {
			"@type": "PostalAddress",
			"streetAddress": "Suite RA01, 195-197 Wood Street",
			"addressLocality": "London",
			"postalCode": "E17 3NU",
			"addressCountry": "GB"
		},
		"sameAs": [
			"https://github.com/getmochify",
			"https://hub.docker.com/r/mochify/mochify-lite",
			"https://x.com/GetMochify",
			"https://www.linkedin.com/company/mochify/",
			"https://www.youtube.com/@GetMochify",
			"https://www.tiktok.com/@getmochify"
		]
	}
	</script>
</svelte:head>

<div class="min-h-screen flex flex-col">
	{#if showBlobs}<BlobBackground />{/if}
	{@render children()}
</div>
