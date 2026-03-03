<script lang="ts">
    import { onMount } from 'svelte'
    import { goto } from '$app/navigation'
    import { browser } from '$app/environment'
    import { createClient, getAccessToken } from '$lib/supabase'
    import Navigation from '$lib/components/Navigation.svelte'
    import Footer from '$lib/components/Footer.svelte'

    const API_URL = 'https://api.mochify.xyz'

    let { data } = $props()
    const supabase = createClient()

    // API key state
    let hasKey = $state(false)
    let keyCreatedAt = $state<string | null>(null)
    let newKeyPlaintext = $state<string | null>(null)
    let copied = $state(false)
    let keyLoading = $state(false)

    // Usage state
    let usageLoaded = $state(false)
    let usedOps = $state(0)
    let quotaOps = $state(1000)

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
        const storedKey = localStorage.getItem('mochify_apikey')
        if (!storedKey) return
        try {
            const res = await fetch(`${API_URL}/v1/user/usage`, {
                headers: { Authorization: `Bearer ${storedKey}` }
            })
            if (res.ok) {
                const body = await res.json()
                usedOps = body.used ?? 0
                quotaOps = body.quota ?? 1000
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
                localStorage.setItem('mochify_apikey', body.key)
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
                localStorage.setItem('mochify_apikey', body.key)
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

    onMount(() => {
        loadKeyStatus()
        loadUsage()
    })

    let usagePercent = $derived(quotaOps > 0 ? Math.min(Math.round((usedOps / quotaOps) * 100), 100) : 0)
    let maskedKey = $derived(browser ? (localStorage.getItem('mochify_apikey')?.slice(0, 8) ?? '') + '••••••••••••••••••••••••' : '')
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

        <!-- Stats row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm p-6">
                <p class="text-xs font-bold text-[#875F42]/50 tracking-widest uppercase mb-1">Plan</p>
                <p class="text-2xl font-black text-[#4A2C2C]">Free</p>
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
                    <code class="flex-1 text-sm font-mono text-[#875F42]/60">{maskedKey}</code>
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
        <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm p-6">
            <h2 class="font-black text-[#4A2C2C] mb-1">Usage history</h2>
            <p class="text-sm text-[#875F42]/60">Detailed per-request history coming soon.</p>
        </div>
    </main>

    <Footer />
</div>
