<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { authClient } from '$lib/auth-client';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { posthog } from '$lib/analytics';

	let { data } = $props();

	let justUpgraded = $state(false);

	// API key state — seeded from the server load so the card renders immediately.
	// Mutations (generate/regenerate) run as server form actions and update these
	// from the action result; no client-side status round-trip.
	// svelte-ignore state_referenced_locally
	let hasKey = $state(data.hasKey ?? false);
	// svelte-ignore state_referenced_locally
	let keyCreatedAt = $state<string | null>(data.keyCreatedAt ?? null);
	let newKeyPlaintext = $state<string | null>(null);
	let copied = $state(false);
	let keyLoading = $state(false);

	// Usage state — seeded from the server load so the card renders with real
	// numbers on first paint (no loading flash). loadUsage() is kept only as a
	// manual-refresh path, invoked after a fresh API key is generated.
	// svelte-ignore state_referenced_locally
	let usageLoaded = $state(data.usage != null);
	// svelte-ignore state_referenced_locally
	let usedOps = $state(data.usage?.used ?? 0);
	// svelte-ignore state_referenced_locally
	let quotaOps = $state(data.usage?.quota ?? data.profile?.ops_limit ?? 30);

	// Third-party AI consent (default off; managed here, enforced when gen-AI ships).
	// Seeded from server data in onMount, then managed locally by the toggle.
	let aiOptin = $state(false);
	let aiSaving = $state(false);

	// Marketing email. Tracked as "emails on" rather than as the stored opt-out
	// flag so the switch reads the same way round as every other toggle here:
	// on means you get them. Inverted back to opt_out at submit time.
	let marketingOn = $state(true);
	let marketingSaving = $state(false);

	let isPro = $derived(data.profile?.plan === 'pro');
	let isSeller = $derived(data.profile?.plan === 'seller');
	let isDay = $derived(data.profile?.plan === 'day');
	// 'growth' was missing here, so growth subscribers were shown the upgrade CTA.
	let isGrowth = $derived(data.profile?.plan === 'growth');
	let isPaid = $derived(isPro || isSeller || isDay || isGrowth);

	// Bucket connection. Seeded from the server load so the card renders without
	// a client round-trip, then updated in place from each action's result —
	// the same pattern the API-key card uses. The secret access key is never
	// part of this state; the server only ever returns a masked key id.
	type BucketConnection = {
		connected: boolean;
		label?: string;
		provider?: 's3' | 'r2' | 'compatible';
		endpoint?: string | null;
		bucket?: string;
		region?: string;
		prefix?: string;
		forcePathStyle?: boolean;
		accessKeyIdMasked?: string;
		status?: 'unverified' | 'ok' | 'error';
		statusDetail?: string | null;
		lastVerifiedAt?: string | null;
	};
	// svelte-ignore state_referenced_locally
	let bucket = $state<BucketConnection>(data.bucket ?? { connected: false });
	let showBucketForm = $state(false);
	let bucketSaving = $state(false);
	let bucketVerifying = $state(false);
	let bucketDisconnecting = $state(false);
	let showBucketDisconnect = $state(false);
	let bucketError = $state<string | null>(null);
	let bucketProvider = $state<'s3' | 'r2' | 'compatible'>('s3');

	let bucketBusy = $derived(bucketSaving || bucketVerifying || bucketDisconnecting);

	function openBucketForm() {
		// Editing an existing connection pre-fills everything except the secret,
		// which the server keeps and reuses when the field is left blank.
		bucketProvider = bucket.provider ?? 's3';
		bucketError = null;
		showBucketForm = true;
		posthog.capture('bucket_connect_started', { editing: bucket.connected });
	}

	function relativeTime(iso: string | null | undefined): string {
		if (!iso) return 'never';
		const diff = Date.now() - new Date(iso).getTime();
		const mins = Math.round(diff / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.round(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		return `${Math.round(hours / 24)}d ago`;
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
		posthog.reset();
		window.location.href = '/';
	}

	let showDeleteConfirm = $state(false);
	let deleteConfirmText = $state('');
	let deleteLoading = $state(false);

	let canConfirmDelete = $derived(deleteConfirmText.trim().toLowerCase() === 'delete my account');

	onMount(() => {
		aiOptin = data.profile?.ai_thirdparty_optin === 1;
		marketingOn = data.profile?.marketing_opt_out !== 1;
		justUpgraded = new URLSearchParams(window.location.search).get('upgraded') === 'true';
	});

	let usagePercent = $derived(
		quotaOps > 0 ? Math.min(Math.round((usedOps / quotaOps) * 100), 100) : 0
	);
</script>

<svelte:head>
	<title>Dashboard — Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Top-only wash instead of the sitewide fixed BlobBackground (see the guide
     redesign): this is a long scrolling settings page, and a fixed blur that
     follows every scroll position reads as noise once you're past the stat
     cards. The wash fades out before the API Key card; everything below that
     sits on plain --mochi-bg, same as the guide pages. -->
<div class="relative flex min-h-screen flex-col">
	<div class="dash-wash" aria-hidden="true"></div>
	<Navigation />

	<main class="relative z-10 mx-auto w-full max-w-4xl grow px-4 py-12 sm:px-6">
		<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="min-w-0">
				<h1 class="text-3xl font-black tracking-tight text-[#4A2C2C]">Dashboard</h1>
				<p class="mt-1 truncate text-sm text-[#875F42]/60">{data.user?.email}</p>
			</div>
			<div class="flex items-center gap-2">
				<a
					href="/flow"
					class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-4 py-2 text-sm font-bold text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)] sm:flex-none"
				>
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13 7l5 5m0 0l-5 5m5-5H6"
						/></svg
					>
					Launch app
				</a>
				<button
					onclick={handleSignOut}
					class="flex-1 cursor-pointer rounded-xl border border-[#875F42]/15 px-4 py-2 text-sm font-bold text-[#875F42]/70 transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292] sm:flex-none"
				>
					Sign out
				</button>
			</div>
		</div>

		<!-- Post-checkout success banner -->
		{#if justUpgraded}
			<div
				class="mb-6 flex items-center gap-3 rounded-2xl border border-[#66BB6A]/30 bg-[#A5D6A7]/20 p-4"
			>
				<span class="text-sm font-black text-[#2E5C31]"
					>You're on {isSeller ? 'Seller' : 'Pro'}!</span
				>
				<span class="text-sm text-[#2E5C31]/70"
					>Your new limits are being applied — your usage numbers may take a minute or two to
					reflect the change.</span
				>
			</div>
		{/if}

		<!-- Stats row -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="dash-glass rounded-3xl p-6 shadow-sm">
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
						data-sveltekit-reload
						class="mt-2 inline-block text-xs font-bold text-[#F06292] hover:underline"
						>Upgrade to Pro →</a
					>
				{:else}
					<p class="text-2xl font-black text-[#4A2C2C]">Free</p>
					<a
						href="/api/checkout?plan=seller&billing=monthly"
						data-sveltekit-reload
						class="mt-2 inline-block text-xs font-bold text-[#F06292] hover:underline">Upgrade →</a
					>
				{/if}
			</div>
			<div class="dash-glass rounded-3xl p-6 shadow-sm">
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
							Resets {new Date(data.profile.quota_period_end).toLocaleDateString(undefined, {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							})}
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
						data-sveltekit-reload
						class="rounded-2xl border border-[#875F42]/20 px-5 py-2.5 text-sm font-black text-[#4A2C2C] transition-all hover:border-[#F06292]/40 hover:bg-white/60 hover:text-[#F06292]"
					>
						Seller — $7.99/mo <span class="font-normal text-[#875F42]/50">· 300 images</span>
					</a>
					<a
						href="/api/checkout?plan=pro&billing=monthly"
						data-sveltekit-reload
						class="rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-5 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
					>
						Pro — $24.99/mo <span class="font-normal opacity-80">· 1,200 images</span>
					</a>
				</div>
			</div>
		{:else if isSeller}
			<div
				class="mb-6 flex flex-col gap-4 rounded-3xl border border-[#F06292]/15 bg-gradient-to-br from-[#FFF0F5] to-[#FFF8F0] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
			>
				<div>
					<p class="text-base font-black text-[#4A2C2C]">Upgrade to Pro, 1,200 images a month</p>
					<p class="mt-0.5 text-sm text-[#875F42]/60">4× the images, top priority queue.</p>
				</div>
				<a
					href="/api/checkout?plan=pro&billing=monthly"
					data-sveltekit-reload
					class="flex-shrink-0 self-start rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-5 py-2.5 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] sm:self-auto"
				>
					Upgrade to Pro
				</a>
			</div>
		{/if}

		<!-- API Key card -->
		<div class="dash-card mb-6 rounded-3xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h2 class="text-lg font-black text-[#4A2C2C]">API Key</h2>
					<p class="mt-0.5 text-xs text-[#875F42]/60">
						Use this key from the web app, CLI, or curl
					</p>
				</div>
				{#if hasKey}
					<form
						method="POST"
						action="?/regenerateKey"
						use:enhance={() => {
							keyLoading = true;
							newKeyPlaintext = null;
							return async ({ result }) => {
								keyLoading = false;
								const d =
									result.type === 'success'
										? (result.data as { apiKey?: string; createdAt?: string } | undefined)
										: undefined;
								if (d?.apiKey) {
									newKeyPlaintext = d.apiKey;
									keyCreatedAt = d.createdAt ?? new Date().toISOString();
									posthog.capture('api_key_created', { action: 'regenerate' });
								}
							};
						}}
					>
						<button
							type="submit"
							disabled={keyLoading}
							class="text-xs font-bold text-[#875F42]/60 transition-colors hover:text-[#F06292] disabled:opacity-40"
						>
							{keyLoading ? 'Regenerating…' : 'Regenerate'}
						</button>
					</form>
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
				<div
					class="flex flex-col gap-1 rounded-2xl border border-white/60 bg-white/40 p-4 sm:flex-row sm:items-center sm:gap-3"
				>
					<code class="min-w-0 flex-1 truncate font-mono text-sm text-[#875F42]/60"
						>••••••••••••••••••••••••••••••••</code
					>
					{#if keyCreatedAt}
						<span class="flex-shrink-0 text-xs text-[#875F42]/40"
							>Created {new Date(keyCreatedAt).toLocaleDateString()}</span
						>
					{/if}
				</div>
			{:else}
				<div class="py-4 text-center">
					<p class="mb-4 text-sm text-[#875F42]/60">
						No API key yet. Generate one to start using authenticated processing.
					</p>
					<form
						method="POST"
						action="?/generateKey"
						use:enhance={() => {
							keyLoading = true;
							newKeyPlaintext = null;
							return async ({ result }) => {
								keyLoading = false;
								const d =
									result.type === 'success'
										? (result.data as { apiKey?: string; createdAt?: string } | undefined)
										: undefined;
								if (d?.apiKey) {
									newKeyPlaintext = d.apiKey;
									hasKey = true;
									keyCreatedAt = d.createdAt ?? new Date().toISOString();
									posthog.capture('api_key_created', { action: 'generate' });
									loadUsage();
								}
							};
						}}
					>
						<button
							type="submit"
							disabled={keyLoading}
							class="cursor-pointer rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] disabled:transform-none disabled:opacity-60"
						>
							{keyLoading ? 'Generating…' : 'Generate API key'}
						</button>
					</form>
				</div>
			{/if}

			<div class="mt-4 border-t border-[#875F42]/8 pt-4">
				<p class="font-mono text-xs break-all text-[#875F42]/50">
					curl -H "Authorization: Bearer &lt;key&gt;" -X POST https://api.mochify.app/v1/squish ...
				</p>
			</div>
		</div>

		<!-- Third-party AI consent -->
		<div class="dash-card mb-6 rounded-3xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<h2 class="font-black text-[#4A2C2C]">Third-party AI features</h2>
						<span
							class="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase {aiOptin
								? 'bg-[#A5D6A7]/30 text-[#2E5C31]'
								: 'bg-[#FFF0F5] text-mochi-pink'}"
						>
							{aiOptin ? 'Enabled' : 'Off'}
						</span>
					</div>
					<p class="mt-1 text-sm text-[#875F42]/60">
						Lets Mochify send your images to third-party AI providers for upcoming generative
						features (e.g. AI-generated backgrounds).
						<strong class="font-bold text-[#875F42]/80">Off by default</strong> — your images are never
						sent to a third party without this, and you can revoke it anytime.
					</p>
				</div>
				<form
					method="POST"
					action="?/setAiOptin"
					class="shrink-0 pt-1"
					use:enhance={() => {
						const desired = !aiOptin;
						aiSaving = true;
						return async ({ result }) => {
							aiSaving = false;
							if (result.type === 'success') {
								aiOptin = desired;
								posthog.capture('ai_thirdparty_optin_changed', { optin: desired });
							}
						};
					}}
				>
					<input type="hidden" name="optin" value={aiOptin ? '0' : '1'} />
					<button
						type="submit"
						role="switch"
						aria-checked={aiOptin}
						aria-label="Toggle third-party AI features"
						disabled={aiSaving}
						class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 {aiOptin
							? 'bg-[#66BB6A]'
							: 'bg-[#875F42]/20'}"
					>
						<span
							class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform {aiOptin
								? 'translate-x-[22px]'
								: 'translate-x-0.5'}"
						></span>
					</button>
				</form>
			</div>
			<p class="mt-3 text-xs text-[#875F42]/40">
				{aiOptin
					? 'Generative features may process your images via third parties.'
					: "All processing stays on Mochify's own in-memory pipeline — nothing leaves to a third party."}
			</p>
		</div>

		<!-- Marketing email preference -->
		<div class="dash-card mb-6 rounded-3xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<h2 class="font-black text-[#4A2C2C]">Offers and reminders</h2>
						<span
							class="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase {marketingOn
								? 'bg-[#A5D6A7]/30 text-[#2E5C31]'
								: 'bg-[#FFF0F5] text-mochi-pink'}"
						>
							{marketingOn ? 'On' : 'Off'}
						</span>
					</div>
					<p class="mt-1 text-sm text-[#875F42]/60">
						Occasional email about upgrades and discounts, such as a reminder if you start setting
						up a plan and do not finish.
						<strong class="font-bold text-[#875F42]/80">Never more than a couple a month.</strong>
						Turning this off never affects account email like sign-in links and receipts.
					</p>
				</div>
				<form
					method="POST"
					action="?/setMarketingOptOut"
					class="shrink-0 pt-1"
					use:enhance={() => {
						const desired = !marketingOn;
						marketingSaving = true;
						return async ({ result }) => {
							marketingSaving = false;
							if (result.type === 'success') {
								marketingOn = desired;
								posthog.capture('marketing_optout_changed', { opt_out: !desired });
							}
						};
					}}
				>
					<input type="hidden" name="opt_out" value={marketingOn ? '1' : '0'} />
					<button
						type="submit"
						role="switch"
						aria-checked={marketingOn}
						aria-label="Toggle offers and reminders email"
						disabled={marketingSaving}
						class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 {marketingOn
							? 'bg-[#66BB6A]'
							: 'bg-[#875F42]/20'}"
					>
						<span
							class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform {marketingOn
								? 'translate-x-[22px]'
								: 'translate-x-0.5'}"
						></span>
					</button>
				</form>
			</div>
			<p class="mt-3 text-xs text-[#875F42]/40">
				{marketingOn
					? 'You can also unsubscribe from the link in any of these emails.'
					: 'You will not receive offers or reminders. Sign-in links and receipts still arrive.'}
			</p>
		</div>

		<!-- Connections -->
		<div class="dash-card mb-6 rounded-3xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h2 class="font-black text-[#4A2C2C]">Connections</h2>
					<p class="mt-0.5 text-xs text-cocoa-milk/60">
						Connect external services to your workflow
					</p>
				</div>
			</div>

			<!-- Stacks on mobile. As a single row the 32px logo and the action button
			     are both shrink-0, so everything they take comes out of the text column,
			     which collapsed to one word per line on a phone. -->
			<div
				class="flex flex-col gap-3 rounded-2xl border border-cocoa-milk/8 bg-white/40 p-4 sm:flex-row sm:items-center sm:gap-4"
			>
				<div class="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
					<!-- Google Drive tri-color logo -->
					<div class="shrink-0">
						<svg
							width="32"
							height="28"
							viewBox="0 0 87.3 78"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
								fill="#0066da"
							/>
							<path
								d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
								fill="#00ac47"
							/>
							<path
								d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
								fill="#ea4335"
							/>
							<path
								d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
								fill="#00832d"
							/>
							<path
								d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
								fill="#2684fc"
							/>
							<path
								d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
								fill="#ffba00"
							/>
						</svg>
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<p class="text-sm font-black text-[#4A2C2C]">Google Drive</p>
							<span
								class="rounded-full bg-[#FFF0F5] px-2 py-0.5 text-[10px] font-bold tracking-wide text-mochi-pink uppercase"
							>
								Coming soon
							</span>
						</div>
						<p class="mt-0.5 text-xs text-cocoa-milk/60">
							Upload from Drive → process through Mochify → save back to Drive. Zero retention. Your
							images never touch our storage.
						</p>
					</div>
				</div>

				<button
					disabled
					class="shrink-0 cursor-not-allowed self-start rounded-xl border border-cocoa-milk/15 px-4 py-2 text-xs font-bold text-cocoa-milk/30 sm:self-auto"
				>
					Connect
				</button>
			</div>

			<div
				class="mt-3 flex flex-col gap-3 rounded-2xl border border-cocoa-milk/8 bg-white/40 p-4 sm:flex-row sm:items-center sm:gap-4"
			>
				<div class="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
					<!-- Bring your own bucket -->
					<div class="shrink-0">
						<svg
							width="32"
							height="28"
							viewBox="0 0 32 32"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								d="M5 8h22l-2.2 18.4a3 3 0 0 1-3 2.6H10.2a3 3 0 0 1-3-2.6L5 8Z"
								fill="#FFF0F5"
								stroke="#F06292"
								stroke-width="1.8"
								stroke-linejoin="round"
							/>
							<path
								d="M8.5 8a7.5 4 0 0 1 15 0"
								fill="none"
								stroke="#F06292"
								stroke-width="1.8"
								stroke-linecap="round"
							/>
							<path
								d="M11 14.5l3 3-3 3M18 14.5l3 3-3 3"
								stroke="#F06292"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<p class="text-sm font-black text-[#4A2C2C]">Bring your own bucket</p>
							{#if bucket.connected}
								<span
									class="h-2 w-2 shrink-0 rounded-full {bucket.status === 'ok'
										? 'bg-[#66BB6A]'
										: bucket.status === 'error'
											? 'bg-red-400'
											: 'bg-amber-400'}"
									aria-hidden="true"
								></span>
								<span class="text-[10px] font-bold tracking-wide text-cocoa-milk/50 uppercase">
									{bucket.status === 'ok'
										? `Verified ${relativeTime(bucket.lastVerifiedAt)}`
										: bucket.status === 'error'
											? 'Needs attention'
											: 'Not verified'}
								</span>
							{:else if !isPaid}
								<span
									class="rounded-full bg-[#FFF0F5] px-2 py-0.5 text-[10px] font-bold tracking-wide text-mochi-pink uppercase"
								>
									Paid plans
								</span>
							{/if}
						</div>

						{#if bucket.connected}
							<p class="mt-0.5 truncate text-xs text-cocoa-milk/60">
								<span class="font-bold text-[#4A2C2C]">{bucket.bucket}</span>{bucket.prefix
									? `/${bucket.prefix}`
									: ''} · <span class="font-mono">{bucket.accessKeyIdMasked}</span>
							</p>
							{#if bucket.status === 'error' && bucket.statusDetail}
								<p class="mt-1 text-xs font-medium text-red-600/80">{bucket.statusDetail}</p>
							{:else if bucket.status === 'ok'}
								<p class="mt-1 text-[11px] text-cocoa-milk/40">
									Connected and writable. Processing straight to your bucket arrives next.
								</p>
							{/if}
						{:else}
							<p class="mt-0.5 text-xs text-cocoa-milk/60">
								Point Mochify at your own S3, R2, or S3-compatible bucket. Your keys are stored
								encrypted and only ever used on your behalf.
							</p>
						{/if}
					</div>
				</div>

				{#if !isPaid}
					<a
						href="/pricing"
						class="shrink-0 self-start rounded-xl border border-mochi-pink/30 px-4 py-2 text-xs font-bold text-mochi-pink transition-all hover:bg-[#FFF0F5] sm:self-auto"
					>
						Upgrade
					</a>
				{:else if !bucket.connected}
					<button
						onclick={openBucketForm}
						disabled={showBucketForm}
						class="shrink-0 cursor-pointer self-start rounded-xl border border-cocoa-milk/15 px-4 py-2 text-xs font-bold text-[#4A2C2C] transition-all hover:border-mochi-pink/40 hover:text-mochi-pink disabled:opacity-40 sm:self-auto"
					>
						Connect
					</button>
				{:else if showBucketDisconnect}
					<div class="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
						<span class="text-xs font-bold text-[#4A2C2C]">Remove credentials?</span>
						<form
							method="POST"
							action="?/disconnectBucket"
							use:enhance={() => {
								bucketDisconnecting = true;
								bucketError = null;
								return async ({ result }) => {
									bucketDisconnecting = false;
									if (result.type === 'success') {
										bucket = { connected: false };
										showBucketDisconnect = false;
										showBucketForm = false;
										posthog.capture('bucket_disconnected');
									} else if (result.type === 'failure') {
										bucketError = (result.data?.error as string) ?? 'Could not disconnect.';
									}
								};
							}}
						>
							<button
								type="submit"
								disabled={bucketDisconnecting}
								class="cursor-pointer rounded-xl border border-red-300/60 px-3 py-2 text-xs font-bold text-red-600/80 transition-all hover:bg-red-50/60 disabled:opacity-50"
							>
								{bucketDisconnecting ? 'Removing…' : 'Yes, disconnect'}
							</button>
						</form>
						<button
							onclick={() => (showBucketDisconnect = false)}
							class="cursor-pointer text-xs font-bold text-cocoa-milk/50 transition-colors hover:text-[#4A2C2C]"
						>
							Keep
						</button>
					</div>
				{:else}
					<div class="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
						<form
							method="POST"
							action="?/verifyBucket"
							use:enhance={() => {
								bucketVerifying = true;
								bucketError = null;
								return async ({ result }) => {
									bucketVerifying = false;
									if (result.type === 'success' && result.data?.bucket) {
										bucket = result.data.bucket as BucketConnection;
										if (bucket.status !== 'ok') {
											posthog.capture('bucket_verify_failed', {
												provider: bucket.provider,
												reason: bucket.statusDetail
											});
										}
									} else if (result.type === 'failure') {
										bucketError =
											(result.data?.error as string) ?? 'Could not test the connection.';
									}
								};
							}}
						>
							<button
								type="submit"
								disabled={bucketBusy}
								class="cursor-pointer rounded-xl border border-cocoa-milk/15 px-3 py-2 text-xs font-bold text-[#4A2C2C] transition-all hover:border-mochi-pink/40 hover:text-mochi-pink disabled:opacity-40"
							>
								{bucketVerifying ? 'Testing…' : 'Test'}
							</button>
						</form>
						<button
							onclick={openBucketForm}
							disabled={bucketBusy || showBucketForm}
							class="cursor-pointer rounded-xl border border-cocoa-milk/15 px-3 py-2 text-xs font-bold text-[#4A2C2C] transition-all hover:border-mochi-pink/40 hover:text-mochi-pink disabled:opacity-40"
						>
							Edit
						</button>
						<button
							onclick={() => (showBucketDisconnect = true)}
							disabled={bucketBusy}
							class="cursor-pointer rounded-xl px-2 py-2 text-xs font-bold text-red-600/50 transition-colors hover:text-red-700 disabled:opacity-40"
						>
							Disconnect
						</button>
					</div>
				{/if}
			</div>

			{#if bucketError}
				<p class="mt-2 px-1 text-xs font-medium text-red-600/80">{bucketError}</p>
			{/if}

			<!-- Connect / edit form. Inline disclosure rather than a modal, matching
			     the delete-account flow further down the page. -->
			{#if showBucketForm && isPaid}
				<form
					method="POST"
					action="?/saveBucket"
					class="mt-3 rounded-2xl border border-cocoa-milk/8 bg-white/40 p-4"
					use:enhance={() => {
						bucketSaving = true;
						bucketError = null;
						return async ({ result }) => {
							bucketSaving = false;
							if (result.type === 'success' && result.data?.bucket) {
								bucket = result.data.bucket as BucketConnection;
								showBucketForm = false;
								posthog.capture('bucket_connect_saved', {
									provider: bucket.provider,
									status: bucket.status
								});
								if (bucket.status !== 'ok') {
									posthog.capture('bucket_verify_failed', {
										provider: bucket.provider,
										reason: bucket.statusDetail
									});
								}
							} else if (result.type === 'failure') {
								bucketError = (result.data?.error as string) ?? 'Could not save the connection.';
							}
						};
					}}
				>
					<div class="grid gap-3 sm:grid-cols-2">
						<label class="block">
							<span
								class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
							>
								Provider
							</span>
							<select
								name="provider"
								bind:value={bucketProvider}
								class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 text-sm text-[#4A2C2C] focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
							>
								<option value="s3">Amazon S3</option>
								<option value="r2">Cloudflare R2</option>
								<option value="compatible">S3-compatible</option>
							</select>
						</label>

						<label class="block">
							<span
								class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
							>
								Bucket
							</span>
							<input
								name="bucket"
								required
								value={bucket.bucket ?? ''}
								placeholder="my-store-images"
								class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
							/>
						</label>

						{#if bucketProvider === 's3'}
							<label class="block">
								<span
									class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
								>
									Region
								</span>
								<input
									name="region"
									required
									value={bucket.region ?? ''}
									placeholder="eu-west-2"
									class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
								/>
							</label>
						{:else}
							<label class="block">
								<span
									class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
								>
									Endpoint
								</span>
								<input
									name="endpoint"
									required
									value={bucket.endpoint ?? ''}
									placeholder={bucketProvider === 'r2'
										? 'https://abc123.r2.cloudflarestorage.com'
										: 'https://s3.example.com'}
									class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
								/>
							</label>
						{/if}

						<label class="block">
							<span
								class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
							>
								Prefix <span class="font-medium text-cocoa-milk/30 normal-case">optional</span>
							</span>
							<input
								name="prefix"
								value={bucket.prefix ?? ''}
								placeholder="product-photos/"
								class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
							/>
						</label>

						<label class="block">
							<span
								class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
							>
								Access key ID
							</span>
							<input
								name="accessKeyId"
								autocomplete="off"
								required={!bucket.connected}
								placeholder={bucket.connected
									? `Leave blank to keep ${bucket.accessKeyIdMasked}`
									: 'AKIA…'}
								class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 font-mono text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
							/>
						</label>

						<label class="block">
							<span
								class="mb-1 block text-[11px] font-bold tracking-wide text-cocoa-milk/50 uppercase"
							>
								Secret access key
							</span>
							<input
								name="secretAccessKey"
								type="password"
								autocomplete="off"
								required={!bucket.connected}
								placeholder={bucket.connected ? 'Leave blank to keep current' : '••••••••••••'}
								class="w-full rounded-xl border border-cocoa-milk/15 bg-white/70 px-3 py-2 font-mono text-sm text-[#4A2C2C] placeholder:text-[#875F42]/30 focus:border-mochi-pink/40 focus:ring-2 focus:ring-[#F06292]/15 focus:outline-none"
							/>
						</label>
					</div>

					{#if bucketProvider === 'compatible'}
						<label class="mt-3 flex cursor-pointer items-center gap-2">
							<input
								name="forcePathStyle"
								type="checkbox"
								checked={bucket.forcePathStyle ?? false}
								class="h-4 w-4 rounded border-cocoa-milk/20 accent-[#F06292]"
							/>
							<span class="text-xs text-cocoa-milk/60">
								Use path-style addressing (needed by MinIO and some self-hosted setups)
							</span>
						</label>
					{/if}

					<p class="mt-3 text-[11px] text-cocoa-milk/40">
						Saving runs a read and write check against the bucket. The key needs
						<span class="font-mono">s3:ListBucket</span>,
						<span class="font-mono">s3:GetObject</span>,
						<span class="font-mono">s3:PutObject</span>, and
						<span class="font-mono">s3:DeleteObject</span> on this prefix.
					</p>

					<div class="mt-4 flex flex-wrap items-center gap-3">
						<button
							type="submit"
							disabled={bucketSaving}
							class="cursor-pointer rounded-xl bg-[#A5D6A7] px-4 py-2 text-xs font-black text-[#2E5C31] transition-all hover:bg-[#94cc96] disabled:opacity-50"
						>
							{bucketSaving ? 'Testing connection…' : 'Save and test'}
						</button>
						<button
							type="button"
							onclick={() => {
								showBucketForm = false;
								bucketError = null;
							}}
							class="cursor-pointer text-xs font-bold text-cocoa-milk/50 transition-colors hover:text-[#4A2C2C]"
						>
							Cancel
						</button>
					</div>
				</form>
			{/if}
		</div>

		<!-- Delete account — deliberately not a peer card. A red "Danger zone"
		     card matching every other card's size and weight made it the
		     loudest thing on the page: red is the highest-contrast color
		     against an otherwise pink/cream/white palette, exactly backwards
		     from wanting people to walk past this. Danger styling now only
		     appears once someone has actually opted into the confirm step —
		     the ambient state is a quiet text link, matching the muted
		     account-utility tone rather than competing with the cards above. -->
		<div class="border-t border-[rgba(0,0,0,0.06)] pt-6">
			{#if !showDeleteConfirm}
				<p class="text-sm text-[#875F42]/50">
					Want to leave?
					<button
						onclick={() => {
							showDeleteConfirm = true;
						}}
						class="cursor-pointer font-semibold text-[#875F42]/70 underline decoration-[#875F42]/30 underline-offset-2 transition-colors hover:text-[#4A2C2C]"
					>
						Delete your account
					</button>
					 and all associated data.
				</p>
			{:else}
				<div class="dash-card space-y-3 rounded-3xl border border-red-200/60 p-6">
					<h2 class="font-black text-red-700/80">Delete account</h2>
					<p class="text-sm text-[#875F42]/60">
						Your account is deactivated immediately and permanently deleted after 14 days —
						signing in again within that window cancels the deletion.
					</p>
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

<style>
	/* Top-only wash, same recipe as the guide redesign: absolute (scrolls away
	   with the page, unlike the old fixed BlobBackground), full-bleed via the
	   100vw + translateX trick, faded out before the settings cards start. */
	.dash-wash {
		/* Unlike the guide pages' hero-wash, this sits directly in the
		   full-width page wrapper, not inside a max-w-* column — so it never
		   needs to break out via 100vw. left/right: 0 already spans exactly
		   the parent's width. 100vw would count the vertical scrollbar's own
		   width as part of the viewport, making this a few pixels wider than
		   the page and causing a permanent horizontal scrollbar on any
		   browser with a space-reserving (non-overlay) scrollbar. */
		position: absolute;
		top: -20rem;
		left: 0;
		right: 0;
		height: 1100px;
		z-index: -1;
		pointer-events: none;
		background:
			radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.4) 0%, transparent 70%),
			radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.32) 0%, transparent 70%),
			radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.25) 0%, transparent 70%);
		mask-image: linear-gradient(to bottom, black 0%, black 45%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, black 45%, transparent 100%);
	}

	@media (max-width: 768px) {
		.dash-wash {
			height: 900px;
			background:
				radial-gradient(ellipse 60% 45% at 12% 8%, rgba(255, 179, 198, 0.22) 0%, transparent 70%),
				radial-gradient(ellipse 50% 40% at 90% 18%, rgba(224, 172, 213, 0.16) 0%, transparent 70%),
				radial-gradient(ellipse 45% 35% at 55% 55%, rgba(255, 214, 224, 0.12) 0%, transparent 70%);
		}
	}

	/* Glass tier — the two at-a-glance stat cards (Plan, Images this month).
	   Fully self-contained like GlassPanel: no Tailwind border/bg utilities on
	   these elements, so there is nothing for this to fight in the cascade. */
	.dash-glass {
		background: #fff9fa;
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow:
			0 8px 32px 0 rgba(240, 98, 146, 0.12),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
			inset 0 -1px 0 0 rgba(255, 255, 255, 0.2);
	}

	@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
		.dash-glass {
			background: linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.55) 0%,
				rgba(255, 255, 255, 0.25) 100%
			);
			backdrop-filter: blur(20px);
			-webkit-backdrop-filter: blur(20px);
		}
	}

	/* Flat tier — API key, toggles, connections, account deletion: anywhere
	   holding a sensitive action or data readers need to trust at a glance.
	   Frosted glass lowers contrast, which is the wrong trade here, so this
	   only sets an opaque fill. Border/shadow stay as ordinary Tailwind
	   utilities on each element (border-cocoa-milk/10, border-red-200/60 for
	   the danger zone) — .dash-card must never set border-color itself: this
	   is a plain unscoped class in a component <style> block, so it beats
	   Tailwind's layered utilities regardless of source order, and would
	   silently override the danger zone's red border if it tried. */
	.dash-card {
		background-color: #ffffff;
	}
</style>
