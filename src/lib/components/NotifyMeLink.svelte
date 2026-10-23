<script lang="ts">
	import { askToNotify, canAskToNotify, type NotifySurface } from '$lib/batchNotify';

	// The opt-in for a finished-batch notification, shown only while a big run
	// is going. Renders nothing once the browser has an answer, or where
	// notifications are not offered (see batchNotify).
	let { surface, class: className = '' }: { surface: NotifySurface; class?: string } = $props();

	let mode = $state<'ask' | 'on' | 'hidden'>(canAskToNotify() ? 'ask' : 'hidden');

	async function ask(e: MouseEvent) {
		e.preventDefault();
		mode = (await askToNotify(surface)) === 'granted' ? 'on' : 'hidden';
	}
</script>

{#if mode === 'ask'}
	<button
		type="button"
		onclick={ask}
		class="cursor-pointer text-xs font-semibold whitespace-nowrap text-[#F06292]/80 underline decoration-dotted underline-offset-2 transition-colors hover:text-[#F06292] {className}"
		>Notify me when it's done</button
	>
{:else if mode === 'on'}
	<span class="text-xs font-medium whitespace-nowrap text-[#6C3F31]/60 {className}"
		>We'll let you know</span
	>
{/if}
