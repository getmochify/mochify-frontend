<script lang="ts">
	import { helpUrlForKey, trackHelpLinkClicked } from '$lib/uploadError';

	// The "Why?" behind every uploader limit message: the batch cap, the size
	// rows and the allowance box. One explainer for all three, because the
	// visitor who hits one limit is usually about to meet another, and the
	// three were being learned one guide visit at a time. Opens in place rather
	// than navigating, so the files staged in the uploader are not lost; the
	// guide is one link further for anyone who wants the long version.
	//
	// The open is tracked through trackHelpLinkClicked, the same event the
	// navigating UploadHelpLink fires, so the help-link reads stay continuous.
	let {
		errorKey,
		surface,
		label = 'Why?',
		class: className = ''
	}: {
		/** Which guide section the "More" link points at. */
		errorKey: string;
		/** Which limit surface this sits on, e.g. 'batch_cap_banner'. */
		surface: string;
		label?: string;
		class?: string;
	} = $props();

	let open = $state(false);

	function toggle() {
		open = !open;
		if (open) trackHelpLinkClicked({ key: errorKey, surface });
	}
</script>

<button type="button" onclick={toggle} aria-expanded={open} class="why-link {className}">
	{label}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="3"
		aria-hidden="true"
		class:rotate-90={open}
		><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
	>
</button>
{#if open}
	<span
		class="mt-1.5 block w-full basis-full rounded-xl border border-[#875F42]/10 bg-white/80 px-3 py-2 text-left text-xs leading-relaxed font-medium text-[#6C3F31]"
	>
		Free plans, with or without an account, convert 3 files per batch at up to 20MB each. The Day
		Pass and the paid plans convert 25 per batch at up to 75MB each. No plan takes a file over 75MB.
		Files are checked in your browser before anything is uploaded, so a trimmed or rejected file
		never uses an upload. Without an account the allowance is 3 uploads a month; a free account
		makes it 25.
		<a
			href={helpUrlForKey(errorKey)}
			class="ml-0.5 font-bold whitespace-nowrap text-mochi-pink underline underline-offset-2 hover:text-[#E91E8C]"
			>More in the guide ›</a
		>
	</span>
{/if}

<style>
	/* Matches UploadHelpLink: coloured by the surface it sits on. */
	.why-link {
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		font-size: 0.75rem;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 2px;
		opacity: 0.85;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.why-link:hover {
		opacity: 1;
	}

	.why-link svg {
		width: 0.7em;
		height: 0.7em;
		transition: transform 0.15s ease;
	}
</style>
