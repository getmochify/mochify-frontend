<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import Navigation from '$lib/components/Navigation.svelte';
	import posthog from 'posthog-js';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleGoogle() {
		await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: err } = await authClient.signIn.email({ email, password });

		if (err) {
			error = err.message ?? 'Sign in failed';
			loading = false;
		} else {
			posthog.identify(email, { email });
			posthog.capture('user_logged_in', { method: 'email' });
			await invalidateAll();
			goto('/dashboard');
		}
	}
</script>

<svelte:head>
	<title>Sign in — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#FDFBF7]">
	<Navigation />

	<main class="flex flex-grow items-start justify-center px-4 pt-16 pb-12">
		<div class="w-full max-w-sm">
			<div class="mb-8 text-center">
				<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C]">Welcome back</h1>
				<p class="text-sm text-[#875F42]/70">Sign in to your Mochify account</p>
			</div>

			<div
				class="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_8px_32px_rgba(240,98,146,0.1)] backdrop-blur-sm"
			>
				{#if error}
					<div
						class="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
					>
						{error}
					</div>
				{/if}

				<button
					type="button"
					onclick={handleGoogle}
					class="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl border border-[#875F42]/15 bg-white/80 text-[#4A2C2C] text-sm font-bold hover:bg-white hover:border-[#875F42]/30 transition-all"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
					Continue with Google
				</button>

				<div class="flex items-center gap-3 my-1">
					<div class="flex-1 h-px bg-[#875F42]/10"></div>
					<span class="text-xs text-[#875F42]/40 font-medium">or</span>
					<div class="flex-1 h-px bg-[#875F42]/10"></div>
				</div>

				<form onsubmit={handleLogin} class="flex flex-col gap-4">
					<div class="flex flex-col gap-1.5">
						<label for="email" class="text-xs font-bold tracking-wide text-[#6C3F31] uppercase"
							>Email</label
						>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							autocomplete="email"
							placeholder="you@example.com"
							class="w-full rounded-2xl border border-[#875F42]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#4A2C2C] placeholder-[#875F42]/30 transition-all focus:border-[#F06292]/40 focus:ring-2 focus:ring-[#F06292]/30 focus:outline-none"
						/>
					</div>

					<div class="flex flex-col gap-1.5">
						<div class="flex items-center justify-between">
							<label for="password" class="text-xs font-bold tracking-wide text-[#6C3F31] uppercase"
								>Password</label
							>
							<a
								href="/auth/forgot-password"
								class="text-xs font-semibold text-[#F06292] hover:underline">Forgot password?</a
							>
						</div>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							autocomplete="current-password"
							placeholder="••••••••"
							class="w-full rounded-2xl border border-[#875F42]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#4A2C2C] placeholder-[#875F42]/30 transition-all focus:border-[#F06292]/40 focus:ring-2 focus:ring-[#F06292]/30 focus:outline-none"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="mt-2 w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loading ? 'Signing in…' : 'Sign in'}
					</button>
				</form>
			</div>

			<p class="mt-6 text-center text-sm text-[#875F42]/60">
				No account?
				<a href="/auth/register" class="font-bold text-[#F06292] hover:underline">Create one</a>
			</p>
		</div>
	</main>
</div>
