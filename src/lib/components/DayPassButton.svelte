<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { posthog } from '$lib/analytics';
	import { DAY_PASS_ACTION, dayPassNext } from '$lib/dayPass';

	let {
		trigger,
		class: className = '',
		next = undefined,
		children
	}: {
		/** PostHog `day_pass_cta_clicked` trigger label for this surface. */
		trigger: string;
		/** Classes for the button itself — it is the element the old anchor was. */
		class?: string;
		/** Override the return path; defaults to the page the CTA sits on. */
		next?: string;
		children?: Snippet;
	} = $props();

	const returnTo = $derived(next ?? dayPassNext(page.url));
</script>

<!--
	A real form, not a link, and not a fetch: nothing crawls or prefetches a POST,
	which is the entire reason the Day Pass moved off its hosted Polar URL. It
	also means the CTA still works with JS disabled.

	`display: contents` keeps the form out of the layout, so the button remains
	the flex/grid item (or the inline element) the anchor it replaced used to be,
	and every surface styles it exactly as before via `class`.
-->
<form
	method="POST"
	action={DAY_PASS_ACTION}
	target="_blank"
	rel="noopener noreferrer"
	class="contents"
	onsubmit={() => posthog.capture('day_pass_cta_clicked', { trigger })}
>
	<input type="hidden" name="next" value={returnTo} />
	<input type="hidden" name="trigger" value={trigger} />
	<button type="submit" class="cursor-pointer {className}">{@render children?.()}</button>
</form>
