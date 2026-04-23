<script lang="ts">
	import { enhance } from '$app/forms';
	import Navigation from '$lib/components/Navigation.svelte';

	let { data, form } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Authorize CLI — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#FDFBF7]">
	<Navigation />

	<main class="flex flex-grow items-start justify-center px-4 pt-16 pb-12">
		<div class="w-full max-w-sm">
			{#if form?.success}
				<div class="text-center">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#A5D6A7]/30"
					>
						<svg class="h-8 w-8 text-[#2E5C31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 class="mb-2 text-3xl font-black tracking-tight text-[#4A2C2C]">You're in</h1>
					<p class="text-sm text-[#875F42]/70">
						The CLI is authorized. Return to your terminal — it should continue automatically.
					</p>
					<p class="mt-6 text-xs text-[#875F42]/40">You can close this tab.</p>
				</div>
			{:else}
				<div class="mb-8 text-center">
					<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C]">Authorize CLI</h1>
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

					<p class="mb-5 text-sm text-[#875F42]/80">
						This will generate an API key and grant the Mochify CLI access to your account.
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
							return async ({ update }) => {
								await update();
								loading = false;
							};
						}}
					>
						<input type="hidden" name="state" value={data.state} />
						<button
							type="submit"
							disabled={loading}
							class="w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? 'Authorizing…' : 'Authorize Mochify CLI'}
						</button>
					</form>

					<p class="mt-5 text-center text-xs text-[#875F42]/50">
						Not you?
						<a href="/auth/login" class="font-bold text-[#F06292] hover:underline"
							>Sign in with a different account</a
						>
					</p>
				</div>
			{/if}
		</div>
	</main>
</div>
