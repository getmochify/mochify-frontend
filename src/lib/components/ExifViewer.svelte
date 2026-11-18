<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { posthog } from '$lib/analytics';
	import type { Report, Field } from '$lib/exif/report';

	// The EXIF viewer: one photo, read in this tab. Rule 2 of the build brief
	// (content-ops 2026-11-18): no byte of the file and no value read from it
	// leaves the browser. So there is no server preview fallback (HEIC in
	// Chrome shows an icon instead), analytics carry formats and counts only,
	// and the results sit inside `ph-no-capture` so autocapture cannot lift a
	// value, a file name or the Maps link's coordinates from a click.

	const MAX_BYTES = 200 * 1024 * 1024;
	const ACCEPT =
		'.jpg,.jpeg,.png,.webp,.heic,.heif,.hif,.avif,image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif';

	let report = $state<Report | null>(null);
	let fileName = $state('');
	let fileSize = $state(0);
	let errorMessage = $state('');
	let isReading = $state(false);
	let isDragging = $state(false);
	let previewUrl = $state('');
	let previewFailed = $state(false);
	let thumbUrl = $state('');
	let fileInputEl: HTMLInputElement | null = $state(null);

	const found = $derived(report ? report.sections.filter((s) => s.fields.length) : []);
	const missing = $derived(report ? report.sections.filter((s) => !s.fields.length) : []);

	onMount(() => posthog.capture('exif_viewer_opened'));
	onDestroy(clearUrls);

	function clearUrls() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		if (thumbUrl) URL.revokeObjectURL(thumbUrl);
		previewUrl = '';
		thumbUrl = '';
	}

	function reset() {
		clearUrls();
		report = null;
		fileName = '';
		fileSize = 0;
		errorMessage = '';
		previewFailed = false;
		if (fileInputEl) fileInputEl.value = '';
	}

	const extOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';
	const fmtBytes = (n: number) =>
		n < 1024 * 1024
			? `${Math.max(1, Math.round(n / 1024))} KB`
			: `${(n / (1024 * 1024)).toFixed(1)} MB`;

	async function read(file: File) {
		reset();
		if (file.size > MAX_BYTES) {
			errorMessage = 'That file is over 200 MB. This viewer reads photos up to 200 MB.';
			posthog.capture('exif_viewer_file_failed', { reason: 'too-large', ext: extOf(file.name) });
			return;
		}
		isReading = true;
		fileName = file.name;
		fileSize = file.size;
		try {
			const { buildReport } = await import('$lib/exif/report');
			const r = await buildReport(new Uint8Array(await file.arrayBuffer()));
			report = r;
			previewUrl = URL.createObjectURL(file);
			if (r.thumbnailJpeg) {
				thumbUrl = URL.createObjectURL(new Blob([r.thumbnailJpeg.slice()], { type: 'image/jpeg' }));
			}
			posthog.capture('exif_viewer_file_read', {
				format: r.format,
				size_mb: Math.round(file.size / (1024 * 1024)),
				...Object.fromEntries(r.sections.map((s) => [`fields_${s.id}`, s.fields.length])),
				essentials: r.essentials.map((e) => e.label).join(','),
				picture_data: r.pictureData.length
			});
		} catch (e) {
			const unsupported = e instanceof Error && e.message === 'unsupported-format';
			errorMessage = unsupported
				? 'This viewer reads JPG, PNG, WebP, HEIC, HIF and AVIF photos. That file is a different type.'
				: 'This file could not be read. It may be damaged, or not a photo.';
			fileName = '';
			posthog.capture('exif_viewer_file_failed', {
				reason: unsupported ? 'unsupported-format' : 'unreadable',
				ext: extOf(file.name)
			});
		} finally {
			isReading = false;
		}
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const f = e.dataTransfer?.files?.[0];
		if (f) read(f);
	}

	function onInputChange() {
		const f = fileInputEl?.files?.[0];
		if (f) read(f);
	}

	const major = (fields: Field[]) => fields.filter((f) => !f.minor);
	const minor = (fields: Field[]) => fields.filter((f) => f.minor);
</script>

{#snippet fieldRows(fields: Field[])}
	<dl class="divide-y divide-pink-50">
		{#each fields as f, i (i)}
			<div class="grid gap-1 py-2.5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
				<dt class="text-sm font-bold text-cocoa-ink">{f.label}</dt>
				<dd class="flex min-w-0 flex-wrap items-baseline gap-x-2 text-sm text-cocoa-deep">
					<span class="min-w-0 break-words whitespace-pre-wrap">{f.value}</span>
					{#if f.href}
						<a
							href={f.href}
							target="_blank"
							rel="noopener noreferrer"
							class="font-bold whitespace-nowrap text-mochi-pink transition-colors hover:text-mochi-pink-deep"
							>Open in Maps</a
						>
					{/if}
					<span class="text-[10px] font-bold tracking-wide text-cocoa-milk/60 uppercase"
						>{f.source}</span
					>
				</dd>
			</div>
		{/each}
	</dl>
{/snippet}

<div class="rounded-3xl border border-pink-50 bg-white p-5 shadow-sm sm:p-8">
	{#if !report}
		<label
			class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors {isDragging
				? 'border-mochi-pink bg-mochi-blush'
				: 'border-pink-200 hover:border-mochi-pink hover:bg-[#FFF9FB]'}"
			ondragover={(e) => {
				e.preventDefault();
				isDragging = true;
			}}
			ondragleave={() => (isDragging = false)}
			ondrop={onDrop}
		>
			<input
				bind:this={fileInputEl}
				type="file"
				accept={ACCEPT}
				class="sr-only"
				onchange={onInputChange}
			/>
			<span
				class="flex h-12 w-12 items-center justify-center rounded-2xl bg-mochi-strawberry text-mochi-pink"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
					/>
				</svg>
			</span>
			{#if isReading}
				<span class="font-bold text-cocoa-ink">Reading the photo…</span>
			{:else}
				<span class="font-bold text-cocoa-ink"
					>Drop a photo here or <span class="text-mochi-pink">browse</span></span
				>
				<span class="text-xs text-cocoa-milk"
					>JPG, PNG, WebP, HEIC, HIF and AVIF · one photo at a time</span
				>
			{/if}
			<span class="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#33691E]">
				<span class="h-1.5 w-1.5 rounded-full bg-matcha-dark"></span>
				Read in your browser. The photo is not uploaded.
			</span>
		</label>
		{#if errorMessage}
			<p
				class="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
				role="alert"
			>
				{errorMessage}
			</p>
		{/if}
	{:else}
		<div class="ph-no-capture space-y-6">
			<!-- File summary -->
			<div class="flex flex-wrap items-center gap-4">
				<div
					class="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-pink-100 bg-mochi-bg"
				>
					{#if previewUrl && !previewFailed}
						<img
							src={previewUrl}
							alt=""
							class="h-full w-full object-cover"
							onerror={() => (previewFailed = true)}
						/>
					{:else}
						<span class="text-xs font-black text-cocoa-milk uppercase">{report.format}</span>
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate font-bold text-cocoa-ink">{fileName}</p>
					<p class="text-sm text-cocoa-milk">
						{report.format === 'heif' ? 'HEIC' : report.format.toUpperCase()}
						{#if report.width && report.height}· {report.width} x {report.height}{/if}
						· {fmtBytes(fileSize)}
					</p>
				</div>
				<button
					type="button"
					onclick={reset}
					class="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-bold text-cocoa-ink shadow-sm transition-all hover:border-mochi-pink hover:text-mochi-pink"
					>Check another photo</button
				>
			</div>

			<p class="rounded-2xl bg-mochi-blush px-4 py-3 text-sm font-bold text-cocoa-ink">
				{#if found.length === 0}
					No removable metadata found in this photo.
				{:else}
					Found: {found.map((s) => `${s.title} (${s.fields.length})`).join(', ')}.
					{#if found.some((s) => s.id === 'location')}
						<span class="block pt-1 font-medium text-cocoa-deep"
							>This photo records where it was taken.</span
						>
					{/if}
				{/if}
			</p>

			{#each found as section (section.id)}
				<section class="rounded-2xl border border-pink-50 p-4 sm:p-5">
					<div class="flex items-baseline justify-between gap-3">
						<h3 class="text-lg font-bold text-cocoa-ink">{section.title}</h3>
						<span
							class="rounded-full bg-mochi-strawberry px-2.5 py-0.5 text-xs font-bold text-mochi-pink-ink"
							>{section.fields.length} {section.fields.length === 1 ? 'field' : 'fields'}</span
						>
					</div>
					<p class="mt-1 text-sm text-cocoa-milk">{section.blurb}</p>
					{#if section.id === 'thumbnail' && thumbUrl}
						<figure class="mt-3 flex items-center gap-3">
							<img
								src={thumbUrl}
								alt="The thumbnail stored inside the file"
								class="max-h-28 rounded-lg border border-pink-100"
							/>
							<figcaption class="text-xs text-cocoa-milk">
								The preview stored inside the file. Compare it with the photo above.
							</figcaption>
						</figure>
					{/if}
					<div class="mt-2">{@render fieldRows(major(section.fields))}</div>
					{#if minor(section.fields).length}
						<details class="mt-1">
							<summary class="cursor-pointer text-sm font-bold text-mochi-pink"
								>{major(section.fields).length
									? `${minor(section.fields).length} more technical fields`
									: `${minor(section.fields).length} technical fields`}</summary
							>
							{@render fieldRows(minor(section.fields))}
						</details>
					{/if}
				</section>
			{/each}

			{#if missing.length}
				<p class="text-sm text-cocoa-milk">
					<span class="font-bold text-cocoa-deep">Not in this photo:</span>
					{missing.map((s) => s.title).join(', ')}.
				</p>
			{/if}

			{#if report.essentials.length}
				<section class="rounded-2xl border border-green-100 bg-[#F0FDF4] p-4 sm:p-5">
					<h3 class="text-lg font-bold text-cocoa-ink">Essential, kept</h3>
					<p class="mt-1 text-sm text-cocoa-milk">
						The photo needs these to look right. They say nothing about you.
					</p>
					<dl class="mt-2 divide-y divide-green-100">
						{#each report.essentials as e (e.label)}
							<div class="grid gap-1 py-2.5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-4">
								<dt class="text-sm font-bold text-cocoa-ink">{e.label}</dt>
								<dd class="text-sm text-cocoa-deep">
									{e.value}
									<span class="block text-xs text-cocoa-milk">{e.reason}</span>
								</dd>
							</div>
						{/each}
					</dl>
					{#if report.pictureData.length}
						<p class="mt-2 text-xs text-cocoa-milk">
							Also stored in the file: {report.pictureData.join(', ')}. That is picture data, not
							metadata.
						</p>
					{/if}
				</section>
			{/if}
		</div>
	{/if}
</div>
