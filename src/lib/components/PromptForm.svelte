<script lang="ts">
    import { tick } from 'svelte';
    import { zip } from 'fflate';
    import { env } from '$env/dynamic/public';
    import { getAccessToken, getIsPro, getPlan } from '$lib/supabase';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.xyz';

    let { onSuccess, onBgRemovalUpsell }: { onSuccess?: () => void; onBgRemovalUpsell?: () => void } = $props();

    let prompt: string = $state('');
    let files: File[] = $state([]);
    let isDragging: boolean = $state(false);
    
    let isProcessing: boolean = $state(false);
    let processPhase: 'idle' | 'thinking' | 'uploading' | 'downloading' | 'packing' = $state('idle');
    let thinkingText: string = $state("Initializing...");

    let uploadPercent: number = $state(0);
    let downloadPercent: number = $state(0);
    let completedFiles: number = $state(0);
    let totalFiles: number = $state(0);
    let downloadAsZip: boolean = $state(false);
    
    let textareaEl: HTMLTextAreaElement;
    let fileInputEl: HTMLInputElement;

    const placeholders = [
        'Describe what you want…',
        'Convert all to WebP…',
        'Resize the first image to 500px, convert all to AVIF…',
        'Optimize these for Shopify…',
        'Compress everything but keep the EXIF data…',
        'Convert to JPEG at 80% quality…',
    ];
    let displayedPlaceholder = $state('');
    $effect(() => {
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            const full = placeholders[index];
            if (!isDeleting) {
                charIndex++;
                displayedPlaceholder = full.slice(0, charIndex);
                if (charIndex === full.length) {
                    isDeleting = true;
                    timeoutId = setTimeout(tick, 2200);
                } else {
                    timeoutId = setTimeout(tick, 55);
                }
            } else {
                charIndex--;
                displayedPlaceholder = full.slice(0, charIndex);
                if (charIndex === 0) {
                    isDeleting = false;
                    index = (index + 1) % placeholders.length;
                    timeoutId = setTimeout(tick, 350);
                } else {
                    timeoutId = setTimeout(tick, 28);
                }
            }
        };

        timeoutId = setTimeout(tick, 800);
        return () => clearTimeout(timeoutId);
    });

    let MAX_FILE_SIZE = $state(20 * 1024 * 1024); // 20MB, 75MB for pro/lite
    let MAX_FILES = $state(3); // 3 for free, 25 for lite/pro
    $effect(() => {
        getIsPro().then(isPro => { MAX_FILE_SIZE = isPro ? 75 * 1024 * 1024 : 20 * 1024 * 1024; });
        getPlan().then(plan => { MAX_FILES = plan === 'free' ? 3 : 25; });
    });

    // Status state
    let statusMessage: { type: 'success' | 'error' | null, text: string } = $state({ type: null, text: '' });
    let statusTimeout: ReturnType<typeof setTimeout>;

    function showStatus(type: 'success' | 'error', text: string) {
        statusMessage = { type, text };
        if (statusTimeout) clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => {
            statusMessage = { type: null, text: '' };
        }, 5000); 
    }

    const ACCEPTED_MIME_TYPES = new Set([
        'image/jpeg', 'image/heic', 'image/heif', 'image/avif',
        'image/png', 'image/jxl', 'image/webp'
    ]);
    const ACCEPTED_EXTENSIONS = new Set([
        'jpg', 'jpeg', 'heic', 'heif', 'hif', 'avif', 'png', 'jxl', 'webp'
    ]);

    function validateAndAddFiles(newFiles: File[]) {
        const validFiles = [];
        let rejectedCount = 0;

        for (const f of newFiles) {
            const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
            const accepted = ACCEPTED_MIME_TYPES.has(f.type) || ACCEPTED_EXTENSIONS.has(ext);
            if (f.size > MAX_FILE_SIZE) {
                rejectedCount++;
            } else if (accepted) {
                validFiles.push(f);
            }
        }

        if (rejectedCount > 0) {
            showStatus('error', `${rejectedCount} file(s) ignored (exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit)`);
        }

        const available = MAX_FILES - files.length;
        const toAdd = validFiles.slice(0, available);
        const overflow = validFiles.length - toAdd.length;
        if (overflow > 0) {
            showStatus('error', `Free plan is limited to ${MAX_FILES} files. Upgrade to Lite or Pro for batches up to 25.`);
        }
        files = [...files, ...toAdd];
    }

    const suggestions = [
        'Convert to WebP',
        'Convert to JPEG XL',
        'Resize to 500px wide and convert to AVIF',
        'Make square',
        'Compress for web, strip EXIF data',
        'Convert to PNG',
    ];

    function fillPrompt(text: string) {
        prompt = text;
        tick().then(() => {
            autoGrow();
            textareaEl?.focus();
        });
    }

    function autoGrow() {
        if (!textareaEl) return;
        textareaEl.style.height = 'auto';
        textareaEl.style.height = Math.min(textareaEl.scrollHeight, 200) + 'px';
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
            isDragging = false;
        }
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        const dropped = Array.from(e.dataTransfer?.files ?? []);
        validateAndAddFiles(dropped);
        tick().then(() => textareaEl?.focus());
    }

    function handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            validateAndAddFiles(Array.from(input.files));
            input.value = '';
        }
    }

    function removeFile(i: number) {
        files = files.filter((_, idx) => idx !== i);
    }

    function getDimensions(file: File): Promise<{w: number, h: number}> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                window.URL.revokeObjectURL(img.src);
                resolve({ w: img.width, h: img.height });
            };
            img.onerror = () => {
                window.URL.revokeObjectURL(img.src);
                resolve({ w: 0, h: 0 }); 
            };
            img.src = window.URL.createObjectURL(file);
        });
    }

    async function submit() {
        if (!prompt.trim() || files.length === 0 || isProcessing) return;

        isProcessing = true;
        processPhase = 'thinking';
        uploadPercent = 0;
        downloadPercent = 0;
        completedFiles = 0;

        const messages = [
            "Reading image dimensions...",
            "Consulting the AI Brain...",
            "Calculating resize ratios...",
            "Optimizing output format...",
            "Preparing to squish..."
        ];

        thinkingText = messages[0];
        let msgIdx = 1;

        const msgInterval = setInterval(() => {
            if (processPhase === 'thinking') {
                thinkingText = messages[msgIdx % messages.length];
                msgIdx++;
            }
        }, 800);

        try {
            const fileDetails = await Promise.all(files.map(async (f) => {
                const dims = await getDimensions(f);
                return { name: f.name, width: dims.w, height: dims.h };
            }));

            const jwt = await getAccessToken()
            const nlpResponse = await fetch(`${API_URL}/v1/prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
                },
                body: JSON.stringify({ prompt: prompt.trim(), fileData: fileDetails })
            });

            if (!nlpResponse.ok) throw new Error(`Failed to understand prompt (Status: ${nlpResponse.status})`);

            const parsedData = await nlpResponse.json();
            const fileArray = parsedData.files || [];
            const fileMap: Record<string, any> = {};
            fileArray.forEach((item: any) => { fileMap[item.filename] = item; });

            // Detect background removal requested by NLP
            const bgRemovalRequested = fileArray.some((item: any) => item.removeBackground);
            const plan = await getPlan();
            const bgRemovalBlocked = bgRemovalRequested && plan === 'free';
            if (bgRemovalBlocked) {
                // Strip the param so we still process the images without it
                fileArray.forEach((item: any) => { delete item.removeBackground; });
            }

            processPhase = 'uploading';
            totalFiles = files.length;
            const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
            let uploadedBytes = 0;
            let processedFiles = 0;
            let currentFileIndex = 0;
            const CONCURRENCY_LIMIT = 1;
            const zipContents: Record<string, Uint8Array> = {};

            const squishFile = (file: File, params: URLSearchParams): Promise<Blob> =>
                new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `${API_URL}/v1/squish?${params}`);
                    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
                    if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
                    xhr.responseType = 'blob';

                    let lastLoaded = 0;
                    xhr.upload.onprogress = (e) => {
                        const delta = e.loaded - lastLoaded;
                        lastLoaded = e.loaded;
                        uploadedBytes += delta;
                        uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                    };

                    xhr.onload = () => {
                        // Account for any bytes not reported via onprogress
                        const remaining = file.size - lastLoaded;
                        if (remaining > 0) {
                            uploadedBytes += remaining;
                            uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                        }

                        const contentType = xhr.getResponseHeader('content-type') || '';
                        if (contentType.includes('application/json')) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                try {
                                    const err = JSON.parse(reader.result as string);
                                    reject(new Error(err.error || err.message || `Server rejected ${file.name}`));
                                } catch {
                                    reject(new Error(`Server rejected ${file.name}`));
                                }
                            };
                            reader.readAsText(xhr.response as Blob);
                            return;
                        }
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response as Blob);
                        } else {
                            reject(new Error(`Failed processing ${file.name} (Status: ${xhr.status})`));
                        }
                    };

                    xhr.onerror = () => reject(new Error(`Network error processing ${file.name}`));
                    xhr.send(file);
                });

            const processNextFile = async () => {
                while (currentFileIndex < files.length) {
                    const file = files[currentFileIndex++];
                    const fileConfig = fileMap[file.name] || {};

                    const params = new URLSearchParams();
                    if (fileConfig.type) params.append('type', fileConfig.type);
                    if (fileConfig.smartCompress) params.append('smartCompress', '1');
                    if (fileConfig.removeBackground) params.append('removeBackground', '1');
                    // Default to stripping EXIF; NLP can explicitly set stripExif: 0 to preserve it
                    const stripExif = fileConfig.stripExif !== undefined ? fileConfig.stripExif : 1;
                    params.append('strip_exif', stripExif ? '1' : '0');

                    for (const [key, value] of Object.entries(fileConfig)) {
                        if (key !== 'smartCompress' && key !== 'type' && key !== 'removeBackground' && key !== 'stripExif') {
                            if (value !== false && value !== 0) params.append(key, String(value));
                        }
                    }

                    try {
                        const blob = await squishFile(file, params);

                        // First result back from server — switch to downloading phase
                        if (processPhase === 'uploading') processPhase = 'downloading';

                        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        const newExtension = fileConfig.type || file.name.split('.').pop();
                        const finalName = `${baseName}_mochified.${newExtension}`;

                        if (downloadAsZip) {
                            const arrayBuffer = await blob.arrayBuffer();
                            zipContents[finalName] = new Uint8Array(arrayBuffer as ArrayBuffer);
                        } else {
                            const downloadUrl = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = downloadUrl;
                            a.download = finalName;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                                window.URL.revokeObjectURL(downloadUrl);
                                document.body.removeChild(a);
                            }, 100);
                        }
                    } catch (e) {
                        console.error(`Error squishing ${file.name}:`, e);
                    }

                    processedFiles++;
                    completedFiles = processedFiles;
                    downloadPercent = Math.round((processedFiles / totalFiles) * 100);
                }
            };

            const workers = [];
            for (let i = 0; i < Math.min(CONCURRENCY_LIMIT, files.length); i++) {
                workers.push(processNextFile());
            }

            await Promise.all(workers);

            if (downloadAsZip && Object.keys(zipContents).length > 0) {
                processPhase = 'packing';

                await new Promise<void>((resolve, reject) => {
                    zip(zipContents, { level: 0 }, (err, zippedData) => {
                        if (err) return reject(err);

                        const zipBlob = new Blob([zippedData], { type: 'application/zip' });
                        const url = URL.createObjectURL(zipBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'mochified_batch.zip';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                            resolve();
                        }, 100);
                    });
                });
            }

            prompt = '';
            files = [];
            if (bgRemovalBlocked) {
                showStatus('success', 'Images processed! Background removal needs Lite or Pro. ✨');
                onBgRemovalUpsell?.();
            } else {
                showStatus('success', 'Images processed successfully! ✨');
                onSuccess?.();
            }

        } catch (err) {
            console.error(err);
            showStatus('error', err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            isProcessing = false;
            processPhase = 'idle';
            clearInterval(msgInterval);
        }
    }
</script>

{#if statusMessage.type}
    <div class="fixed top-4 right-4 sm:top-24 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-50 animate-fade-in pointer-events-none">
        <div class="px-5 py-3 rounded-2xl backdrop-blur-md border shadow-xl flex items-center gap-3 transition-all duration-300
            {statusMessage.type === 'error' 
                ? 'bg-red-50/90 border-red-200 text-red-800 shadow-red-500/10' 
                : 'bg-[#F4FBF2]/90 border-[#A5D6A7]/50 text-[#2E5C31] shadow-green-500/10'}">
            
            {#if statusMessage.type === 'error'}
                <svg class="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            {:else}
                <svg class="w-5 h-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            {/if}
            
            <span class="font-bold text-sm sm:text-base tracking-tight">{statusMessage.text}</span>
        </div>
    </div>
{/if}

<div class="w-full max-w-3xl">
    <div class="relative rounded-[2rem] transition-all duration-300 {isDragging ? 'scale-[1.02] liquid-glow' : ''}">
        
        <div 
            class="liquid-glass relative rounded-[2rem] overflow-hidden transition-all duration-300"
            ondragover={handleDragOver}
            ondragleave={handleDragLeave}
            ondrop={handleDrop}
            role="region"
            aria-label="Image processing prompt input area"
        >
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10"></div>

            {#if isDragging}
                <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-pink-50/70 to-white/50 backdrop-blur-md pointer-events-none rounded-[2rem]">
                    <div class="w-14 h-14 rounded-2xl bg-white/90 shadow-xl shadow-pink-200/60 flex items-center justify-center mb-3 animate-float">
                        <svg class="w-6 h-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                        </svg>
                    </div>
                    <p class="text-[#4A2C2C] font-black text-lg tracking-tight">Drop to squish</p>
                </div>
            {/if}

            {#if files.length > 0}
                <div class="flex items-center gap-3 flex-wrap px-4 sm:px-6 pt-6 pb-2 relative">
                    {#each files as file, i}
                        <div class="relative group flex-shrink-0 animate-fade-in">
                            <div class="liquid-bubble w-16 h-16 rounded-2xl overflow-hidden p-1">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    class="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <button
                                onclick={() => removeFile(i)}
                                class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/90 text-[#F06292] hover:text-red-500 hover:bg-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-md sm:hover:scale-110 cursor-pointer backdrop-blur-sm"
                                aria-label="Remove {file.name}"
                            >
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    {/each}
                    <button
                        onclick={() => fileInputEl?.click()}
                        class="liquid-bubble flex-shrink-0 w-16 h-16 rounded-2xl border border-dashed border-[#F06292]/30 hover:bg-white/60 transition-all flex items-center justify-center text-[#F06292]/60 hover:text-[#F06292] hover:scale-105 cursor-pointer shadow-sm"
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
            {/if}

            <div class="flex flex-wrap sm:flex-nowrap items-end gap-x-3 gap-y-4 px-4 sm:px-6 py-4 sm:py-5">
                
                <div class="order-2 sm:order-1 flex items-center gap-2 sm:gap-3 flex-shrink-0 bg-white/20 p-1.5 rounded-2xl backdrop-blur-sm shadow-inner border border-white/30">
                    
                    <button onclick={() => fileInputEl?.click()} class="p-2 rounded-xl text-[#875F42]/80 hover:text-[#F06292] hover:bg-white/60 transition-all cursor-pointer" aria-label="Attach images">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
                        </svg>
                    </button>
                    
                    <div class="w-[1px] h-6 bg-white/40"></div>
                    
                    <label class="flex items-center gap-2 cursor-pointer group pr-2" title="Download as ZIP">
                        <div class="relative">
                            <input type="checkbox" bind:checked={downloadAsZip} class="sr-only">
                            <div class="block w-8 h-4 rounded-full transition-all duration-300 border {downloadAsZip ? 'bg-[#C8E6C9] border-[#C8E6C9] shadow-[0_0_8px_rgba(200,230,201,0.8)]' : 'bg-[#e8f5e9] border-[#C8E6C9]/40 shadow-inner'}"></div>
                            <div class="dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-300 shadow-sm {downloadAsZip ? 'transform translate-x-4' : ''}"></div>
                        </div>
                        <span class="text-[10px] font-extrabold tracking-widest uppercase transition-colors duration-300 {downloadAsZip ? 'text-[#2E5C31]' : 'text-[#875F42]/60'}">ZIP</span>
                    </label>
                </div>

                <input bind:this={fileInputEl} type="file" multiple accept=".jpg,.jpeg,.heic,.heif,.hif,.avif,.png,.jxl,.webp,image/jpeg,image/heic,image/heif,image/avif,image/png,image/jxl,image/webp" onchange={handleFileSelect} class="hidden"/>
                
                <textarea 
                    bind:this={textareaEl} 
                    bind:value={prompt} 
                    oninput={autoGrow} 
                    onkeydown={handleKeydown} 
                    placeholder={displayedPlaceholder}
                    rows="1" 
                    class="order-1 sm:order-2 w-full sm:flex-1 resize-none border-0 bg-transparent text-[#4A2C2C] placeholder-[#875F42]/40 text-base sm:text-lg leading-relaxed focus:outline-none focus:ring-0 font-medium min-h-[48px] max-h-[200px] overflow-y-auto py-2.5 [appearance:none]"
                ></textarea>
                
                <button 
                    onclick={submit} 
                    disabled={!prompt.trim() || files.length === 0 || isProcessing} 
                    class="order-3 ml-auto sm:ml-0 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 
                    {prompt.trim() && files.length > 0 && !isProcessing 
                        ? 'bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_4px_16px_rgba(240,98,146,0.4)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_0_8px_24px_rgba(240,98,146,0.6)] hover:-translate-y-0.5 cursor-pointer' 
                        : 'bg-white/50 text-[#F06292]/30 border border-white/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] cursor-not-allowed'}"
                >
                    {#if isProcessing}
                        <svg class="w-5 h-5 animate-spin drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                        </svg>
                    {:else}
                        <svg class="w-5 h-5 translate-x-[1px] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                        </svg>
                    {/if}
                </button>
            </div> 

            <div class="bg-white/20 backdrop-blur-md">
                {#if isProcessing}
                    <div class="h-1 bg-white/20 overflow-hidden relative">
                        {#if processPhase === 'thinking' || processPhase === 'packing'}
                            <div class="absolute inset-0 bg-gradient-to-r from-[#F06292] to-[#e040a0] opacity-60 animate-pulse"></div>
                        {:else if processPhase === 'uploading'}
                            <div class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(240,98,146,0.5)]" style="width: {uploadPercent}%"></div>
                        {:else if processPhase === 'downloading'}
                            <div class="h-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(165,214,167,0.5)]" style="width: {downloadPercent}%"></div>
                        {/if}
                    </div>
                {/if}

                <div class="flex items-center justify-between px-4 sm:px-6 py-2">
                    <span class="text-xs text-[#875F42]/50 font-medium tracking-wide flex items-center gap-2">
                        {#if isProcessing}
                            {#if processPhase === 'thinking'}
                                <span class="animate-pulse">✨</span>
                                {#key thinkingText}
                                    <span class="animate-fade-in">{thinkingText}</span>
                                {/key}
                            {:else if processPhase === 'uploading'}
                                Uploading your images… ({uploadPercent}%)
                            {:else if processPhase === 'downloading'}
                                {downloadAsZip ? 'Preparing' : 'Downloading'} results… ({completedFiles} of {totalFiles})
                            {:else if processPhase === 'packing'}
                                Packing your zip file…
                            {/if}
                        {:else if files.length === 0}
                            Drop images or use the clip button
                        {:else}
                            {files.length} {files.length === 1 ? 'image' : 'images'} attached
                        {/if}
                    </span>
                    <span class="hidden sm:inline-flex text-[10px] text-[#875F42]/40 font-semibold tracking-widest">
                        ↵ enter
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-wrap gap-2 mt-3 px-1">
        {#each suggestions as suggestion}
            <button
                onclick={() => fillPrompt(suggestion)}
                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/50 border border-white/60 text-[#875F42]/70 hover:text-[#F06292] hover:bg-white/80 hover:border-[#F06292]/30 transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer"
            >
                {suggestion}
            </button>
        {/each}
    </div>
</div>

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

    @keyframes fade-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
    }
</style>