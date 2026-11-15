<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { posthog } from '$lib/analytics';
	import {
		DAY_PASS_ACTION,
		DAY_PASS_PLUS_ACTION,
		dayPassNext,
		prewarmDayPass,
		startDayPassCheckout,
		type DayPassActivation
	} from '$lib/dayPass';
	import { warmCheckout } from '$lib/embedCheckout';

	let {
		trigger,
		source = undefined,
		class: className = '',
		next = undefined,
		onPaid = undefined,
		properties = undefined,
		plus = false,
		prewarm = false,
		children
	}: {
		/** PostHog `day_pass_cta_clicked` trigger label for this surface. */
		trigger: string;
		/** Which uploader limit box the click came from (batch_cap_box, size_row, allowance_box). */
		source?: string;
		/** Classes for the button itself — it is the element the old anchor was. */
		class?: string;
		/** Override the return path; defaults to the page the CTA sits on. */
		next?: string;
		/** Called when payment completes in the overlay; the default is a notice card. */
		onPaid?: (checkoutUrl: string, activation: DayPassActivation) => void;
		/** Extra properties for `day_pass_cta_clicked` (the batch-cap box sends its drop size). */
		properties?: Record<string, unknown>;
		/** Sell Day Pass+ (300 uploads) instead of the Day Pass. */
		plus?: boolean;
		/**
		 * Create the checkout and load Polar's frame while this button is on
		 * screen, so a click opens it at once. Only where the visitor has hit a
		 * limit: each one is a real (if unclaimed) Polar checkout. See `prewarmDayPass`.
		 */
		prewarm?: boolean;
		children?: Snippet;
	} = $props();

	const returnTo = $derived(next ?? dayPassNext(page.url));

	// Connect to Polar while the offer is on screen, and again on
	// hover/focus/press: a preconnect lapses after about ten seconds unused.
	// With `prewarm`, load the whole checkout instead; the intent handlers then
	// replace one a cancelled overlay used up.
	function warm() {
		if (prewarm) prewarmDayPass({ next: returnTo, plus });
		else warmCheckout();
	}
	$effect(warm);

	function handleSubmit(event: SubmitEvent) {
		posthog.capture('day_pass_cta_clicked', {
			trigger,
			...(source ? { source } : {}),
			pass: plus ? 'plus' : 'day',
			...properties
		});
		// With JS the checkout is started as a JSON fetch instead of this form's
		// native POST, which is what keeps callers whose `Origin` header never
		// arrives out of SvelteKit's CSRF rejection. See `startDayPassCheckout`.
		const form = event.currentTarget as HTMLFormElement;
		event.preventDefault();
		void startDayPassCheckout({ next: returnTo, trigger, plus, fallbackForm: form, onPaid });
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
	action={plus ? DAY_PASS_PLUS_ACTION : DAY_PASS_ACTION}
	target="_blank"
	rel="noopener noreferrer"
	class="contents"
	onsubmit={handleSubmit}
>
	<input type="hidden" name="next" value={returnTo} />
	<input type="hidden" name="trigger" value={trigger} />
	<button
		type="submit"
		class="cursor-pointer {className}"
		onpointerenter={warm}
		onpointerdown={warm}
		onfocus={warm}>{@render children?.()}</button
	>
</form>
