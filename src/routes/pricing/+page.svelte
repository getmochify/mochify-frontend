<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import { EN_PRICING } from '$lib/i18n/pricing';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import type { PageData } from './$types';

	// The page body is shared with /fr/pricing; only the head and the string set
	// differ per locale. See $lib/components/PricingPage.svelte.
	//
	// The WebPage + SoftwareApplication + FAQPage graph that used to sit in this
	// head as literal JSON is emitted by PricingPage now, so both locales get it
	// from one place and the FAQ entries come from the copy the page renders.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Pricing — Mochify</title>
	<meta
		name="description"
		content="Simple, transparent pricing. Try 3 images free without signing up, or create a free account for 25 images/month. Upgrade to Seller for 300, Pro for 1,200 or Growth for 5,000 images a month. Or grab a $2 Day Pass — upload up to 100 images in 24 hours, no subscription."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/pricing" />
	<meta property="og:title" content="Pricing — Mochify" />
	<meta
		property="og:description"
		content="Simple, transparent pricing. Try 3 images free without signing up, or create a free account for 25 images/month. Upgrade to Seller for 300, Pro for 1,200 or Growth for 5,000 images a month. Or grab a $2 Day Pass — upload up to 100 images in 24 hours, no subscription."
	/>
	<!-- hreflang: one set across all three languages, the same four lines on each
	     pricing page, with English as x-default. Serving is by URL only, as on
	     /flow: no redirect by IP or Accept-Language, which would hide the
	     localised pages from a US crawler. -->
	<link rel="alternate" hreflang="en" href="https://mochify.app/pricing" />
	<link rel="alternate" hreflang="fr" href="https://mochify.app/fr/pricing" />
	<link rel="alternate" hreflang="es" href="https://mochify.app/es/pricing" />
	<link rel="alternate" hreflang="x-default" href="https://mochify.app/pricing" />
</svelte:head>

<LocaleBanner
	offers={[
		{ href: '/fr/pricing', label: 'Voir cette page en français', lang: 'fr', when: 'fr' },
		{ href: '/es/pricing', label: 'Ver esta página en español', lang: 'es', when: 'es' }
	]}
/>

<PricingPage {data} strings={EN_PRICING} locale="en" />
