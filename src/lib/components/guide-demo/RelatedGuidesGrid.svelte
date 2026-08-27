<script lang="ts">
	import { guides as allGuides } from '$lib/data/guides';

	// Grid version of RelatedGuides: eyebrow (category from guides.ts), title,
	// and description on their own lines instead of one crammed span.
	let {
		guides
	}: {
		guides: { href: string; title: string; desc: string }[];
	} = $props();

	function categoryFor(href: string): string {
		return allGuides.find((g) => g.url === href)?.category ?? 'Guide';
	}
</script>

<section class="related">
	<h2 class="related-heading">
		Related Guides
		<span class="bar"></span>
	</h2>
	<ul>
		{#each guides as g}
			<li>
				<a href={g.href}>
					<span class="card-eyebrow">{categoryFor(g.href)}</span>
					<span class="card-title">{g.title}</span>
					<span class="card-desc">{g.desc}</span>
					<span class="card-more" aria-hidden="true">
						Read guide
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"
							><path d="M9 5l7 7-7 7" /></svg
						>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.related {
		margin: 3rem 0;
	}

	.related-heading {
		font-size: 1.5rem;
		font-weight: 900;
		color: #4a2c2c;
		margin: 0 0 2rem;
	}

	.bar {
		display: block;
		width: 60px;
		height: 5px;
		border-radius: 9999px;
		background: linear-gradient(90deg, #f06292, rgba(240, 98, 146, 0.25));
		margin-top: 0.75rem;
	}

	.related ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.related ul {
			grid-template-columns: 1fr 1fr;
		}
	}

	.related a {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 100%;
		padding: 1.25rem 1.4rem;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.85);
		box-shadow: 0 2px 8px rgba(240, 98, 146, 0.06);
		text-decoration: none;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			background 0.25s ease;
	}

	.related a:hover {
		transform: translateY(-3px);
		background: rgba(255, 255, 255, 0.92);
		box-shadow: 0 10px 24px rgba(240, 98, 146, 0.16);
	}

	.card-eyebrow {
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #f06292;
	}

	.card-title {
		font-weight: 800;
		font-size: 1rem;
		line-height: 1.35;
		color: #4a2c2c;
		transition: color 0.25s ease;
	}

	.related a:hover .card-title {
		color: #f06292;
	}

	.card-desc {
		font-size: 0.875rem;
		line-height: 1.55;
		color: rgba(108, 63, 49, 0.8);
	}

	/* Related-guide descs are authored as lowercase sentence tails for the old
	   inline "{title} {desc}" layout. On their own line they read as cut-off
	   fragments, so capitalize the first letter at render time instead of
	   rewriting every guide's data. */
	.card-desc::first-letter {
		text-transform: uppercase;
	}

	.card-more {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: auto;
		padding-top: 0.5rem;
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #f8a5bd;
		transition: color 0.25s ease;
	}

	.related a:hover .card-more {
		color: #f06292;
	}

	.card-more svg {
		width: 0.8rem;
		height: 0.8rem;
		transition: transform 0.25s ease;
	}

	.related a:hover .card-more svg {
		transform: translateX(3px);
	}
</style>
