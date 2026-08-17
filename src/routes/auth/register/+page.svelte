<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Navigation from '$lib/components/Navigation.svelte';
	import { posthog } from '$lib/analytics';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleGoogle() {
		await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}

	const benefits = [
		{
			title: '25 Images / Month',
			desc: 'Convert or compress files up to 20MB each.',
			tone: 'pink',
			highlight: true,
			path: 'M3 16.5l4.5-4.5a2 2 0 012.8 0l3.2 3.2m0 0l2.2-2.2a2 2 0 012.8 0L21 15.5M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm5.5 4.5h.01'
		},
		{
			title: 'Advanced Formats',
			highlight: false,
			desc: 'Access to AVIF, WebP, JPEG XL, and Jpegli.',
			tone: 'amber',
			path: 'M12 3l1.9 4.4L18.5 9l-4.6 1.6L12 15l-1.9-4.4L5.5 9l4.6-1.6L12 3zm6 10l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1zM6 14l.7 1.6 1.6.7-1.6.7L6 18.6l-.7-1.6-1.6-.7 1.6-.7L6 14z'
		},
		{
			title: 'EXIF Control',
			highlight: false,
			desc: 'Strip metadata and apply custom settings.',
			tone: 'pink',
			path: 'M4 6h10m4 0h2M4 12h2m4 0h10M4 18h10m4 0h2M14 4v4M8 10v4M14 16v4'
		},
		{
			title: '100% Free Forever',
			highlight: false,
			desc: 'No credit card required, resets monthly.',
			tone: 'amber',
			path: 'M9 12.5l2 2 4-4.5M12 3l2.4 1.8 3 .1.9 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.8-3 .1L12 22l-2.4-1.8-3-.1-.9-2.8L3.3 15.5l.9-2.9-.9-2.9 2.4-1.8.9-2.8 3-.1L12 3z'
		}
	];

	async function handleRegister(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: err } = await authClient.signUp.email({
			email,
			password,
			name: email.split('@')[0] ?? email
		});

		if (err) {
			error = err.message ?? 'Registration failed';
			loading = false;
		} else {
			// `user_signed_up` is captured server-side in the user-create database
			// hook (src/lib/auth.ts) so OAuth and magic-link signups are counted too.
			// Don't capture it here as well or email signups would double-count.
			posthog.identify(email, { email });
			success = true;
		}
	}
</script>

<svelte:head>
	<title>Create account — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navigation showGetStarted={false} />

	<main class="relative z-10 flex flex-grow items-start justify-center px-4 pt-16 pb-12 lg:pt-12">
		<div
			class="grid w-full max-w-sm items-center gap-10 {success
				? ''
				: 'lg:max-w-4xl lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14'}"
		>
			{#if !success}
				<aside class="order-2 lg:order-1">
					<div
						class="rounded-3xl border border-white/80 bg-gradient-to-br from-[#FFF4F8] to-[#FFFAF2] p-7 shadow-[0_8px_32px_rgba(240,98,146,0.08)] sm:p-8"
					>
						<h2 class="mb-7 text-lg font-black tracking-tight text-[#4A2C2C]">
							What you get with a Free Account:
						</h2>

						<!-- -mx-3 cancels each row's px-3 so text lines up with the heading, while the
						     highlighted row's pill still bleeds toward the card edge. -->
						<ul class="-mx-3 flex flex-col gap-2">
							{#each benefits as benefit (benefit.title)}
								<li
									class="flex items-start gap-4 rounded-2xl px-3 py-3 {benefit.highlight
										? 'bg-white/80 shadow-[0_2px_10px_rgba(240,98,146,0.08)] ring-1 ring-[#F06292]/20'
										: ''}"
								>
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl {benefit.tone ===
										'pink'
											? 'bg-[#FDE7EF] text-[#F06292]'
											: 'bg-[#FDF0DC] text-[#D9922F]'}"
									>
										<svg
											class="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											stroke-width="2"
											aria-hidden="true"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d={benefit.path} />
										</svg>
									</div>
									<div class="pt-0.5">
										<p
											class="text-sm font-black {benefit.highlight
												? 'text-[#F06292]'
												: 'text-[#4A2C2C]'}"
										>
											{benefit.title}
										</p>
										<p class="mt-0.5 text-sm text-[#875F42]/70">{benefit.desc}</p>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				</aside>
			{/if}

			<div class="order-1 w-full lg:order-2">
				<div class="mb-8 text-center">
					<h1 class="mb-1 text-3xl font-black tracking-tight text-[#4A2C2C]">Create account</h1>
					<p class="text-sm text-[#875F42]/70">
						Unlock higher limits and advanced features, 100% free forever.
					</p>
				</div>

				<div
					class="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-[0_8px_32px_rgba(240,98,146,0.1)] backdrop-blur-sm"
				>
					{#if success}
						<div class="py-4 text-center">
							<div
								class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4FBF2]"
							>
								<svg
									class="h-7 w-7 text-[#A5D6A7]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									stroke-width="2.5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<p class="mb-1 text-lg font-black text-[#4A2C2C]">Check your email</p>
							<p class="text-sm text-[#875F42]/70">
								We sent a confirmation link to <strong class="text-[#6C3F31]">{email}</strong>.
							</p>
							<p class="mt-2 text-sm text-[#875F42]/70">
								Already have an account? <a
									href="/auth/login"
									class="font-bold text-[#F06292] hover:underline">Sign in instead</a
								>
							</p>
						</div>
					{:else}
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
							class="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-[#D1D5DB] bg-white py-3 text-sm font-bold text-[#4A2C2C] shadow-sm transition-all hover:border-[#9CA3AF] hover:shadow-md"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24"
								><path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/><path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/><path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
								/><path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/></svg
							>
							Continue with Google
						</button>

						<div class="my-1 flex items-center gap-3">
							<div class="h-px flex-1 bg-[#875F42]/10"></div>
							<span class="text-xs font-medium text-[#875F42]/40">or</span>
							<div class="h-px flex-1 bg-[#875F42]/10"></div>
						</div>

						<form onsubmit={handleRegister} class="flex flex-col gap-4">
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
								<label
									for="password"
									class="text-xs font-bold tracking-wide text-[#6C3F31] uppercase">Password</label
								>
								<input
									id="password"
									type="password"
									bind:value={password}
									required
									minlength={8}
									autocomplete="new-password"
									placeholder="Min. 8 characters"
									class="w-full rounded-2xl border border-[#875F42]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#4A2C2C] placeholder-[#875F42]/30 transition-all focus:border-[#F06292]/40 focus:ring-2 focus:ring-[#F06292]/30 focus:outline-none"
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								class="mt-2 w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-sm font-black tracking-wide text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.5)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60"
							>
								{loading ? 'Creating account…' : 'Create account'}
							</button>

							<p class="-mt-1 text-center text-xs font-medium text-[#875F42]/50">
								Free account • No credit card required • Resets monthly
							</p>
						</form>
					{/if}
				</div>

				{#if !success}
					<p class="mt-6 text-center text-sm text-[#875F42]/60">
						Already have an account?
						<a href="/auth/login" class="font-bold text-[#F06292] hover:underline">Sign in</a>
					</p>
				{/if}
			</div>
		</div>
	</main>
</div>
