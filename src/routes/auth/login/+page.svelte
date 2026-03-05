<script lang="ts">
    import { goto } from '$app/navigation'
    import { createClient } from '$lib/supabase'
    import Navigation from '$lib/components/Navigation.svelte'

    const supabase = createClient()

    let email = $state('')
    let password = $state('')
    let loading = $state(false)
    let error = $state('')

    async function handleLogin(e: Event) {
        e.preventDefault()
        loading = true
        error = ''

        const { error: err } = await supabase.auth.signInWithPassword({ email, password })

        if (err) {
            error = err.message
            loading = false
        } else {
            goto('/dashboard')
        }
    }
</script>

<svelte:head>
    <title>Sign in — Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col">
    <Navigation />

    <main class="flex-grow flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-sm">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black text-[#4A2C2C] tracking-tight mb-1">Welcome back</h1>
                <p class="text-sm text-[#875F42]/70">Sign in to your Mochify account</p>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(240,98,146,0.1)] p-8">
                {#if error}
                    <div class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                        {error}
                    </div>
                {/if}

                <form onsubmit={handleLogin} class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label for="email" class="text-xs font-bold text-[#6C3F31] tracking-wide uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
                            required
                            autocomplete="email"
                            placeholder="you@example.com"
                            class="w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all"
                        />
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <div class="flex items-center justify-between">
                            <label for="password" class="text-xs font-bold text-[#6C3F31] tracking-wide uppercase">Password</label>
                            <a href="/auth/forgot-password" class="text-xs text-[#F06292] font-semibold hover:underline">Forgot password?</a>
                        </div>
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                            autocomplete="current-password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        class="mt-2 w-full py-3 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>

            <p class="text-center text-sm text-[#875F42]/60 mt-6">
                No account?
                <a href="/auth/register" class="text-[#F06292] font-bold hover:underline">Create one</a>
            </p>
        </div>
    </main>
</div>
