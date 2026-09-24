<script lang="ts">
	import { onMount } from 'svelte';

	// A dismissible offer of another language. Never a redirect: Googlebot
	// crawls from the US, so redirecting by IP or Accept-Language would hide
	// /fr/flow and /es/flow from the crawler that has to index them (handoff A4,
	// and the Spanish handoff's A5). Pages are served by URL and the visitor
	// chooses.
	//
	// Detection is client-side on `navigator.languages` rather than server-side
	// on the Accept-Language header, deliberately: these pages sit behind
	// Cloudflare, and varying the HTML on a request header either fragments the
	// edge cache or, worse, lets one visitor's cached French banner be served to
	// the next visitor. The banner is an enhancement, so it can cost a frame
	// after hydration; correctness at the cache cannot.
	//
	// `offers` is a list because an English page now has two to make. A visitor
	// gets ONE banner: the first offer whose `when` they prefer, in the order
	// given. An offer with no `when` always shows, which is how /fr/* and /es/*
	// offer English back to every visitor rather than only to English speakers.
	//
	// The dismissal is sessionStorage, per the handoff's "remember for the
	// session" — a per-visitor convenience, not state anything else reads. It is
	// keyed per language offered, so dismissing the Spanish banner does not also
	// silence the French one on a page that could show either.
	type Offer = {
		href: string;
		label: string;
		/** Language of the page being offered, for the link's own lang/hreflang. */
		lang: string;
		/** Show only to a visitor who prefers this language. Omit to always show. */
		when?: string;
	};

	let {
		offers,
		dismissKeyPrefix = 'mochify-locale-banner'
	}: { offers: Offer[]; dismissKeyPrefix?: string } = $props();

	let shown = $state<Offer | null>(null);

	function prefers(tag: string): boolean {
		const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
		return langs.some((l) => l?.toLowerCase().split('-')[0] === tag);
	}

	const keyFor = (offer: Offer) => `${dismissKeyPrefix}-${offer.lang}`;

	onMount(() => {
		for (const offer of offers) {
			try {
				if (sessionStorage.getItem(keyFor(offer))) continue;
			} catch {
				// Private mode or blocked storage: offer the banner rather than fail.
			}
			if (!offer.when || prefers(offer.when)) {
				shown = offer;
				return;
			}
		}
	});

	function dismiss() {
		const offer = shown;
		shown = null;
		if (!offer) return;
		try {
			sessionStorage.setItem(keyFor(offer), '1');
		} catch {
			/* nothing to remember is better than a thrown error */
		}
	}
</script>

{#if shown}
	<div class="flex justify-center px-4 pt-3">
		<div
			class="flex w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-[#FFF5F7] px-4 py-2.5 text-sm text-[#6C3F31]"
		>
			<a
				href={shown.href}
				hreflang={shown.lang}
				lang={shown.lang}
				class="font-bold text-[#F06292] hover:underline">{shown.label}</a
			>
			<button
				type="button"
				onclick={dismiss}
				aria-label={shown.label}
				class="shrink-0 cursor-pointer rounded-full p-1 text-[#875F42]/60 transition-colors hover:text-[#F06292]"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>
{/if}
