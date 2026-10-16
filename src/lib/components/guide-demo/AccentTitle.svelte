<script lang="ts">
	// Two-tone guide title, matching the /guides index header: cocoa text with
	// one short key phrase in brand pink. `accent` must be an exact substring of
	// `title`; if it is missing or not found the title renders plain, so the
	// copy of record can never be altered by a styling choice.
	const { title, accent = '' }: { title: string; accent?: string } = $props();

	const i = $derived(accent ? title.indexOf(accent) : -1);
</script>

{#if i >= 0}
	{title.slice(0, i)}<span
		class="bg-gradient-to-r from-[#F06292] to-[#EC407A] bg-clip-text text-transparent"
		>{accent}</span
	>{title.slice(i + accent.length)}
{:else}
	{title}
{/if}
