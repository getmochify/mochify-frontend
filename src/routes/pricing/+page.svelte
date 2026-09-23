<script lang="ts">
	import PricingPage from '$lib/components/PricingPage.svelte';
	import { EN_PRICING } from '$lib/i18n/pricing';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import type { PageData } from './$types';

	// The page body is shared with /fr/pricing; only the head and the string set
	// differ per locale. See $lib/components/PricingPage.svelte.
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
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": "https://mochify.app/pricing",
					"url": "https://mochify.app/pricing",
					"name": "Pricing — Mochify",
					"description": "Simple, transparent pricing. Try 3 images free without signing up, or create a free account for 25 images/month. Upgrade to Seller for 300, Pro for 1,200 or Growth for 5,000 images a month.",
					"isPartOf": { "@id": "https://mochify.app" }
				},
				{
					"@type": "SoftwareApplication",
					"name": "Mochify",
					"url": "https://mochify.app",
					"applicationCategory": "MultimediaApplication",
					"operatingSystem": "Any",
					"offers": [
						{
							"@type": "Offer",
							"name": "Free",
							"price": "0",
							"priceCurrency": "USD",
							"description": "3 images free without an account. Create a free account for 25 images per month. Includes all formats, resize, rotate, crop, background removal, MCP and API access. Standard processing queue."
						},
						{
							"@type": "Offer",
							"name": "Seller — Monthly",
							"price": "7.99",
							"priceCurrency": "USD",
							"priceSpecification": {
								"@type": "UnitPriceSpecification",
								"price": "7.99",
								"priceCurrency": "USD",
								"unitCode": "MON"
							},
							"description": "300 images per month. Includes all formats, resize, rotate, crop, background removal, MCP and API access. Up to 75MB per file. Priority processing queue."
						},
						{
							"@type": "Offer",
							"name": "Pro — Monthly",
							"price": "24.99",
							"priceCurrency": "USD",
							"priceSpecification": {
								"@type": "UnitPriceSpecification",
								"price": "24.99",
								"priceCurrency": "USD",
								"unitCode": "MON"
							},
							"description": "1,200 images per month. Includes all formats, resize, rotate, crop, background removal, MCP and API access. Up to 75MB per file. Top priority processing queue."
						},
						{
							"@type": "Offer",
							"name": "Growth — Monthly",
							"price": "79.99",
							"priceCurrency": "USD",
							"priceSpecification": {
								"@type": "UnitPriceSpecification",
								"price": "79.99",
								"priceCurrency": "USD",
								"unitCode": "MON"
							},
							"description": "5,000 images per month. Everything in Pro plus unlimited PDF pages and PDFs built from up to 200 images. Save results to your own bucket or Google Drive. Top priority processing queue."
						},
						{
							"@type": "Offer",
							"name": "Seller — Annual",
							"price": "79.99",
							"priceCurrency": "USD",
							"priceSpecification": {
								"@type": "UnitPriceSpecification",
								"price": "79.99",
								"priceCurrency": "USD",
								"unitCode": "ANN"
							},
							"description": "300 images per month, billed annually at $79.99/year. Save 17% versus monthly. Includes background removal. Up to 75MB per file. Priority processing queue."
						},
						{
							"@type": "Offer",
							"name": "Pro — Annual",
							"price": "249.99",
							"priceCurrency": "USD",
							"priceSpecification": {
								"@type": "UnitPriceSpecification",
								"price": "249.99",
								"priceCurrency": "USD",
								"unitCode": "ANN"
							},
							"description": "1,200 images per month, billed annually at $249.99/year. Save 17% versus monthly. Includes background removal. Up to 75MB per file. Top priority processing queue."
						},
						{
							"@type": "Offer",
							"name": "Growth — Annual",
							"price": "799.99",
							"priceCurrency": "USD",
							"priceSpecification": {
								"@type": "UnitPriceSpecification",
								"price": "799.99",
								"priceCurrency": "USD",
								"unitCode": "ANN"
							},
							"description": "5,000 images per month, billed annually at $799.99/year. Save 17% versus monthly. Unlimited PDF pages. Top priority processing queue."
						},
						{
							"@type": "Offer",
							"name": "Day Pass",
							"price": "2.00",
							"priceCurrency": "USD",
							"description": "24-hour pass, one-time purchase. Upload up to 100 images, files up to 75MB, larger batches. No subscription or account required — activated instantly by magic link."
						}
					]
				},
				{
					"@type": "FAQPage",
					"mainEntity": [
						{
							"@type": "Question",
							"name": "What counts as one image?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Each image we hand back uses one from your monthly allowance. Compressing, converting, resizing, or any combination of those on a single file is one image. Asking for several formats or sizes of the same file returns several images, so each one counts: WebP and AVIF at two widths is four. Batch uploads count one per file."
							}
						},
						{
							"@type": "Question",
							"name": "Do unused images roll over?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "No. Free resets on a rolling 30-day cycle from when you start using it; Seller and Pro reset on your billing date. Unused images do not roll over."
							}
						},
						{
							"@type": "Question",
							"name": "Can I use the API on the free tier?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Yes — all tiers have full MCP and API access. The same monthly limit applies."
							}
						},
						{
							"@type": "Question",
							"name": "How does the Day Pass work?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Pay $2 and we email you a magic link. Click it to unlock 100 image uploads within 24 hours, 75MB files and larger batches for 24 hours. No account or subscription needed."
							}
						},
						{
							"@type": "Question",
							"name": "Can I cancel anytime?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Yes. Cancel any time and you keep access until the end of your billing period."
							}
						},
						{
							"@type": "Question",
							"name": "Is Pro worth it over Seller?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "It depends on volume. Pro gives you four times the images for a little over three times the price, so each image works out around 22% cheaper: about 2.1 cents on Pro versus 2.7 cents on Seller, or 1.7 cents versus 2.2 cents on annual billing. Pro also puts you at the front of the processing queue and gets priority email support. If you are comfortably inside 300 images a month, Seller is the better buy."
							}
						}
					]
				}
			]
		}
	</script>
</svelte:head>

<LocaleBanner
	href="/fr/pricing"
	label="Voir cette page en français"
	dismissKey="mochify-locale-banner-fr"
	when="fr"
/>

<PricingPage {data} strings={EN_PRICING} locale="en" />
