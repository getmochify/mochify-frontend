<script lang="ts">
	import { helpUrlForKey, trackHelpLinkClicked } from '$lib/uploadError';

	// "What can I do?" link under a failure message, pointing at the matching
	// section of /guides/why-did-my-upload-fail. Every failure surface in the app
	// is persistent (no auto-dismiss), so the link is still there when the reader
	// comes back from the guide — which is the whole point: the first line of a
	// failure message does not have to carry the fix.
	//
	// `decoder` is passed on incomplete_image only. Core's corrupt-image label is
	// reached both by a truly truncated file and by any other libheif failure, so
	// the decoder sentence is what keeps this anchor's click counts readable.
	let {
		errorKey,
		surface,
		decoder,
		label = 'What can I do?',
		class: className = ''
	}: {
		/** An UploadErrorKey. Anything unmapped falls through to the guide's "still stuck" section. */
		errorKey?: string;
		/** Which failure surface this link sits on, e.g. 'manual_banner'. Rides along on the event. */
		surface: string;
		decoder?: string;
		label?: string;
		class?: string;
	} = $props();
</script>

<a
	href={helpUrlForKey(errorKey)}
	onclick={() => trackHelpLinkClicked({ key: errorKey, surface, decoder })}
	class="help-link {className}"
>
	{label}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"
		><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
	>
</a>

<style>
	/* Deliberately unstyled by colour: each surface (red banner, amber banner,
	   per-file card) sets its own via currentColor, so the link reads as part of
	   the message rather than as a foreign element pasted underneath it. */
	.help-link {
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		font-size: 0.75rem;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 2px;
		opacity: 0.85;
		transition: opacity 0.15s ease;
	}

	.help-link:hover {
		opacity: 1;
	}

	.help-link svg {
		width: 0.7em;
		height: 0.7em;
	}
</style>
