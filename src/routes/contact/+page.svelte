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
	// `render=explicit` stops the script auto-scanning for `.cf-turnstile`, so we
	// control render/teardown ourselves. `onload` names the global Turnstile calls
	// once its API has finished initialising — the documented entry point for
	// explicit rendering.
	const TURNSTILE_SRC =
		'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';

	let turnstileEl: HTMLDivElement | undefined = $state();
	let turnstileError = $state(false);
	let widgetId: string | undefined;

	// Turnstile loads on mount. It used to wait for the first user interaction, on
	// the theory that loading it at page load crashed Safari's WebContent process —
	// that theory was wrong. The Safari reload was Bot Fight Mode serving
	// interstitial challenge pages zone-wide, plus a render race here. Gating on
	// input only bought a late-arriving widget that looked broken.
	//
	// Readiness comes from Turnstile itself: `onload` for a fresh script,
	// `turnstile.ready()` when the script is already cached. Never poll for
	// `window.turnstile.render` to appear — the API object is published before it
	// is initialised, so a poll wins the race and renders too early, which is what
	// made the widget no-show and then materialise later out of Turnstile's own init.
	onMount(() => {
		let cancelled = false;

		function renderWidget() {
			// Re-check both: `ready` fires asynchronously, so the component may have
			// unmounted, and a rendered widget must never be rendered over.
			if (cancelled || widgetId !== undefined || !turnstileEl) return;
			try {
				widgetId = window.turnstile?.render(turnstileEl, {
					sitekey: TURNSTILE_SITE_KEY,
					action: 'turnstile-spin-v2',
					// Surface failures instead of retrying invisibly forever (the default
					// is retry: 'auto' on an 8s loop, which hides a broken challenge).
					retry: 'never',
					'error-callback': (code: string) => {
						console.error('[contact] turnstile error:', code);
						turnstileError = true;
						return true;
					}
				});
				if (widgetId !== undefined) clearTimeout(watchdog);
			} catch (e) {
				console.error('[contact] turnstile render failed:', e);
				turnstileError = true;
			}
		}

		// A blocked script (content blocker, VPN, offline) can leave the container
		// silently empty with no error event of any kind. Say so rather than showing
		// a blank gap above a submit button that will always fail server-side.
		const watchdog = setTimeout(() => {
			if (widgetId === undefined && !cancelled) {
				console.error('[contact] turnstile did not render within 15s');
				turnstileError = true;
			}
		}, 15_000);

		// Script already present (cached, or a previous mount in this SPA session):
		// `onload` will not fire again, so go straight through ready().
		if (window.turnstile) {
			window.turnstile.ready(renderWidget);
		} else {
			window.onloadTurnstileCallback = () => window.turnstile?.ready(renderWidget);

			if (!document.querySelector('script[data-turnstile]')) {
				const script = document.createElement('script');
				script.src = TURNSTILE_SRC;
				// Dynamically inserted scripts are async by default; `defer` would be
				// ignored here, so readiness is handled by onload/ready() above.
				script.dataset.turnstile = 'true';
				script.onerror = () => {
					console.error('[contact] turnstile script failed to load');
					turnstileError = true;
				};
				document.head.appendChild(script);
			}
		}

		return () => {
			cancelled = true;
			clearTimeout(watchdog);
			removeWidget();
		};
	});

	function removeWidget() {
		if (widgetId === undefined) return;
		try {
			window.turnstile?.remove(widgetId);
		} catch {
			/* already gone */
		}
		widgetId = undefined;
	}

	// The success view replaces the whole form, so Svelte would otherwise tear the
	// widget's container out from under a live Turnstile instance. Tell Turnstile
	// to drop it first.
	$effect(() => {
		if (form?.success) removeWidget();
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

			<!-- No backdrop-blur here: this card contains the Turnstile iframe, and an
			     iframe inside a backdrop-filter subtree is a known WebKit compositing
			     hazard. The backdrop is a soft pastel gradient with no detail to blur,
			     so a slightly more opaque white reads the same. -->
			<div
				class="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_8px_32px_rgba(240,98,146,0.1)] sm:p-8"
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
								if (widgetId !== undefined && window.turnstile) {
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

						<!-- min-h reserves the widget's height so its arrival on first
						     interaction doesn't shove the submit button down mid-tap. -->
						<div bind:this={turnstileEl} class="mt-1 min-h-[65px]"></div>

						{#if turnstileError}
							<p class="-mt-2 text-xs font-medium text-red-700">
								The bot check couldn't load. Please refresh, or email
								<a href="mailto:hello@mochify.app" class="font-bold underline"
									>hello@mochify.app</a
								> directly.
							</p>
						{/if}

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
