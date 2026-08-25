<script lang="ts">
    import { page } from '$app/state'
    import { beforeNavigate } from '$app/navigation'
    import { authClient } from '$lib/auth-client'
    import { posthog } from '$lib/analytics'

    // Pages that ARE the sign-up destination (e.g. /auth/register) opt out of the
    // "Get started" CTA: it links to the page you're already on and competes with
    // the primary form. "Sign in" stays, since it's a real escape hatch for existing users.
    let { showGetStarted = true }: { showGetStarted?: boolean } = $props()

    let mobileMenuOpen = $state(false)
    let userMenuOpen = $state(false)
    let signingOut = $state(false)

    function toggleMenu() { mobileMenuOpen = !mobileMenuOpen }
    function closeMenu() { mobileMenuOpen = false }

    // Close both menus as soon as a navigation STARTS, so the tap gives instant
    // feedback instead of the menu lingering open for the whole load (worst on the
    // dashboard, whose server load blocks the navigation from completing). We can't
    // close in the link's onclick: that unmounts the {#if} block holding the tapped
    // <a> mid-click and iOS Safari aborts the navigation (loading bar starts, page
    // never changes). beforeNavigate fires AFTER SvelteKit has already committed to
    // the client-side navigation, so unmounting the anchor here can't abort it — the
    // WebKit race is sidestepped while the menu still closes immediately.
    beforeNavigate(() => {
        mobileMenuOpen = false
        userMenuOpen = false
    })

    async function signOut() {
        // Guard against double-clicks while the async sign-out is in flight.
        if (signingOut) return
        signingOut = true
        try {
            await authClient.signOut()
            posthog.reset()
        } finally {
            // Full-page navigation, matching the dashboard's sign-out. An SPA
            // goto()/invalidateAll() cannot refresh session state here: the
            // homepage (and most routes) are `prerender = true`, so their server
            // load never re-runs at runtime and the nav keeps reading the stale
            // signed-in `page.data.session`. A real navigation re-runs SSR with
            // the now-cleared cookie, so the app renders signed-out immediately.
            window.location.href = '/'
        }
    }

    async function signInWithGoogle() {
        await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
    }

    // useSession() keeps the nav in sync client-side across navigations.
    // page.data.session is used as the immediate SSR value to prevent the flash
    // where the nav briefly shows "Sign in" before the client-side session loads.
    const sessionStore = authClient.useSession()
    let session = $derived($sessionStore.data?.session ?? page.data.session ?? null)
    let user = $derived($sessionStore.data?.user ?? page.data.user ?? null)
    let initials = $derived(user?.email?.slice(0, 1).toUpperCase() ?? '')

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
    let onDashboard = $derived(page.url.pathname === '/dashboard')
    let hideLaunch = $derived(onDashboard || page.url.pathname === '/flow')
</script>

<nav class="relative z-20 w-full max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
    <a href="/" class="group flex items-center gap-2 transition-transform active:scale-95">
        <div class="w-8 h-8 bg-mochi-pink rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
            <span class="text-white font-black text-xl">M</span>
        </div>
        <span class="text-xl font-black text-[#4A2C2C] tracking-tight">Mochify</span>
    </a>

    <!-- Desktop Menu -->
    <div class="hidden sm:flex items-center gap-6">
        <a href="/solutions" data-sveltekit-preload-data="hover" class="text-sm font-medium text-cocoa-deep hover:text-mochi-pink transition-colors">Solutions</a>
        <a href="/guides" data-sveltekit-preload-data="hover" class="text-sm font-medium text-cocoa-deep hover:text-mochi-pink transition-colors">Guides</a>
        <a href="/docs" data-sveltekit-preload-data="hover" class="text-sm font-medium text-cocoa-deep hover:text-mochi-pink transition-colors">Docs</a>
        <a href="/pricing" data-sveltekit-preload-data="hover" class="text-sm font-medium text-cocoa-deep hover:text-mochi-pink transition-colors">Pricing</a>

        {#if session}
            {#if !hideLaunch}
                <a
                    href="/flow"
                    data-sveltekit-preload-data="hover"
                    class="ml-2 px-5 py-2 rounded-full text-sm font-black text-white bg-mochi-pink hover:bg-[#E91E8C] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                    Launch app
                </a>
            {/if}
            <div class="relative {hideLaunch ? 'ml-2' : ''}">
                <button
                    onclick={() => userMenuOpen = !userMenuOpen}
                    class="w-9 h-9 rounded-xl bg-linear-to-br from-[#FF9EBB] to-mochi-pink text-white font-black text-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                    aria-label="User menu"
                >
                    {initials}
                </button>

                {#if userMenuOpen}
                    <div
                        class="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50"
                        role="menu"
                    >
                        {#if !onDashboard}
                            <a
                                href="/dashboard"
                                data-sveltekit-preload-data="hover"
                                class="block px-4 py-3 text-sm font-medium text-cocoa-deep hover:bg-[#FFF5F7] transition-colors"
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
                            class="w-full text-left px-4 py-3 text-sm font-medium text-cocoa-milk/70 hover:bg-[#FFF5F7] hover:text-mochi-pink transition-colors disabled:opacity-50 disabled:cursor-wait {onDashboard ? '' : 'border-t border-pink-50'}"
                            role="menuitem"
                        >
                            {signingOut ? 'Signing out…' : 'Sign out'}
                        </button>
                    </div>
                    <!-- click-away overlay -->
                    <button
                        class="fixed inset-0 -z-10 cursor-default"
                        onclick={() => userMenuOpen = false}
                        aria-label="Close menu"
                        tabindex="-1"
                    ></button>
                {/if}
            </div>
        {:else}
            <a
                href="/auth/login"
                class="ml-2 text-sm font-semibold text-cocoa-deep/60 hover:text-mochi-pink transition-colors cursor-pointer"
            >
                Sign in
            </a>
            {#if showGetStarted}
                <a
                    href="/auth/register"
                    class="px-5 py-2 rounded-full text-sm font-black text-white bg-mochi-pink hover:bg-[#E91E8C] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                    Get started
                </a>
            {/if}
        {/if}
    </div>

    <!-- Mobile Menu Button -->
    <button
        onclick={toggleMenu}
        class="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#FFF5F7] border border-pink-100 transition-all active:scale-95"
        aria-label="Toggle menu"
    >
        <div class="w-5 h-4 flex flex-col justify-between">
            <span class="w-full h-0.5 bg-mochi-pink rounded-full transition-all {mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}"></span>
            <span class="w-full h-0.5 bg-mochi-pink rounded-full transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></span>
            <span class="w-full h-0.5 bg-mochi-pink rounded-full transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
        </div>
    </button>
</nav>

<!-- Mobile Menu Panel -->
{#if mobileMenuOpen}
    <!-- The dim/blur backdrop is this element itself. Closing is gated on
         target===currentTarget so only taps on the dim area close the menu — NOT
         clicks bubbling up from the panel or its links. Do NOT stopPropagation on
         the panel: that stops link clicks from reaching SvelteKit's document-level
         router, forcing a full-page reload (slow, and mobile-only since the desktop
         dropdown has no backdrop wrapper). -->
    <div class="sm:hidden fixed inset-0 z-50 bg-[#4A2C2C]/20 backdrop-blur-sm" onclick={(e) => { if (e.target === e.currentTarget) closeMenu() }} onkeydown={(e) => e.key === 'Escape' && closeMenu()} role="button" tabindex="-1">
        <div
            class="absolute top-20 right-4 left-4 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden"
            role="dialog"
            aria-modal="true"
            tabindex="0"
        >
            <div class="flex flex-col p-4 gap-2">
                <a href="/solutions" class="px-6 py-4 text-cocoa-deep font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Solutions
                </a>
                <a href="/guides" class="px-6 py-4 text-cocoa-deep font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Guides
                </a>
                <a href="/docs" class="px-6 py-4 text-cocoa-deep font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Docs
                </a>
                <a href="/pricing" class="px-6 py-4 text-cocoa-deep font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Pricing
                </a>
                {#if session}
                    {#if !hideLaunch}
                        <a href="/flow" class="mx-2 mt-2 px-6 py-4 text-center text-white font-black rounded-2xl bg-mochi-pink hover:bg-[#E91E8C] transition-all active:scale-95 shadow-sm">
                            Launch app
                        </a>
                    {/if}
                    {#if !onDashboard}
                        <a href="/dashboard" data-sveltekit-preload-data="hover" class="px-6 py-4 text-cocoa-deep font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95 border-t border-pink-50">
                            Dashboard
                        </a>
                    {/if}
                    <!-- Inherits the border-t that Dashboard was carrying, so the rule
                         separating page links from account actions survives its removal. -->
                    <button onclick={signOut} disabled={signingOut} class="px-6 py-4 text-left text-cocoa-milk/70 font-medium rounded-2xl hover:bg-[#FFF5F7] hover:text-mochi-pink transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait {onDashboard ? 'border-t border-pink-50' : ''}">
                        {signingOut ? 'Signing out…' : 'Sign out'}
                    </button>
                {:else}
                    <a href="/auth/login" class="px-6 py-4 text-cocoa-deep font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95 border-t border-pink-50">
                        Sign in
                    </a>
                    <button onclick={() => { closeMenu(); signInWithGoogle(); }} class="mx-2 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border border-cocoa-milk/15 bg-white/80 text-cocoa-deep font-bold hover:bg-white hover:border-cocoa-milk/30 transition-all active:scale-95">
                        <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </button>
                    {#if showGetStarted}
                        <a href="/auth/register" class="mx-2 mb-2 px-6 py-4 text-center text-white font-black rounded-2xl bg-mochi-pink hover:bg-[#E91E8C] transition-all active:scale-95 shadow-sm">
                            Get started
                        </a>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{/if}
