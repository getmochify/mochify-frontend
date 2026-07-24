<script lang="ts">
    import { enhance } from '$app/forms'
    import Navigation from '$lib/components/Navigation.svelte'
    import Footer from '$lib/components/Footer.svelte'

    let { data, form } = $props()

    let loading = $state(false)

    const inputClass =
        'w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all'
    const labelClass = 'text-xs font-bold text-[#6C3F31] tracking-wide uppercase'

    // Cloudflare Turnstile — public sitekey (safe to expose); secret lives in env.
    const TURNSTILE_SITE_KEY = '0x4AAAAAAD9Ccvbui6jzOPT2'
</script>

<svelte:head>
    <title>Contact — Mochify</title>
    <meta name="description" content="Get in touch with the Mochify team — feedback, support, billing, or anything else." />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mochify.app/contact" />
    <meta property="og:title" content="Contact Mochify" />
    <meta property="og:description" content="Get in touch with the Mochify team — feedback, support, billing, or anything else." />

    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col">
    <Navigation />

    <main class="flex-grow flex items-start justify-center px-4 pt-16 pb-12">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-3xl md:text-4xl font-black text-[#4A2C2C] tracking-tight mb-1">Get in touch</h1>
                <p class="text-sm text-[#875F42]/70">
                    We usually reply within a day. Prefer email?
                    <a href="mailto:hello@mochify.app" class="text-[#F06292] font-bold hover:underline">hello@mochify.app</a>
                </p>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(240,98,146,0.1)] p-8">
                {#if form?.success}
                    <div class="text-center py-4">
                        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#A5D6A7]/30">
                            <svg class="h-8 w-8 text-[#2E5C31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 class="mb-2 text-2xl font-black tracking-tight text-[#4A2C2C]">Message sent</h2>
                        <p class="text-sm text-[#875F42]/70">
                            Thanks for reaching out. We'll get back to you at the email you provided.
                        </p>
                    </div>
                {:else}
                    {#if form?.error}
                        <div class="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                            {form.error}
                        </div>
                    {/if}

                    <form
                        method="POST"
                        action="?/send"
                        use:enhance={() => {
                            loading = true
                            return async ({ update }) => {
                                await update()
                                loading = false
                            }
                        }}
                        class="flex flex-col gap-4"
                    >
                        <!-- Honeypot: hidden from real users, tempts bots -->
                        <div class="hidden" aria-hidden="true">
                            <label for="company">Company</label>
                            <input id="company" name="company" type="text" tabindex="-1" autocomplete="off" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="topic" class={labelClass}>Topic</label>
                            <select id="topic" name="topic" required class={inputClass}>
                                <option value="" disabled selected={!(form?.values?.topic ?? data.presetTopic)}>Choose a topic…</option>
                                {#each data.topics as topic (topic)}
                                    <option value={topic} selected={(form?.values?.topic ?? data.presetTopic) === topic}>{topic}</option>
                                {/each}
                            </select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="name" class={labelClass}>Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autocomplete="name"
                                placeholder="Your name"
                                value={form?.values?.name ?? ''}
                                class={inputClass}
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="email" class={labelClass}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autocomplete="email"
                                placeholder="you@example.com"
                                value={form?.values?.email ?? ''}
                                class={inputClass}
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="message" class={labelClass}>Message</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows="5"
                                maxlength="5000"
                                placeholder="How can we help?"
                                class="{inputClass} resize-y">{form?.values?.message ?? ''}</textarea>
                        </div>

                        <div class="cf-turnstile mt-1" data-sitekey={TURNSTILE_SITE_KEY} data-action="turnstile-spin-v2"></div>

                        <button
                            type="submit"
                            disabled={loading}
                            class="mt-2 w-full py-3 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm tracking-wide shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Sending…' : 'Send message'}
                        </button>
                    </form>
                {/if}
            </div>
        </div>
    </main>

    <Footer />
</div>
