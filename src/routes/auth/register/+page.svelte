<script lang="ts">
    import { authClient } from '$lib/auth-client'
    import Navigation from '$lib/components/Navigation.svelte'

    let email = $state('')
    let password = $state('')
    let loading = $state(false)
    let error = $state('')
    let success = $state(false)

    async function handleGoogle() {
        await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
    }

    async function handleRegister(e: Event) {
        e.preventDefault()
        loading = true
        error = ''

        const { error: err } = await authClient.signUp.email({
            email,
            password,
            name: email.split('@')[0] ?? email,
        })

        if (err) {
            error = err.message ?? 'Registration failed'
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

                    <!--
                    <button
                        type="button"
                        onclick={handleGoogle}
                        class="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] text-sm font-bold hover:bg-white hover:border-[#875F42]/30 transition-all"
                    >
                        <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </button>-->

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
