<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';

	let { data } = $props();

	const loginHref = $derived(`/auth/login?next=${encodeURIComponent(data.next)}`);

	// Better Auth's codes, from the verify-email route's redirectOnError. Anything
	// unrecognised is treated as an unusable link, which has the same remedy.
	const state = $derived(
		!data.error ? 'verified' : data.error === 'TOKEN_EXPIRED' ? 'expired' : 'invalid'
	);
</script>

<svelte:head>
	<title>Verify email — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navigation />

	<main class="relative z-10 flex flex-grow items-start justify-center px-4 pt-16 pb-12">
		<div class="w-full max-w-sm">
			<div class="mb-8 text-center">
				<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C]">
					{state === 'verified'
						? 'Email verified'
						: state === 'expired'
							? 'Link expired'
							: 'Link not valid'}
				</h1>
			</div>

			<div
				class="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_8px_32px_rgba(240,98,146,0.1)] backdrop-blur-sm"
			>
				{#if state === 'verified'}
					<div
						class="mb-5 rounded-2xl border border-[#66BB6A]/30 bg-[#A5D6A7]/20 px-4 py-3 text-sm font-medium text-[#2E5C31]"
					>
						Your account is ready. Sign in to continue.
					</div>
				{:else}
					<div
						class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
					>
						{state === 'expired'
							? 'This verification link has expired.'
							: "This verification link didn't work. It may have been copied incompletely."}
						Sign in with your email and password and we'll send you a fresh one.
					</div>
				{/if}

				<a
					href={loginHref}
					class="block w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-center text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)]"
				>
					Sign in
				</a>
			</div>

			<p class="mt-6 text-center text-sm text-[#875F42]/60">
				Still stuck?
				<a href="/contact" class="font-bold text-[#F06292] hover:underline">Contact us</a>
			</p>
		</div>
	</main>
</div>
