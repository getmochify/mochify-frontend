<script lang="ts">
	// Quieter code block: language/filename chip instead of fake macOS window
	// chrome, warm dark surface, soft pink glow in the shadow.
	let {
		filename = '',
		code = ''
	}: {
		filename?: string;
		code?: string;
	} = $props();
</script>

<div class="code-card">
	{#if filename}
		<div class="code-header">
			<span class="chip">{filename}</span>
		</div>
	{/if}
	<pre><code>{code}</code></pre>
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

	.code-card pre {
		margin: 0;
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
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
</style>
