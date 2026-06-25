<script lang="ts">
    import { posthog } from '$lib/analytics';
    import { isChunkLoadError, recoverFromStaleChunk } from '$lib/chunkRecovery';

    let {
        output = 'mp4',
        accept = '.mp4,.webm,.mkv,.mov,.avi,.m4v,video/*',
        maxFiles = 10,
        formatLabel = ''
    }: {
        output?: string;
        accept?: string;
        maxFiles?: number;
        formatLabel?: string;
    } = $props();

    const FORMAT_MIME: Record<string, string> = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        mkv: 'video/x-matroska',
        mov: 'video/quicktime',
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        aac: 'audio/aac',
        flac: 'audio/flac',
        ogg: 'audio/ogg'
    };
    const AUDIO_ONLY = new Set(['mp3', 'wav', 'aac', 'flac', 'ogg']);
    const outLabel = $derived(formatLabel || output.toUpperCase());

    let files: File[] = $state([]);
    let isDragging = $state(false);
    let isProcessing = $state(false);
    let current = $state(0);
    let percent = $state(0);
    let errorMessage = $state('');
    let successMessage = $state('');
    let fileInputEl: HTMLInputElement | null = $state(null);

    const isMedia = (f: File) =>
        f.type.startsWith('video/') ||
        f.type.startsWith('audio/') ||
        /\.(mp4|webm|mkv|mov|avi|m4v|mpe?g|ogv|ogg|mp3|wav|aac|flac|m4a|opus)$/i.test(f.name);

    const fmtBytes = (n: number) =>
        n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;

    function addFiles(list: FileList | File[]) {
        errorMessage = '';
        successMessage = '';
        const incoming = Array.from(list).filter(isMedia);
        if (incoming.length === 0) {
            errorMessage = 'Please add video files.';
            return;
        }
        const next = [...files, ...incoming];
        if (next.length > maxFiles) errorMessage = `You can add up to ${maxFiles} files at once.`;
        files = next.slice(0, maxFiles);
    }

    function onDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    }

    function onInputChange() {
        if (!fileInputEl?.files?.length) return;
        const selected = Array.from(fileInputEl.files);
        fileInputEl.value = '';
        addFiles(selected);
    }

    function removeFile(i: number) {
        files = files.filter((_, idx) => idx !== i);
    }

    function downloadBlob(blob: Blob, name: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);
    }

    async function convert() {
        if (files.length === 0 || isProcessing) return;
        isProcessing = true;
        errorMessage = '';
        successMessage = '';

        let mediabunny: typeof import('mediabunny');
        try {
            mediabunny = await import('mediabunny');
        } catch (e) {
            // Stale chunk after a deploy: reload once to pull the current build.
            if (isChunkLoadError(e) && recoverFromStaleChunk()) return;
            isProcessing = false;
            errorMessage = 'Could not load the converter. Please refresh and try again.';
            return;
        }

        const {
            Input, Output, Conversion, BlobSource, BufferTarget, ALL_FORMATS,
            Mp4OutputFormat, WebMOutputFormat, MkvOutputFormat, MovOutputFormat,
            Mp3OutputFormat, WavOutputFormat, AdtsOutputFormat, FlacOutputFormat, OggOutputFormat
        } = mediabunny;

        const FORMAT_MAP: Record<string, any> = {
            mp4: Mp4OutputFormat, webm: WebMOutputFormat, mkv: MkvOutputFormat, mov: MovOutputFormat,
            mp3: Mp3OutputFormat, wav: WavOutputFormat, aac: AdtsOutputFormat, flac: FlacOutputFormat, ogg: OggOutputFormat
        };
        const FormatClass = FORMAT_MAP[output] ?? Mp4OutputFormat;

        const failures: string[] = [];
        let done = 0;
        const total = files.length;

        for (let i = 0; i < total; i++) {
            const file = files[i];
            current = i + 1;
            percent = 0;
            try {
                const input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });

                if (AUDIO_ONLY.has(output)) {
                    const audioTracks = await input.getAudioTracks();
                    if (audioTracks.length === 0) {
                        failures.push(`${file.name}: no audio track to extract`);
                        continue;
                    }
                }

                const target = new BufferTarget();
                const out = new Output({ format: new FormatClass(), target });
                const conversion = await Conversion.init({ input, output: out });
                if (!conversion.isValid) {
                    failures.push(`${file.name}: unsupported conversion`);
                    continue;
                }
                conversion.onProgress = (p: number) => {
                    percent = Math.min(Math.round(p * 100), 99);
                };
                await conversion.execute();
                percent = 100;

                const buffer = target.buffer;
                if (!buffer) throw new Error('conversion produced no output');
                const blob = new Blob([buffer], { type: FORMAT_MIME[output] ?? 'application/octet-stream' });
                const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                downloadBlob(blob, `${base}.${output}`);
                done++;
            } catch (e: any) {
                failures.push(`${file.name}: ${e instanceof Error ? e.message : 'conversion failed'}`);
            }
        }

        isProcessing = false;
        current = 0;
        posthog.capture('video_solution_completed', { files: total, output, failed: failures.length });

        if (done === 0) {
            errorMessage = failures[0] ?? 'Conversion failed — please try again.';
        } else {
            successMessage = `Converted ${done} file${done > 1 ? 's' : ''} to ${outLabel}!${failures.length ? ` (${failures.length} couldn't be converted)` : ''} ✨`;
            files = [];
            if (fileInputEl) fileInputEl.value = '';
        }
    }
</script>

<div class="bg-white rounded-3xl border border-pink-50 shadow-sm p-6 sm:p-8">
    <!-- Drop zone -->
    <label
        class="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors {isDragging
            ? 'border-[#F06292] bg-[#FFF5F7]'
            : 'border-pink-200 hover:border-[#F06292] hover:bg-[#FFF9FB]'}"
        ondragover={(e) => {
            e.preventDefault();
            isDragging = true;
        }}
        ondragleave={() => (isDragging = false)}
        ondrop={onDrop}
    >
        <span class="w-12 h-12 rounded-2xl bg-[#FFF0F3] flex items-center justify-center mb-1">
            <svg class="w-6 h-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </span>
        <span class="font-black text-[#4A2C2C]">Drop videos here, or click to choose</span>
        <span class="text-xs text-[#875F42]">Converted to {outLabel} in your browser · up to {maxFiles} files · never uploaded</span>
        <input bind:this={fileInputEl} type="file" {accept} multiple class="sr-only" onchange={onInputChange} />
    </label>

    {#if files.length > 0}
        <ul class="mt-5 space-y-2">
            {#each files as f, i}
                <li class="flex items-center gap-3 rounded-xl border border-pink-50 bg-[#FDFBF7] px-4 py-2.5">
                    <span class="flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFF0F3] text-[#F06292] text-xs font-black flex-shrink-0">{i + 1}</span>
                    <span class="flex-1 truncate text-sm font-semibold text-[#4A2C2C]">{f.name}</span>
                    <span class="text-xs text-[#875F42] flex-shrink-0">{fmtBytes(f.size)}</span>
                    <button
                        type="button"
                        onclick={() => removeFile(i)}
                        disabled={isProcessing}
                        class="flex-shrink-0 text-[#875F42]/50 hover:text-red-500 transition-colors disabled:opacity-40"
                        aria-label="Remove {f.name}"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </li>
            {/each}
        </ul>

        <button
            type="button"
            onclick={convert}
            disabled={isProcessing}
            class="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F06292] hover:bg-[#D81B60] text-white font-black shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
        >
            {#if isProcessing}
                Converting {current}/{files.length}… {percent}%
            {:else}
                Convert to {outLabel}{files.length > 1 ? ` (${files.length} files)` : ''}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            {/if}
        </button>
    {/if}

    {#if errorMessage}
        <div class="mt-4 flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-[#EF5350]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-xs font-bold text-red-700">{errorMessage}</p>
        </div>
    {/if}
    {#if successMessage}
        <div class="mt-4 flex items-center gap-2 rounded-2xl border border-green-100 bg-[#F0FDF4] px-4 py-3">
            <svg class="h-4 w-4 flex-shrink-0 text-[#66BB6A]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-xs font-bold text-[#33691E]">{successMessage}</p>
        </div>
    {/if}
</div>
