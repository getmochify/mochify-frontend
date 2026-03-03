<script lang="ts">
	import './layout.css';

	let { children } = $props();

	// Import Outfit (Weights: 600, 700, 800, 900)
	import '@fontsource/outfit/600.css';
	import '@fontsource/outfit/700.css';
	import '@fontsource/outfit/800.css';
	import '@fontsource/outfit/900.css';

	// Import Quicksand (Weights: 400, 500, 600, 700)
	import '@fontsource/quicksand/400.css';
	import '@fontsource/quicksand/500.css';
	import '@fontsource/quicksand/600.css';
	import '@fontsource/quicksand/700.css';
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Mochify" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="dns-prefetch" href="https://api.mochify.xyz">
	<link rel="preconnect" href="https://api.mochify.xyz" crossorigin="anonymous">

	<script
		async
		defer
		src="https://analytics.mochify.xyz/script.js"
		data-website-id="f1d3e4ff-16c4-4b0f-b876-671cd2191ae0"
		data-host-url="https://analytics.mochify.xyz"
		data-domains="mochify.xyz"
	></script>

	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Mochify",
		"url": "https://mochify.xyz",
		"sameAs": [
			"https://github.com/getmochify/mochify-cli",
			"https://github.com/getmochify/mochify-cli",
			"https://github.com/getmochify/mochify-docker",
			"https://hub.docker.com/r/mochify/mochify-lite",
			"https://x.com/GetMochify"
		]
	}
	</script>
</svelte:head>

<div class="min-h-screen flex flex-col">
	{@render children()}
</div>
