<script lang="ts">
	import type { Snippet } from 'svelte';

	// Closing CTA for guide pages. Mirrors the pricing page's final CTA card
	// (blush gradient, hairline pink border, soft shadow) so the marketing
	// surfaces all end on the same note.
	//
	// The heading and body use scoped classes rather than Tailwind utilities:
	// the guides layout styles `article h3` / `article p` from an unlayered
	// component stylesheet, which outranks every utility class. A scoped class
	// selector outranks the element selector, so the card keeps its own type.
	let {
		heading,
		href,
		label,
		secondaryHref,
		secondaryLabel,
		class: className = '',
		children,
		note
	}: {
		heading: string;
		href: string;
		label: string;
		secondaryHref?: string;
		secondaryLabel?: string;
		/** Extra classes on the card, e.g. margin when it sits mid-article. */
		class?: string;
		children: Snippet;
		note?: Snippet;
	} = $props();
</script>

<div
	class="rounded-3xl border border-pink-100 bg-gradient-to-b from-[#FFF0F3]/70 to-white px-6 py-10 text-center shadow-sm md:px-12 md:py-12 {className}"
>
	<h3 class="cta-heading">{heading}</h3>
	<p class="cta-body">{@render children()}</p>
	<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
		<a
			{href}
			class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F06292] px-7 py-4 font-black text-white no-underline shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#D81B60] sm:w-auto"
		>
			{label}
		</a>
		{#if secondaryHref && secondaryLabel}
			<a
				href={secondaryHref}
				class="inline-flex w-full items-center justify-center rounded-2xl border border-[#875F42]/25 px-7 py-4 font-black text-[#6C3F31] no-underline transition-all hover:border-[#F06292]/40 hover:bg-[#FFF5F7] hover:text-[#F06292] sm:w-auto"
			>
				{secondaryLabel}
			</a>
		{/if}
	</div>
	{#if note}
		<p class="cta-note">{@render note()}</p>
	{/if}
</div>

<style>
	.cta-heading {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 900;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: #4a2c2c;
		margin: 0 0 0.75rem;
	}

	@media (min-width: 768px) {
		.cta-heading {
			font-size: 1.875rem;
		}
	}

	.cta-body {
		max-width: 32rem;
		margin: 0 auto 2rem;
		color: #6c3f31;
		line-height: 1.7;
	}

	.cta-note {
		margin: 1.5rem 0 0;
		font-size: 0.75rem;
		line-height: 1.5;
		color: rgba(108, 63, 49, 0.6);
	}
</style>
