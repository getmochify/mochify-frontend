<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import { FR_PRICING } from '$lib/i18n/pricing.fr';
	import type { PageData } from './$types';

	// The same body as /pricing, with the French string set and the French
	// locale, which is what turns "€7.99" into "7,99 €".
	//
	// NOINDEX, deliberately. The French copy here was drafted dev-side because
	// this page has no copy sheet: the localisation plan puts French copy and its
	// claim check with content-ops, and neither has run over this page yet. A
	// French visitor who clicks "Tarifs" gets a French page today; nothing
	// unverified accumulates search equity meanwhile. There is no hreflang pair
	// and no sitemap entry for the same reason: both would tell Google to index
	// it. Lift all three together once content-ops has verified the claims.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{FR_PRICING.metaTitle}</title>
	<meta name="description" content={FR_PRICING.metaDescription} />
	<meta name="robots" content="noindex" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/fr/pricing" />
	<meta property="og:locale" content="fr_FR" />
	<meta property="og:title" content={FR_PRICING.metaTitle} />
	<meta property="og:description" content={FR_PRICING.metaDescription} />
</svelte:head>

<LocaleBanner href="/pricing" label="View in English" dismissKey="mochify-locale-banner-en" />

<PricingPage {data} strings={FR_PRICING} locale="fr" />
