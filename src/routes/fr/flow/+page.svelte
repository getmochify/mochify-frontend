<script lang="ts">
	import PromptFormApp from '$lib/components/PromptFormApp.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FaqAccordion from '$lib/components/FaqAccordion.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import { faqSchema, type FaqItem } from '$lib/faq';
	import {
		frFlowMeta,
		frFlowTool,
		frFlowSections,
		frFlowFaqs,
		FR_PROMPT_FORM_STRINGS
	} from '$lib/i18n/fr-flow';

	// Not a translation of /flow: a French page for French searches, sharing the
	// tool component. Every visible string comes from the content-ops copy sheet
	// via $lib/i18n/fr-flow.ts and is never edited here.
	//
	// The prompt chips are off. The sheet lists their labels but not the French
	// prompts behind them, and the handoff forbids writing French, so the seven
	// examples below carry that job until the prompts arrive.
	let form: ReturnType<typeof PromptFormApp> | undefined = $state();

	const faqs: FaqItem[] = frFlowFaqs.map((f) => ({ q: f.q, a: f.a }));

	const faqLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'fr',
		mainEntity: faqSchema(faqs)
	});

	const appLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Mochify',
		url: 'https://mochify.app/fr/flow',
		inLanguage: 'fr',
		applicationCategory: 'MultimediaApplication',
		operatingSystem: 'Web',
		description: frFlowMeta.metaDescription,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }
	});

	const breadcrumbLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Mochify', item: 'https://mochify.app/' },
			{
				'@type': 'ListItem',
				position: 2,
				name: frFlowMeta.ogTitle,
				item: 'https://mochify.app/fr/flow'
			}
		]
	});
</script>

<svelte:head>
	<title>{frFlowMeta.title}</title>
	<meta name="description" content={frFlowMeta.metaDescription} />

	<!-- canonical, og:image and twitter:image are injected by the root layout. -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/fr/flow" />
	<meta property="og:locale" content="fr_FR" />
	<meta property="og:title" content={frFlowMeta.ogTitle} />
	<meta property="og:description" content={frFlowMeta.ogDescription} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={frFlowMeta.ogTitle} />
	<meta name="twitter:description" content={frFlowMeta.ogDescription} />

	<!-- hreflang: this pair points both ways, and English is x-default. Serving
	     is by URL only; there is no redirect by IP or Accept-Language anywhere,
	     because that hides this page from a crawler in the US. -->
	<link rel="alternate" hreflang="fr" href="https://mochify.app/fr/flow" />
	<link rel="alternate" hreflang="en" href="https://mochify.app/flow" />
	<link rel="alternate" hreflang="x-default" href="https://mochify.app/flow" />

	{@html `<script type="application/ld+json">${breadcrumbLd}<\/script>`}
	{@html `<script type="application/ld+json">${appLd}<\/script>`}
	{@html `<script type="application/ld+json">${faqLd}<\/script>`}
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navigation />

	<LocaleBanner href="/flow" label="View in English" dismissKey="mochify-locale-banner-en" />

	<main
		class="relative z-10 mx-auto flex w-full max-w-5xl flex-grow flex-col items-center px-4 py-12 sm:px-6 lg:px-8"
	>
		<header class="mb-10 text-center">
			<h1
				class="mx-auto mb-3 max-w-3xl font-heading text-3xl leading-tight font-black tracking-tight text-balance text-[#4A2C2C] md:text-5xl"
			>
				{frFlowTool.h1}
			</h1>
			<p class="mx-auto max-w-2xl text-base leading-relaxed text-pretty text-[#875F42] md:text-lg">
				{frFlowTool.subtitle}
			</p>
		</header>

		<PromptFormApp
			bind:this={form}
			rememberPrompts
			strings={FR_PROMPT_FORM_STRINGS}
			initialPrompt={frFlowTool.defaultPrompt}
			showSuggestionChips={false}
			locale="fr-FR"
		/>

		<!-- Badge line, from the sheet. Rendered as one string rather than split
		     into the English page's icon row: the separators are part of the copy. -->
		<p class="mt-10 text-center text-sm font-bold text-[#6C3F31]">{frFlowTool.badgeLine}</p>

		<!-- The seven examples. Tap to load, exactly like the English page's
		     example cards, which is the only way a prompt-driven page shows a
		     first-time visitor (or a crawler) what it can be asked for. -->
		<section class="mt-14 w-full max-w-3xl">
			<ul class="grid list-none gap-2 p-0 sm:grid-cols-2">
				{#each frFlowTool.examples as example (example)}
					<li class="flex">
						<button
							type="button"
							onclick={() => form?.useExample(example)}
							class="mochi-row flex h-full w-full cursor-pointer items-center rounded-2xl px-4 py-2.5 text-left text-sm leading-snug text-[#6C3F31]"
							>{example}</button
						>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Body. Seven sections, each ending in the prompt it describes; the
		     prompts load into the compose bar like the examples above. -->
		<article class="mt-16 w-full max-w-3xl space-y-12 text-lg leading-relaxed text-[#6C3F31]">
			{#each frFlowSections as section (section.id)}
				<section id={section.id} class="scroll-mt-24">
					<h2
						class="mb-4 border-b-2 border-[#F06292]/30 pb-2 font-heading text-2xl font-black text-[#4A2C2C] md:text-3xl"
					>
						{section.heading}
					</h2>
					{#each section.blocks as block, i (i)}
						{#if block.type === 'p'}
							<p class="mb-4">{block.text}</p>
						{:else}
							<button
								type="button"
								onclick={() => form?.useExample(block.text)}
								class="mochi-row mb-4 block w-full cursor-pointer rounded-2xl px-4 py-3 text-left font-mono text-sm text-[#6C3F31]"
								>{block.text}</button
							>
						{/if}
					{/each}
				</section>
			{/each}
		</article>

		<section class="mt-16 w-full max-w-3xl">
			<h2 class="mb-6 text-center font-heading text-2xl font-black text-[#4A2C2C] md:text-3xl">
				FAQ
			</h2>
			<FaqAccordion {faqs} class="space-y-3" />
		</section>

		<p class="mt-12 text-center text-sm text-[#6C3F31]/75">
			<a href="/pricing" class="font-semibold text-[#F06292] hover:underline">Tarifs</a>
		</p>
	</main>

	<div class="mt-12">
		<Footer minimal />
	</div>
</div>

<style>
	/* Same treatment as the English /flow example rows, so a tap-to-load prompt
	   reads the same on both pages. */
	.mochi-row {
		background: linear-gradient(160deg, #fff5f8 0%, #ffe7ee 100%);
		border: 1px solid rgba(240, 98, 146, 0.12);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.9),
			inset 0 -2px 4px rgba(240, 98, 146, 0.07),
			0 1px 2px rgba(240, 98, 146, 0.06);
		transition:
			transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.mochi-row:hover {
		background: linear-gradient(160deg, #ffffff 0%, #ffeef3 100%);
		transform: translateY(-2px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 1),
			0 8px 18px -6px rgba(240, 98, 146, 0.28);
	}

	.mochi-row:active {
		transform: translateY(0) scale(0.99);
	}

	.mochi-row:focus-visible {
		outline: 2px solid #f06292;
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.mochi-row,
		.mochi-row:hover,
		.mochi-row:active {
			transform: none;
			transition: none;
		}
	}
</style>
