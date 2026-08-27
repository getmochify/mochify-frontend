<script lang="ts">
	// Numbered workflow steps with a connecting rail between the badges.
	// Pure CSS (counters + pseudo-elements) so it works with csr = false.
	// Step bodies are authored HTML (links, <code>) written by us, not user input.
	let {
		steps
	}: {
		steps: { title: string; html: string }[];
	} = $props();
</script>

<ol class="step-list">
	{#each steps as step}
		<li>
			<p class="step-title">{step.title}</p>
			<div class="step-body">{@html step.html}</div>
		</li>
	{/each}
</ol>

<style>
	.step-list {
		list-style: none;
		counter-reset: step;
		margin: 1.75rem 0;
		padding: 0;
	}

	.step-list li {
		counter-increment: step;
		position: relative;
		padding-left: 3.75rem;
		padding-bottom: 2.25rem;
	}

	.step-list li:last-child {
		padding-bottom: 0;
	}

	/* Number badge */
	.step-list li::before {
		content: counter(step);
		position: absolute;
		left: 0;
		top: -0.25rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #ff8fa3 0%, #f06292 100%);
		color: white;
		font-weight: 900;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 12px rgba(240, 98, 146, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	/* Connecting rail */
	.step-list li:not(:last-child)::after {
		content: '';
		position: absolute;
		left: calc(1.25rem - 1px);
		top: 2.5rem;
		bottom: 0.25rem;
		width: 2px;
		border-radius: 9999px;
		background: linear-gradient(180deg, rgba(240, 98, 146, 0.45), rgba(255, 179, 198, 0.25));
	}

	.step-title {
		font-weight: 900;
		color: #4a2c2c;
		margin: 0 0 0.5rem;
	}

	.step-body :global(p) {
		margin: 0 0 0.75rem;
	}
	.step-body :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
