<script lang="ts">
	import { kbSizes, GENERAL_SLUG } from '$lib/data/compressToKb';

	// The family's internal linking: every size page links every other size
	// and the general page, as plain crawlable links. `current` is the page's
	// own size (left out of the row), or 0 on the general page.
	let { current = 0 }: { current?: number } = $props();

	const links = $derived([
		...kbSizes
			.filter((s) => s.kb !== current)
			.map((s) => ({ href: `/solutions/${s.slug}`, label: `Compress image to ${s.kb}KB` })),
		...(current ? [{ href: `/solutions/${GENERAL_SLUG}`, label: 'Reduce image size in KB' }] : [])
	]);
</script>

<ul class="flex flex-wrap gap-3">
	{#each links as link (link.href)}
		<li>
			<a
				href={link.href}
				class="inline-block rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-bold text-cocoa-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-mochi-pink hover:text-mochi-pink"
				>{link.label}</a
			>
		</li>
	{/each}
</ul>
