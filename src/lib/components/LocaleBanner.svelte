<script lang="ts">
	import { onMount } from 'svelte';

	// A dismissible offer of the other language. Never a redirect: Googlebot
	// crawls from the US, so redirecting by IP or Accept-Language would hide
	// /fr/flow from the crawler that has to index it (handoff A4). Pages are
	// served by URL and the visitor chooses.
	//
	// Detection is client-side on `navigator.languages` rather than server-side
	// on the Accept-Language header, deliberately: these pages sit behind
	// Cloudflare, and varying the HTML on a request header either fragments the
	// edge cache or, worse, lets one visitor's cached French banner be served to
	// the next visitor. The banner is an enhancement, so it can cost a frame
	// after hydration; correctness at the cache cannot.
	//
	// The dismissal is sessionStorage, per the handoff's "remember for the
	// session" — it is a per-visitor convenience, not state anything else reads.
	let {
		href,
		label,
		dismissKey,
		/** Show only when the visitor's browser prefers this language. Omit to always offer. */
		when
	}: { href: string; label: string; dismissKey: string; when?: string } = $props();

	let show = $state(false);

	function prefers(tag: string): boolean {
		const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
		return langs.some((l) => l?.toLowerCase().startsWith(tag));
	}

	onMount(() => {
		try {
			if (sessionStorage.getItem(dismissKey)) return;
		} catch {
			// Private mode or blocked storage: offer the banner rather than fail.
		}
		show = when ? prefers(when) : true;
	});

	function dismiss() {
		show = false;
		try {
			sessionStorage.setItem(dismissKey, '1');
		} catch {
			/* nothing to remember is better than a thrown error */
		}
	}
</script>

{#if show}
	<div class="flex justify-center px-4 pt-3">
		<div
			class="flex w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-[#FFF5F7] px-4 py-2.5 text-sm text-[#6C3F31]"
		>
			<a {href} class="font-bold text-[#F06292] hover:underline">{label}</a>
			<button
				type="button"
				onclick={dismiss}
				aria-label={label}
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
