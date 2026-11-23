<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { posthog } from '$lib/analytics';
	import { readTheme, setTheme } from '$lib/theme';

	// Rendered by Navigation on pages that opt in (see $lib/theme). The saved
	// choice is already on <html> from app.html; this syncs the icon, and
	// re-applies it after a client-side navigation from a page that changed it.
	let dark = $state(false);
	onMount(() => {
		dark = readTheme() === 'dark';
		document.documentElement.dataset.theme = dark ? 'dark' : 'light';
	});

	function toggle() {
		dark = !dark;
		setTheme(dark ? 'dark' : 'light');
		posthog.capture('theme_toggled', { theme: dark ? 'dark' : 'light', path: page.url.pathname });
	}
</script>

<!-- Both icons are always in the markup and CSS shows the one for the current
     theme (layout.css), so the icon is right before hydration and on the guide
     pages, which never hydrate: there the guides layout's inline script handles
     the click, found by `data-theme-toggle`. -->
<button
	type="button"
	data-theme-toggle
	onclick={toggle}
	aria-pressed={dark}
	aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={dark ? 'Light mode' : 'Dark mode'}
	class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-pink-100 bg-mochi-blush text-cocoa-milk transition-colors hover:text-mochi-pink"
>
	<svg class="theme-icon-sun h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"
		><circle cx="12" cy="12" r="4" /><path
			stroke-linecap="round"
			d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"
		/></svg
	>
	<svg class="theme-icon-moon h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"
		><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
	>
</button>
