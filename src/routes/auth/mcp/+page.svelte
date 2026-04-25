<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import Navigation from '$lib/components/Navigation.svelte';

	let { data, form } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Authorize Claude Integration — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#FDFBF7]">
	<Navigation />

	<main class="flex flex-grow items-start justify-center px-4 pt-16 pb-12">
		<div class="w-full max-w-sm">
			<div class="mb-8 text-center">
				<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C]">
					Authorize Integration
				</h1>
				<p class="text-sm text-[#875F42]/70">
					Signed in as <span class="font-semibold text-[#4A2C2C]">{data.user.email}</span>
				</p>
			</div>

			<div
				class="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_8px_32px_rgba(240,98,146,0.1)] backdrop-blur-sm"
			>
				{#if form?.error}
					<div
						class="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
					>
						{form.error}
					</div>
				{/if}

				<div class="mb-5 flex items-center gap-3">
					<div
						class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292]"
					>
						<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-black text-[#4A2C2C]">Mochify Image Processing</p>
						<p class="text-xs text-[#875F42]/60">Compress, convert, and resize images</p>
					</div>
				</div>

				<p class="mb-5 text-sm text-[#875F42]/80">
					This will allow your AI assistant to process images on your behalf using your Mochify
					account and quota.
				</p>

				{#if data.hasKey}
					<div
						class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700"
					>
						Your existing API key will be replaced. Update any other integrations that use it.
					</div>
				{/if}

				<form
					method="POST"
					action="?/authorize"
					use:enhance={() => {
						loading = true;
						return async ({ result }) => {
							if (result.type === 'redirect') {
								window.location.href = result.location;
							} else {
								loading = false;
								await applyAction(result);
							}
						};
					}}
				>
					<input type="hidden" name="state" value={data.state} />
					<button
						type="submit"
						disabled={loading}
						class="w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loading ? 'Authorizing…' : 'Authorize'}
					</button>
				</form>

				<p class="mt-5 text-center text-xs text-[#875F42]/50">
					Not you?
					<a href="/auth/login" class="font-bold text-[#F06292] hover:underline"
						>Sign in with a different account</a
					>
				</p>
			</div>
		</div>
	</main>
</div>
