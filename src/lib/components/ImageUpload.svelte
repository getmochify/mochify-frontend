<script lang="ts">
    import { zip } from 'fflate';
    import { env } from '$env/dynamic/public';
    import { getIsPro, getPlan, getSessionToken } from '$lib/user';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.xyz';

    type FileProgress = {
        file: File;
        progress: number;
        status: 'pending' | 'processing' | 'complete' | 'error';
        error?: string;
        thumbnailUrl?: string;
    };

    const props = $props();
    let { types = ".JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF, .JXL", showTypes = true, output = 'jpg', class: className = '', queryParams = '', showExifOption = false, showSmartMode = false } = props;
    const hasOutputOverride = 'output' in props;

    let stripExif: boolean = $state(false);
    let smartCompress: boolean = $state(false);
    let isDragging: boolean = $state(false);

    let selectedFiles: File[] = $state([]);
    let fileProgress: FileProgress[] = $state([]);
    let imageType: string = $state(output);
    let isLoading: boolean = $state(false);
    let errorMessage: string = $state('');
    let successMessage: string = $state('');
    let totalOriginalSize: number = $state(0);
    let fileInputElement: HTMLInputElement;
    let MAX_FILES = $state(25);
    const CONCURRENT_UPLOADS = 1;
    let MAX_INDIVIDUAL_FILE_SIZE = $state(20 * 1024 * 1024); // 20MB, 75MB for pro
    $effect(() => {
        getIsPro().then(isPro => { MAX_INDIVIDUAL_FILE_SIZE = isPro ? 75 * 1024 * 1024 : 20 * 1024 * 1024; });
        getPlan().then(plan => { MAX_FILES = plan === 'free' ? 3 : 25; });
    });

    let showSignupCta = $state(false);

    // Token limit tracking
    let availableTokens: number = $state(0);
    let hasCheckedTokens: boolean = $state(false);

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            processFiles(Array.from(target.files));
            target.value = '';
        }
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        isDragging = true;
    }

    function handleDragLeave(event: DragEvent) {
        event.preventDefault();
        if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
            isDragging = false;
        }
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        isDragging = false;
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            processFiles(Array.from(event.dataTransfer.files));
        }
    }

    async function checkTokenLimit(): Promise<void> {
        try {
            const jwt = await getSessionToken();
            const response = await fetch(`${API_URL}/v1/checkTokens`, {
                headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
            });
            if (!response.ok) {
                throw new Error('Failed to check token limit');
            }
            const data = await response.json();
            availableTokens = data.remaining || 0;
            hasCheckedTokens = true;
        } catch (error) {
            console.error('Token check failed:', error);
            hasCheckedTokens = false;
        }
    }

    const ACCEPTED_MIME_TYPES = new Set([
        'image/jpeg', 'image/heic', 'image/heif', 'image/avif',
        'image/png', 'image/jxl', 'image/webp'
    ]);
    const ACCEPTED_EXTENSIONS = new Set([
        'jpg', 'jpeg', 'heic', 'heif', 'hif', 'avif', 'png', 'jxl', 'webp'
    ]);

    async function processFiles(allFiles: File[]) {
        const invalidFiles = allFiles.filter(f => {
            const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
            return !ACCEPTED_MIME_TYPES.has(f.type) && !ACCEPTED_EXTENSIONS.has(ext);
        });
        if (invalidFiles.length > 0) {
            errorMessage = `${invalidFiles.length} file(s) not supported. Accepted: JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF, JXL.`;
            allFiles = allFiles.filter(f => {
                const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
                return ACCEPTED_MIME_TYPES.has(f.type) || ACCEPTED_EXTENSIONS.has(ext);
            });
            if (allFiles.length === 0) return;
        }

        const oversizedFiles = allFiles.filter(f => f.size > MAX_INDIVIDUAL_FILE_SIZE);

        if (oversizedFiles.length > 0) {
            errorMessage = `Individual file size limit is ${MAX_INDIVIDUAL_FILE_SIZE / 1024 / 1024}MB. ${oversizedFiles.length} file(s) exceed this limit.`;
            return;
        }

        const existingFileKeys = new Set(
            selectedFiles.map(f => `${f.name}-${f.size}`)
        );
        const newFiles = allFiles.filter(
            f => !existingFileKeys.has(`${f.name}-${f.size}`)
        );

        const combinedFiles = [...selectedFiles, ...newFiles].slice(0, MAX_FILES);
        const addedCount = combinedFiles.length - selectedFiles.length;

        selectedFiles = combinedFiles;
        fileProgress = combinedFiles.map(file => {
            const existing = fileProgress.find(fp => fp.file === file);
            if (existing) return existing;
            return {
                file,
                progress: 0,
                status: 'pending' as const,
                thumbnailUrl: URL.createObjectURL(file)
            };
        });
        totalOriginalSize = combinedFiles.reduce((sum, file) => sum + file.size, 0);
        errorMessage = '';
        successMessage = '';

        if (addedCount === 0 && newFiles.length === 0) {
            errorMessage = 'All selected files are already in the list.';
        } else if (selectedFiles.length >= MAX_FILES && allFiles.length > addedCount) {
            errorMessage = MAX_FILES === 3
                ? `Free plan is limited to 3 files. Upgrade to Seller or Pro for batches up to 25.`
                : `Maximum ${MAX_FILES} files. Added ${addedCount} file(s).`;
        }

        await checkTokenLimit();
    }

    function formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    $effect(() => {
        if (hasOutputOverride) {
            imageType = output;
        }
    });

    // Pre-flight token check only applies to unauthenticated users.
    // Authenticated users skip this — the backend enforces limits via 429.
    let isAuthenticated: boolean = $state(false);
    $effect(() => { getSessionToken().then(jwt => { isAuthenticated = !!jwt; }); });

    const insufficientTokens = $derived(
        !isAuthenticated && hasCheckedTokens && selectedFiles.length > 0 && selectedFiles.length > availableTokens
    );

    async function compressImage() {
        if (selectedFiles.length === 0) {
            errorMessage = 'Please select at least one image';
            return;
        }

        const jwt = await getSessionToken();

        isLoading = true;
        errorMessage = '';
        successMessage = '';

        fileProgress = selectedFiles.map(file => ({
            file,
            progress: 0,
            status: 'pending' as const
        }));

        try {
            let totalCompressedSize = 0;
            const compressedBlobs: Blob[] = new Array(selectedFiles.length);
            let hitRateLimit = false;

            const processFile = async (index: number) => {
                const file = selectedFiles[index];
                fileProgress[index].status = 'processing';
                fileProgress[index].progress = 0;

                try {
                    const blob = await new Promise<Blob>((resolve, reject) => {
                        const xhr = new XMLHttpRequest();

                        xhr.upload.addEventListener('progress', (e) => {
                            if (e.lengthComputable) {
                                fileProgress[index].progress = Math.round((e.loaded / e.total) * 40);
                            }
                        });

                        xhr.addEventListener('progress', (e) => {
                            if (e.lengthComputable) {
                                fileProgress[index].progress = Math.round(60 + (e.loaded / e.total) * 40);
                            }
                        });

                        xhr.addEventListener('load', () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                const latency = xhr.getResponseHeader('X-Latency-Ms');
                                if (latency) console.log(`[C++ Engine] ${file.name} squished in ${latency}`);
                                resolve(xhr.response);
                            } else {
                                const error: any = new Error(`Server error: ${xhr.status}`);
                                error.status = xhr.status;
                                reject(error);
                            }
                        });

                        xhr.addEventListener('error', () => reject(new Error('Network error')));
                        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

                        xhr.upload.addEventListener('load', () => {
                            fileProgress[index].progress = 40;
                            setTimeout(() => {
                                if (fileProgress[index].progress < 60) {
                                    fileProgress[index].progress = 50;
                                }
                            }, 100);
                        });

                        xhr.open('POST', `${API_URL}/v1/squish?type=${imageType}&strip_exif=${stripExif}${smartCompress ? '&smartCompress=1' : ''}${queryParams ? '&' + queryParams : ''}`);
                        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
                        if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                        xhr.responseType = 'blob';
                        xhr.send(file);
                    });

                    compressedBlobs[index] = blob;
                    totalCompressedSize += blob.size;
                    fileProgress[index].progress = 100;
                    fileProgress[index].status = 'complete';
                } catch (error: any) {
                    fileProgress[index].status = 'error';
                    if (error.status === 429) {
                        hitRateLimit = true;
                        fileProgress[index].error = 'Rate limit exceeded';
                        const jwt = await getSessionToken();
                        if (!jwt) showSignupCta = true;
                    } else {
                        fileProgress[index].error = error instanceof Error ? error.message : 'Unknown error';
                    }
                }
            };

            batchLoop: for (let i = 0; i < selectedFiles.length; i += CONCURRENT_UPLOADS) {
                const batch = [];
                for (let j = i; j < Math.min(i + CONCURRENT_UPLOADS, selectedFiles.length); j++) {
                    batch.push(processFile(j));
                }
                await Promise.allSettled(batch);
                if (hitRateLimit) break batchLoop;
            }

            const successfulFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'complete');
            const failedFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'error');

            if (successfulFiles.length === 0) {
                throw new Error('All files failed to convert');
            }

            if (successfulFiles.length === 1) {
                const index = selectedFiles.findIndex((_, i) => fileProgress[i].status === 'complete');
                const nameWithoutExt = successfulFiles[0].name.replace(/\.[^/.]+$/, '');
                const extension = imageType === 'jpeg' ? 'jpg' : imageType;
                downloadBlob(compressedBlobs[index], `${nameWithoutExt}.${extension}`);
            } else {
                const zipData: Record<string, Uint8Array> = {};
                await Promise.all(selectedFiles.map(async (file, i) => {
                    if (fileProgress[i].status !== 'complete') return;
                    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                    const extension = imageType === 'jpeg' ? 'jpg' : imageType;
                    const buffer = await compressedBlobs[i].arrayBuffer();
                    zipData[`${nameWithoutExt}.${extension}`] = new Uint8Array(buffer);
                }));

                const zipContent = await new Promise<Uint8Array>((resolve, reject) => {
                    zip(zipData, { level: 0 }, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                downloadBlob(new Blob([zipContent.buffer as ArrayBuffer], { type: 'application/zip' }), 'compressed-images.zip');
            }

            const reduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
            const spaceSaved = formatFileSize(totalOriginalSize - totalCompressedSize);

            if (hitRateLimit) {
                const pendingFiles = fileProgress.filter(fp => fp.status === 'pending').length;
                successMessage = `Rate limit reached! Downloaded ${successfulFiles.length} successful conversion(s). ${pendingFiles} file(s) remain.`;
            } else if (failedFiles.length > 0) {
                successMessage = `${successfulFiles.length} of ${selectedFiles.length} squished. Saved ${spaceSaved}. ${failedFiles.length} failed.`;
            } else {
                successMessage = selectedFiles.length === 1
                    ? `Squished! Saved ${spaceSaved} (${reduction}% smaller).`
                    : `Done! ${selectedFiles.length} images optimised. Saved ${spaceSaved} total.`;
            }

            fileProgress.forEach(fp => {
                if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
            });
            selectedFiles = selectedFiles.filter((_, i) => fileProgress[i].status !== 'complete');
            fileProgress = fileProgress.filter(fp => fp.status !== 'complete');
            totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

            if (fileInputElement) fileInputElement.value = '';
            await checkTokenLimit();
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
        } finally {
            isLoading = false;
        }
    }

    function downloadBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        if (!filename.includes('.')) {
            const extension = imageType === 'jpeg' ? 'jpg' : imageType;
            a.download = `${filename}.${extension}`;
        } else {
            a.download = filename;
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function resetForm() {
        fileProgress.forEach(fp => {
            if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
        });
        selectedFiles = [];
        fileProgress = [];
        totalOriginalSize = 0;
        errorMessage = '';
        successMessage = '';
        imageType = 'jpg';
        if (fileInputElement) fileInputElement.value = '';
    }

    function removeFile(index: number) {
        if (fileProgress[index].thumbnailUrl) {
            URL.revokeObjectURL(fileProgress[index].thumbnailUrl!);
        }
        selectedFiles = selectedFiles.filter((_, i) => i !== index);
        fileProgress = fileProgress.filter((_, i) => i !== index);
        totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    }

    const formats = [
        { value: 'jpg',  label: 'JPEG' },
        { value: 'png',  label: 'PNG'  },
        { value: 'webp', label: 'WebP' },
        { value: 'avif', label: 'AVIF' },
        { value: 'jxl',  label: 'JXL'  },
    ];
</script>

<div
    class={`liquid-glass relative rounded-[2rem] overflow-hidden transition-all duration-300 w-full ${isDragging ? 'scale-[1.02] liquid-glow' : ''} ${className}`.trim()}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="region"
    aria-label="Upload images"
>
    <!-- Top highlight -->
    <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>

    <!-- Hidden file input -->
    <input
        bind:this={fileInputElement}
        id="file-input"
        type="file"
        accept=".jpg,.jpeg,.heic,.heif,.hif,.avif,.png,.jxl,.webp,image/jpeg,image/heic,image/heif,image/avif,image/png,image/jxl,image/webp"
        multiple
        onchange={handleFileSelect}
        class="hidden"
    />

    <!-- Drag overlay -->
    {#if isDragging}
        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md pointer-events-none rounded-[2rem]">
            <div class="w-14 h-14 rounded-2xl bg-white/90 shadow-xl shadow-pink-200/50 flex items-center justify-center mb-3 animate-bounce">
                <svg class="w-6 h-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                </svg>
            </div>
            <p class="text-[#4A2C2C] font-bold text-lg tracking-tight drop-shadow-md">Drop it like it's hot</p>
        </div>
    {/if}

    <!-- Thumbnails (files selected) -->
    {#if selectedFiles.length > 0}
        <div class="flex items-center gap-3 flex-wrap px-4 sm:px-6 pt-6 pb-3 relative">
            {#each fileProgress as fp, index}
                <div class="relative group flex-shrink-0">
                    <div class="liquid-bubble w-16 h-16 rounded-2xl overflow-hidden p-1">
                        {#if fp.thumbnailUrl}
                            <img src={fp.thumbnailUrl} alt={fp.file.name} class="w-full h-full object-cover rounded-xl" />
                        {:else}
                            <div class="w-full h-full rounded-xl bg-white/40 flex items-center justify-center">
                                <svg class="w-5 h-5 text-[#FFB3C6]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                        {/if}
                    </div>

                    <!-- Status badge -->
                    {#if fp.status === 'complete'}
                        <div class="absolute -top-1 -right-1 w-5 h-5 bg-[#81C784] rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                    {:else if fp.status === 'error'}
                        <div class="absolute -top-1 -right-1 w-5 h-5 bg-[#EF5350] rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                    {:else if fp.status === 'processing'}
                        <div class="absolute -top-1 -right-1 w-5 h-5 bg-[#F06292] rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                            <svg class="w-3 h-3 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    {/if}

                    <!-- Progress bar -->
                    {#if fp.status === 'processing'}
                        <div class="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6] rounded-full transition-all duration-300" style="width: {fp.progress}%"></div>
                        </div>
                    {/if}

                    <!-- Remove button -->
                    {#if fp.status !== 'processing'}
                        <button
                            onclick={() => removeFile(index)}
                            class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/90 text-[#F06292] hover:text-red-500 hover:bg-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-md sm:hover:scale-110 cursor-pointer backdrop-blur-sm"
                            title="Remove file"
                        >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    {/if}
                </div>
            {/each}

            <!-- Add more -->
            <button
                onclick={() => fileInputElement?.click()}
                class="liquid-bubble flex-shrink-0 w-16 h-16 rounded-2xl border border-dashed border-[#F06292]/30 hover:bg-white/60 transition-all flex items-center justify-center text-[#F06292]/60 hover:text-[#F06292] hover:scale-105 cursor-pointer"
                aria-label="Add more images"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                </svg>
            </button>

            <div class="absolute bottom-0 left-8 right-8">
                <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-[#875F42]/15 to-transparent"></div>
                <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
        </div>
    {:else}
        <!-- Empty state -->
        <label for="file-input" class="flex flex-col items-center justify-center gap-2 px-6 pt-8 pb-5 cursor-pointer text-center group">
            <div class="w-12 h-12 rounded-2xl liquid-bubble flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-200">
                <svg class="w-6 h-6 text-[#F06292]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                </svg>
            </div>
            <p class="text-[#4A2C2C] font-semibold text-sm">Drop images here or <span class="text-[#F06292]">browse</span></p>
            <p class="text-[#6C3F31]/60 text-xs">{types} · max {MAX_FILES} files, {MAX_INDIVIDUAL_FILE_SIZE / 1024 / 1024}MB each</p>
        </label>
    {/if}

    <!-- Toggles -->
    {#if showExifOption || showSmartMode}
        <div class="flex flex-wrap gap-x-6 gap-y-3 px-4 sm:px-6 pb-3">
            {#if showExifOption}
                <label class="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input type="checkbox" bind:checked={stripExif} class="sr-only" />
                    <div class="relative w-10 h-5 rounded-full transition-all duration-300 {stripExif ? 'bg-[#F06292] shadow-[0_0_0_1px_#F06292]' : 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}">
                        <div class="absolute top-[3px] left-[3px] bg-white w-3.5 h-3.5 rounded-full shadow-md transition-transform duration-300 {stripExif ? 'translate-x-5' : ''}"></div>
                    </div>
                    <span class="text-xs font-semibold text-[#6C3F31] group-hover:text-[#4A2C2C] transition-colors">Strip EXIF</span>
                </label>
            {/if}
            {#if showSmartMode}
                <label class="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input type="checkbox" bind:checked={smartCompress} class="sr-only" />
                    <div class="relative w-10 h-5 rounded-full transition-all duration-300 {smartCompress ? 'bg-[#66BB6A] shadow-[0_0_0_1px_#66BB6A]' : 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}">
                        <div class="absolute top-[3px] left-[3px] bg-white w-3.5 h-3.5 rounded-full shadow-md transition-transform duration-300 {smartCompress ? 'translate-x-5' : ''}"></div>
                    </div>
                    <span class="text-xs font-semibold text-[#6C3F31] group-hover:text-[#4A2C2C] transition-colors">Smart Mode</span>
                </label>
            {/if}
        </div>
    {/if}

    <!-- Token status -->
    {#if hasCheckedTokens && selectedFiles.length > 0 && !insufficientTokens}
        <div class="mx-4 sm:mx-6 mb-3 px-4 py-2.5 bg-white/30 backdrop-blur-sm border border-[#A5D6A7]/40 rounded-2xl flex items-center gap-2">
            <svg class="w-4 h-4 text-[#66BB6A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-xs text-[#33691E] font-semibold">
                {availableTokens} token{availableTokens !== 1 ? 's' : ''} available
            </p>
        </div>
    {/if}

    {#if insufficientTokens}
        <div class="mx-4 sm:mx-6 mb-3 px-4 py-2.5 bg-white/30 backdrop-blur-sm border border-[#FFD54F]/50 rounded-2xl flex items-start gap-2">
            <svg class="w-4 h-4 text-[#F57C00] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="text-xs text-[#6C3F31] font-semibold">
                {availableTokens} token{availableTokens !== 1 ? 's' : ''} available — remove {selectedFiles.length - availableTokens} file{selectedFiles.length - availableTokens !== 1 ? 's' : ''} to continue
            </p>
        </div>
    {/if}

    <!-- Submit button -->
    <div class="px-4 sm:px-6 pb-4">
        <button
            onclick={compressImage}
            disabled={selectedFiles.length === 0 || isLoading || insufficientTokens}
            class="w-full py-3.5 px-6 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group
                {selectedFiles.length > 0 && !isLoading && !insufficientTokens
                    ? 'bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:shadow-[0_8px_24px_rgba(240,98,146,0.5)] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-white/40 text-[#875F42]/60 border border-[#875F42]/15 cursor-not-allowed'}"
        >
            {#if isLoading}
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Squishing{selectedFiles.length > 1 ? ` ${selectedFiles.length} images` : ''}…</span>
            {:else if insufficientTokens}
                <span>Not enough tokens</span>
            {:else}
                <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <span>Squish{selectedFiles.length > 1 ? ` ${selectedFiles.length} images as ZIP` : ' your image'}</span>
            {/if}
        </button>
    </div>

    <!-- Success / error messages -->
    {#if successMessage || errorMessage}
        <div class="px-4 sm:px-6 pb-4 -mt-1 flex flex-col gap-2">
            {#if successMessage}
                <div class="px-4 py-3 bg-white/30 backdrop-blur-sm border border-[#A5D6A7]/50 rounded-2xl flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#66BB6A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-xs font-bold text-[#33691E]">{successMessage}</p>
                </div>
            {/if}
            {#if errorMessage}
                <div class="px-4 py-3 bg-white/30 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#EF5350] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-xs font-bold text-red-700">{errorMessage}</p>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Footer tray -->
    <div class="bg-white/20 backdrop-blur-md px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        {#if showTypes && !hasOutputOverride}
            <div class="flex items-center gap-1.5 flex-wrap">
                {#each formats as fmt}
                    <button
                        onclick={() => imageType = fmt.value}
                        class="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer {imageType === fmt.value ? 'bg-[#F06292] text-white shadow-sm' : 'bg-white/50 text-[#6C3F31] hover:bg-white/70 hover:text-[#F06292] border border-[#875F42]/20'}"
                    >
                        {fmt.label}
                    </button>
                {/each}
            </div>
        {:else}
            <span></span>
        {/if}

        <span class="text-xs text-[#6C3F31]/70 font-medium whitespace-nowrap flex-shrink-0">
            {#if isLoading}
                Processing…
            {:else if selectedFiles.length > 0}
                {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'} ready
                {#if selectedFiles.length > 1}
                    · <button onclick={resetForm} class="text-[#F06292]/70 hover:text-[#F06292] transition-colors cursor-pointer">clear all</button>
                {/if}
            {/if}
        </span>
    </div>
</div>

{#if showSignupCta}
<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onclick={() => showSignupCta = false}
    role="dialog"
    aria-modal="true"
>
    <div
        class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative"
        onclick={(e) => e.stopPropagation()}
    >
        <button
            onclick={() => showSignupCta = false}
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#875F42]/50 hover:text-[#875F42] hover:bg-[#FFF5F7] transition-all cursor-pointer"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        <div class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-[#FFF0F5] flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            </div>
            <h3 class="text-lg font-black text-[#4A2C2C] mb-2">You've hit the free limit</h3>
            <p class="text-sm text-[#875F42]/70 leading-relaxed mb-6">
                Without an account you get 3 free images per month. Create a free account for 30 images/month, or upgrade for even more.
            </p>
            <div class="flex flex-col gap-3">
                <a
                    href="/auth/register"
                    class="block px-6 py-3 rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white font-black text-sm shadow-[0_4px_16px_rgba(240,98,146,0.3)] hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)] hover:-translate-y-0.5 transition-all text-center"
                >
                    Create free account
                </a>
                <a
                    href="/pricing"
                    class="block px-6 py-3 rounded-2xl border border-[#875F42]/15 text-sm font-bold text-[#6C3F31] hover:border-[#F06292]/30 hover:text-[#F06292] hover:bg-[#FFF5F7] transition-all text-center"
                >
                    See plans
                </a>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .liquid-glass {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow:
            0 8px 32px 0 rgba(240, 98, 146, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
    }

    .liquid-bubble {
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.6),
            inset 0 -2px 4px rgba(0, 0, 0, 0.05),
            0 4px 12px rgba(240, 98, 146, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .liquid-glow {
        box-shadow:
            0 0 0 2px rgba(240, 98, 146, 0.4),
            0 0 40px rgba(240, 98, 146, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
    }
</style>
