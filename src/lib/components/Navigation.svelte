<script lang="ts">
    import { page } from '$app/state'
    import { goto, invalidateAll } from '$app/navigation'
    import { createClient } from '$lib/supabase'

    const supabase = createClient()

    let mobileMenuOpen = $state(false)
    let userMenuOpen = $state(false)

    function toggleMenu() { mobileMenuOpen = !mobileMenuOpen }
    function closeMenu() { mobileMenuOpen = false }

    async function signOut() {
        await supabase.auth.signOut()
        await invalidateAll()
        goto('/')
    }

    let session = $derived(page.data.session)
    let user = $derived(page.data.user)
    let initials = $derived(user?.email?.slice(0, 1).toUpperCase() ?? '')
</script>

<nav class="relative z-20 w-full max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
    <a href="/" class="group flex items-center gap-2 transition-transform active:scale-95">
        <div class="w-8 h-8 bg-[#F06292] rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
            <span class="text-white font-black text-xl">M</span>
        </div>
        <span class="text-xl font-black text-[#4A2C2C] tracking-tight">Mochify</span>
    </a>

    <!-- Desktop Menu -->
    <div class="hidden sm:flex items-center gap-6">
        <a href="/solutions" class="text-sm font-medium text-[#6C3F31] hover:text-[#F06292] transition-colors">Solutions</a>
        <a href="/guides" class="text-sm font-medium text-[#6C3F31] hover:text-[#F06292] transition-colors">Guides</a>
        <a href="/docs" class="text-sm font-medium text-[#6C3F31] hover:text-[#F06292] transition-colors">Docs</a>
        <a href="/pricing" class="text-sm font-medium text-[#6C3F31] hover:text-[#F06292] transition-colors">Pricing</a>

        {#if session}
            <div class="relative">
                <button
                    onclick={() => userMenuOpen = !userMenuOpen}
                    class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                    aria-label="User menu"
                >
                    {initials}
                </button>

                {#if userMenuOpen}
                    <div
                        class="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50"
                        role="menu"
                    >
                        <a
                            href="/dashboard"
                            onclick={() => userMenuOpen = false}
                            class="block px-4 py-3 text-sm font-medium text-[#6C3F31] hover:bg-[#FFF5F7] transition-colors"
                            role="menuitem"
                        >
                            Dashboard
                        </a>
                        <button
                            onclick={signOut}
                            class="w-full text-left px-4 py-3 text-sm font-medium text-[#875F42]/70 hover:bg-[#FFF5F7] hover:text-[#F06292] transition-colors border-t border-pink-50"
                            role="menuitem"
                        >
                            Sign out
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
                class="px-4 py-2 rounded-xl text-xs font-black text-[#6C3F31] border border-[#875F42]/15 hover:border-[#F06292]/30 hover:text-[#F06292] hover:bg-[#FFF5F7] transition-all cursor-pointer"
            >
                Sign in
            </a>
        {/if}
    </div>

    <!-- Mobile Menu Button -->
    <button
        onclick={toggleMenu}
        class="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#FFF5F7] border border-pink-100 transition-all active:scale-95"
        aria-label="Toggle menu"
    >
        <div class="w-5 h-4 flex flex-col justify-between">
            <span class="w-full h-0.5 bg-[#F06292] rounded-full transition-all {mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}"></span>
            <span class="w-full h-0.5 bg-[#F06292] rounded-full transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></span>
            <span class="w-full h-0.5 bg-[#F06292] rounded-full transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
        </div>
    </button>
</nav>

<!-- Mobile Menu Panel -->
{#if mobileMenuOpen}
    <div class="sm:hidden fixed inset-0 z-50" onclick={closeMenu} onkeydown={(e) => e.key === 'Escape' && closeMenu()} role="button" tabindex="-1">
        <div class="absolute inset-0 bg-[#4A2C2C]/20 backdrop-blur-sm"></div>
        <div
            class="absolute top-20 right-4 left-4 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden"
            onclick={(e) => e.stopPropagation()}
            onkeydown={() => {}}
            role="dialog"
            aria-modal="true"
            tabindex="0"
        >
            <div class="flex flex-col p-4 gap-2">
                <a href="/solutions" onclick={closeMenu} class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Solutions
                </a>
                <a href="/guides" onclick={closeMenu} class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Guides
                </a>
                <a href="/docs" onclick={closeMenu} class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Docs
                </a>
                <a href="/pricing" onclick={closeMenu} class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95">
                    Pricing
                </a>
                {#if session}
                    <a href="/dashboard" onclick={closeMenu} class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95 border-t border-pink-50">
                        Dashboard
                    </a>
                    <button onclick={signOut} class="px-6 py-4 text-left text-[#875F42]/70 font-medium rounded-2xl hover:bg-[#FFF5F7] hover:text-[#F06292] transition-all active:scale-95">
                        Sign out
                    </button>
                {:else}
                    <a href="/auth/login" onclick={closeMenu} class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95 border-t border-pink-50">
                        Sign in
                    </a>
                {/if}
            </div>
        </div>
    </div>
{/if}
