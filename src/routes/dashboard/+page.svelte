<script lang="ts">
    import { onMount } from 'svelte'
    import { goto } from '$app/navigation'
    import { createClient, getAccessToken } from '$lib/supabase'
    import Navigation from '$lib/components/Navigation.svelte'
    import Footer from '$lib/components/Footer.svelte'

    const API_URL = 'https://api.mochify.xyz'

    let { data } = $props()
    const supabase = createClient()

    let justUpgraded = $state(false)

    // API key state
    let hasKey = $state(false)
    let keyCreatedAt = $state<string | null>(null)
    let newKeyPlaintext = $state<string | null>(null)
    let copied = $state(false)
    let keyLoading = $state(false)

    // Usage state
    let usageLoaded = $state(false)
    let usedOps = $state(0)
    let quotaOps = $state(30)

    let isPro = $derived(data.profile?.plan === 'pro')
    let isLite = $derived(data.profile?.plan === 'lite')
    let isPaid = $derived(isPro || isLite)

    async function loadKeyStatus() {
        const jwt = await getAccessToken()
        if (!jwt) return
        try {
            const res = await fetch(`${API_URL}/v1/user/apikey`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.ok) {
                const body = await res.json()
                hasKey = body.has_key ?? false
                keyCreatedAt = body.created_at ?? null
            }
        } catch {
            // endpoint not live yet — silently ignore
        }
    }

    async function loadUsage() {
        const jwt = await getAccessToken()
        if (!jwt) return
        try {
            const res = await fetch(`${API_URL}/v1/user/usage`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.ok) {
                const body = await res.json()
                usedOps = body.used ?? 0
                quotaOps = body.quota ?? data.profile?.ops_limit ?? 30
                usageLoaded = true
            }
        } catch {
            // endpoint not live yet — silently ignore
        }
    }

    async function generateKey() {
        keyLoading = true
        newKeyPlaintext = null
        const jwt = await getAccessToken()
        if (!jwt) { keyLoading = false; return }
        try {
            const res = await fetch(`${API_URL}/v1/user/apikey`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.ok) {
                const body = await res.json()
                newKeyPlaintext = body.key
                hasKey = true
                keyCreatedAt = new Date().toISOString()
                await loadUsage()
            }
        } catch {
            // endpoint not live yet
        }
        keyLoading = false
    }

    async function regenerateKey() {
        keyLoading = true
        newKeyPlaintext = null
        const jwt = await getAccessToken()
        if (!jwt) { keyLoading = false; return }
        try {
            // Revoke old key
            await fetch(`${API_URL}/v1/user/apikey`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${jwt}` }
            })
            // Generate new key
            const res = await fetch(`${API_URL}/v1/user/apikey`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${jwt}` }
            })
            if (res.ok) {
                const body = await res.json()
                newKeyPlaintext = body.key
                keyCreatedAt = new Date().toISOString()
            }
        } catch {
            // endpoint not live yet
        }
        keyLoading = false
    }

    async function copyKey() {
        if (!newKeyPlaintext) return
        await navigator.clipboard.writeText(newKeyPlaintext)
        copied = true
        setTimeout(() => { copied = false }, 2000)
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        goto('/')
    }

    let showDeleteConfirm = $state(false)
    let deleteConfirmText = $state('')
    let deleteLoading = $state(false)

    let canConfirmDelete = $derived(deleteConfirmText.trim().toLowerCase() === 'delete my account')

    onMount(() => {
        quotaOps = data.profile?.ops_limit ?? 30
        justUpgraded = new URLSearchParams(window.location.search).get('upgraded') === 'true'
        loadKeyStatus()
        loadUsage()
    })

    let usagePercent = $derived(quotaOps > 0 ? Math.min(Math.round((usedOps / quotaOps) * 100), 100) : 0)
</script>

<svelte:head>
    <title>Dashboard — Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col">
    <Navigation />

    <main class="flex-grow w-full max-w-4xl mx-auto px-4 py-12 sm:px-6">
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-black text-[#4A2C2C] tracking-tight">Dashboard</h1>
                <p class="text-sm text-[#875F42]/60 mt-1">{data.user?.email}</p>
            </div>
            <button
                onclick={handleSignOut}
                class="px-4 py-2 rounded-xl border border-[#875F42]/15 text-sm font-bold text-[#875F42]/70 hover:text-[#F06292] hover:border-[#F06292]/30 hover:bg-[#FFF5F7] transition-all cursor-pointer"
            >
                Sign out
            </button>
        </div>

        <!-- Post-checkout success banner -->
        {#if justUpgraded}
        <div class="mb-6 p-4 bg-[#A5D6A7]/20 border border-[#66BB6A]/30 rounded-2xl flex items-center gap-3">
            <span class="text-[#2E5C31] font-black text-sm">You're on {isLite ? 'Lite' : 'Pro'}!</span>
            <span class="text-[#2E5C31]/70 text-sm">Your quota has been updated. Welcome aboard.</span>
        </div>
        {/if}

        <!-- Stats row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm p-6">
                <p class="text-xs font-bold text-[#875F42]/50 tracking-widest uppercase mb-1">Plan</p>
                {#if isPro}
                    <p class="text-2xl font-black text-[#4A2C2C]">Pro</p>
                    {#if data.profile?.quota_period_end}
                        <p class="text-xs text-[#875F42]/50 mt-1">Renews {new Date(data.profile.quota_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    {/if}
                {:else if isLite}
                    <p class="text-2xl font-black text-[#4A2C2C]">Lite</p>
                    {#if data.profile?.quota_period_end}
                        <p class="text-xs text-[#875F42]/50 mt-1">Renews {new Date(data.profile.quota_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    {/if}
                    <a href="/api/checkout?plan=pro&billing=monthly" class="mt-2 inline-block text-xs font-bold text-[#F06292] hover:underline">Upgrade to Pro →</a>
                {:else}
                    <p class="text-2xl font-black text-[#4A2C2C]">Free</p>
                    <a href="/api/checkout?plan=pro&billing=monthly" class="mt-2 inline-block text-xs font-bold text-[#F06292] hover:underline">Upgrade →</a>
                {/if}
            </div>
            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm p-6">
                <p class="text-xs font-bold text-[#875F42]/50 tracking-widest uppercase mb-2">Operations this month</p>
                {#if usageLoaded}
                    <p class="text-2xl font-black text-[#4A2C2C] mb-3">{usedOps} <span class="text-base font-semibold text-[#875F42]/50">/ {quotaOps}</span></p>
                    <div class="h-2 bg-[#875F42]/10 rounded-full overflow-hidden">
                        <div
                            class="h-full rounded-full transition-all duration-700 {usagePercent >= 90 ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A]'}"
                            style="width: {usagePercent}%"
                        ></div>
                    </div>
                {:else}
                    <p class="text-2xl font-black text-[#4A2C2C]">—</p>
                    <p class="text-xs text-[#875F42]/50 mt-1">Generate an API key to track usage</p>
                {/if}
            </div>
        </div>

        <!-- Upgrade CTA for free/lite users -->
        {#if !isPaid}
        <div class="bg-gradient-to-br from-[#FFF0F5] to-[#FFF8F0] rounded-3xl border border-[#F06292]/15 shadow-sm p-6 mb-6">
            <p class="font-black text-[#4A2C2C] text-base mb-1">Upgrade your plan</p>
            <p class="text-sm text-[#875F42]/60 mb-4">More operations, larger files, priority queue, and API key access.</p>
            <div class="flex flex-wrap gap-3">
                <a
                    href="/api/checkout?plan=lite&billing=monthly"
                    class="px-5 py-2.5 rounded-2xl border border-[#875F42]/20 text-[#4A2C2C] font-black text-sm hover:border-[#F06292]/40 hover:text-[#F06292] hover:bg-white/60 transition-all"
                >
                    Lite — $5/mo <span class="font-normal text-[#875F42]/50">· 300 ops</span>
                </a>
                <a
                    href="/api/checkout?plan=pro&billing=monthly"
                    class="px-5 py-2.5 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] hover:-translate-y-0.5 transition-all"
                >
                    Pro — $12/mo <span class="font-normal opacity-80">· 1,200 ops</span>
                </a>
            </div>
        </div>
        {:else if isLite}
        <div class="bg-gradient-to-br from-[#FFF0F5] to-[#FFF8F0] rounded-3xl border border-[#F06292]/15 shadow-sm p-6 mb-6 flex items-center justify-between gap-4">
            <div>
                <p class="font-black text-[#4A2C2C] text-base">Upgrade to Pro — 1,200 ops/month</p>
                <p class="text-sm text-[#875F42]/60 mt-0.5">4× the operations, top priority queue.</p>
            </div>
            <a
                href="/api/checkout?plan=pro&billing=monthly"
                class="flex-shrink-0 px-5 py-2.5 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] hover:-translate-y-0.5 transition-all"
            >
                Upgrade to Pro
            </a>
        </div>
        {/if}

        <!-- API Key card -->
        <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm p-6 mb-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h2 class="font-black text-[#4A2C2C] text-lg">API Key</h2>
                    <p class="text-xs text-[#875F42]/60 mt-0.5">Use this key from the web app, CLI, or curl</p>
                </div>
                {#if hasKey}
                    <button
                        onclick={regenerateKey}
                        disabled={keyLoading}
                        class="text-xs font-bold text-[#875F42]/60 hover:text-[#F06292] transition-colors disabled:opacity-40"
                    >
                        {keyLoading ? 'Regenerating…' : 'Regenerate'}
                    </button>
                {/if}
            </div>

            {#if newKeyPlaintext}
                <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <p class="text-xs font-bold text-amber-700 mb-2">Save this key — you won't see it again</p>
                    <div class="flex items-center gap-2">
                        <code class="flex-1 text-xs font-mono text-[#4A2C2C] bg-white/70 px-3 py-2 rounded-xl border border-amber-200/60 overflow-x-auto">{newKeyPlaintext}</code>
                        <button
                            onclick={copyKey}
                            class="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all {copied ? 'bg-[#A5D6A7]/30 text-[#2E5C31]' : 'bg-white/70 text-[#875F42]/70 hover:text-[#F06292] hover:bg-[#FFF5F7]'} border border-white/60"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            {:else if hasKey}
                <div class="flex items-center gap-3 p-4 bg-white/40 rounded-2xl border border-white/60">
                    <code class="flex-1 text-sm font-mono text-[#875F42]/60">••••••••••••••••••••••••••••••••</code>
                    {#if keyCreatedAt}
                        <span class="text-xs text-[#875F42]/40 flex-shrink-0">Created {new Date(keyCreatedAt).toLocaleDateString()}</span>
                    {/if}
                </div>
            {:else}
                <div class="text-center py-4">
                    <p class="text-sm text-[#875F42]/60 mb-4">No API key yet. Generate one to start using authenticated processing.</p>
                    <button
                        onclick={generateKey}
                        disabled={keyLoading}
                        class="px-6 py-2.5 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none cursor-pointer"
                    >
                        {keyLoading ? 'Generating…' : 'Generate API key'}
                    </button>
                </div>
            {/if}

            <div class="mt-4 pt-4 border-t border-[#875F42]/8">
                <p class="text-xs text-[#875F42]/50 font-mono">curl -H "Authorization: Bearer &lt;key&gt;" -X POST https://api.mochify.xyz/v1/squish ...</p>
            </div>
        </div>

        <!-- Usage note -->
        <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm p-6 mb-6">
            <h2 class="font-black text-[#4A2C2C] mb-1">Usage history</h2>
            <p class="text-sm text-[#875F42]/60">Detailed per-request history coming soon.</p>
        </div>

        <!-- Danger zone -->
        <div class="rounded-3xl border border-red-200/60 p-6">
            <h2 class="font-black text-red-700/80 mb-1">Danger zone</h2>
            <p class="text-sm text-[#875F42]/60 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            {#if !showDeleteConfirm}
                <button
                    onclick={() => { showDeleteConfirm = true }}
                    class="px-4 py-2 rounded-xl border border-red-300/60 text-sm font-bold text-red-600/70 hover:text-red-700 hover:border-red-400/60 hover:bg-red-50/60 transition-all cursor-pointer"
                >
                    Delete account
                </button>
            {:else}
                <div class="space-y-3">
                    <p class="text-sm font-bold text-red-700/80">Type <span class="font-mono">delete my account</span> to confirm:</p>
                    <input
                        type="text"
                        bind:value={deleteConfirmText}
                        placeholder="delete my account"
                        class="w-full max-w-sm px-4 py-2.5 rounded-xl border border-red-200 bg-white/70 text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200/50"
                    />
                    <div class="flex gap-3">
                        <form method="POST" action="?/deleteAccount" onsubmit={() => { deleteLoading = true }}>
                            <button
                                type="submit"
                                disabled={!canConfirmDelete || deleteLoading}
                                class="px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer
                                    {canConfirmDelete && !deleteLoading
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                                        : 'bg-red-100 text-red-300 cursor-not-allowed'}"
                            >
                                {deleteLoading ? 'Deleting…' : 'Permanently delete'}
                            </button>
                        </form>
                        <button
                            onclick={() => { showDeleteConfirm = false; deleteConfirmText = '' }}
                            class="px-4 py-2 rounded-xl border border-[#875F42]/15 text-sm font-bold text-[#875F42]/60 hover:text-[#4A2C2C] hover:border-[#875F42]/30 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </main>

    <Footer />
</div>
