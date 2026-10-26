<script lang="ts">
	import { posthog } from '$lib/analytics';

	let {
		value = $bindable(''),
		results,
		surface,
		label,
		placeholder
	}: {
		value?: string;
		/** How many items the current query shows, for the `list_search` event. */
		results: number;
		/** `guides` or `solutions`, for the event. */
		surface: string;
		label: string;
		placeholder: string;
	} = $props();

	// What visitors look for is the point of logging this: a query with no
	// results is a page we have not built yet. Sent once the typing settles,
	// and never twice for the same query, so one search is one event.
	let lastSent = '';
	let timer: ReturnType<typeof setTimeout> | undefined;
	function report(now = false) {
		clearTimeout(timer);
		const send = () => {
			const query = value.trim().toLowerCase();
			if (query.length < 2 || query === lastSent) return;
			lastSent = query;
			posthog.capture('list_search', { surface, query, results, no_results: results === 0 });
		};
		if (now) send();
		else timer = setTimeout(send, 1200);
	}
</script>

<div class="relative">
	<svg
		class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#875F42]/50"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		stroke-width="2.5"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
		/>
	</svg>
	<input
		type="search"
		bind:value
		oninput={() => report()}
		onblur={() => report(true)}
		aria-label={label}
		{placeholder}
		autocomplete="off"
		spellcheck="false"
		class="w-full rounded-2xl border border-pink-100 bg-white py-3 pr-4 pl-11 text-sm font-medium text-[#4A2C2C] placeholder-[#875F42]/40 shadow-sm transition-all focus:border-[#F06292]/40 focus:ring-2 focus:ring-[#F06292]/30 focus:outline-none"
	/>
</div>
