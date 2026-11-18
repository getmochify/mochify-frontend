<script lang="ts">
	import { onMount } from 'svelte';
	import { posthog } from '$lib/analytics';
	import { saveBlob } from '$lib/saveBlob';
	import { zipBlobs } from '$lib/zipWorker';
	import { SECTIONS } from '$lib/exif/sections';
	import type { SectionId } from '$lib/exif/report';

	// The bulk EXIF remover (build brief 2026-11-18, section 4): many photos,
	// one step. Same rule as the viewer: no byte of a file and no value read
	// from one leaves the tab, so analytics carry counts and formats only and
	// the file list sits inside `ph-no-capture`.
	//
	// Files are read and cleaned one at a time and only the File handle and the
	// cleaned Blob are kept, so memory is bounded by the ZIP, not the batch.
	// Hence the stated ceiling: 200 photos or 2 GB per batch.

	const MAX_FILES = 200;
	const MAX_TOTAL = 2 * 1024 * 1024 * 1024;
	const MAX_BYTES = 200 * 1024 * 1024;
	const ACCEPT =
		'.jpg,.jpeg,.png,.webp,.heic,.heif,.hif,.avif,image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif';
	const ALL_IDS = SECTIONS.map((s) => s.id);

	type Format = 'jpeg' | 'png' | 'webp' | 'heif' | 'avif';
	type Item = {
		id: number;
		file: File;
		/** Set once read: the sections holding something. */
		format?: Format;
		found?: SectionId[];
		/** Why it is skipped, in plain words. */
		skip?: string;
		result?: {
			blob: Blob;
			/** Sections that were emptied. */
			removed: SectionId[];
			/** Chosen sections still holding something after the run. */
			left: SectionId[];
		};
	};

	let items = $state<Item[]>([]);
	let nextId = 0;
	let isReading = $state(false);
	let isRemoving = $state(false);
	let isZipping = $state(false);
	let progress = $state(0);
	let locationOnly = $state(false);
	let isDragging = $state(false);
	let notice = $state('');
	let ran = $state(false);
	let fileInputEl: HTMLInputElement | null = $state(null);

	const readable = $derived(items.filter((i) => i.found));
	const skipped = $derived(items.filter((i) => i.skip));
	const done = $derived(items.filter((i) => i.result));
	const totalBytes = $derived(items.reduce((n, i) => n + i.file.size, 0));

	const TITLE = Object.fromEntries(SECTIONS.map((s) => [s.id, s.title])) as Record<
		SectionId,
		string
	>;
	/** How the summary line names a photo holding each section. */
	const WITH: Record<SectionId, string> = {
		location: 'with a location',
		camera: 'with camera details',
		datetime: 'with dates',
		author: 'with a name or copyright',
		software: 'with software or edit history',
		ai: 'with AI labels',
		thumbnail: 'with an embedded thumbnail',
		other: 'with other metadata'
	};
	const summary = $derived.by(() => {
		const n = readable.length;
		if (!n) return '';
		const parts = ALL_IDS.map((id) => [id, readable.filter((i) => i.found!.includes(id)).length])
			.filter(([, c]) => c)
			.map(([id, c]) => `${c} ${WITH[id as SectionId]}`);
		const head = `${n} ${n === 1 ? 'photo' : 'photos'}`;
		const skip = skipped.length
			? ` (${skipped.length} ${skipped.length === 1 ? 'file' : 'files'} skipped, see below)`
			: '';
		return parts.length
			? `${head}${skip}: ${parts.join(', ')}`
			: `${head}${skip}: nothing to remove`;
	});

	onMount(() => posthog.capture('exif_remover_opened'));

	const fmtBytes = (n: number) =>
		n < 1024 * 1024
			? `${Math.max(1, Math.round(n / 1024))} KB`
			: `${(n / (1024 * 1024)).toFixed(1)} MB`;
	const FORMAT_NAME: Record<Format, string> = {
		jpeg: 'JPG',
		png: 'PNG',
		webp: 'WebP',
		heif: 'HEIC',
		avif: 'AVIF'
	};
	const list = (ids: SectionId[]) => ids.map((id) => TITLE[id]).join(', ');
	/** Lets the progress line paint between files. */
	const yieldToUi = () => new Promise((r) => setTimeout(r, 0));

	async function add(files: File[]) {
		if (!files.length || isReading || isRemoving) return;
		if (ran) clear();
		notice = '';
		let incoming = files;
		const room = MAX_FILES - items.length;
		if (incoming.length > room) {
			incoming = incoming.slice(0, Math.max(0, room));
			notice = `A batch holds up to ${MAX_FILES} photos. The first ${incoming.length} were added.`;
		}
		let total = totalBytes;
		const fits: File[] = [];
		for (const f of incoming) {
			if (total + f.size > MAX_TOTAL) {
				notice = 'A batch holds up to 2 GB. The photos past that were not added.';
				break;
			}
			total += f.size;
			fits.push(f);
		}
		if (!fits.length) return;

		isReading = true;
		const { buildReport } = await import('$lib/exif/report');
		const start = items.length;
		items.push(...fits.map((file) => ({ id: nextId++, file })));
		for (let k = start; k < items.length; k++) {
			const item = items[k];
			progress = k - start + 1;
			if (item.file.size > MAX_BYTES) {
				item.skip = 'Over 200 MB';
				continue;
			}
			try {
				const r = await buildReport(new Uint8Array(await item.file.arrayBuffer()));
				item.format = r.format;
				item.found = r.sections.filter((s) => s.fields.length).map((s) => s.id);
			} catch (e) {
				item.skip =
					e instanceof Error && e.message === 'unsupported-format'
						? 'Not a JPG, PNG, WebP, HEIC, HIF or AVIF photo'
						: 'Could not be read. It may be damaged';
			}
			await yieldToUi();
		}
		isReading = false;

		const added = items.slice(start);
		const formats: Record<string, number> = {};
		for (const i of added) {
			const key = i.format ?? 'skipped';
			formats[key] = (formats[key] ?? 0) + 1;
		}
		posthog.capture('exif_remover_files_added', {
			count: added.length,
			skipped: added.filter((i) => i.skip).length,
			batch: items.length,
			...Object.fromEntries(Object.entries(formats).map(([f, c]) => [`format_${f}`, c])),
			...Object.fromEntries(
				ALL_IDS.map((id) => [`with_${id}`, added.filter((i) => i.found?.includes(id)).length])
			)
		});
	}

	async function run() {
		if (!readable.length || isRemoving) return;
		isRemoving = true;
		notice = '';
		const chosen: SectionId[] = locationOnly ? ['location'] : ALL_IDS;
		const [{ removeMetadata, pickSections }, { buildReport }] = await Promise.all([
			import('$lib/exif/remove'),
			import('$lib/exif/report')
		]);
		const pick = pickSections(chosen);
		let failed = 0;
		let saved = 0;
		const todo = readable;
		for (let k = 0; k < todo.length; k++) {
			const item = todo[k];
			progress = k + 1;
			const had = item.found!.filter((id) => chosen.includes(id));
			try {
				const bytes = new Uint8Array(await item.file.arrayBuffer());
				// Nothing chosen in it: passed through as it is (brief 4.7).
				const out = had.length ? removeMetadata(bytes, pick) : bytes;
				const after = had.length ? await buildReport(out) : null;
				const still = after
					? after.sections.filter((s) => s.fields.length).map((s) => s.id)
					: item.found!;
				item.result = {
					blob: new Blob([out.slice()], { type: MIME[item.format!] }),
					removed: had.filter((id) => !still.includes(id)),
					left: had.filter((id) => still.includes(id))
				};
				saved += bytes.length - out.length;
			} catch {
				item.found = undefined;
				item.skip = 'The metadata could not be removed. Nothing was changed';
				failed++;
			}
			await yieldToUi();
		}
		isRemoving = false;
		ran = true;
		posthog.capture('exif_remover_removed', {
			mode: locationOnly ? 'location' : 'all',
			count: todo.length,
			cleaned: todo.filter((i) => i.result?.removed.length).length,
			nothing: todo.filter((i) => i.result && !i.result.removed.length && !i.result.left.length)
				.length,
			partial: todo.filter((i) => i.result?.left.length).length,
			failed,
			saved_kb: Math.round(saved / 1024)
		});
	}

	const MIME: Record<Format, string> = {
		jpeg: 'image/jpeg',
		png: 'image/png',
		webp: 'image/webp',
		heif: 'image/heic',
		avif: 'image/avif'
	};

	const cleanName = (name: string) => {
		const dot = name.lastIndexOf('.');
		return dot > 0 ? `${name.slice(0, dot)}-clean${name.slice(dot)}` : `${name}-clean`;
	};

	/** ZIP entry names, with "(2)" added where two photos share a name. */
	function zipNames(list: Item[]): string[] {
		const seen: Record<string, number> = {};
		return list.map((i) => {
			const name = cleanName(i.file.name);
			const n = (seen[name.toLowerCase()] ?? 0) + 1;
			seen[name.toLowerCase()] = n;
			if (n === 1) return name;
			const dot = name.lastIndexOf('.');
			return dot > 0 ? `${name.slice(0, dot)} (${n})${name.slice(dot)}` : `${name} (${n})`;
		});
	}

	function downloadOne(item: Item) {
		if (!item.result) return;
		saveBlob(item.result.blob, cleanName(item.file.name));
		posthog.capture('exif_remover_downloaded', { kind: 'single', count: 1 });
	}

	async function downloadZip() {
		if (!done.length || isZipping) return;
		isZipping = true;
		try {
			const names = zipNames(done);
			const zip = await zipBlobs(done.map((i, k) => ({ name: names[k], blob: i.result!.blob })));
			saveBlob(zip, 'mochify-clean.zip');
			posthog.capture('exif_remover_downloaded', { kind: 'zip', count: done.length });
		} catch {
			notice = 'The ZIP could not be made. You can still download the photos one by one.';
		} finally {
			isZipping = false;
		}
	}

	function clear() {
		items = [];
		ran = false;
		notice = '';
		progress = 0;
		if (fileInputEl) fileInputEl.value = '';
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		add([...(e.dataTransfer?.files ?? [])]);
	}

	function onInputChange() {
		add([...(fileInputEl?.files ?? [])]);
		if (fileInputEl) fileInputEl.value = '';
	}

	const savedTotal = $derived(done.reduce((n, i) => n + i.file.size - i.result!.blob.size, 0));
</script>

<div class="rounded-3xl border border-pink-50 bg-white p-5 shadow-sm sm:p-8">
	{#if !ran}
		<label
			class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 text-center transition-colors {items.length
				? 'py-6'
				: 'py-12'} {isDragging
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
				multiple
				accept={ACCEPT}
				class="sr-only"
				disabled={isReading || isRemoving}
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
						d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
					/>
				</svg>
			</span>
			{#if isReading}
				<span class="font-bold text-cocoa-ink" aria-live="polite">Reading photo {progress}…</span>
			{:else}
				<span class="font-bold text-cocoa-ink"
					>{items.length ? 'Add more photos' : 'Drop photos here'} or
					<span class="text-mochi-pink">browse</span></span
				>
				<span class="text-xs text-cocoa-milk"
					>JPG, PNG, WebP, HEIC, HIF and AVIF · up to {MAX_FILES} photos or 2 GB at a time</span
				>
			{/if}
			<span class="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#33691E]">
				<span class="h-1.5 w-1.5 rounded-full bg-matcha-dark"></span>
				Cleaned in your browser. Your photos are not uploaded.
			</span>
		</label>
	{/if}

	{#if notice}
		<p
			class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
			role="status"
		>
			{notice}
		</p>
	{/if}

	{#if items.length}
		<div class="ph-no-capture space-y-5 {ran ? '' : 'mt-6'}">
			{#if !ran}
				{#if summary}
					<p
						class="rounded-2xl border border-pink-100 bg-mochi-blush px-4 py-3 font-bold text-cocoa-ink"
					>
						{summary}.
					</p>
				{/if}
				<div class="flex flex-wrap items-center gap-3">
					<button
						type="button"
						onclick={run}
						disabled={isReading || isRemoving || !readable.length}
						class="rounded-full bg-mochi-pink px-6 py-3 font-bold text-white shadow-sm transition-colors hover:bg-mochi-pink-deep disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isRemoving
							? `Removing ${progress} of ${readable.length}…`
							: locationOnly
								? 'Remove location'
								: 'Remove metadata'}
					</button>
					<label
						class="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-cocoa-ink"
					>
						<input
							type="checkbox"
							bind:checked={locationOnly}
							disabled={isRemoving}
							class="h-4 w-4 accent-mochi-pink"
						/>
						Location only
					</label>
					<button
						type="button"
						onclick={clear}
						disabled={isReading || isRemoving}
						class="ml-auto text-sm font-bold text-cocoa-milk transition-colors hover:text-mochi-pink disabled:opacity-50"
						>Clear</button
					>
				</div>
				<p class="text-xs text-cocoa-deep">
					{locationOnly
						? 'Removes the location from every photo and leaves the rest.'
						: 'Removes everything that identifies you, your camera or your location from every photo.'}
					The orientation, color profile, HDR gain map and pixel density are kept, and the picture itself
					is not recompressed.
				</p>
			{:else}
				<div class="space-y-3 rounded-2xl border border-pink-100 bg-mochi-blush p-4">
					<p class="font-bold text-cocoa-ink" aria-live="polite">
						Done. {done.length}
						{done.length === 1 ? 'photo' : 'photos'} ready{#if savedTotal > 0}, {fmtBytes(
								savedTotal
							)}
							smaller in total{/if}. The pictures were not changed: same pixels, same dimensions.
					</p>
					<div class="flex flex-wrap gap-2">
						{#if done.length > 1}
							<button
								type="button"
								onclick={downloadZip}
								disabled={isZipping}
								class="rounded-full bg-mochi-pink px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-mochi-pink-deep disabled:opacity-50"
								>{isZipping ? 'Making the ZIP…' : `Download all as ZIP (${done.length})`}</button
							>
						{:else if done.length === 1}
							<button
								type="button"
								onclick={() => downloadOne(done[0])}
								class="rounded-full bg-mochi-pink px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-mochi-pink-deep"
								>Download {cleanName(done[0].file.name)}</button
							>
						{/if}
						<button
							type="button"
							onclick={clear}
							class="rounded-full border border-pink-100 bg-white px-4 py-2.5 text-sm font-bold text-cocoa-ink shadow-sm transition-all hover:border-mochi-pink hover:text-mochi-pink"
							>Clean more photos</button
						>
					</div>
				</div>
			{/if}

			<ul class="divide-y divide-pink-50 rounded-2xl border border-pink-50">
				{#each items as item (item.id)}
					<li class="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold text-cocoa-ink">{item.file.name}</p>
							<p class="text-xs text-cocoa-milk">
								{#if item.skip}
									<span class="font-bold text-red-700">Skipped:</span> {item.skip}.
								{:else if item.result}
									{#if item.result.removed.length}
										Removed: {list(item.result.removed)}.
									{:else if !item.result.left.length}
										Nothing to remove.
									{/if}
									{#if item.result.left.length}
										<span class="font-bold text-amber-900"
											>Some left in {list(item.result.left)}.</span
										>
									{/if}
									{#if item.result.blob.size !== item.file.size}
										{fmtBytes(item.file.size)} → {fmtBytes(item.result.blob.size)}
									{:else}
										{fmtBytes(item.file.size)}
									{/if}
								{:else if item.found}
									{FORMAT_NAME[item.format!]} · {fmtBytes(item.file.size)} ·
									{item.found.length ? list(item.found) : 'Nothing to remove'}
								{:else}
									{fmtBytes(item.file.size)}
								{/if}
							</p>
						</div>
						{#if item.result}
							<button
								type="button"
								onclick={() => downloadOne(item)}
								class="rounded-full border border-pink-100 bg-white px-3 py-1.5 text-xs font-bold text-cocoa-ink transition-all hover:border-mochi-pink hover:text-mochi-pink"
								>Download</button
							>
						{/if}
					</li>
				{/each}
			</ul>
			{#if skipped.length && ran}
				<p class="text-xs text-cocoa-milk">
					{skipped.length}
					{skipped.length === 1 ? 'file was' : 'files were'} skipped and left out of the download.
				</p>
			{/if}
		</div>
	{/if}
</div>
