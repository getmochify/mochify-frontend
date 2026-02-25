<script lang="ts">
    import { zip } from 'fflate';
    import { env } from '$env/dynamic/public';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.xyz';

    type FileProgress = {
        file: File;
        progress: number;
        status: 'pending' | 'processing' | 'complete' | 'error';
        error?: string;
        thumbnailUrl?: string;
    };

    const props = $props();
    let { types = ".JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF", showTypes = true, output = 'jpg', compact = false, theme = 'pink', class: className = '', queryParams = '', showExifOption = false, showSmartMode = false } = props;
    const hasOutputOverride = 'output' in props;

    let stripExif: boolean = $state(false);
    let smartCompress: boolean = $state(false);

    // Theme color mappings
    const colors = theme === 'blue' ? {
        border: 'border-blue-100',
        borderLight: 'border-blue-200',
        borderHover: 'hover:border-blue-400',
        bg: 'bg-blue-50',
        bgLight: 'bg-blue-100',
        text: 'text-blue-300',
        textHover: 'group-hover:text-blue-500',
        textDark: 'text-blue-500',
        textDarker: 'text-blue-600',
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-cyan-400',
        accentBg: 'bg-blue-50',
        accentBorder: 'border-blue-100',
        buttonFrom: 'from-blue-400',
        buttonTo: 'to-cyan-400',
        buttonHoverFrom: 'hover:from-blue-500',
        buttonHoverTo: 'hover:to-cyan-500'
    } : {
        border: 'border-[#FFF0F3]',
        borderLight: 'border-[#FFE5EC]',
        borderHover: 'hover:border-[#FFD6E0]',
        bg: 'bg-[#FFF0F3]',
        bgLight: 'bg-[#FFE5EC]',
        text: 'text-[#FFB3C6]',
        textHover: 'group-hover:text-[#F06292]',
        textDark: 'text-[#F06292]',
        textDarker: 'text-[#FF6B8A]',
        gradientFrom: 'from-[#FFB3C6]',
        gradientTo: 'to-[#E0ACD5]',
        accentBg: 'bg-[#FFF0F3]',
        accentBorder: 'border-[#FFE5EC]',
        buttonFrom: 'from-[#FFB3C6]',
        buttonTo: 'to-[#E0ACD5]',
        buttonHoverFrom: 'hover:from-[#F06292]',
        buttonHoverTo: 'hover:to-[#D89AC7]'
    };

    let selectedFiles: File[] = $state([]);
    let fileProgress: FileProgress[] = $state([]);
    let imageType: string = $state(output);
    let isLoading: boolean = $state(false);
    let errorMessage: string = $state('');
    let successMessage: string = $state('');
    let totalOriginalSize: number = $state(0);
    let fileInputElement: HTMLInputElement;
    const MAX_FILES = 25;
    const CONCURRENT_UPLOADS = 2;
    const MAX_INDIVIDUAL_FILE_SIZE = 20 * 1024 * 1024; // 20MB
    
    // Token limit tracking
    let availableTokens: number = $state(0);
    let hasCheckedTokens: boolean = $state(false);
    let tokenCheckError: boolean = $state(false);

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            processFiles(Array.from(target.files));
            // Reset the input so the same file can be selected again
            target.value = '';
        }
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            processFiles(Array.from(event.dataTransfer.files));
        }
    }

    async function checkTokenLimit(): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/v1/checkTokens`);
            if (!response.ok) {
                throw new Error('Failed to check token limit');
            }
            const data = await response.json();
            availableTokens = (data.free_tokens || 0) + (data.paid_tokens || 0);
            hasCheckedTokens = true;
            tokenCheckError = false;
        } catch (error) {
            console.error('Token check failed:', error);
            tokenCheckError = true;
            hasCheckedTokens = false;
        }
    }

    // Helper to unify file processing logic
    async function processFiles(allFiles: File[]) {
        const oversizedFiles = allFiles.filter(f => f.size > MAX_INDIVIDUAL_FILE_SIZE);
        
        if (oversizedFiles.length > 0) {
            errorMessage = `Individual file size limit is 20MB. ${oversizedFiles.length} file(s) exceed this limit.`;
            return;
        }
        
        // Filter out duplicates based on name and size
        const existingFileKeys = new Set(
            selectedFiles.map(f => `${f.name}-${f.size}`)
        );
        const newFiles = allFiles.filter(
            f => !existingFileKeys.has(`${f.name}-${f.size}`)
        );
        
        // Combine existing and new files, respecting MAX_FILES limit
        const combinedFiles = [...selectedFiles, ...newFiles].slice(0, MAX_FILES);
        const addedCount = combinedFiles.length - selectedFiles.length;
        
        selectedFiles = combinedFiles;
        fileProgress = combinedFiles.map(file => {
            // Preserve existing progress for files already in the list
            const existing = fileProgress.find(fp => fp.file === file);
            if (existing) {
                return existing;
            }
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
            errorMessage = `Maximum ${MAX_FILES} files. Added ${addedCount} file(s).`;
        }
        
        // Check token limit after files are added
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

    // Check if user has enough tokens for the selected files
    const insufficientTokens = $derived(
        hasCheckedTokens && selectedFiles.length > 0 && selectedFiles.length > availableTokens
    );

    async function compressImage() {
        if (selectedFiles.length === 0) {
            errorMessage = 'Please select at least one image';
            return;
        }

        isLoading = true;
        errorMessage = '';
        successMessage = '';

        fileProgress = selectedFiles.map(file => ({
            file,
            progress: 0,
            status: 'pending' as const
        }));

        try {
            if (typeof window.umami !== 'undefined') {
                window.umami.track('compress-image', {
                    format: imageType,
                    fileCount: selectedFiles.length,
                    totalSize: formatFileSize(totalOriginalSize)
                });
            }

            let totalCompressedSize = 0;
            const compressedBlobs: Blob[] = new Array(selectedFiles.length);
            let hitRateLimit = false;

            const processFile = async (index: number) => {
                const file = selectedFiles[index];
                fileProgress[index].status = 'processing';
                fileProgress[index].progress = 0;
                
                try {
                    // Use XMLHttpRequest for upload progress tracking
                    const blob = await new Promise<Blob>((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        
                        // Track upload progress (0-40%)
                        xhr.upload.addEventListener('progress', (e) => {
                            if (e.lengthComputable) {
                                const uploadProgress = (e.loaded / e.total) * 40;
                                fileProgress[index].progress = Math.round(uploadProgress);
                            }
                        });
                        
                        // Track download progress (60-100%)
                        xhr.addEventListener('progress', (e) => {
                            if (e.lengthComputable) {
                                const downloadProgress = 60 + (e.loaded / e.total) * 40;
                                fileProgress[index].progress = Math.round(downloadProgress);
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
                        
                        // Upload complete, processing on server (40-60%)
                        xhr.upload.addEventListener('load', () => {
                            fileProgress[index].progress = 40;
                            // Simulate server processing phase
                            setTimeout(() => {
                                if (fileProgress[index].progress < 60) {
                                    fileProgress[index].progress = 50;
                                }
                            }, 100);
                        });
                        
                        xhr.open('POST', `${API_URL}/v1/squish?type=${imageType}&strip_exif=${stripExif}${smartCompress ? '&smartCompress=1' : ''}${queryParams ? '&' + queryParams : ''}`);
                        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
                        xhr.responseType = 'blob';
                        xhr.send(file);
                    });

                    compressedBlobs[index] = blob;
                    totalCompressedSize += blob.size;
                    
                    fileProgress[index].progress = 100;
                    fileProgress[index].status = 'complete';
                } catch (error: any) {
                    fileProgress[index].status = 'error';
                    
                    // Check if it's a 429 rate limit error
                    if (error.status === 429) {
                        hitRateLimit = true;
                        fileProgress[index].error = 'Rate limit exceeded';
                    } else {
                        fileProgress[index].error = error instanceof Error ? error.message : 'Unknown error';
                    }
                }
            };

            // Process files in batches, but stop if we hit rate limit
            batchLoop: for (let i = 0; i < selectedFiles.length; i += CONCURRENT_UPLOADS) {
                const batch = [];
                for (let j = i; j < Math.min(i + CONCURRENT_UPLOADS, selectedFiles.length); j++) {
                    batch.push(processFile(j));
                }
                await Promise.allSettled(batch);
                
                // If any file in this batch hit rate limit, stop processing
                if (hitRateLimit) {
                    break batchLoop;
                }
            }

            // --- DOWNLOAD LOGIC (fflate) ---
            
            // Filter for only successful conversions
            const successfulFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'complete');
            const failedFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'error');
            
            if (successfulFiles.length === 0) {
                throw new Error('All files failed to convert');
            }
            
            if (successfulFiles.length === 1) {
                const index = selectedFiles.findIndex((_, i) => fileProgress[i].status === 'complete');
                const nameWithoutExt = successfulFiles[0].name.replace(/\.[^/.]+$/, '');
                const extension = imageType === 'jpeg' ? 'jpg' : imageType;
                const newFileName = `${nameWithoutExt}.${extension}`;
                downloadBlob(compressedBlobs[index], newFileName);
            } else {
                // Multiple files: Zip with fflate (only successful ones)
                const zipData: Record<string, Uint8Array> = {};

                // 1. Convert Blobs to Uint8Arrays in parallel (only successful files)
                await Promise.all(selectedFiles.map(async (file, i) => {
                    if (fileProgress[i].status !== 'complete') return;
                    
                    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                    const extension = imageType === 'jpeg' ? 'jpg' : imageType;
                    const fileName = `${nameWithoutExt}.${extension}`;
                    
                    // Read blob into buffer for fflate
                    const buffer = await compressedBlobs[i].arrayBuffer();
                    zipData[fileName] = new Uint8Array(buffer);
                }));

                // 2. Generate Zip (Level 0 - Store only)
                const zipContent = await new Promise<Uint8Array>((resolve, reject) => {
                    zip(zipData, { level: 0 }, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                const zipBlob = new Blob([zipContent], { type: 'application/zip' });
                downloadBlob(zipBlob, 'compressed-images.zip');
            }
            // --------------------------------

            const reduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
            const spaceSaved = formatFileSize(totalOriginalSize - totalCompressedSize);

            if (hitRateLimit) {
                const pendingFiles = fileProgress.filter(fp => fp.status === 'pending').length;
                successMessage = `Rate limit reached! Downloaded ${successfulFiles.length} successful conversion(s). ${pendingFiles} file(s) remain in queue - please wait a moment before retrying.`;
            } else if (failedFiles.length > 0) {
                successMessage = `${successfulFiles.length} of ${selectedFiles.length} images squished successfully! Saved ${spaceSaved}. ${failedFiles.length} file(s) failed.`;
            } else {
                successMessage = selectedFiles.length === 1
                    ? `Successfully squished! You saved ${spaceSaved} (${reduction}% reduction).`
                    : `Batch complete! ${selectedFiles.length} images optimized. Total space saved: ${spaceSaved}.`;
            }

            if (typeof window.umami !== 'undefined') {
                window.umami.track('compress-success', {
                    format: imageType,
                    fileCount: selectedFiles.length,
                    reduction: `${reduction}%`,
                    finalSize: formatFileSize(totalCompressedSize)
                });
            }

            // Remove successfully processed files from the queue
            fileProgress.forEach(fp => {
                if (fp.thumbnailUrl) {
                    URL.revokeObjectURL(fp.thumbnailUrl);
                }
            });
            selectedFiles = selectedFiles.filter((_, i) => fileProgress[i].status !== 'complete');
            fileProgress = fileProgress.filter(fp => fp.status !== 'complete');
            totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
            
            // Reset file input to allow selecting new files
            if (fileInputElement) {
                fileInputElement.value = '';
            }
            
            // Re-check token limit after successful compression
            await checkTokenLimit();
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
            if (typeof window.umami !== 'undefined') {
                window.umami.track('compress-error', {
                    format: imageType,
                    fileCount: selectedFiles.length,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        } finally {
            isLoading = false;
        }
    }

    // Helper to handle the actual download trigger
    function downloadBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Handle extension logic for single files if needed
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
            if (fp.thumbnailUrl) {
                URL.revokeObjectURL(fp.thumbnailUrl);
            }
        });
        selectedFiles = [];
        fileProgress = [];
        totalOriginalSize = 0;
        errorMessage = '';
        successMessage = '';
        imageType = 'jpg';
        
        // Reset file input
        if (fileInputElement) {
            fileInputElement.value = '';
        }
    }

    function removeFile(index: number) {
        if (fileProgress[index].thumbnailUrl) {
            URL.revokeObjectURL(fileProgress[index].thumbnailUrl!);
        }
        selectedFiles = selectedFiles.filter((_, i) => i !== index);
        fileProgress = fileProgress.filter((_, i) => i !== index);
        totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    }
</script>

<div class={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border ${colors.border} overflow-hidden ${className}`.trim()}>
    <div class={compact ? 'p-6 lg:p-8' : 'p-8 lg:p-12'}>
        <!-- Upload Section -->
        <div class={compact ? 'mb-6' : 'mb-8'}>
            <label for="file-input" class="block">
                <input
                    bind:this={fileInputElement}
                    id="file-input"
                    type="file"
                    accept={types}
                    multiple
                    onchange={handleFileSelect}
                    class="hidden"
                />
                <div 
                    class={`border-[4px] border-dashed ${colors.borderLight} ${colors.borderHover} rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 bg-[#FFF5F7] hover:${colors.bg} group`}
                    ondragover={handleDragOver}
                    ondrop={handleDrop}
                    role="button"
                    tabindex="0"
                    aria-label="Upload image by clicking or dragging and dropping"
                >
                    <svg class={`w-16 h-16 mx-auto mb-4 ${colors.text} ${colors.textHover} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-lg text-[#6C3F31] font-semibold mb-1">
    {selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected` : 'Drop your images here or click to browse'}
</p>
                <p class="text-sm text-[#B38B91]">
    {types} supported · Max {MAX_FILES} files
</p>
                </div>
            </label>

            {#if selectedFiles.length > 0}
            <div class="mt-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-semibold text-gray-700">Selected Files</h3>
                    {#if selectedFiles.length > 1}
                    <button 
                        onclick={resetForm}
                        class={`text-xs ${colors.textDark} hover:${colors.textDarker} font-medium cursor-pointer`}
                    >
                        Clear All
                    </button>
                    {/if}
                </div>
                <div class="space-y-2 overflow-visible">
                    {#each fileProgress as fp, index}
                    <div class="p-3 pl-4 bg-[#FFF8E1] rounded-xl border border-pink-100 overflow-visible">
                        <div class="relative flex items-center justify-between mb-2">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class="relative flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    {#if fp.thumbnailUrl}
                                        <img src={fp.thumbnailUrl} alt={fp.file.name} class="w-full h-full rounded-lg object-cover" />
                                    {:else}
                                        <svg class="w-5 h-5 text-[#FFB3C6]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                                        </svg>
                                    {/if}

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
                                </div>

                                <div class="flex flex-col min-w-0">
                                    <span class="text-sm text-gray-700 truncate font-medium">{fp.file.name}</span>
                                    <span class="text-xs text-gray-500">({formatFileSize(fp.file.size)})</span>
                                </div>
                            </div>
                            
                            {#if fp.status === 'pending' || fp.status === 'complete' || fp.status === 'error'}
                                <button
                                    onclick={() => removeFile(index)}
                                    class="absolute -top-2 -right-2 z-10 group bg-white hover:bg-red-50 text-[#875F42] hover:text-red-500 border border-pink-100 p-1.5 rounded-full shadow-sm hover:shadow-md active:scale-90 transition-all duration-200 ease-in-out cursor-pointer"
                                    title="Remove file"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            {/if}
                        </div>

                        {#if fp.status === 'processing'}
                        <div class="w-full h-2 bg-[#FFF0F3] rounded-full overflow-hidden border border-pink-50 shadow-inner">
                            <div 
                                class="h-full bg-gradient-to-r from-[#F06292] to-[#FFB3C6] rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(240,98,146,0.4)]"
                                style="width: {fp.progress}%"
                            ></div>
                        </div>
                        {/if}

                        {#if fp.status === 'error' && fp.error}
                        <div class="flex items-center gap-1 mt-2 text-[#C62828]">
                            <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            <p class="text-xs font-bold">{fp.error}</p>
                        </div>
                        {/if}
                    </div>
                    {/each}
                </div>
            </div>
            {/if}
        </div>

        {#if showTypes && !hasOutputOverride}
        <!-- Controls Grid -->
        <div class={`grid gap-6 grid-cols-1 ${compact ? 'mb-6' : 'mb-8'}`}>
            <!-- Format Control -->
            <div class="space-y-3">
                <label for="type" class="block text-[#6C3F31] font-semibold">
                    Output Format
                </label>
                <select
                    id="type"
                    bind:value={imageType}
                    class={`appearance-none bg-white border border-pink-100 text-[#6C3F31] rounded-xl px-6 py-3 pr-12 font-bold shadow-sm focus:ring-2 focus:ring-pink-200 transition-all cursor-pointer w-full`}
                >
                    <option value="jpg">JPEG — The Classic (Works Everywhere)</option>
                    <option value="png">PNG — Pixel Perfect (Lossless & Sharp)</option>
                    <option value="webp">WebP — Fast & Fresh (Great for Web)</option>
                    <option value="avif">AVIF — Extra Small (Tiny Files, Huge Quality)</option>
                    <option value="jxl">JPEG XL — The Future (Best-in-Class Compression)</option>
                </select>
            </div>
        </div>
        {/if}

{#if showExifOption}
<div class="mb-6 flex items-center gap-3 p-4 bg-[#FFF8E1] rounded-2xl border border-[#FFE082]/50 shadow-sm transition-colors hover:bg-[#FFF3CD]">
    <label class="relative flex items-center cursor-pointer select-none">
        <input 
            type="checkbox" 
            bind:checked={stripExif}
            class="sr-only" 
        />
        
        <div class={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-inner
            ${stripExif ? 'bg-[#F06292] border-[#F06292]' : 'bg-white border-[#FFD54F]'}
        `}>
            
            <svg 
                class={`w-4 h-4 text-white transition-all duration-200 ${stripExif ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>

        <div class="ml-3">
            <span class="block text-sm font-bold text-[#6C3F31]">Remove EXIF Data</span>
            <span class="block text-xs text-[#875F42]/80">Strip GPS and camera metadata for extra privacy.</span>
        </div>
    </label>
</div>
{/if}

{#if showSmartMode}
<div class="mb-6 flex items-center gap-3 p-4 bg-[#E8F5E9] rounded-2xl border border-[#A5D6A7]/50 shadow-sm transition-colors hover:bg-[#C8E6C9]">
    <label class="relative flex items-center cursor-pointer select-none">
        <input 
            type="checkbox" 
            bind:checked={smartCompress}
            class="sr-only" 
        />
        
        <div class={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-inner
            ${smartCompress ? 'bg-[#66BB6A] border-[#66BB6A]' : 'bg-white border-[#A5D6A7]'}
        `}>
            
            <svg 
                class={`w-4 h-4 text-white transition-all duration-200 ${smartCompress ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>

        <div class="ml-3">
            <span class="block text-sm font-bold text-[#6C3F31]">Smart Mode</span>
            <span class="block text-xs text-[#875F42]/80">Intelligently optimize compression for best quality-to-size ratio.</span>
        </div>
    </label>
</div>
{/if}

        {#if hasCheckedTokens && selectedFiles.length > 0 && !insufficientTokens}
            <div class="mb-6 px-6 py-4 bg-[#E8F5E9] border-2 border-[#A5D6A7] rounded-2xl flex items-center gap-3 shadow-sm">
                <svg class="w-5 h-5 text-[#66BB6A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <p class="text-sm text-[#33691E] font-semibold">
                    Ready to squish! You have <span class="font-bold">{availableTokens} token{availableTokens !== 1 ? 's' : ''}</span> available.
                </p>
            </div>
        {/if}

        {#if insufficientTokens}
            <div class="mb-6 px-6 py-4 bg-[#FFF3CD] border-2 border-[#FFD54F] rounded-2xl flex items-start gap-3 shadow-sm">
                <svg class="w-6 h-6 text-[#F57C00] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div>
                    <p class="text-[#6C3F31] font-bold mb-1">Not enough tokens!</p>
                    <p class="text-sm text-[#875F42]">
                        You have <span class="font-bold">{availableTokens} token{availableTokens !== 1 ? 's' : ''}</span> available but selected <span class="font-bold">{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}</span>. 
                        Please remove {selectedFiles.length - availableTokens} file{selectedFiles.length - availableTokens !== 1 ? 's' : ''} to continue.
                    </p>
                </div>
            </div>
        {/if}

        <!-- Action Button -->
        <button
            onclick={compressImage}
            disabled={selectedFiles.length === 0 || isLoading || insufficientTokens}
            class={`w-full py-4 px-6 bg-[#A5D6A7] hover:bg-[#81C784] hover:scale-[1.02] active:scale-[0.96] active:brightness-95 disabled:bg-[#EFEBE9] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 group cursor-pointer`}
        >
            {#if isLoading}
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Squishing {selectedFiles.length > 1 ? `${selectedFiles.length} images` : ''}...</span>
            {:else if insufficientTokens}
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>Insufficient Tokens</span>
            {:else}
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <span>Squish your images{selectedFiles.length > 1 ? ' as ZIP' : ''}</span>			
            {/if}
        </button>
        <!-- Messages -->
        {#if successMessage}
            <div class="mt-4 bg-[#F1F8E9] border-2 border-[#A5D6A7] text-[#33691E] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-bounce-short">
                <svg class="w-6 h-6 text-[#66BB6A]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <p class="font-bold">{successMessage}</p>
            </div>
        {/if}

        {#if errorMessage}
            <div class="mt-4 px-6 py-4 bg-[#FFF5F5] border-2 border-red-200 rounded-2xl flex items-center gap-3 shadow-sm animate-bounce-short">
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-[#EF5350] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-red-700 font-bold">{errorMessage}</p>
                </div>
            </div>
        {/if}
    </div>
</div>