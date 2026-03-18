<script lang="ts">
    import { createClient } from '$lib/supabase'
    import Navigation from '$lib/components/Navigation.svelte'

    const supabase = createClient()

    let email = $state('')
    let password = $state('')
    let loading = $state(false)
    let error = $state('')
    let success = $state(false)

    async function handleGithub() {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: `${location.origin}/auth/callback` }
        })
    }

    async function handleRegister(e: Event) {
        e.preventDefault()
        loading = true
        error = ''

        const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/auth/callback` }
        })

        if (err) {
            error = err.message
            loading = false
        } else {
            success = true
        }
    }
</script>

<svelte:head>
    <title>Create account — Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col">
    <Navigation />

    <main class="flex-grow flex items-start justify-center px-4 pt-16 pb-12">
        <div class="w-full max-w-sm">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black text-[#4A2C2C] tracking-tight mb-1">Create account</h1>
                <p class="text-sm text-[#875F42]/70">Start compressing smarter</p>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(240,98,146,0.1)] p-8">
                {#if success}
                    <div class="text-center py-4">
                        <div class="w-14 h-14 rounded-2xl bg-[#F4FBF2] flex items-center justify-center mx-auto mb-4">
                            <svg class="w-7 h-7 text-[#A5D6A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <p class="font-black text-[#4A2C2C] text-lg mb-1">Check your email</p>
                        <p class="text-sm text-[#875F42]/70">We sent a confirmation link to <strong class="text-[#6C3F31]">{email}</strong></p>
                    </div>
                {:else}
                    {#if error}
                        <div class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                            {error}
                        </div>
                    {/if}

                    <button
                        type="button"
                        onclick={handleGithub}
                        class="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] text-sm font-bold hover:bg-white hover:border-[#875F42]/30 transition-all"
                    >
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        Continue with GitHub
                    </button>

                    <div class="flex items-center gap-3 my-1">
                        <div class="flex-1 h-px bg-[#875F42]/10"></div>
                        <span class="text-xs text-[#875F42]/40 font-medium">or</span>
                        <div class="flex-1 h-px bg-[#875F42]/10"></div>
                    </div>

                    <form onsubmit={handleRegister} class="flex flex-col gap-4">
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
                            <label for="password" class="text-xs font-bold text-[#6C3F31] tracking-wide uppercase">Password</label>
                            <input
                                id="password"
                                type="password"
                                bind:value={password}
                                required
                                minlength={8}
                                autocomplete="new-password"
                                placeholder="Min. 8 characters"
                                class="w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            class="mt-2 w-full py-3 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>
                {/if}
            </div>

            {#if !success}
                <p class="text-center text-sm text-[#875F42]/60 mt-6">
                    Already have an account?
                    <a href="/auth/login" class="text-[#F06292] font-bold hover:underline">Sign in</a>
                </p>
            {/if}
        </div>
    </main>
</div>
