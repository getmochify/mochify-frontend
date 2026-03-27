<script lang="ts">
    import { tick } from 'svelte';
    import { zip } from 'fflate';
    import { env } from '$env/dynamic/public';
    import { getSessionToken, getIsPro, getPlan } from '$lib/user';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.xyz';
    const WORKER_URL = env.PUBLIC_WORKER_URL || 'https://tokens.mochify.xyz';

    let { onSuccess, onBgRemovalUpsell }: { onSuccess?: () => void; onBgRemovalUpsell?: () => void } = $props();

    let prompt: string = $state('');
    let files: File[] = $state([]);
    let isDragging: boolean = $state(false);
    
    let isProcessing: boolean = $state(false);
    let processPhase: 'idle' | 'thinking' | 'uploading' | 'processing' | 'downloading' | 'packing' = $state('idle');
    let thinkingText: string = $state("Reading your images…");
    let processingText: string = $state("Processing…");

    let uploadPercent: number = $state(0);
    let downloadPercent: number = $state(0);
    let completedFiles: number = $state(0);
    let totalFiles: number = $state(0);
    let downloadAsZip: boolean = $state(false);
    let agentMessage: string = $state('');
    
    let textareaEl: HTMLTextAreaElement;
    let fileInputEl: HTMLInputElement;

  const placeholders = [
        'Describe what you want…',
        'Shopify square-crop, convert to WebP…',
        'Fix PageSpeed — convert all to AVIF…',
        'Resize to 1200px, rename "product-ready"…',
        'Make these 1:1, center the subject…',
        'Give me high-quality Jpegli at 85%…',
    ];
    let placeholderIndex = $state(0);
    let placeholderVisible = $state(true);
    let isFocused = $state(false);

    $effect(() => {
        let intervalId: ReturnType<typeof setInterval>;
        let fadeId: ReturnType<typeof setTimeout>;

        const cycle = () => {
            placeholderVisible = false;
            fadeId = setTimeout(() => {
                placeholderIndex = (placeholderIndex + 1) % placeholders.length;
                placeholderVisible = true;
            }, 400);
        };

        intervalId = setInterval(cycle, 3200);
        return () => {
            clearInterval(intervalId);
            clearTimeout(fadeId);
        };
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
    let hitRateLimit: boolean = $state(false);
    let showSignupCta: boolean = $state(false);
    let victoryGlow: boolean = $state(false);

    function triggerVictoryGlow() {
        victoryGlow = true;
        setTimeout(() => { victoryGlow = false; }, 1800);
    }

    function showStatus(type: 'success' | 'error', text: string) {
        statusMessage = { type, text };
        if (type === 'success') triggerVictoryGlow();
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
            showStatus('error', `Free plan is limited to ${MAX_FILES} files. Upgrade to Seller or Pro for batches up to 25.`);
        }
        files = [...files, ...toAdd];
    }

    const suggestions = [
        { label: 'Remove BG',   prompt: 'Remove the background and convert to PNG',                              dot: 'bg-purple-400' },
        { label: 'eBay',        prompt: 'Optimize for eBay listings — square crop, convert to JPEG',             dot: 'bg-[#3665F3]' },
        { label: 'Vinted',      prompt: 'Optimize for Vinted listings — square crop, compress',                  dot: 'bg-[#007782]' },
        { label: 'Square crop', prompt: 'Smart-crop to square, centering the main subject',                      dot: 'bg-[#66BB6A]' },
        { label: 'PageSpeed',   prompt: 'Fix my PageSpeed — convert to WebP and compress for fast load times',   dot: 'bg-[#4285F4]' },
    ];

    const formatSuggestions = [
        { label: 'WebP',     prompt: 'Convert to WebP for best web compression and quality' },
        { label: 'JPEG',     prompt: 'Convert to JPEG with high quality compression' },
        { label: 'PNG',      prompt: 'Convert to PNG for lossless quality' },
        { label: 'AVIF',     prompt: 'Convert to AVIF for maximum compression with high quality' },
        { label: 'JPEG XL',  prompt: 'Convert to JPEG XL for next-generation compression' },
    ];

    const rotateSuggestions = [
        { label: '90° clockwise',       prompt: 'Rotate 90 degrees clockwise' },
        { label: '180°',                prompt: 'Rotate 180 degrees' },
        { label: '90° anti-clockwise',  prompt: 'Rotate 90 degrees anti-clockwise' },
        { label: 'Flip horizontal',     prompt: 'Flip horizontal' },
    ];

    let showFormatPicker = $state(false);
    let showRotatePicker = $state(false);

    function closePickers() {
        showFormatPicker = false;
        showRotatePicker = false;
    }

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
        textareaEl.style.height = Math.max(72, Math.min(textareaEl.scrollHeight, 200)) + 'px';
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

        const jwt = await getSessionToken();

        // Pre-flight quota check — works for both authed and unauthed users.
        let tokenData: any = null;
        try {
            const tokenRes = await fetch(`${API_URL}/v1/checkTokens`, {
                headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
            });
            if (tokenRes.ok) {
                tokenData = await tokenRes.json();
                if (tokenData.remaining < files.length) {
                    if (!jwt) showSignupCta = true;
                    else showStatus('error', "You've reached your processing limit. Upgrade your plan for more.");
                    return;
                }
            }
        } catch {
            // Non-blocking — proceed if checkTokens fails
        }

        (window as any).umami?.track('nlp_submit', { files: files.length, authed: !!jwt });

        isProcessing = true;
        processPhase = 'thinking';
        uploadPercent = 0;
        downloadPercent = 0;
        completedFiles = 0;
        hitRateLimit = false;
        agentMessage = '';

        const thinkingMessages = [
            "Reading your images…",
            "Planning the squish…",
        ];

        thinkingText = thinkingMessages[0];
        let msgIdx = 1;

        const msgInterval = setInterval(() => {
            if (processPhase === 'thinking') {
                thinkingText = thinkingMessages[msgIdx % thinkingMessages.length];
                msgIdx++;
            }
        }, 900);

        try {
            const fileDetails = await Promise.all(files.map(async (f) => {
                const dims = await getDimensions(f);
                return { name: f.name, width: dims.w, height: dims.h };
            }));

            const nlpResponse = await fetch(`${WORKER_URL}/v1/prompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
                },
                body: JSON.stringify({ prompt: prompt.trim(), fileData: fileDetails })
            });

            if (!nlpResponse.ok) throw new Error(`Failed to understand prompt (Status: ${nlpResponse.status})`);

            const parsedData = await nlpResponse.json() as { agent_message?: string; files?: any[] };
            agentMessage = parsedData.agent_message || '';
            const fileArray = parsedData.files || [];
            const fileMap: Record<string, any> = {};
            fileArray.forEach((item: any) => { fileMap[item.filename] = item; });

            // Detect background removal requested by NLP.
            // Background removal requires authentication — strip the param for anonymous
            // users and proceed without it (backend enforces the same rule on 403).
            const bgRemovalRequested = fileArray.some((item: any) => item.removeBackground);
            const bgRemovalBlocked = bgRemovalRequested && !jwt;
            if (bgRemovalBlocked) {
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

            const getProcessingText = (config: any): string => {
                if (config.removeBackground) return 'Removing background…';
                if (config.type === 'avif') return 'Encoding to AVIF…';
                if (config.type === 'jxl') return 'Encoding to JPEG XL…';
                if (config.type === 'webp') return 'Compressing to WebP…';
                if (config.type === 'jpeg' || config.type === 'jpg') return 'Compressing to JPEG…';
                if (config.type === 'png') return 'Encoding to PNG…';
                if (config.smartCompress) return 'Smart-compressing…';
                if (config.crop || (config.width && config.width === config.height)) return 'Cropping and compressing…';
                return 'Processing your image…';
            };

            const squishFile = (file: File, params: URLSearchParams, onUploadEnd?: () => void): Promise<Blob> =>
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

                    xhr.upload.onloadend = () => { onUploadEnd?.(); };

                    xhr.onload = () => {
                        // Account for any bytes not reported via onprogress
                        const remaining = file.size - lastLoaded;
                        if (remaining > 0) {
                            uploadedBytes += remaining;
                            uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
                        }

                        const contentType = xhr.getResponseHeader('content-type') || '';
                        if (contentType.includes('application/json')) {
                            const status = xhr.status;
                            const reader = new FileReader();
                            reader.onload = () => {
                                try {
                                    const errData = JSON.parse(reader.result as string);
                                    const e: any = new Error(errData.error || errData.message || `Server rejected ${file.name}`);
                                    e.status = status;
                                    reject(e);
                                } catch {
                                    const e: any = new Error(`Server rejected ${file.name}`);
                                    e.status = status;
                                    reject(e);
                                }
                            };
                            reader.readAsText(xhr.response as Blob);
                            return;
                        }
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response as Blob);
                        } else {
                            const e: any = new Error(`Failed processing ${file.name} (Status: ${xhr.status})`);
                            e.status = xhr.status;
                            reject(e);
                        }
                    };

                    xhr.onerror = () => reject(new Error(`Network error processing ${file.name}`));
                    xhr.send(file);
                });

            const processNextFile = async () => {
                while (currentFileIndex < files.length) {
                    const file = files[currentFileIndex++];
                    const fileConfig = fileMap[file.name] || {};

                    processPhase = 'uploading';

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
                        const blob = await squishFile(file, params, () => {
                            processingText = getProcessingText(fileConfig);
                            processPhase = 'processing';
                        });

                        processPhase = 'downloading';

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
                    } catch (e: any) {
                        console.error(`Error squishing ${file.name}:`, e);
                        if (e?.status === 429) {
                            hitRateLimit = true;
                            if (!jwt) showSignupCta = true;
                            break;
                        }
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

            if (hitRateLimit) {
                showStatus('error', jwt
                    ? "You've reached your processing limit. Upgrade your plan for more."
                    : "You've hit the free limit. Sign up for more images.");
                return;
            }

            if (downloadAsZip && Object.keys(zipContents).length > 0) {
                processPhase = 'packing';

                await new Promise<void>((resolve, reject) => {
                    zip(zipContents, { level: 0 }, (err, zippedData) => {
                        if (err) return reject(err);

                        const zipBlob = new Blob([zippedData as Uint8Array<ArrayBuffer>], { type: 'application/zip' });
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
                (window as any).umami?.track('nlp_success', { files: totalFiles, bg_removal_blocked: true });
                showStatus('success', 'Images processed without background removal — sign up for a free account to unlock it. ✨');
                onBgRemovalUpsell?.();
            } else {
                (window as any).umami?.track('nlp_success', { files: totalFiles });
                showStatus('success', 'Images processed successfully! ✨');
                onSuccess?.();
            }

        } catch (err) {
            console.error(err);
            (window as any).umami?.track('nlp_error');
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
            class="liquid-glass relative rounded-[2rem] overflow-hidden transition-all duration-700 {victoryGlow ? 'victory-glow' : ''}"
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

            <div class="flex flex-col px-4 sm:px-6 pt-4 sm:pt-5 pb-3 gap-3">

                <input bind:this={fileInputEl} type="file" multiple accept=".jpg,.jpeg,.heic,.heif,.hif,.avif,.png,.jxl,.webp,image/jpeg,image/heic,image/heif,image/avif,image/png,image/jxl,image/webp" onchange={handleFileSelect} aria-label="Upload images" class="hidden"/>

                <div class="relative">
                    {#if !prompt && !isFocused}
                        <div
                            aria-hidden="true"
                            class="pointer-events-none absolute inset-0 flex items-start py-1 text-base sm:text-lg leading-relaxed font-medium text-[#875F42]/40 transition-opacity duration-300 {placeholderVisible ? 'opacity-100' : 'opacity-0'}"
                        >
                            {placeholders[placeholderIndex]}
                        </div>
                    {/if}
                    <textarea
                        bind:this={textareaEl}
                        bind:value={prompt}
                        oninput={autoGrow}
                        onkeydown={handleKeydown}
                        onfocus={() => isFocused = true}
                        onblur={() => isFocused = false}
                        aria-label="Describe what you want"
                        rows="2"
                        class="w-full resize-none border-0 bg-transparent text-[#4A2C2C] placeholder-transparent text-base sm:text-lg leading-relaxed focus:outline-none focus:ring-0 font-medium min-h-[72px] max-h-[200px] overflow-y-auto py-1 [appearance:none]"
                    ></textarea>
                </div>

            </div>

            <div class="bg-white/20 backdrop-blur-md border-t border-white/40">
                {#if isProcessing}
                    <div class="h-1 bg-white/20 overflow-hidden relative">
                        {#if processPhase === 'thinking' || processPhase === 'packing'}
                            <div class="absolute inset-0 bg-gradient-to-r from-[#F06292] to-[#e040a0] opacity-60 animate-pulse"></div>
                        {:else if processPhase === 'uploading'}
                            <div class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(240,98,146,0.5)]" style="width: {uploadPercent}%"></div>
                        {:else if processPhase === 'processing'}
                            <div class="absolute inset-0 bg-gradient-to-r from-[#A5D6A7] via-[#66BB6A] to-[#A5D6A7] bg-[length:200%_100%] animate-shimmer opacity-80"></div>
                        {:else if processPhase === 'downloading'}
                            <div class="h-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(165,214,167,0.5)]" style="width: {downloadPercent}%"></div>
                        {/if}
                    </div>
                {/if}

                <div class="flex items-center gap-2 px-3 sm:px-4 py-2">
                    <!-- Controls -->
                    <button onclick={() => fileInputEl?.click()} class="p-1.5 rounded-xl text-[#875F42]/60 hover:text-[#F06292] hover:bg-white/60 transition-all cursor-pointer flex-shrink-0" aria-label="Attach images">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
                        </svg>
                    </button>
                    <div class="w-px h-4 bg-white/40 flex-shrink-0"></div>
                    <label class="flex items-center gap-1.5 cursor-pointer flex-shrink-0" title="Download as ZIP">
                        <div class="relative">
                            <input type="checkbox" bind:checked={downloadAsZip} class="sr-only">
                            <div class="block w-7 h-3.5 rounded-full transition-all duration-300 border {downloadAsZip ? 'bg-[#C8E6C9] border-[#C8E6C9]' : 'bg-[#e8f5e9] border-[#C8E6C9]/40 shadow-inner'}"></div>
                            <div class="dot absolute left-0.5 top-0.5 bg-white w-2.5 h-2.5 rounded-full transition-transform duration-300 shadow-sm {downloadAsZip ? 'transform translate-x-3.5' : ''}"></div>
                        </div>
                        <span class="text-[10px] font-extrabold tracking-widest uppercase transition-colors duration-300 {downloadAsZip ? 'text-[#2E5C31]' : 'text-[#875F42]/50'}">ZIP</span>
                    </label>
                    <div class="w-px h-4 bg-white/40 flex-shrink-0"></div>
                    <!-- Status text -->
                    <span class="text-xs text-[#875F42]/50 font-medium tracking-wide flex items-center gap-1.5 flex-1 min-w-0 truncate">
                        {#if isProcessing}
                            {#if processPhase === 'thinking'}
                                <span class="animate-pulse flex-shrink-0">✨</span>
                                {#key thinkingText}<span class="animate-fade-in truncate">{thinkingText}</span>{/key}
                            {:else if processPhase === 'uploading'}
                                Uploading{totalFiles > 1 ? ` ${completedFiles + 1}/${totalFiles}` : '…'} ({uploadPercent}%)
                            {:else if processPhase === 'processing'}
                                <span class="animate-pulse text-[#66BB6A] flex-shrink-0">⬡</span>
                                {#key processingText}<span class="animate-fade-in truncate">{processingText}{totalFiles > 1 ? ` (${completedFiles + 1}/${totalFiles})` : ''}</span>{/key}
                            {:else if processPhase === 'downloading'}
                                {downloadAsZip ? 'Packing zip' : 'Saving'} ({completedFiles}/{totalFiles})…
                            {:else if processPhase === 'packing'}
                                Packing your zip file…
                            {/if}
                        {:else if files.length === 0}
                            Drop images or use the clip button
                        {:else}
                            {files.length} {files.length === 1 ? 'image' : 'images'} attached
                        {/if}
                    </span>
                    <!-- Send button -->
                    <button
                        onclick={submit}
                        disabled={!prompt.trim() || files.length === 0 || isProcessing}
                        aria-label={isProcessing ? 'Processing…' : 'Submit'}
                        class="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all duration-300
                        {prompt.trim() && files.length > 0 && !isProcessing
                            ? 'bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)] hover:-translate-y-0.5 cursor-pointer'
                            : 'bg-white/50 text-[#F06292]/30 border border-white/60 cursor-not-allowed'}"
                    >
                        {#if isProcessing}
                            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                        {:else}
                            <svg class="w-4 h-4 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                            </svg>
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>

    {#if agentMessage}
        <div class="mt-3 px-1 animate-fade-in">
            <div class="flex items-start gap-3 pl-4 pr-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFF0F5] to-[#FDFBF7] border border-[#F06292]/20 border-l-[3px] border-l-[#F06292] shadow-sm shadow-pink-100/60">
                <svg class="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#F06292]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                <p class="text-xs text-[#4A2C2C]/75 leading-relaxed font-medium">{agentMessage}</p>
            </div>
        </div>
    {/if}

    <div class="flex flex-wrap gap-2 mt-3 px-1">
        {#if showFormatPicker || showRotatePicker}
            <!-- Back button -->
            <button
                onclick={closePickers}
                class="inline-flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 border border-white/60 text-[#875F42] hover:text-[#F06292] hover:border-[#F06292] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer"
            >
                <svg class="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                Back
            </button>
            <!-- Sub-options -->
            {#each (showFormatPicker ? formatSuggestions : rotateSuggestions) as s}
                <button
                    onclick={() => { fillPrompt(s.prompt); closePickers(); }}
                    class="inline-flex flex-shrink-0 items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 border border-white/60 text-[#875F42] hover:text-[#F06292] hover:bg-white/80 hover:border-[#F06292] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer"
                >
                    {s.label}
                </button>
            {/each}
        {:else}
            <!-- Main suggestions -->
            {#each suggestions as s}
                <button
                    onclick={() => fillPrompt(s.prompt)}
                    class="inline-flex flex-shrink-0 items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 border border-white/60 text-[#875F42] hover:text-[#F06292] hover:bg-white/80 hover:border-[#F06292] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer"
                >
                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-80 {s.dot}"></span>{s.label}
                </button>
            {/each}
            <!-- Convert to… expander -->
            <button
                onclick={() => { showFormatPicker = true; showRotatePicker = false; }}
                class="inline-flex flex-shrink-0 items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 border border-white/60 text-[#875F42] hover:text-[#F06292] hover:bg-white/80 hover:border-[#F06292] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer"
            >
                <svg class="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/></svg>
                Convert to…
            </button>
            <!-- Rotate… expander -->
            <button
                onclick={() => { showRotatePicker = true; showFormatPicker = false; }}
                class="inline-flex flex-shrink-0 items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 border border-white/60 text-[#875F42] hover:text-[#F06292] hover:bg-white/80 hover:border-[#F06292] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 backdrop-blur-sm shadow-sm cursor-pointer"
            >
                <svg class="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                Rotate…
            </button>
        {/if}
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
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#875F42]/8 hover:bg-[#875F42]/15 flex items-center justify-center text-[#875F42]/50 hover:text-[#875F42] transition-all cursor-pointer"
            aria-label="Close"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-[#F06292]/20 flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
        </div>
        <h3 class="text-lg font-black text-[#4A2C2C] mb-2">You've hit the free limit</h3>
        <p class="text-sm text-[#875F42]/70 leading-relaxed mb-6">
            Without an account you get 3 free images per month. Create a free account for 30 images/month, or upgrade for even more.
        </p>
        <a
            href="/auth/register"
            class="block w-full text-center py-3 rounded-2xl font-black text-white bg-gradient-to-br from-[#FF9EBB] to-[#F06292] shadow-lg shadow-pink-200/50 hover:shadow-pink-300/60 hover:-translate-y-0.5 transition-all duration-200 mb-3"
        >
            Create free account
        </a>
        <a
            href="/pricing"
            class="block w-full text-center py-3 rounded-2xl font-bold text-[#875F42] border border-[#875F42]/15 hover:bg-[#875F42]/5 transition-all duration-200"
        >
            See plans
        </a>
    </div>
</div>
{/if}

<style>
    .victory-glow {
        animation: victory-pulse 1.8s ease-out forwards;
    }

    @keyframes victory-pulse {
        0%   { box-shadow: 0 8px 32px 0 rgba(240, 98, 146, 0.15), 0 0 0 0 rgba(165, 214, 167, 0); }
        20%  { box-shadow: 0 8px 32px 0 rgba(165, 214, 167, 0.5), 0 0 60px 12px rgba(165, 214, 167, 0.35); }
        60%  { box-shadow: 0 8px 32px 0 rgba(165, 214, 167, 0.3), 0 0 40px 8px rgba(165, 214, 167, 0.2); }
        100% { box-shadow: 0 8px 32px 0 rgba(240, 98, 146, 0.15), 0 0 0 0 rgba(165, 214, 167, 0); }
    }

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

    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    @keyframes fade-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
    }

    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    .animate-shimmer {
        animation: shimmer 1.8s ease-in-out infinite;
    }
</style>