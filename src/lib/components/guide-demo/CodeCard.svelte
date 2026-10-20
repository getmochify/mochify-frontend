<script lang="ts">
	import type { Snippet } from 'svelte';

	// Quieter code block: language/filename chip instead of fake macOS window
	// chrome, warm dark surface, soft pink glow in the shadow. The one code
	// block style for the site: guides pass `code`; the homepage passes a
	// `children` snippet for rich content (prompt markers, a chat transcript)
	// and `compact` for the smaller step cards.
	let {
		filename = '',
		code = '',
		compact = false,
		class: className = '',
		children
	}: {
		filename?: string;
		code?: string;
		/** Smaller type and padding, no outer margin, body fills the card's height. */
		compact?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="code-card {className}" class:compact>
	{#if filename}
		<div class="code-header">
			<span class="chip">{filename}</span>
		</div>
	{/if}
	{#if children}
		<div class="code-body">{@render children()}</div>
	{:else}
		<pre><code>{code}</code></pre>
	{/if}
</div>

<style>
	.code-card {
		margin: 1.75rem 0;
		border-radius: 1.25rem;
		overflow: hidden;
		background: linear-gradient(160deg, #241a1c 0%, #1c1416 100%);
		border: 1px solid rgba(255, 179, 198, 0.12);
		box-shadow:
			0 12px 32px rgba(74, 44, 44, 0.25),
			0 4px 12px rgba(240, 98, 146, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.code-header {
		display: flex;
		align-items: center;
		padding: 0.65rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.chip {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: 'SF Mono', 'Monaco', 'Fira Code', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #ffb3c6;
		background: rgba(240, 98, 146, 0.12);
		border: 1px solid rgba(240, 98, 146, 0.25);
		border-radius: 9999px;
		padding: 0.2rem 0.7rem;
	}

	.code-card pre,
	.code-body {
		margin: 0;
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 0.9375rem;
		line-height: 1.7;
		color: #f3e8e6;
		background: transparent;
	}

	.code-card code {
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		background: transparent;
		color: inherit;
		padding: 0;
		border: none;
		font-weight: 400;
		font-size: inherit;
	}

	.compact {
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.compact .code-header {
		flex-shrink: 0;
	}

	.compact pre,
	.compact .code-body {
		flex: 1;
		padding: 1rem;
		font-size: 0.75rem;
		line-height: 1.65;
	}
</style>
