<script lang="ts">
	import type { Snippet } from 'svelte';

	// Frosted mochi-glass panel for guide pages. Needs ambient colour behind it
	// (BlobBackground) to read as glass; falls back to a solid blush card when
	// backdrop-filter is unsupported.
	let {
		label,
		class: className = '',
		children
	}: {
		/** Optional small uppercase eyebrow inside the panel, e.g. "The short answer". */
		label?: string;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class="glass-panel {className}">
	{#if label}
		<p class="glass-label"><span class="glass-dot"></span>{label}</p>
	{/if}
	<div class="glass-body">
		{@render children()}
	</div>
</div>

<style>
	.glass-panel {
		position: relative;
		border-radius: 1.5rem;
		padding: 1.5rem 1.75rem;
		margin: 1.75rem 0;
		background: #fff9fa;
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow:
			0 8px 32px 0 rgba(240, 98, 146, 0.12),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
			inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
	}

	@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
		.glass-panel {
			background: linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.55) 0%,
				rgba(255, 255, 255, 0.25) 100%
			);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}

	.glass-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #d14d64;
		margin: 0 0 0.75rem;
	}

	.glass-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #ffb3c6, #f06292);
		box-shadow: 0 0 6px rgba(240, 98, 146, 0.5);
		flex-shrink: 0;
	}

	.glass-body :global(p:first-child) {
		margin-top: 0;
	}
	.glass-body :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
