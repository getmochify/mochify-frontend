<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import Hreflang from '$lib/components/Hreflang.svelte';
	import { PT_BR_PRICING } from '$lib/i18n/pricing.pt-br';
	import type { PageData } from './$types';

	// The same body as /pricing, with the Portuguese string set and the `pt-BR`
	// locale. The price FORMAT comes from the visitor's country rather than from
	// the page, so a Brazilian reader gets pt-BR and a Portuguese one pt-PT; see
	// formatLocaleFor in $lib/currency.
	//
	// Indexable from day one. The copy is dev-drafted and not yet through the
	// section 4.1 claim check; content-ops verifies it live and a Brazilian
	// reviewer reads it after launch. See $lib/i18n/pricing.pt-br.ts.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{PT_BR_PRICING.metaTitle}</title>
	<meta name="description" content={PT_BR_PRICING.metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/pt-br/pricing" />
	<meta property="og:locale" content="pt_BR" />
	<meta property="og:title" content={PT_BR_PRICING.metaTitle} />
	<meta property="og:description" content={PT_BR_PRICING.metaDescription} />

</svelte:head>

<Hreflang base="/pricing" />

<LocaleBanner offers={[{ href: '/pricing', label: 'View in English', lang: 'en' }]} />

<PricingPage {data} strings={PT_BR_PRICING} locale="pt-BR" />
