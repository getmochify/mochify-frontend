<script lang="ts">
	import { enhance } from '$app/forms';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data, form } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Unsubscribe | Mochify</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Navigation />

<main class="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 py-20">
	<div class="card-mochi p-8 text-center">
		{#if form?.done}
			<h1 class="mb-3 font-heading text-2xl font-black text-[#4A2C2C]">You're unsubscribed</h1>
			<p class="text-sm font-medium text-[#875F42]">
				We won't send you any more offers or reminders. You'll still get essential account email
				like sign-in links and payment receipts.
			</p>
			<a href="/" class="btn-mochi mt-6 inline-block px-6 py-3 text-sm font-bold">Back to Mochify</a
			>
		{:else if !data.valid}
			<h1 class="mb-3 font-heading text-2xl font-black text-[#4A2C2C]">This link isn't valid</h1>
			<p class="text-sm font-medium text-[#875F42]">
				It may have been copied incompletely. Email
				<a href="mailto:hello@mochify.app" class="font-bold text-[#F06292]">hello@mochify.app</a>
				and we'll take you off the list by hand.
			</p>
		{:else}
			<h1 class="mb-3 font-heading text-2xl font-black text-[#4A2C2C]">Unsubscribe from offers?</h1>
			<p class="mb-6 text-sm font-medium text-[#875F42]">
				You'll stop receiving upgrade offers and reminders. Essential account email, like sign-in
				links and payment receipts, will keep arriving.
			</p>

			{#if form?.error}
				<p class="mb-4 text-sm font-bold text-[#F06292]">{form.error}</p>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<input type="hidden" name="token" value={data.token} />
				<button
					type="submit"
					disabled={loading}
					class="btn-mochi w-full px-6 py-3 text-sm font-bold disabled:opacity-60"
				>
					{loading ? 'Updating…' : 'Yes, unsubscribe me'}
				</button>
			</form>
		{/if}
	</div>
</main>

<Footer />
