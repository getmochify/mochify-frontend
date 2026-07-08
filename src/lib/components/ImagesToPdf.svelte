<script lang="ts">
    import { env } from '$env/dynamic/public';
    import { getSessionToken } from '$lib/user';
    import { posthog } from '$lib/analytics';
    import { withRetry } from '$lib/uploadRetry';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.app';

    type PageSize = 'fit' | 'a4' | 'letter';

    let {
        accept = '.webp,.png,.jpg,.jpeg,.avif,.heic,.heif,.hif,.jxl,image/webp,image/png,image/jpeg,image/avif,image/heic,image/heif,image/jxl',
        formatLabel = 'image',
        maxFiles = 20,
        downloadName = 'mochified.pdf'
    }: {
        accept?: string;
        formatLabel?: string;
        maxFiles?: number;
        downloadName?: string;
    } = $props();

    let files: File[] = $state([]);
    let pageSize: PageSize = $state('fit');
    let isDragging = $state(false);
    let isProcessing = $state(false);
    let phase: 'idle' | 'uploading' | 'processing' | 'downloading' = $state('idle');
    let uploadPercent = $state(0);
    let errorMessage = $state('');
    let successMessage = $state('');
    let fileInputEl: HTMLInputElement | null = $state(null);

    const isImage = (f: File) =>
        f.type.startsWith('image/') || /\.(png|jpe?g|webp|avif|heic|heif|hif|jxl)$/i.test(f.name);

    const fmtBytes = (n: number) =>
        n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;

    const pageOptions: { value: PageSize; label: string }[] = [
        { value: 'fit', label: 'Fit to image' },
        { value: 'a4', label: 'A4' },
        { value: 'letter', label: 'Letter' }
    ];

    function addFiles(list: FileList | File[]) {
        errorMessage = '';
        successMessage = '';
        const incoming = Array.from(list).filter(isImage);
        if (incoming.length === 0) {
            errorMessage = 'Please add image files.';
            return;
        }
        const next = [...files, ...incoming];
        if (next.length > maxFiles) {
            errorMessage = `You can add up to ${maxFiles} images at once.`;
        }
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

    async function createPdf() {
        if (files.length === 0 || isProcessing) return;
        isProcessing = true;
        errorMessage = '';
        successMessage = '';
        phase = 'uploading';
        uploadPercent = 0;

        const jwt = await getSessionToken();
        const totalBytes = files.reduce((s, f) => s + f.size, 0);
        const form = new FormData();
        // One page per image, in upload order.
        for (const f of files) form.append('images', f, f.name);
        const params = new URLSearchParams({ op: 'create', page: pageSize, quality: '85' });

        try {
            const blob = await withRetry(
                () =>
                    new Promise<Blob>((resolve, reject) => {
                        phase = 'uploading';
                        uploadPercent = 0;
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', `${API_URL}/v1/pdf?${params}`);
                        if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                        // No Content-Type — the browser sets the multipart boundary.
                        xhr.responseType = 'blob';
                        xhr.upload.onprogress = (e) => {
                            if (totalBytes > 0)
                                uploadPercent = Math.min(Math.round((e.loaded / totalBytes) * 100), 100);
                        };
                        xhr.upload.onloadend = () => {
                            phase = 'processing';
                        };
                        xhr.onload = () => {
                            uploadPercent = 100;
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve(xhr.response as Blob);
                                return;
                            }
                            const status = xhr.status;
                            const reader = new FileReader();
                            reader.onload = () => {
                                const text = (reader.result as string)?.trim() || '';
                                const err: any = new Error(text || `PDF creation failed (status ${status})`);
                                err.status = status;
                                reject(err);
                            };
                            reader.onerror = () => {
                                const err: any = new Error(`PDF creation failed (status ${status})`);
                                err.status = status;
                                reject(err);
                            };
                            reader.readAsText(xhr.response as Blob);
                        };
                        xhr.onerror = () => {
                            const err: any = new Error('Lost connection while creating your PDF');
                            err.retryable = true;
                            reject(err);
                        };
                        xhr.send(form);
                    }),
                'imgpdf_solution'
            );

            phase = 'downloading';
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);

            const count = files.length;
            posthog.capture('imgpdf_solution_completed', { images: count, page: pageSize, format: formatLabel });
            successMessage = `PDF created from ${count} ${formatLabel}${count > 1 ? 's' : ''}! ✨`;
            files = [];
            if (fileInputEl) fileInputEl.value = '';
        } catch (e: any) {
            if (e?.status === 429) {
                errorMessage = jwt
                    ? "You're out of tokens for now — they refill, or upgrade for more."
                    : "You've hit the free limit — sign up for a free account to get more.";
            } else {
                errorMessage = e instanceof Error ? e.message : 'PDF creation failed — please try again.';
            }
            posthog.capture('imgpdf_solution_failed', { images: files.length, status: e?.status ?? 0 });
        } finally {
            isProcessing = false;
            phase = 'idle';
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
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
        </span>
        <span class="font-black text-[#4A2C2C]">Drop images here, or click to choose</span>
        <span class="text-xs text-[#875F42]">One page per image · up to {maxFiles} files · processed in memory, never stored</span>
        <input
            bind:this={fileInputEl}
            type="file"
            {accept}
            multiple
            class="sr-only"
            onchange={onInputChange}
        />
    </label>

    {#if files.length > 0}
        <!-- Selected files -->
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

        <!-- Page size -->
        <div class="mt-6 flex flex-wrap items-center gap-3">
            <span class="text-xs font-black uppercase tracking-widest text-[#875F42]">Page size</span>
            <div class="flex flex-wrap gap-2">
                {#each pageOptions as opt}
                    <button
                        type="button"
                        onclick={() => (pageSize = opt.value)}
                        disabled={isProcessing}
                        class="rounded-full px-3.5 py-1.5 text-xs font-bold transition-all disabled:opacity-40 {pageSize === opt.value
                            ? 'bg-[#F06292] text-white shadow-sm'
                            : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}"
                    >
                        {opt.label}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Create button -->
        <button
            type="button"
            onclick={createPdf}
            disabled={isProcessing}
            class="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F06292] hover:bg-[#D81B60] text-white font-black shadow-md hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
        >
            {#if isProcessing}
                {phase === 'uploading' ? `Uploading… ${uploadPercent}%` : phase === 'processing' ? 'Building your PDF…' : 'Downloading…'}
            {:else}
                Create PDF{files.length > 1 ? ` from ${files.length} images` : ''}
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
