<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import { ES_PRICING } from '$lib/i18n/pricing.es';
	import type { PageData } from './$types';

	// The same body as /pricing, with the Spanish string set and the `es` locale,
	// which is what turns "€7.99" into "7,99 €" and renders 1200 and 5000 with no
	// thousands separator, the convention the /es/flow copy sheet uses.
	//
	// Indexable from day one, unlike /fr/pricing, which shipped noindex and had to
	// be opened up a day later once the live check found that a page nobody can
	// find is not a cautious version of a page: the Spanish handoff (A9) says to
	// build it right the first time. The copy is dev-drafted and not yet through
	// the section 4.1 claim check; content-ops verifies it live. See
	// $lib/i18n/pricing.es.ts.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{ES_PRICING.metaTitle}</title>
	<meta name="description" content={ES_PRICING.metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/es/pricing" />
	<meta property="og:locale" content="es_ES" />
	<meta property="og:locale:alternate" content="es_MX" />
	<meta property="og:title" content={ES_PRICING.metaTitle} />
	<meta property="og:description" content={ES_PRICING.metaDescription} />

	<!-- hreflang: one set across all three languages, the same four lines on each
	     pricing page, with English as x-default. `es` carries no region: this page
	     serves Spain and Latin America, and es-ES would signal Spain only. -->
	<link rel="alternate" hreflang="en" href="https://mochify.app/pricing" />
	<link rel="alternate" hreflang="fr" href="https://mochify.app/fr/pricing" />
	<link rel="alternate" hreflang="es" href="https://mochify.app/es/pricing" />
	<link rel="alternate" hreflang="x-default" href="https://mochify.app/pricing" />
</svelte:head>

<LocaleBanner offers={[{ href: '/pricing', label: 'View in English', lang: 'en' }]} />

<PricingPage {data} strings={ES_PRICING} locale="es" />
