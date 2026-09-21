<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { posthog } from '$lib/analytics';
	import { DAY_PASS_ACTION, dayPassNext, startDayPassCheckout } from '$lib/dayPass';

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

	function handleSubmit(event: SubmitEvent) {
		posthog.capture('day_pass_cta_clicked', { trigger });
		// With JS the checkout is started as a JSON fetch instead of this form's
		// native POST, which is what keeps callers whose `Origin` header never
		// arrives out of SvelteKit's CSRF rejection. See `startDayPassCheckout`.
		const form = event.currentTarget as HTMLFormElement;
		event.preventDefault();
		void startDayPassCheckout({ next: returnTo, trigger, fallbackForm: form });
	}
</script>

<!--
	A real form, not a link: nothing crawls or prefetches a POST, which is the
	entire reason the Day Pass moved off its hosted Polar URL, and the CTA still
	works with JS disabled. With JS the submit is intercepted and sent as JSON
	(see `startDayPassCheckout`); this form is then only the fallback.

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
	onsubmit={handleSubmit}
>
	<input type="hidden" name="next" value={returnTo} />
	<input type="hidden" name="trigger" value={trigger} />
	<button type="submit" class="cursor-pointer {className}">{@render children?.()}</button>
</form>
