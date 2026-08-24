<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { posthog } from '$lib/analytics';
	import { ogImageFor } from '$lib/og/cards.js';
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
	]);

	const showBlobs = $derived(
		BLOB_ROUTES.has(page.url.pathname) ||
		page.url.pathname.startsWith('/solutions') ||
		page.url.pathname.startsWith('/guides')
	);

	// Build-time OG card for this route (falls back to the generic card).
	// Pages set their own og:title/description; the shared image is injected here
	// so we don't have to repeat it across ~90 routes. See src/lib/og/cards.js.
	const ogImage = $derived(ogImageFor(page.url.pathname));

	// Import Outfit (Weights: 600, 700, 800, 900)
	import '@fontsource/outfit/600.css';
	import '@fontsource/outfit/700.css';
	import '@fontsource/outfit/800.css';
	import '@fontsource/outfit/900.css';

	// Import Nunito (Weights: 400, 500, 600, 700)
	import '@fontsource/nunito/400.css';
	import '@fontsource/nunito/500.css';
	import '@fontsource/nunito/600.css';
	import '@fontsource/nunito/700.css';

	// Preload the most-used weights so fonts arrive before first paint,
	// preventing the font-display:swap reflow that causes CLS.
	import qs400 from '@fontsource/nunito/files/nunito-latin-400-normal.woff2?url';
	import qs600 from '@fontsource/nunito/files/nunito-latin-600-normal.woff2?url';
	import qs700 from '@fontsource/nunito/files/nunito-latin-700-normal.woff2?url';
	import of700 from '@fontsource/outfit/files/outfit-latin-700-normal.woff2?url';
	import of800 from '@fontsource/outfit/files/outfit-latin-800-normal.woff2?url';
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={qs400} crossorigin="anonymous">
	<link rel="preload" as="font" type="font/woff2" href={qs600} crossorigin="anonymous">
	<link rel="preload" as="font" type="font/woff2" href={qs700} crossorigin="anonymous">
	<link rel="preload" as="font" type="font/woff2" href={of700} crossorigin="anonymous">
	<link rel="preload" as="font" type="font/woff2" href={of800} crossorigin="anonymous">
	<link rel="canonical" href="https://mochify.app{page.url.pathname}" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content="Mochify" />
	<meta name="twitter:image" content={ogImage} />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="Mochify" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<link rel="manifest" href="/site.webmanifest" />

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
