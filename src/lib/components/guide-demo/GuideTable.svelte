<script lang="ts">
	import type { Snippet } from 'svelte';

	// Soft table card for the open guide layout. Replaces the solid-white
	// table + ScrollableTable pairing: translucent card, blush header, row
	// hover, and a CSS-only scroll container (ScrollableTable's nudge/fade is
	// JS-driven and never activates on guides, which ship csr = false).
	// Pages author a bare <table> inside; all styling lives here.
	let {
		class: className = 'my-6',
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class="guide-table {className}">
	<div class="guide-table-scroll">
		{@render children()}
	</div>
	<!-- Right-edge fade: the CSS-only counterpart to ScrollableTable's cue,
	     so a narrow screen can tell the last column is off to the right. -->
	<span class="guide-table-fade" aria-hidden="true"></span>
</div>

<style>
	.guide-table {
		position: relative;
		/* Query container so the fade can key off the card's own width rather
		   than a viewport breakpoint that would need updating whenever the
		   reading column changes. */
		container-type: inline-size;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.85);
		box-shadow:
			0 2px 8px rgba(240, 98, 146, 0.06),
			0 8px 24px rgba(240, 98, 146, 0.06);
	}

	.guide-table-scroll {
		overflow-x: auto;
		border-radius: inherit;
		/* Named timeline the fade animates against; see the @supports block. */
		scroll-timeline: --guide-table-scroll inline;
	}

	/* Hidden by default: the table only overflows once the card is narrower
	   than the table's own min-width, so anything wider needs no cue. */
	.guide-table-fade {
		display: none;
	}

	@container (width < 640px) {
		.guide-table-fade {
			display: block;
			position: absolute;
			inset: 1px 1px 1px auto;
			width: 3.5rem;
			pointer-events: none;
			border-radius: 0 1.25rem 1.25rem 0;
			background: linear-gradient(to left, rgba(108, 63, 49, 0.13), rgba(108, 63, 49, 0));
		}
	}

	/* Where scroll-driven animations exist, retire the cue as the last column
	   comes into view. Without them the fade simply stays put, which still
	   reads as a soft card edge. */
	@supports (animation-timeline: --t) and (timeline-scope: --t) {
		.guide-table {
			timeline-scope: --guide-table-scroll;
		}

		@container (width < 640px) {
			.guide-table-fade {
				animation: guide-table-fade-out linear both;
				animation-timeline: --guide-table-scroll;
			}
		}

		@keyframes guide-table-fade-out {
			0%,
			85% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
	}

	.guide-table :global(table) {
		width: 100%;
		min-width: 640px;
		border-collapse: collapse;
		text-align: left;
		font-size: 1rem;
	}

	.guide-table :global(thead) {
		background: linear-gradient(135deg, rgba(255, 245, 247, 0.9), rgba(255, 240, 243, 0.7));
	}

	.guide-table :global(th) {
		padding: 1rem 1.25rem;
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #b04a68;
		border-bottom: 1px solid #fbeaef;
		white-space: nowrap;
	}

	.guide-table :global(td) {
		padding: 1rem 1.25rem;
		vertical-align: top;
		color: #6c3f31;
		border-bottom: 1px solid #fbeaef;
	}

	.guide-table :global(tbody tr:last-child td) {
		border-bottom: none;
	}

	.guide-table :global(td:first-child) {
		font-weight: 700;
		color: #4a2c2c;
	}

	.guide-table :global(tbody tr) {
		transition: background 0.2s ease;
	}

	.guide-table :global(tbody tr:hover) {
		background: rgba(255, 240, 243, 0.45);
	}
</style>
