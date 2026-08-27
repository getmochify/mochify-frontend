<script lang="ts">
	import type { Snippet } from 'svelte';

	// Glass take on InfoBox: frosted surface with a tinted accent edge and a
	// coloured mochi dot as the indicator. Same two themes as InfoBox so it can
	// be swapped in without touching call sites beyond the import.
	let {
		type = 'pink',
		title,
		children
	}: {
		type?: 'pink' | 'tip' | 'warning' | 'blue' | 'note' | 'technical';
		title: string;
		children: Snippet;
	} = $props();

	const themeMap: Record<string, 'pink' | 'blue'> = {
		pink: 'pink',
		tip: 'pink',
		warning: 'pink',
		blue: 'blue',
		note: 'blue',
		technical: 'blue'
	};

	const theme = $derived(themeMap[type] ?? 'pink');
</script>

<aside class="infobox" class:pink={theme === 'pink'} class:blue={theme === 'blue'}>
	<div class="info-header">
		<span class="dot"></span>
		<span class="info-label">{title}</span>
	</div>
	<div class="info-body">
		{@render children()}
	</div>
</aside>

<style>
	.infobox {
		position: relative;
		border-radius: 1.25rem;
		padding: 1.25rem 1.5rem 1.25rem 1.75rem;
		margin: 1.75rem 0;
		border: 1px solid rgba(255, 255, 255, 0.7);
		overflow: hidden;
	}

	/* Tinted accent edge instead of a full-width flat fill. */
	.infobox::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		background: var(--edge);
	}

	.infobox.pink {
		--edge: linear-gradient(180deg, #ffb3c6, #f06292);
		--accent: #d14d64;
		--body: #4a2c2c;
		--tint: rgba(255, 240, 243, 0.55);
		background: #fff5f7;
		box-shadow:
			0 8px 24px 0 rgba(240, 98, 146, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
	}

	.infobox.blue {
		--edge: linear-gradient(180deg, #a5c8f0, #5b9bd5);
		--accent: #2b6cb0;
		--body: #1e3a5f;
		--tint: rgba(240, 247, 255, 0.55);
		background: #f0f7ff;
		box-shadow:
			0 8px 24px 0 rgba(91, 155, 213, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
	}

	@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
		.infobox {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, var(--tint) 100%);
			backdrop-filter: blur(18px);
			-webkit-backdrop-filter: blur(18px);
		}
	}

	.info-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 12px;
	}

	.dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 9999px;
		background: var(--edge);
		box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 45%, transparent);
		flex-shrink: 0;
	}

	.info-label {
		font-size: 0.85rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		line-height: 1;
	}

	.info-body {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--body);
	}

	.info-body :global(p:first-child) {
		margin-top: 0;
	}
	.info-body :global(p:last-child) {
		margin-bottom: 0;
	}

	.info-body :global(code) {
		font-size: 0.875rem;
		overflow-wrap: break-word;
		word-break: break-word;
	}
</style>
