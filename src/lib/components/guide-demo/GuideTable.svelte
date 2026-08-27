<script lang="ts">
	import type { Snippet } from 'svelte';

	// Soft table card for the open guide layout. Replaces the solid-white
	// table + ScrollableTable pairing: translucent card, blush header, row
	// hover, and a plain CSS scroll container (ScrollableTable's nudge/fade
	// never activates on guides anyway because they ship csr = false).
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
	{@render children()}
</div>

<style>
	.guide-table {
		overflow-x: auto;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.85);
		box-shadow:
			0 2px 8px rgba(240, 98, 146, 0.06),
			0 8px 24px rgba(240, 98, 146, 0.06);
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
