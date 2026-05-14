<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { getSessionToken } from '$lib/user';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { env } from '$env/dynamic/public';
	import posthog from 'posthog-js';

	const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.app';

	let { data } = $props();

	let justUpgraded = $state(false);

	// API key state
	let hasKey = $state(false);
	let keyCreatedAt = $state<string | null>(null);
	let newKeyPlaintext = $state<string | null>(null);
	let copied = $state(false);
	let keyLoading = $state(false);
	let keyChecking = $state(true); // true until the first successful status check

	// Usage state
	let usageLoaded = $state(false);
	let usedOps = $state(0);
	let quotaOps = $state(30);

	let isPro = $derived(data.profile?.plan === 'pro');
	let isSeller = $derived(data.profile?.plan === 'seller');
	let isDay = $derived(data.profile?.plan === 'day');
	let isPaid = $derived(isPro || isSeller || isDay);

	async function loadKeyStatus(retries = 3) {
		keyChecking = true;
		let jwt = await getSessionToken();
		// Session may not be hydrated on first mount — retry a couple of times
		if (!jwt && retries > 0) {
			await new Promise(r => setTimeout(r, 500));
			return loadKeyStatus(retries - 1);
		}
		if (!jwt) { keyChecking = false; return; }
		try {
			const res = await fetch(`${API_URL}/v1/user/apikey`, {
				headers: { Authorization: `Bearer ${jwt}` }
			});
			if (res.ok) {
				const body = (await res.json()) as Record<string, unknown>;
				hasKey = (body.has_key as boolean) ?? false;
				keyCreatedAt = (body.created_at as string) ?? null;
			}
		} catch {
			// network error — leave hasKey as-is
		}
		keyChecking = false;
	}

	async function loadUsage() {
		try {
			const res = await fetch('/api/usage');
			if (res.ok) {
				const body = (await res.json()) as Record<string, unknown>;
				usedOps = (body.used as number) ?? 0;
				quotaOps = (body.quota as number) ?? data.profile?.ops_limit ?? 30;
				usageLoaded = true;
			}
		} catch {
			// silently ignore
		}
	}

	async function generateKey() {
		keyLoading = true;
		newKeyPlaintext = null;
		const jwt = await getSessionToken();
		if (!jwt) {
			keyLoading = false;
			return;
		}
		try {
			const res = await fetch(`${API_URL}/v1/user/apikey`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${jwt}` }
			});
			if (res.ok) {
				const body = (await res.json()) as Record<string, unknown>;
				newKeyPlaintext = (body.key as string) ?? null;
				hasKey = true;
				keyCreatedAt = new Date().toISOString();
				posthog.capture('api_key_created', { action: 'generate' });
				await loadUsage();
			} else {
				// Key likely already exists (conflict) — re-check status and show dots
				await loadKeyStatus();
			}
		} catch {
			await loadKeyStatus();
		}
		keyLoading = false;
	}

	async function regenerateKey() {
		keyLoading = true;
		newKeyPlaintext = null;
		const jwt = await getSessionToken();
		if (!jwt) {
			keyLoading = false;
			return;
		}
		try {
			// Revoke old key — abort if it fails to avoid issuing a duplicate
			const delRes = await fetch(`${API_URL}/v1/user/apikey`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${jwt}` }
			});
			if (!delRes.ok) {
				await loadKeyStatus();
				keyLoading = false;
				return;
			}
			// Generate new key
			const res = await fetch(`${API_URL}/v1/user/apikey`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${jwt}` }
			});
			if (res.ok) {
				const body = (await res.json()) as Record<string, unknown>;
				newKeyPlaintext = (body.key as string) ?? null;
				keyCreatedAt = new Date().toISOString();
			}
		} catch {
			await loadKeyStatus();
		}
		keyLoading = false;
	}

	async function copyKey() {
		if (!newKeyPlaintext) return;
		await navigator.clipboard.writeText(newKeyPlaintext);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	async function handleSignOut() {
		await authClient.signOut();
		window.location.href = '/';
	}

	let showDeleteConfirm = $state(false);
	let deleteConfirmText = $state('');
	let deleteLoading = $state(false);

	let canConfirmDelete = $derived(deleteConfirmText.trim().toLowerCase() === 'delete my account');

	onMount(() => {
		quotaOps = data.profile?.ops_limit ?? 30;
		justUpgraded = new URLSearchParams(window.location.search).get('upgraded') === 'true';
		loadKeyStatus();
		loadUsage();
	});

	let usagePercent = $derived(
		quotaOps > 0 ? Math.min(Math.round((usedOps / quotaOps) * 100), 100) : 0
	);
</script>

<svelte:head>
	<title>Dashboard — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-[#FDFBF7]">
	<Navigation />

	<main class="mx-auto w-full max-w-4xl grow px-4 py-12 sm:px-6">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-black tracking-tight text-[#4A2C2C]">Dashboard</h1>
				<p class="mt-1 text-sm text-[#875F42]/60">{data.user?.email}</p>
			</div>
			<button
				onclick={handleSignOut}
				class="cursor-pointer rounded-xl border border-[#875F42]/15 px-4 py-2 text-sm font-bold text-[#875F42]/70 transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
			>
				Sign out
			</button>
		</div>

		<!-- Post-checkout success banner -->
		{#if justUpgraded}
			<div
				class="mb-6 flex items-center gap-3 rounded-2xl border border-[#66BB6A]/30 bg-[#A5D6A7]/20 p-4"
			>
				<span class="text-sm font-black text-[#2E5C31]"
					>You're on {isSeller ? 'Seller' : 'Pro'}!</span
				>
				<span class="text-sm text-[#2E5C31]/70">Your new limits are being applied — your usage numbers may take a minute or two to reflect the change.</span>
			</div>
		{/if}

		<!-- Stats row -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
				<p class="mb-1 text-xs font-bold tracking-widest text-[#875F42]/50 uppercase">Plan</p>
				{#if isPro}
					<p class="text-2xl font-black text-[#4A2C2C]">Pro</p>
					{#if data.profile?.quota_period_end}
						<p class="mt-1 text-xs text-[#875F42]/50">
							Renews {new Date(data.profile.quota_period_end).toLocaleDateString(undefined, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							})}
						</p>
					{/if}
				{:else if isSeller}
					<p class="text-2xl font-black text-[#4A2C2C]">Seller</p>
					{#if data.profile?.quota_period_end}
						<p class="mt-1 text-xs text-[#875F42]/50">
							Renews {new Date(data.profile.quota_period_end).toLocaleDateString(undefined, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							})}
						</p>
					{/if}
					<a
						href="/api/checkout?plan=pro&billing=monthly"
						class="mt-2 inline-block text-xs font-bold text-[#F06292] hover:underline"
						>Upgrade to Pro →</a
					>
				{:else}
					<p class="text-2xl font-black text-[#4A2C2C]">Free</p>
					<a
						href="/api/checkout?plan=pro&billing=monthly"
						class="mt-2 inline-block text-xs font-bold text-[#F06292] hover:underline">Upgrade →</a
					>
				{/if}
			</div>
			<div class="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
				<p class="mb-2 text-xs font-bold tracking-widest text-[#875F42]/50 uppercase">
					Images this month
				</p>
				{#if usageLoaded}
					<p class="mb-3 text-2xl font-black text-[#4A2C2C]">
						{usedOps} <span class="text-base font-semibold text-[#875F42]/50">/ {quotaOps}</span>
					</p>
					<div class="h-2 overflow-hidden rounded-full bg-[#875F42]/10">
						<div
							class="h-full rounded-full transition-all duration-700 {usagePercent >= 90
								? 'bg-gradient-to-r from-orange-400 to-red-400'
								: 'bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A]'}"
							style="width: {usagePercent}%"
						></div>
					</div>
					<p class="mt-2 text-xs text-[#875F42]/50">
						{#if data.profile?.quota_period_end}
							Resets {new Date(data.profile.quota_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
						{:else}
							Resets every 30 days
						{/if}
					</p>
				{:else}
					<p class="text-2xl font-black text-[#4A2C2C]">—</p>
					<p class="mt-1 text-xs text-[#875F42]/50">Generate an API key to track usage</p>
				{/if}
			</div>
		</div>

		<!-- Upgrade CTA for free/lite users -->
		{#if !isPaid}
			<div
				class="mb-6 rounded-3xl border border-[#F06292]/15 bg-gradient-to-br from-[#FFF0F5] to-[#FFF8F0] p-6 shadow-sm"
			>
				<p class="mb-1 text-base font-black text-[#4A2C2C]">Upgrade your plan</p>
				<p class="mb-4 text-sm text-[#875F42]/60">
					More images, larger files, priority queue, and API key access.
				</p>
				<div class="flex flex-wrap gap-3">
					<a
						href="/api/checkout?plan=seller&billing=monthly"
						class="rounded-2xl border border-[#875F42]/20 px-5 py-2.5 text-sm font-black text-[#4A2C2C] transition-all hover:border-[#F06292]/40 hover:bg-white/60 hover:text-[#F06292]"
					>
						Seller — $7.99/mo <span class="font-normal text-[#875F42]/50">· 300 images</span>
					</a>
					<a
						href="/api/checkout?plan=pro&billing=monthly"
						class="rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-5 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
					>
						Pro — $24.99/mo <span class="font-normal opacity-80">· 1,200 images</span>
					</a>
				</div>
			</div>
		{:else if isSeller}
			<div
				class="mb-6 flex items-center justify-between gap-4 rounded-3xl border border-[#F06292]/15 bg-gradient-to-br from-[#FFF0F5] to-[#FFF8F0] p-6 shadow-sm"
			>
				<div>
					<p class="text-base font-black text-[#4A2C2C]">Upgrade to Pro — 1,200 images/month</p>
					<p class="mt-0.5 text-sm text-[#875F42]/60">4× the images, top priority queue.</p>
				</div>
				<a
					href="/api/checkout?plan=pro&billing=monthly"
					class="flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-5 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
				>
					Upgrade to Pro
				</a>
			</div>
		{/if}

		<!-- API Key card -->
		<div class="mb-6 rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h2 class="text-lg font-black text-[#4A2C2C]">API Key</h2>
					<p class="mt-0.5 text-xs text-[#875F42]/60">
						Use this key from the web app, CLI, or curl
					</p>
				</div>
				{#if hasKey}
					<button
						onclick={regenerateKey}
						disabled={keyLoading}
						class="text-xs font-bold text-[#875F42]/60 transition-colors hover:text-[#F06292] disabled:opacity-40"
					>
						{keyLoading ? 'Regenerating…' : 'Regenerate'}
					</button>
				{/if}
			</div>

			{#if newKeyPlaintext}
				<div class="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
					<p class="mb-2 text-xs font-bold text-amber-700">
						Save this key — you won't see it again
					</p>
					<div class="flex items-center gap-2">
						<code
							class="min-w-0 flex-1 overflow-x-auto rounded-xl border border-amber-200/60 bg-white/70 px-3 py-2 font-mono text-xs break-all text-[#4A2C2C]"
							>{newKeyPlaintext}</code
						>
						<button
							onclick={copyKey}
							class="flex-shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all {copied
								? 'bg-[#A5D6A7]/30 text-[#2E5C31]'
								: 'bg-white/70 text-[#875F42]/70 hover:bg-[#FFF5F7] hover:text-[#F06292]'} border border-white/60"
						>
							{copied ? 'Copied!' : 'Copy'}
						</button>
					</div>
				</div>
			{:else if hasKey}
				<div class="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 p-4">
					<code class="min-w-0 flex-1 truncate font-mono text-sm text-[#875F42]/60"
						>••••••••••••••••••••••••••••••••</code
					>
					{#if keyCreatedAt}
						<span class="flex-shrink-0 text-xs text-[#875F42]/40"
							>Created {new Date(keyCreatedAt).toLocaleDateString()}</span
						>
					{/if}
				</div>
			{:else if keyChecking}
				<div class="py-4 text-center">
					<p class="text-sm text-cocoa-milk/40">Checking…</p>
				</div>
			{:else}
				<div class="py-4 text-center">
					<p class="mb-4 text-sm text-[#875F42]/60">
						No API key yet. Generate one to start using authenticated processing.
					</p>
					<button
						onclick={generateKey}
						disabled={keyLoading}
						class="cursor-pointer rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] disabled:transform-none disabled:opacity-60"
					>
						{keyLoading ? 'Generating…' : 'Generate API key'}
					</button>
				</div>
			{/if}

			<div class="mt-4 border-t border-[#875F42]/8 pt-4">
				<p class="font-mono text-xs break-all text-[#875F42]/50">
					curl -H "Authorization: Bearer &lt;key&gt;" -X POST https://api.mochify.app/v1/squish ...
				</p>
			</div>
		</div>

		<!-- Usage note -->
		<div class="mb-6 rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
			<h2 class="mb-1 font-black text-[#4A2C2C]">Usage history</h2>
			<p class="text-sm text-[#875F42]/60">Detailed per-request history coming soon.</p>
		</div>

		<!-- Danger zone -->
		<div class="rounded-3xl border border-red-200/60 p-6">
			<h2 class="mb-1 font-black text-red-700/80">Danger zone</h2>
			<p class="mb-4 text-sm text-[#875F42]/60">
				Permanently delete your account and all associated data. This cannot be undone.
			</p>
			{#if !showDeleteConfirm}
				<button
					onclick={() => {
						showDeleteConfirm = true;
					}}
					class="cursor-pointer rounded-xl border border-red-300/60 px-4 py-2 text-sm font-bold text-red-600/70 transition-all hover:border-red-400/60 hover:bg-red-50/60 hover:text-red-700"
				>
					Delete account
				</button>
			{:else}
				<div class="space-y-3">
					<p class="text-sm font-bold text-red-700/80">
						Type <span class="font-mono">delete my account</span> to confirm:
					</p>
					<input
						type="text"
						bind:value={deleteConfirmText}
						placeholder="delete my account"
						class="w-full max-w-sm rounded-xl border border-red-200 bg-white/70 px-4 py-2.5 text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-red-400 focus:ring-2 focus:ring-red-200/50 focus:outline-none"
					/>
					<div class="flex gap-3">
						<form
							method="POST"
							action="?/deleteAccount"
							onsubmit={() => {
								deleteLoading = true;
							}}
						>
							<button
								type="submit"
								disabled={!canConfirmDelete || deleteLoading}
								class="cursor-pointer rounded-xl px-4 py-2 text-sm font-bold transition-all
                                    {canConfirmDelete && !deleteLoading
									? 'bg-red-600 text-white shadow-sm hover:bg-red-700'
									: 'cursor-not-allowed bg-red-100 text-red-300'}"
							>
								{deleteLoading ? 'Deleting…' : 'Permanently delete'}
							</button>
						</form>
						<button
							onclick={() => {
								showDeleteConfirm = false;
								deleteConfirmText = '';
							}}
							class="cursor-pointer rounded-xl border border-[#875F42]/15 px-4 py-2 text-sm font-bold text-[#875F42]/60 transition-all hover:border-[#875F42]/30 hover:text-[#4A2C2C]"
						>
							Cancel
						</button>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>
