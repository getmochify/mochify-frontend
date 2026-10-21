<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { posthog } from '$lib/analytics';
	import { getSessionToken } from '$lib/user';
	import { METHODS, runMethod, type Method, type RunResult } from '$lib/betaUpload';

	const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.app';

	let file: File | null = $state(null);
	let selected: Record<Method, boolean> = $state({
		'ws-64k': true,
		'ws-64k-w64': true,
		'http-5m': true,
		'http-256k': true
	});
	let rounds = $state(1);
	let dropEvery = $state(0);
	let processResult = $state(false);
	let outputType = $state('webp');

	let token: string | null = $state(null);
	let authChecked = $state(false);
	let network = $state('');

	let running = $state(false);
	let current = $state('');
	let progress = $state(0);
	let results: (RunResult & { round: number })[] = $state([]);
	let log: string[] = $state([]);
	let controller: AbortController | null = null;
	let copied = $state(false);

	onMount(async () => {
		token = await getSessionToken().catch(() => null);
		authChecked = true;
		// Chromium only; a hint, not a measurement.
		const c = (
			navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }
		).connection;
		if (c?.effectiveType) network = `${c.effectiveType}, ~${c.downlink} Mbps reported`;
	});

	const fmtBytes = (n: number) =>
		n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
	const mbps = (r: RunResult) => ((r.bytes * 8) / 1e6 / (r.ms / 1000)).toFixed(1);
	const label = (m: Method) => METHODS.find((x) => x.id === m)?.label ?? m;
	const stamp = () => new Date().toISOString().slice(11, 19);
	const addLog = (line: string) => (log = [...log.slice(-300), `${stamp()} ${line}`]);

	function pick(e: Event) {
		file = (e.currentTarget as HTMLInputElement).files?.[0] ?? null;
	}

	async function run() {
		if (!file) return;
		const methods = METHODS.map((m) => m.id).filter((id) => selected[id]);
		if (!methods.length) return;
		running = true;
		results = [];
		log = [];
		controller = new AbortController();
		addLog(`file ${file.name.slice(-40)} ${fmtBytes(file.size)}${network ? `, ${network}` : ''}`);
		try {
			// Rotate the starting method each round so none always runs first, on
			// a cold connection or ahead of a link that is degrading over time.
			for (let round = 1; round <= rounds; round++) {
				const order = methods.map((_, i) => methods[(i + round - 1) % methods.length]);
				for (const method of order) {
					if (controller.signal.aborted) return;
					current = `${label(method)}${rounds > 1 ? `, round ${round}/${rounds}` : ''}`;
					progress = 0;
					const result = await runMethod(method, {
						apiUrl: API_URL,
						token,
						file,
						process: processResult,
						params: processResult ? { type: outputType } : {},
						dropEvery,
						onProgress: (o) => (progress = file ? o / file.size : 0),
						onLog: addLog,
						signal: controller.signal
					});
					results = [...results, { ...result, round }];
					addLog(
						`${method}: ${result.ok ? 'ok' : 'FAILED'} in ${(result.ms / 1000).toFixed(1)}s, ` +
							`${result.reconnects} retries${result.error ? `, ${result.error}` : ''}`
					);
					posthog.capture('beta_upload_run', {
						method,
						ok: result.ok,
						bytes: result.bytes,
						ms: result.ms,
						reconnects: result.reconnects,
						bytes_attempted: result.bytesAttempted,
						forced_drop_every: dropEvery,
						processed: processResult,
						signed_in: !!token,
						network: network || undefined,
						error: result.error
					});
				}
			}
		} finally {
			running = false;
			current = '';
			controller = null;
		}
	}

	function cancel() {
		controller?.abort();
	}

	function download(r: RunResult) {
		if (!r.output) return;
		const url = URL.createObjectURL(r.output);
		const a = document.createElement('a');
		a.href = url;
		a.download = `beta-${r.method}.${(r.outputType ?? '').split('/')[1] ?? 'bin'}`;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function copyResults() {
		const summary = {
			file_bytes: file?.size,
			network: network || null,
			forced_drop_every: dropEvery,
			signed_in: !!token,
			results: results.map((r) => ({ ...r, output: undefined }))
		};
		await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Upload test (beta) | Mochify</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<Navigation />

	<main class="relative z-10 mx-auto w-full max-w-3xl grow px-4 py-12 sm:px-6">
		<p class="text-xs font-black tracking-widest text-[#F06292] uppercase">Beta test</p>
		<h1 class="mt-1 text-3xl font-black text-[#4A2C2C]">Upload transport test</h1>
		<p class="mt-3 text-sm text-[#875F42]">
			Uploads one file through each transport on your current connection and reports how each did.
			Most useful on the connection that gives you trouble: patchy Wi-Fi, a train, a weak mobile
			signal. Nothing is processed or stored unless you tick the box below, so a run is free.
		</p>

		<section class="mt-8 space-y-5 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
			<div>
				<label class="text-sm font-bold text-[#4A2C2C]" for="file">Image</label>
				<input
					id="file"
					type="file"
					accept="image/*"
					onchange={pick}
					disabled={running}
					class="mt-2 block w-full text-sm text-[#875F42] file:mr-3 file:rounded-xl file:border-0 file:bg-[#FFF0F3] file:px-4 file:py-2 file:font-bold file:text-[#F06292]"
				/>
				{#if file}
					<p class="mt-1 text-xs text-[#875F42]/70">
						{fmtBytes(file.size)}. Larger files show the differences better.
					</p>
				{/if}
			</div>

			<fieldset>
				<legend class="text-sm font-bold text-[#4A2C2C]">Transports</legend>
				{#each METHODS as m (m.id)}
					<label class="mt-2 flex items-center gap-2 text-sm text-[#4A2C2C]">
						<input type="checkbox" bind:checked={selected[m.id]} disabled={running} />
						{m.label}
						<span class="text-xs text-[#875F42]/70">{m.note}</span>
					</label>
				{/each}
			</fieldset>

			<div class="grid gap-4 sm:grid-cols-2">
				<label class="text-sm font-bold text-[#4A2C2C]">
					Rounds
					<select
						bind:value={rounds}
						disabled={running}
						class="mt-1 block w-full rounded-xl border-pink-100 text-sm font-normal"
					>
						<option value={1}>1</option>
						<option value={3}>3</option>
						<option value={5}>5</option>
					</select>
				</label>
				<label class="text-sm font-bold text-[#4A2C2C]">
					Simulated drops
					<select
						bind:value={dropEvery}
						disabled={running}
						class="mt-1 block w-full rounded-xl border-pink-100 text-sm font-normal"
					>
						<option value={0}>None, real network only</option>
						<option value={1048576}>Every 1 MB</option>
						<option value={2097152}>Every 2 MB</option>
					</select>
				</label>
			</div>
			{#if dropEvery}
				<p class="-mt-2 text-xs text-[#875F42]/70">
					Simulated drops check that each transport recovers; they cut the connection instantly, so
					they say little about speed. 5 MB chunks cannot finish when drops come more often than
					every 5 MB, just as on a real link that drops that often. Real-network runs are the ones
					that compare speed.
				</p>
			{/if}

			<div>
				<label class="flex items-center gap-2 text-sm text-[#4A2C2C]">
					<input type="checkbox" bind:checked={processResult} disabled={running} />
					Process the result too
					<span class="text-xs text-[#875F42]/70">uses 1 operation per transport per round</span>
				</label>
				{#if processResult}
					<select
						bind:value={outputType}
						disabled={running}
						class="mt-2 rounded-xl border-pink-100 text-sm"
					>
						<option value="webp">WebP</option>
						<option value="avif">AVIF</option>
						<option value="jpg">JPEG</option>
					</select>
				{/if}
			</div>

			<div class="flex flex-wrap items-center gap-3">
				{#if running}
					<button
						onclick={cancel}
						class="rounded-2xl border border-[#875F42]/20 px-5 py-2.5 text-sm font-black text-[#4A2C2C]"
					>
						Cancel
					</button>
					<span class="text-sm text-[#875F42]">{current}: {Math.round(progress * 100)}%</span>
				{:else}
					<button
						onclick={run}
						disabled={!file}
						class="rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-5 py-2.5 text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] disabled:opacity-50"
					>
						Run test
					</button>
				{/if}
				{#if authChecked}
					<span class="text-xs text-[#875F42]/70">
						{token
							? 'Signed in'
							: 'Not signed in: uses your guest allowance, which must not be used up'}
					</span>
				{/if}
			</div>
			{#if running}
				<div class="h-2 overflow-hidden rounded-full bg-[#FFF0F3]">
					<div class="h-full bg-[#F06292] transition-all" style="width: {progress * 100}%"></div>
				</div>
			{/if}
		</section>

		{#if results.length}
			<section
				class="mt-8 overflow-x-auto rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
			>
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-black text-[#4A2C2C]">Results</h2>
					<button onclick={copyResults} class="text-xs font-bold text-[#F06292]">
						{copied ? 'Copied' : 'Copy as JSON'}
					</button>
				</div>
				<table class="mt-3 w-full text-left text-sm text-[#4A2C2C]">
					<thead class="text-xs text-[#875F42]/70">
						<tr>
							<th class="py-1 pr-3">Transport</th>
							<th class="py-1 pr-3">Result</th>
							<th class="py-1 pr-3">Upload time</th>
							<th class="py-1 pr-3">Speed</th>
							<th class="py-1 pr-3">Retries</th>
							<th class="py-1 pr-3">Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each results as r, i (i)}
							<tr class="border-t border-pink-50">
								<td class="py-1.5 pr-3">{label(r.method)}{rounds > 1 ? ` (${r.round})` : ''}</td>
								<td class="py-1.5 pr-3">
									{#if r.ok}
										OK
										{#if r.output}
											<button
												onclick={() => download(r)}
												class="ml-1 text-xs font-bold text-[#F06292]"
											>
												{fmtBytes(r.outputBytes ?? 0)}
											</button>
										{/if}
									{:else}
										<span class="text-red-600" title={r.error}>Failed</span>
									{/if}
								</td>
								<td class="py-1.5 pr-3">{(r.ms / 1000).toFixed(1)} s</td>
								<td class="py-1.5 pr-3">{r.ok ? `${mbps(r)} Mbps` : ''}</td>
								<td class="py-1.5 pr-3">{r.reconnects}</td>
								<td class="py-1.5 pr-3">{(r.bytesAttempted / r.bytes).toFixed(2)}×</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="mt-3 text-xs text-[#875F42]/70">
					Sent is data put on the network divided by the file size: 1.00× means nothing was re-sent.
					Upload time excludes processing.
				</p>
			</section>
		{/if}

		{#if log.length}
			<details class="mt-6" open={running}>
				<summary class="cursor-pointer text-sm font-bold text-[#4A2C2C]">Log</summary>
				<pre
					class="mt-2 max-h-72 overflow-auto rounded-xl bg-[#4A2C2C] p-3 text-xs text-white/90">{log.join(
						'\n'
					)}</pre>
			</details>
		{/if}
	</main>

	<Footer />
</div>
