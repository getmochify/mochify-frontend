<script lang="ts">
	import { onMount } from 'svelte';
	import PromptFormApp from '$lib/components/PromptFormApp.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FaqAccordion from '$lib/components/FaqAccordion.svelte';
	import LocaleBanner from '$lib/components/LocaleBanner.svelte';
	import Hreflang from '$lib/components/Hreflang.svelte';
	import { faqSchema } from '$lib/faq';
	import { visitorLocale } from '$lib/localeHint';
	import {
		ptBrFlowMeta,
		ptBrFlowTool,
		ptBrFlowSections,
		ptBrFlowFaqs,
		PT_BR_PROMPT_FORM_STRINGS
	} from '$lib/i18n/pt-br-flow';

	// Not a translation of /flow: a Portuguese page for Portuguese searches,
	// sharing the tool component. Every visible string comes from the content-ops
	// copy sheet via $lib/i18n/pt-br-flow.ts and is never edited here.
	//
	// The copy is Brazilian and the page declares `pt-BR`, but it claims bare
	// `pt` in hreflang too: it is the only Portuguese page we have, so leaving
	// Portugal and Angola to the English x-default would serve them worse than
	// Brazilian Portuguese would (handoff A2).
	let form: ReturnType<typeof PromptFormApp> | undefined = $state();

	// The locale hint the parser gets is the VISITOR's own tag (handoff A7), so a
	// pt-PT reader gets their own rather than Brazil's. Brazil writes 1.200 for
	// one thousand two hundred and 1,5 for one and a half, the reverse of
	// English, and Mercado Livre itself publishes "1.200 x 1.200", so sellers
	// will type it. The worker derives that convention from the tag.
	let parseLocale = $state('pt-BR');
	onMount(() => {
		parseLocale = visitorLocale('pt');
	});

	const faqLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'pt-BR',
		mainEntity: faqSchema(ptBrFlowFaqs)
	});

	const appLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Mochify',
		url: 'https://mochify.app/pt-br/flow',
		inLanguage: 'pt-BR',
		applicationCategory: 'MultimediaApplication',
		operatingSystem: 'Web',
		description: ptBrFlowMeta.metaDescription,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' }
	});

	const breadcrumbLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Mochify', item: 'https://mochify.app/' },
			{
				'@type': 'ListItem',
				position: 2,
				name: ptBrFlowMeta.ogTitle,
				item: 'https://mochify.app/pt-br/flow'
			}
		]
	});
</script>

<svelte:head>
	<title>{ptBrFlowMeta.title}</title>
	<meta name="description" content={ptBrFlowMeta.metaDescription} />

	<!-- canonical, og:image and twitter:image are injected by the root layout. -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/pt-br/flow" />
	<meta property="og:locale" content="pt_BR" />
	<meta property="og:title" content={ptBrFlowMeta.ogTitle} />
	<meta property="og:description" content={ptBrFlowMeta.ogDescription} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ptBrFlowMeta.ogTitle} />
	<meta name="twitter:description" content={ptBrFlowMeta.ogDescription} />


	{@html `<script type="application/ld+json">${breadcrumbLd}<\/script>`}
	{@html `<script type="application/ld+json">${appLd}<\/script>`}
	{@html `<script type="application/ld+json">${faqLd}<\/script>`}
</svelte:head>

<Hreflang base="/flow" />

<div class="relative flex min-h-screen flex-col">
	<Navigation />

	<LocaleBanner offers={[{ href: '/flow', label: 'View in English', lang: 'en' }]} />

	<main
		class="relative z-10 mx-auto flex w-full max-w-5xl flex-grow flex-col items-center px-4 py-12 sm:px-6 lg:px-8"
	>
		<header class="mb-10 text-center">
			<h1
				class="mx-auto mb-3 max-w-3xl font-heading text-3xl leading-tight font-black tracking-tight text-balance text-[#4A2C2C] md:text-5xl"
			>
				{ptBrFlowTool.h1}
			</h1>
			<p class="mx-auto max-w-2xl text-base leading-relaxed text-pretty text-[#875F42] md:text-lg">
				{ptBrFlowTool.subtitle}
			</p>
		</header>

		<PromptFormApp
			bind:this={form}
			rememberPrompts
			strings={PT_BR_PROMPT_FORM_STRINGS}
			initialPrompt={ptBrFlowTool.defaultPrompt}
			locale={parseLocale}
		/>

		<!-- Badge line, from the sheet. Rendered as one string rather than split
		     into the English page's icon row: the separators are part of the copy. -->
		<p class="mt-10 text-center text-sm font-bold text-[#6C3F31]">{ptBrFlowTool.badgeLine}</p>

		<!-- The seven examples. Tap to load, exactly like the English page's
		     example cards, which is the only way a prompt-driven page shows a
		     first-time visitor (or a crawler) what it can be asked for. -->
		<section class="mt-14 w-full max-w-3xl">
			<ul class="grid list-none gap-2 p-0 sm:grid-cols-2">
				{#each ptBrFlowTool.examples as example (example)}
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
		     prompts load into the compose bar like the examples above. One
		     paragraph carries an outbound link, so paragraphs render from parts
		     when the sheet gives them. -->
		<article class="mt-16 w-full max-w-3xl space-y-12 text-lg leading-relaxed text-[#6C3F31]">
			{#each ptBrFlowSections as section (section.id)}
				<section id={section.id} class="scroll-mt-24">
					<h2
						class="mb-4 border-b-2 border-[#F06292]/30 pb-2 font-heading text-2xl font-black text-[#4A2C2C] md:text-3xl"
					>
						{section.heading}
					</h2>
					{#each section.blocks as block, i (i)}
						{#if block.type === 'prompt'}
							<button
								type="button"
								onclick={() => form?.useExample(block.text)}
								class="mochi-row mb-4 block w-full cursor-pointer rounded-2xl px-4 py-3 text-left font-mono text-sm text-[#6C3F31]"
								>{block.text}</button
							>
						{:else if 'parts' in block}
							<p class="mb-4">
								{#each block.parts as part}{#if typeof part === 'string'}{part}{:else}<a
											href={part.href}
											class="font-bold text-[#F06292] transition-colors hover:text-[#D81B60]"
											>{part.label}</a
										>{/if}{/each}
							</p>
						{:else}
							<p class="mb-4">{block.text}</p>
						{/if}
					{/each}
				</section>
			{/each}
		</article>

		<section class="mt-16 w-full max-w-3xl">
			<h2 class="mb-6 text-center font-heading text-2xl font-black text-[#4A2C2C] md:text-3xl">
				FAQ
			</h2>
			<FaqAccordion faqs={ptBrFlowFaqs} class="space-y-3" />
		</section>

		<p class="mt-12 text-center text-sm text-[#6C3F31]/75">
			<a href="/pt-br/pricing" class="font-semibold text-[#F06292] hover:underline">Preços</a>
		</p>
	</main>

	<div class="mt-12">
		<Footer minimal />
	</div>
</div>

<style>
	/* Same treatment as the English /flow example rows, so a tap-to-load prompt
	   reads the same on every locale's page. */
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
