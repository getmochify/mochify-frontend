<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import { FR_PRICING } from '$lib/i18n/pricing.fr';
	import type { PageData } from './$types';

	// The same body as /pricing, with the French string set and the French
	// locale, which is what turns "€7.99" into "7,99 €".
	//
	// Indexable as of handoff 2026-09-24 Change 2. It shipped noindex, unpaired and
	// out of the sitemap because the French copy was drafted dev-side rather than by
	// content-ops, and nothing unverified should accumulate search equity. The live
	// check found the effect of that: the page could not be found in French at all.
	// The operator took the call to index it before the section 4.1 claim check, so
	// all three lifted together: robots, the hreflang pair here and on /pricing,
	// and the sitemap entry. The copy's provenance is unchanged; see
	// $lib/i18n/pricing.fr.ts.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{FR_PRICING.metaTitle}</title>
	<meta name="description" content={FR_PRICING.metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/fr/pricing" />
	<meta property="og:locale" content="fr_FR" />
	<meta property="og:title" content={FR_PRICING.metaTitle} />
	<meta property="og:description" content={FR_PRICING.metaDescription} />

	<!-- hreflang: one set across all three languages, the same four lines on each
	     pricing page, matching the Flow set. Serving is by URL only; nothing
	     redirects on IP or Accept-Language, which would hide this page from a US
	     crawler. -->
	<link rel="alternate" hreflang="en" href="https://mochify.app/pricing" />
	<link rel="alternate" hreflang="fr" href="https://mochify.app/fr/pricing" />
	<link rel="alternate" hreflang="es" href="https://mochify.app/es/pricing" />
	<link rel="alternate" hreflang="x-default" href="https://mochify.app/pricing" />
</svelte:head>

<LocaleBanner offers={[{ href: '/pricing', label: 'View in English', lang: 'en' }]} />

<PricingPage {data} strings={FR_PRICING} locale="fr" />
