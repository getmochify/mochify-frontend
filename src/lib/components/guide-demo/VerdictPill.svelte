<script lang="ts">
	import type { Snippet } from 'svelte';

	// Status pill for verdict columns in guide tables: coloured dot + label.
	// yes = matcha, no = strawberry, mixed = warm amber, note = neutral blue.
	let {
		kind = 'note',
		children
	}: {
		kind?: 'yes' | 'no' | 'mixed' | 'note';
		children: Snippet;
	} = $props();
</script>

<span class="pill {kind}"><span class="dot"></span>{@render children()}</span>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.25rem 0.7rem;
		border-radius: 9999px;
		font-size: 0.85rem;
		font-weight: 700;
		line-height: 1.35;
		white-space: nowrap;
		border: 1px solid;
	}

	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 9999px;
		background: currentColor;
		flex-shrink: 0;
	}

	.pill.yes {
		color: #2e7d4f;
		background: rgba(165, 214, 167, 0.25);
		border-color: rgba(129, 199, 132, 0.5);
	}

	.pill.no {
		color: #c2185b;
		background: rgba(255, 179, 198, 0.2);
		border-color: rgba(240, 98, 146, 0.35);
	}

	.pill.mixed {
		color: #a3661a;
		background: rgba(255, 213, 128, 0.22);
		border-color: rgba(230, 168, 76, 0.4);
	}

	.pill.note {
		color: #2b6cb0;
		background: rgba(212, 231, 254, 0.35);
		border-color: rgba(165, 200, 240, 0.55);
	}
</style>
