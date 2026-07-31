<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data, form } = $props();

	let loading = $state(false);

	const inputClass =
		'w-full px-4 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] placeholder-[#875F42]/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F06292]/30 focus:border-[#F06292]/40 transition-all';
	const labelClass = 'text-xs font-bold text-[#6C3F31] tracking-wide uppercase';

	// Cloudflare Turnstile — public sitekey (safe to expose); secret lives in env.
	const TURNSTILE_SITE_KEY = '0x4AAAAAAD9Ccvbui6jzOPT2';
	// `render=explicit` stops the script auto-scanning for `.cf-turnstile`, so
	// we control render/teardown ourselves.
	const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

	let turnstileEl: HTMLDivElement | undefined = $state();
	let widgetId: string | undefined;

	// Turnstile is loaded lazily, on the first user interaction, NOT during initial
	// page load. Loading its script + running the bot challenge at load raced with
	// hydration/PostHog/font work and spiked memory enough to crash Safari's
	// WebContent process on a cold first visit ("reloaded because a problem
	// occurred") — which is why it only ever happened on load #1 and never on the
	// auto-reload (by then those assets are cached). The token is only needed at
	// submit, so first-input is always early enough. Explicit render (no implicit
	// `.cf-turnstile` auto-scan) + remove-on-unmount keeps exactly one widget.
	onMount(() => {
		let cancelled = false;
		let started = false;
		let timer: ReturnType<typeof setInterval> | undefined;

		const triggers = ['pointerdown', 'keydown', 'focusin'] as const;
		const stopWaiting = () => triggers.forEach((t) => window.removeEventListener(t, initTurnstile));

		function initTurnstile() {
			if (started || cancelled) return;
			started = true;
			stopWaiting();

			if (!document.querySelector('script[data-turnstile]')) {
				const script = document.createElement('script');
				script.src = TURNSTILE_SRC;
				// `defer` only (no `async`): matches Cloudflare's explicit-render guidance.
				script.defer = true;
				script.dataset.turnstile = 'true';
				document.head.appendChild(script);
			}

			// The script may still be loading or already loaded (cached from a prior
			// visit) — poll for readiness. Bounded to ~15s so a blocked script (Safari
			// content blocker, offline) never spins.
			let attempts = 0;
			timer = setInterval(() => {
				if (cancelled || widgetId !== undefined || attempts++ > 150) {
					clearInterval(timer);
					return;
				}
				if (!turnstileEl || !window.turnstile?.render) return;
				// Stop polling BEFORE calling render(). If render() throws (the API isn't
				// fully initialised yet, or the widget was already rendered), re-looping
				// would spawn a fresh iframe every 100ms until Safari's WebContent process
				// runs out of memory and reloads the page ("a problem occurred").
				clearInterval(timer);
				try {
					widgetId = window.turnstile.render(turnstileEl, {
						sitekey: TURNSTILE_SITE_KEY,
						action: 'turnstile-spin-v2'
					});
				} catch (e) {
					console.error('[contact] turnstile render failed:', e);
				}
			}, 100);
		}

		triggers.forEach((t) => window.addEventListener(t, initTurnstile, { passive: true }));

		return () => {
			cancelled = true;
			stopWaiting();
			clearInterval(timer);
			if (widgetId && window.turnstile) {
				try {
					window.turnstile.remove(widgetId);
				} catch {
					/* already removed */
				}
			}
		};
	});
</script>

<svelte:head>
	<title>Contact — Mochify</title>
	<meta
		name="description"
		content="Get in touch with the Mochify team — feedback, support, billing, or anything else."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mochify.app/contact" />
	<meta property="og:title" content="Contact Mochify" />
	<meta
		property="og:description"
		content="Get in touch with the Mochify team — feedback, support, billing, or anything else."
	/>
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navigation />

	<main class="relative z-10 flex flex-grow items-start justify-center px-4 pt-6 pb-12 sm:pt-16">
		<div class="w-full max-w-md">
			<div class="mb-5 text-center sm:mb-8">
				<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C] md:text-4xl">
					Get in touch
				</h1>
				<p class="text-sm text-[#875F42]/70">
					We usually reply within a day. Prefer email?
					<a href="mailto:hello@mochify.app" class="font-bold text-[#F06292] hover:underline"
						>hello@mochify.app</a
					>
				</p>
			</div>

			<div
				class="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_8px_32px_rgba(240,98,146,0.1)] backdrop-blur-sm sm:p-8"
			>
				{#if form?.success}
					<div class="py-4 text-center">
						<div
							class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#A5D6A7]/30"
						>
							<svg
								class="h-8 w-8 text-[#2E5C31]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2.5"
							>
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
						<div
							class="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
						>
							{form.error}
						</div>
					{/if}

					<form
						method="POST"
						action="?/send"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
								// Turnstile tokens are single-use; reset so a
								// retry after a validation error gets a fresh one.
								if (turnstileEl && widgetId && window.turnstile) {
									try {
										window.turnstile.reset(widgetId);
									} catch {
										/* widget already gone (success view) */
									}
								}
							};
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
								<option value="" disabled selected={!(form?.values?.topic ?? data.presetTopic)}
									>Choose a topic…</option
								>
								{#each data.topics as topic (topic)}
									<option
										value={topic}
										selected={(form?.values?.topic ?? data.presetTopic) === topic}>{topic}</option
									>
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
								class="{inputClass} resize-y">{form?.values?.message ?? ''}</textarea
							>
						</div>

						<div bind:this={turnstileEl} class="mt-1"></div>

						<button
							type="submit"
							disabled={loading}
							class="mt-2 w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60"
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
