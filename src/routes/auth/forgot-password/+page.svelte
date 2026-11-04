<script lang="ts">
    import { authClient } from '$lib/auth-client'
    import Navigation from '$lib/components/Navigation.svelte'

    let email = $state('')
    let loading = $state(false)
    let error = $state('')
    let success = $state(false)

    async function handleSubmit(e: Event) {
        e.preventDefault()
        loading = true
        error = ''

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: err } = await (authClient as any).requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (err) {
            error = err.message
            loading = false
        } else {
            success = true
            loading = false
        }
    }
</script>

<svelte:head>
    <title>Forgot password — Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="relative min-h-screen flex flex-col">
    <Navigation />

    <main class="relative z-10 flex-grow flex items-start justify-center px-4 pt-16 pb-12">
        <div class="w-full max-w-sm">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black text-cocoa-ink tracking-tight mb-1">Reset password</h1>
                <p class="text-sm text-cocoa-milk/70">We'll send you a link to reset your password</p>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(240,98,146,0.1)] p-8">
                {#if success}
                    <div class="px-4 py-3 bg-green-50 border border-green-100 rounded-2xl text-sm text-green-700 font-medium text-center">
                        Check your email for a password reset link.
                    </div>
                {:else}
                    {#if error}
                        <div class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                            {error}
                        </div>
                    {/if}

                    <form onsubmit={handleSubmit} class="flex flex-col gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label for="email" class="text-xs font-bold text-cocoa-deep tracking-wide uppercase">Email</label>
                            <input
                                id="email"
                                type="email"
                                bind:value={email}
                                required
                                autocomplete="email"
                                placeholder="you@example.com"
                                class="w-full px-4 py-3 rounded-2xl border border-cocoa-milk/15 bg-white/80 text-cocoa-ink placeholder-cocoa-milk/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mochi-pink/30 focus:border-mochi-pink/40 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            class="mt-2 w-full py-3 rounded-2xl bg-gradient-to-br from-mochi-pink-light to-mochi-pink text-white font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Sending…' : 'Send reset link'}
                        </button>
                    </form>
                {/if}
            </div>

            <p class="text-center text-sm text-cocoa-milk/60 mt-6">
                Remember your password?
                <a href="/auth/login" class="text-mochi-pink font-bold hover:underline">Sign in</a>
            </p>
        </div>
    </main>
</div>
