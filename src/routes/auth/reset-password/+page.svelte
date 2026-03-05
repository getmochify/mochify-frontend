<script lang="ts">
    import { goto } from '$app/navigation'
    import { createClient } from '$lib/supabase'
    import Navigation from '$lib/components/Navigation.svelte'

    const supabase = createClient()

    let password = $state('')
    let confirm = $state('')
    let loading = $state(false)
    let error = $state('')

    async function handleSubmit(e: Event) {
        e.preventDefault()
        if (password !== confirm) {
            error = 'Passwords do not match'
            return
        }
        loading = true
        error = ''

        const { error: err } = await supabase.auth.updateUser({ password })

        if (err) {
            error = err.message
            loading = false
        } else {
            goto('/dashboard')
        }
    }
</script>

<svelte:head>
    <title>Set new password — Mochify</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col">
    <Navigation />

    <main class="flex-grow flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-sm">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black text-[#4A2C2C] tracking-tight mb-1">Set new password</h1>
                <p class="text-sm text-[#875F42]/70">Choose a strong password for your account</p>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(240,98,146,0.1)] p-8">
                {#if error}
                    <div class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                        {error}
                    </div>
                {/if}

                <form onsubmit={handleSubmit} class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label for="password" class="text-xs font-bold text-[#6C3F31] tracking-wide uppercase">New password</label>
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                            minlength={8}
                            autocomplete="new-password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all"
                        />
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="confirm" class="text-xs font-bold text-[#6C3F31] tracking-wide uppercase">Confirm password</label>
                        <input
                            id="confirm"
                            type="password"
                            bind:value={confirm}
                            required
                            autocomplete="new-password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        class="mt-2 w-full py-3 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Saving…' : 'Save new password'}
                    </button>
                </form>
            </div>
        </div>
    </main>
</div>
