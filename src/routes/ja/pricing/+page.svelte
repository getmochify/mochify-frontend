<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import { JA_PRICING } from '$lib/i18n/pricing.ja';
	import type { PageData } from './$types';

	// The same body as /pricing, with the Japanese string set and the `ja` locale.
	//
	// Polar charges in JPY for a Japanese connection (ledger v47), and every
	// figure comes from Polar rather than the copy, so a Japanese reader abroad
	// correctly sees their own currency instead of yen baked into the page.
	//
	// Indexable from day one. The copy is dev-drafted and not yet claim-checked;
	// content-ops verifies it live and the native reviewer reads it too. See
	// $lib/i18n/pricing.ja.ts.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{JA_PRICING.metaTitle}</title>
	<meta name="description" content={JA_PRICING.metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/ja/pricing" />
	<meta property="og:locale" content="ja_JP" />
	<meta property="og:title" content={JA_PRICING.metaTitle} />
	<meta property="og:description" content={JA_PRICING.metaDescription} />

	<!-- hreflang: every live language plus x-default, the same set on each pricing
	     page. -->
	<link rel="alternate" hreflang="en" href="https://mochify.app/pricing" />
	<link rel="alternate" hreflang="fr" href="https://mochify.app/fr/pricing" />
	<link rel="alternate" hreflang="es" href="https://mochify.app/es/pricing" />
	<link rel="alternate" hreflang="ja" href="https://mochify.app/ja/pricing" />
	<link rel="alternate" hreflang="x-default" href="https://mochify.app/pricing" />
</svelte:head>

<LocaleBanner offers={[{ href: '/pricing', label: 'View in English', lang: 'en' }]} />

<PricingPage {data} strings={JA_PRICING} locale="ja" />
