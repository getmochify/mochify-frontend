<script lang="ts">
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { posthog } from '$lib/analytics';

	// Pages that ARE the sign-up destination (e.g. /auth/register) opt out of the
	// "Get started" CTA: it links to the page you're already on and competes with
	// the primary form. "Sign in" stays, since it's a real escape hatch for existing users.
	let { showGetStarted = true }: { showGetStarted?: boolean } = $props();

	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);
	let signingOut = $state(false);

	// The drawer is a native Popover API element (popover="auto") rather than an
	// {#if}-gated block, so it stays mounted whether it's open or closed and the
	// browser handles click-outside/Escape itself. closeMenu() just asks it to hide;
	// mobileMenuOpen (used only to drive the hamburger-icon morph) is kept in sync by
	// the popover's native `toggle` event below, not set directly.
	function closeMenu() {
		document.getElementById('mobile-nav-menu')?.hidePopover();
	}

	// Close both menus as soon as a navigation STARTS, so the tap gives instant
	// feedback instead of the menu lingering open for the whole load (worst on the
	// dashboard, whose server load blocks the navigation from completing). Previously
	// this couldn't happen in the link's own onclick because it would unmount the
	// {#if} block holding the tapped <a> mid-click and iOS Safari would abort the
	// navigation (loading bar starts, page never changes). The popover-based drawer
	// is never unmounted, so that race no longer applies here, but beforeNavigate
	// remains the single place that closes the menu on every kind of navigation
	// (link taps, programmatic goto()) without needing a handler on every link.
	beforeNavigate(() => {
		closeMenu();
		userMenuOpen = false;
	});

	async function signOut() {
		// Guard against double-clicks while the async sign-out is in flight.
		if (signingOut) return;
		signingOut = true;
		try {
			await authClient.signOut();
			posthog.reset();
		} finally {
			// Full-page navigation, matching the dashboard's sign-out. An SPA
			// goto()/invalidateAll() cannot refresh session state here: the
			// homepage (and most routes) are `prerender = true`, so their server
			// load never re-runs at runtime and the nav keeps reading the stale
			// signed-in `page.data.session`. A real navigation re-runs SSR with
			// the now-cleared cookie, so the app renders signed-out immediately.
			window.location.href = '/';
		}
	}

	async function signInWithGoogle() {
		await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}

	// useSession() keeps the nav in sync client-side across navigations.
	// page.data.session is used as the immediate SSR value to prevent the flash
	// where the nav briefly shows "Sign in" before the client-side session loads.
	const sessionStore = authClient.useSession();
	let session = $derived($sessionStore.data?.session ?? page.data.session ?? null);
	let user = $derived($sessionStore.data?.user ?? page.data.user ?? null);
	let initials = $derived(user?.email?.slice(0, 1).toUpperCase() ?? '');

	// Paths where the "Launch app" CTA is suppressed, for two different reasons.
	//
	//   /flow      IS the app, so the CTA would link to the page you are already on.
	//              Same reasoning as showGetStarted on /auth/register, but keyed off
	//              the path: /flow renders <Navigation /> with no props.
	//   /dashboard already renders its own larger "Launch app" as the page's primary
	//              action, roughly 100px below this one. Two identical pink pills in
	//              one viewport read as a rendering bug rather than a choice, and the
	//              nav is `relative`, not sticky, so keeping it buys no persistent
	//              access to justify the duplication: it scrolls away either way.
	// Also guards the two "Dashboard" links (avatar dropdown + mobile menu) from
	// pointing at the page you are already on.
	let onDashboard = $derived(page.url.pathname === '/dashboard');
	let hideLaunch = $derived(onDashboard || page.url.pathname === '/flow');
</script>

<nav class="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
	<a href="/" class="group flex items-center gap-2 transition-transform active:scale-95">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-lg bg-mochi-pink shadow-sm transition-transform group-hover:rotate-6"
		>
			<span class="text-xl font-black text-white">M</span>
		</div>
		<span class="text-xl font-black tracking-tight text-[#4A2C2C]">Mochify</span>
	</a>

	<!-- Desktop Menu -->
	<div class="hidden items-center gap-6 sm:flex">
		<a
			href="/solutions"
			data-sveltekit-preload-data="hover"
			class="text-sm font-medium text-cocoa-deep transition-colors hover:text-mochi-pink"
			>Solutions</a
		>
		<a
			href="/guides"
			data-sveltekit-preload-data="hover"
			class="text-sm font-medium text-cocoa-deep transition-colors hover:text-mochi-pink">Guides</a
		>
		<a
			href="/docs"
			data-sveltekit-preload-data="hover"
			class="text-sm font-medium text-cocoa-deep transition-colors hover:text-mochi-pink">Docs</a
		>
		<a
			href="/pricing"
			data-sveltekit-preload-data="hover"
			class="text-sm font-medium text-cocoa-deep transition-colors hover:text-mochi-pink">Pricing</a
		>

		{#if session}
			{#if !hideLaunch}
				<a
					href="/flow"
					data-sveltekit-preload-data="hover"
					class="ml-2 cursor-pointer rounded-full bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-5 py-2 text-sm font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] transition-all hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)] active:scale-95"
				>
					Launch app
				</a>
			{/if}
			<div class="relative {hideLaunch ? 'ml-2' : ''}">
				<button
					onclick={() => (userMenuOpen = !userMenuOpen)}
					class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink text-sm font-black text-white shadow-sm transition-all hover:shadow-md"
					aria-label="User menu"
				>
					{initials}
				</button>

				{#if userMenuOpen}
					<div
						class="absolute top-11 right-0 z-50 w-44 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-xl"
						role="menu"
					>
						{#if !onDashboard}
							<a
								href="/dashboard"
								data-sveltekit-preload-data="hover"
								class="block px-4 py-3 text-sm font-medium text-cocoa-deep transition-colors hover:bg-[#FFF5F7]"
								role="menuitem"
							>
								Dashboard
							</a>
						{/if}
						<!-- The divider belongs BETWEEN the two items, so it goes away
                             with the first one: on /dashboard this button is the only
                             thing in the menu and a top border would draw a rule
                             against the dropdown's own rounded edge. -->
						<button
							onclick={signOut}
							disabled={signingOut}
							class="w-full px-4 py-3 text-left text-sm font-medium text-cocoa-milk/70 transition-colors hover:bg-[#FFF5F7] hover:text-mochi-pink disabled:cursor-wait disabled:opacity-50 {onDashboard
								? ''
								: 'border-t border-pink-50'}"
							role="menuitem"
						>
							{signingOut ? 'Signing out…' : 'Sign out'}
						</button>
					</div>
					<!-- click-away overlay -->
					<button
						class="fixed inset-0 -z-10 cursor-default"
						onclick={() => (userMenuOpen = false)}
						aria-label="Close menu"
						tabindex="-1"
					></button>
				{/if}
			</div>
		{:else}
			<a
				href="/auth/login"
				class="ml-2 cursor-pointer text-sm font-semibold text-cocoa-deep/60 transition-colors hover:text-mochi-pink"
			>
				Sign in
			</a>
			{#if showGetStarted}
				<a
					href="/auth/register"
					class="cursor-pointer rounded-full bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-5 py-2 text-sm font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] transition-all hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)] active:scale-95"
				>
					Get started
				</a>
			{/if}
		{/if}
	</div>

	<!-- Mobile Menu Button. popovertarget wires this to #mobile-nav-menu with zero
         JS: the browser opens/closes the drawer natively, so this works even on
         guide pages (`csr = false`, no hydration). aria-expanded/mobileMenuOpen
         (icon morph) only update once hydrated, via the popover's ontoggle below. -->
	<button
		popovertarget="mobile-nav-menu"
		aria-expanded={mobileMenuOpen}
		aria-controls="mobile-nav-menu"
		class="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-100 bg-[#FFF5F7] transition-all active:scale-95 sm:hidden"
		aria-label="Toggle menu"
	>
		<div class="flex h-4 w-5 flex-col justify-between">
			<span
				class="h-0.5 w-full rounded-full bg-mochi-pink transition-all {mobileMenuOpen
					? 'translate-y-1.5 rotate-45'
					: ''}"
			></span>
			<span
				class="h-0.5 w-full rounded-full bg-mochi-pink transition-all {mobileMenuOpen
					? 'opacity-0'
					: ''}"
			></span>
			<span
				class="h-0.5 w-full rounded-full bg-mochi-pink transition-all {mobileMenuOpen
					? '-translate-y-2 -rotate-45'
					: ''}"
			></span>
		</div>
	</button>
</nav>

<!-- Mobile Menu Panel. Native Popover API: popover="auto" gives click-outside
     (light dismiss) and Escape-to-close for free, in the top layer, with NO
     JavaScript required — this is what makes the menu work on guide pages
     (csr = false). The dim/blur backdrop is the popover's own ::backdrop
     pseudo-element, styled in <style> below since Tailwind utilities can't
     target it. Positioning/sizing overrides (also in <style>) undo the UA
     stylesheet's default centered/fit-content popover box so this keeps its
     original top-20/right-4/left-4 placement. ontoggle only fires once
     hydrated; it just keeps mobileMenuOpen (hamburger icon morph) in sync. -->
<div
	id="mobile-nav-menu"
	popover="auto"
	ontoggle={(e) => {
		mobileMenuOpen = e.newState === 'open';
	}}
	class="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-2xl sm:hidden"
>
	<div class="flex flex-col gap-2 p-4">
		<a
			href="/solutions"
			class="rounded-2xl px-6 py-4 font-medium text-cocoa-deep transition-all hover:bg-[#FFF5F7] active:scale-95"
		>
			Solutions
		</a>
		<a
			href="/guides"
			class="rounded-2xl px-6 py-4 font-medium text-cocoa-deep transition-all hover:bg-[#FFF5F7] active:scale-95"
		>
			Guides
		</a>
		<a
			href="/docs"
			class="rounded-2xl px-6 py-4 font-medium text-cocoa-deep transition-all hover:bg-[#FFF5F7] active:scale-95"
		>
			Docs
		</a>
		<a
			href="/pricing"
			class="rounded-2xl px-6 py-4 font-medium text-cocoa-deep transition-all hover:bg-[#FFF5F7] active:scale-95"
		>
			Pricing
		</a>
		{#if session}
			{#if !hideLaunch}
				<a
					href="/flow"
					class="mx-2 mt-2 rounded-2xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-6 py-4 text-center font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] transition-all hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)] active:scale-95"
				>
					Launch app
				</a>
			{/if}
			{#if !onDashboard}
				<a
					href="/dashboard"
					data-sveltekit-preload-data="hover"
					class="rounded-2xl border-t border-pink-50 px-6 py-4 font-medium text-cocoa-deep transition-all hover:bg-[#FFF5F7] active:scale-95"
				>
					Dashboard
				</a>
			{/if}
			<!-- Inherits the border-t that Dashboard was carrying, so the rule
                 separating page links from account actions survives its removal.
                 Signed-in UI only ever renders once useSession() has resolved a
                 user, which requires hydration — so this button never appears on
                 a JS-free guide page and can stay a plain onclick handler. -->
			<button
				onclick={signOut}
				disabled={signingOut}
				class="rounded-2xl px-6 py-4 text-left font-medium text-cocoa-milk/70 transition-all hover:bg-[#FFF5F7] hover:text-mochi-pink active:scale-95 disabled:cursor-wait disabled:opacity-50 {onDashboard
					? 'border-t border-pink-50'
					: ''}"
			>
				{signingOut ? 'Signing out…' : 'Sign out'}
			</button>
		{:else}
			<a
				href="/auth/login"
				class="rounded-2xl border-t border-pink-50 px-6 py-4 font-medium text-cocoa-deep transition-all hover:bg-[#FFF5F7] active:scale-95"
			>
				Sign in
			</a>
			<!-- A real link, not a button: on a JS-free guide page it navigates to
                 /auth/login (which has its own Google button) like any other link
                 here. Once hydrated, onclick intercepts the tap for one-tap Google
                 sign-in instead. -->
			<a
				href="/auth/login"
				onclick={(e) => {
					e.preventDefault();
					closeMenu();
					signInWithGoogle();
				}}
				class="mx-2 flex items-center justify-center gap-2.5 rounded-2xl border border-cocoa-milk/15 bg-white/80 px-6 py-3.5 font-bold text-cocoa-deep transition-all hover:border-cocoa-milk/30 hover:bg-white active:scale-95"
			>
				<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true"
					><path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/><path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/><path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
					/><path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/></svg
				>
				Continue with Google
			</a>
			{#if showGetStarted}
				<a
					href="/auth/register"
					class="mx-2 mb-2 rounded-2xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink px-6 py-4 text-center font-black text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] transition-all hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)] active:scale-95"
				>
					Get started
				</a>
			{/if}
		{/if}
	</div>
</div>

<style>
	/* The [popover] UA stylesheet defaults to `position: fixed; inset: 0;
       margin: auto; width/height: fit-content`, which shrink-wraps and centers
       the box. Override with the drawer's original top-20/right-4/left-4
       placement and auto sizing. Unlayered component styles beat Tailwind
       utility classes here, so this also wins over any conflicting utility. */
	#mobile-nav-menu {
		position: fixed;
		inset: auto 1rem auto 1rem;
		top: 5rem;
		margin: 0;
		padding: 0;
		width: auto;
		height: auto;
		max-width: none;
		max-height: none;
	}

	/* Replaces the old manual bg-[#4A2C2C]/20 backdrop-blur-sm overlay div —
       ::backdrop is the only way to style a popover's dimming layer, and
       Tailwind utility classes can't be applied to a pseudo-element. */
	#mobile-nav-menu::backdrop {
		background: rgba(74, 44, 44, 0.2);
		-webkit-backdrop-filter: blur(8px);
		backdrop-filter: blur(8px);
	}
</style>
