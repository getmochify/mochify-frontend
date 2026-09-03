<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	// Accordion FAQ for guide pages, matching the pricing/homepage FAQ
	// pattern: one card, hairline dividers, native <details>/<summary> so it
	// needs zero JS (guides ship csr = false). Same props as GuideFAQs so it
	// can be swapped in without touching the items data.
	//
	// The question is a real <h3> inside the <summary>, styled to look exactly
	// like the plain text it replaced. Accordions must not cost the guide its
	// question headings - those are what earn long-tail and People-Also-Ask
	// visibility. Answers are server-rendered and stay in the DOM when
	// collapsed, so the text is indexable either way.
	const {
		items,
		id = 'faq',
		heading = 'FAQ',
		openFirst = true,
		jsonLd = true
	}: {
		items: { q: string; a: string }[];
		id?: string;
		heading?: string;
		openFirst?: boolean;
		jsonLd?: boolean;
	} = $props();

	// Answers may carry inline markup (<code>, <em>, a link) because they are
	// authored copy, not user input - the same footing as StepList's bodies.
	// Schema wants the words only, so tags come off for the JSON-LD text.
	const plain = (html: string) =>
		html
			.replace(/<[^>]+>/g, '')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/\s+/g, ' ')
			.trim();

	// FAQPage schema built from the same array the section renders, so the
	// markup and the structured data cannot drift apart.
	const faqSchema = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: items.map((item) => ({
				'@type': 'Question',
				name: plain(item.q),
				acceptedAnswer: { '@type': 'Answer', text: plain(item.a) }
			}))
		}).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	{#if jsonLd}
		<!-- Safe: the payload is JSON.stringify output with every < escaped above.
		     {@html} is the only option here - Svelte does not interpolate
		     expressions inside a literal <script> element. The closing tag stays
		     escaped because the ESLint Svelte parser trips over a bare one. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
		{@html `<script type="application/ld+json">${faqSchema}<\/script>`}
	{/if}
</svelte:head>

<section {id} class="scroll-mt-24">
	<SectionHeading>{heading}</SectionHeading>
	<div class="faq-card">
		{#each items as item, i (item.q)}
			<details open={openFirst && i === 0}>
				<summary>
					<h3 class="q">{item.q}</h3>
					<svg
						class="chev"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						viewBox="0 0 24 24"
						aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg
					>
				</summary>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p class="a">{@html item.a}</p>
			</details>
		{/each}
	</div>
</section>

<style>
	.faq-card {
		border-radius: 1.25rem;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.85);
		box-shadow:
			0 2px 8px rgba(240, 98, 146, 0.06),
			0 8px 24px rgba(240, 98, 146, 0.06);
	}

	details + details {
		border-top: 1px solid #fbeaef;
	}

	details[open] {
		background: rgba(255, 250, 251, 0.9);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 1.5rem;
		cursor: pointer;
		list-style: none;
		user-select: none;
		transition: color 0.2s ease;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	/* Sized to match the plain <span> this heading replaced: the guides layout
	   styles `article h3` at 1.5rem with a 2.5rem top margin, and the base
	   layer swaps the font to Outfit, so all three are overridden here. */
	.q {
		margin: 0;
		font-family: inherit;
		font-weight: 700;
		font-size: 1.05rem;
		line-height: 1.35;
		letter-spacing: 0;
		color: #4a2c2c;
		transition: color 0.2s ease;
	}

	summary:hover .q {
		color: #d81b60;
	}

	.chev {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
		color: #f06292;
		transition: transform 0.2s ease;
	}

	details[open] .chev {
		transform: rotate(180deg);
	}

	.a {
		margin: -0.25rem 0 0;
		padding: 0 1.5rem 1.35rem;
		font-size: 1rem;
		line-height: 1.65;
		color: #6c3f31;
	}
</style>
