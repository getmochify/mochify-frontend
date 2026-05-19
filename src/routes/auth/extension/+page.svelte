<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import Navigation from '$lib/components/Navigation.svelte';

	let { data, form } = $props();

	let loading = $state(false);
	let sent = $state(false);
	let sendError = $state(false);

	// Once the server returns the key, push it straight to the extension.
	$effect(() => {
		if (!form?.success || !browser) return;

		const extId: string = data.extId;
		const apiKey: string = form.apiKey;
		const email: string = form.email ?? '';

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const cr = (globalThis as any).chrome;
		if (!cr?.runtime?.sendMessage) {
			sendError = true;
			return;
		}

		cr.runtime.sendMessage(extId, { type: 'MOCHIFY_AUTH', apiKey, email }, (res: { ok: boolean }) => {
			if (cr.runtime.lastError || !res?.ok) {
				sendError = true;
			} else {
				sent = true;
			}
		});
	});
</script>

<svelte:head>
	<title>Authorize Extension — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#FDFBF7]">
	<Navigation />

	<main class="flex flex-grow items-start justify-center px-4 pt-16 pb-12">
		<div class="w-full max-w-sm">
			{#if sent}
				<!-- Success: key delivered to extension -->
				<div class="text-center">
					<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#A5D6A7]/30">
						<svg class="h-8 w-8 text-[#2E5C31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 class="mb-2 text-3xl font-black tracking-tight text-[#4A2C2C]">You're in</h1>
					<p class="text-sm text-[#875F42]/70">
						The extension is authorized. You can close this tab and start right-clicking images.
					</p>
					<p class="mt-6 text-xs text-[#875F42]/40">You can close this tab.</p>
				</div>

			{:else if sendError}
				<!-- Extension not found in this browser — show fallback -->
				<div class="text-center">
					<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
						<svg class="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
						</svg>
					</div>
					<h1 class="mb-2 text-2xl font-black tracking-tight text-[#4A2C2C]">Extension not found</h1>
					<p class="mb-4 text-sm text-[#875F42]/70">
						Your API key was generated but couldn't be sent to the extension automatically. Make sure the
						Mochify extension is installed in this browser, then try again.
					</p>
					<a href="/auth/extension?ext={data.extId}"
						class="text-sm font-bold text-[#F06292] hover:underline">Try again →</a>
				</div>

			{:else}
				<div class="mb-8 text-center">
					<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C]">Authorize Extension</h1>
					<p class="text-sm text-[#875F42]/70">
						Signed in as <span class="font-semibold text-[#4A2C2C]">{data.user.email}</span>
					</p>
				</div>

				<div class="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_8px_32px_rgba(240,98,146,0.1)] backdrop-blur-sm">
					{#if form?.error}
						<div class="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
							{form.error}
						</div>
					{/if}

					<p class="mb-5 text-sm text-[#875F42]/80">
						This will grant the Mochify Chrome extension access to your account so you can compress images by right-clicking them on any page.
					</p>

					{#if data.hasKey}
						<div class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
							Your existing API key will be replaced. If you use the Mochify CLI, re-run <code class="font-mono">mochify auth</code> afterwards.
						</div>
					{/if}

					<form
						method="POST"
						action="?/authorize"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
							};
						}}
					>
						<input type="hidden" name="extId" value={data.extId} />
						<button
							type="submit"
							disabled={loading}
							class="w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? 'Authorizing…' : 'Authorize Mochify Extension'}
						</button>
					</form>

					<p class="mt-5 text-center text-xs text-[#875F42]/50">
						Not you?
						<a href="/auth/login?next={encodeURIComponent('/auth/extension?ext=' + data.extId)}"
							class="font-bold text-[#F06292] hover:underline">Sign in with a different account</a>
					</p>
				</div>
			{/if}
		</div>
	</main>
</div>
