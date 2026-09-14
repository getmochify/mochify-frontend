<script lang="ts">
	import type { Snippet } from 'svelte';

	// Status pill for verdict columns in guide tables: coloured dot + label.
	// yes = matcha, no = strawberry, mixed = warm amber, note = neutral blue.
	//
	// `banner` switches the pill from a nowrap table label to a standalone
	// block that wraps. The default nowrap is what keeps short verdicts from
	// breaking mid-phrase in a narrow table column, but it makes a
	// sentence-length pill overflow the viewport on mobile.
	let {
		kind = 'note',
		banner = false,
		children
	}: {
		kind?: 'yes' | 'no' | 'mixed' | 'note';
		banner?: boolean;
		children: Snippet;
	} = $props();
</script>

<span class="pill {kind}" class:banner><span class="dot"></span>{@render children()}</span>

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

	/* Wrapping variant. Stays inline-flex so it shrink-wraps to the sentence
	   where there is room and only takes the full width once the text has to
	   wrap. At one line the 1.1rem radius is still a full stadium (the box is
	   ~2.3rem tall), so the desktop look is unchanged; multi-line it reads as
	   a rounded banner rather than a stretched capsule. */
	.pill.banner {
		align-items: flex-start;
		white-space: normal;
		text-wrap: pretty;
		padding: 0.6rem 0.95rem;
		border-radius: 1.1rem;
	}

	/* Centre the dot on the first line rather than the whole flex box. */
	.pill.banner .dot {
		margin-top: 0.41em;
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
