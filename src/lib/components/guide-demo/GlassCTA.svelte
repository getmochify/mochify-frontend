<script lang="ts">
	import type { Snippet } from 'svelte';

	// Glass closing CTA for the open guide layout. Same API as GuideCTA, but
	// the card is frosted and carries its own radial glow behind it, echoing
	// the hero wash, so the page closes on the same warmth it opened with
	// (and the backdrop-filter has colour to blur this deep into the page).
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
		class?: string;
		children: Snippet;
		note?: Snippet;
	} = $props();
</script>

<div class="cta-zone {className}">
	<div class="cta-glow" aria-hidden="true"></div>
	<div class="cta-card">
		<h3 class="cta-heading">{heading}</h3>
		<p class="cta-body">{@render children()}</p>
		<div class="cta-actions">
			<a {href} class="cta-primary">{label}</a>
			{#if secondaryHref && secondaryLabel}
				<a href={secondaryHref} class="cta-secondary">{secondaryLabel}</a>
			{/if}
		</div>
		{#if note}
			<p class="cta-note">{@render note()}</p>
		{/if}
	</div>
</div>

<style>
	.cta-zone {
		position: relative;
	}

	/* Localized wash behind the card, echoing the page-top hero wash. */
	/* Single centered glow that reaches transparent before its own bounds,
	   so there is no clipped edge and no blotching through the frost. */
	.cta-glow {
		position: absolute;
		/* No horizontal bleed below the safe breakpoint: the article's own
		   side padding drops to 0 at exactly 768px (the same point it hits
		   max-w-3xl), so at that width the reading column has zero margin
		   and ANY horizontal bleed here overflows the viewport. Vertical
		   bleed is always safe (page scrolls vertically anyway). */
		inset: -2rem 0;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(
			closest-side,
			rgba(255, 179, 198, 0.5) 0%,
			rgba(255, 194, 209, 0.3) 45%,
			transparent 100%
		);
	}

	/* Only bleed horizontally once the column has stopped growing and the
	   viewport has margin outside it: at 1024px, margin = (1024-768)/2 =
	   128px per side, comfortably clearing the 80px (-5rem) bleed below. */
	@media (min-width: 1024px) {
		.cta-glow {
			inset: -3rem -5rem;
		}
	}

	.cta-card {
		position: relative;
		z-index: 1;
		border-radius: 1.5rem;
		padding: 2.5rem 1.5rem;
		text-align: center;
		background: #fff9fa;
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow:
			0 8px 32px 0 rgba(240, 98, 146, 0.12),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
			inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
	}

	@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
		.cta-card {
			background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.6) 0%,
				rgba(255, 240, 243, 0.45) 100%
			);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}

	@media (min-width: 768px) {
		.cta-card {
			padding: 3rem;
		}
	}

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

	.cta-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.cta-actions {
			flex-direction: row;
		}
	}

	.cta-primary {
		display: inline-flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 1rem;
		background: #f06292;
		padding: 1rem 1.75rem;
		font-weight: 900;
		color: white;
		text-decoration: none;
		box-shadow:
			0 10px 20px -5px rgba(240, 98, 146, 0.45),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}

	.cta-primary:hover {
		transform: translateY(-2px);
		background: #d81b60;
		box-shadow:
			0 14px 26px -5px rgba(240, 98, 146, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.cta-secondary {
		display: inline-flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 1rem;
		border: 1px solid rgba(135, 95, 66, 0.25);
		padding: 1rem 1.75rem;
		font-weight: 900;
		color: #6c3f31;
		text-decoration: none;
		background: rgba(255, 255, 255, 0.5);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	.cta-secondary:hover {
		border-color: rgba(240, 98, 146, 0.4);
		background: #fff5f7;
		color: #f06292;
	}

	@media (min-width: 640px) {
		.cta-primary,
		.cta-secondary {
			width: auto;
		}
	}

	.cta-note {
		margin: 1.5rem 0 0;
		font-size: 0.75rem;
		line-height: 1.5;
		color: rgba(108, 63, 49, 0.6);
	}
</style>
