<script lang="ts">
	import { alternates } from '$lib/i18n/locales';

	// Every Flow page emits the same alternate set, and every pricing page emits
	// the same one, which is what hreflang requires: a page that lists itself
	// differently from its siblings is ignored rather than corrected. Keeping it
	// in a component means adding a language edits one table, not ten files.
	let { base }: { base: '/flow' | '/pricing' } = $props();
</script>

<svelte:head>
	{#each alternates(base) as alt (alt.hreflang)}
		<link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
	{/each}
</svelte:head>
