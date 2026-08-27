<script lang="ts">
	// Glass table-of-contents card. Keeps the numbered-row pattern from the
	// existing guides but frosts the wrapper and makes rows translucent so the
	// blob background shows through. Numbers come from a CSS counter, so pages
	// no longer hand-author "01"/"02" strings.
	let {
		items,
		heading = "What's in this guide"
	}: {
		items: { id: string; label: string }[];
		heading?: string;
	} = $props();
</script>

<nav class="toc" aria-label="Table of contents">
	<p class="toc-heading">{heading}</p>
	<ul>
		{#each items as item}
			<li>
				<a href="#{item.id}">
					<span class="row-num" aria-hidden="true"></span>
					<span class="row-label">{item.label}</span>
					<svg
						class="row-chevron"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="3"
						aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg
					>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.toc {
		border-radius: 1.5rem;
		padding: 1.25rem;
		margin: 1.75rem 0;
		background: #fff9fa;
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow:
			0 8px 32px 0 rgba(240, 98, 146, 0.12),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
	}

	@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
		.toc {
			background: linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.45) 0%,
				rgba(255, 255, 255, 0.15) 100%
			);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}

	.toc-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #d14d64;
		margin: 0.25rem 0 1rem 0.5rem;
	}

	.toc-heading::before {
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #ffb3c6, #f06292);
		box-shadow: 0 0 6px rgba(240, 98, 146, 0.5);
	}

	/* One column on mobile; two on md+ so a constrained-width TOC doesn't
	   stack into excessive vertical height. Rows read down each column in
	   document order (grid auto-placement is row-major, which keeps numbered
	   pairs side by side; fine for a scan list). */
	.toc ul {
		list-style: none;
		counter-reset: toc;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.6rem;
	}

	@media (min-width: 768px) {
		.toc ul {
			grid-template-columns: 1fr 1fr;
			gap: 0.75rem;
		}
	}

	.toc li {
		counter-increment: toc;
	}

	.toc a {
		display: flex;
		align-items: center;
		height: 100%; /* cells in the same grid row match heights when a label wraps */
		gap: 1rem;
		padding: 0.7rem 0.9rem;
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.8);
		box-shadow: 0 1px 3px rgba(240, 98, 146, 0.06);
		text-decoration: none;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			background 0.25s ease;
	}

	.toc a:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.85);
		box-shadow: 0 6px 16px rgba(240, 98, 146, 0.15);
	}

	.row-num {
		flex-shrink: 0;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background: #fff0f3;
		border: 1px solid #ffd6e0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.25s ease;
	}

	.row-num::before {
		content: counter(toc, decimal-leading-zero);
		font-size: 10px;
		font-weight: 900;
		color: #f06292;
	}

	.toc a:hover .row-num {
		transform: scale(1.1);
	}

	.row-label {
		flex: 1;
		font-weight: 700;
		font-size: 0.95rem;
		line-height: 1.3;
		color: #6c3f31;
		transition: color 0.25s ease;
	}

	.toc a:hover .row-label {
		color: #f06292;
	}

	.row-chevron {
		flex-shrink: 0;
		width: 1rem;
		height: 1rem;
		color: #f8a5bd;
		transition:
			color 0.25s ease,
			transform 0.25s ease;
	}

	.toc a:hover .row-chevron {
		color: #f06292;
		transform: translateX(4px);
	}
</style>
