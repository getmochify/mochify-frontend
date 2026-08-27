<script lang="ts">
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	// Accordion FAQ for guide pages, matching the pricing/homepage FAQ
	// pattern: one card, hairline dividers, native <details>/<summary> so it
	// needs zero JS (guides ship csr = false). Same props as GuideFAQs so it
	// can be swapped in without touching the items data.
	const {
		items,
		id = 'faq',
		heading = 'FAQ'
	}: {
		items: { q: string; a: string }[];
		id?: string;
		heading?: string;
	} = $props();
</script>

<section {id} class="scroll-mt-24">
	<SectionHeading>{heading}</SectionHeading>
	<div class="faq-card">
		{#each items as item}
			<details>
				<summary>
					<span class="q">{item.q}</span>
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
				<p class="a">{item.a}</p>
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

	.q {
		font-weight: 700;
		font-size: 1.05rem;
		line-height: 1.35;
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
