<script lang="ts">
    import { tick } from 'svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let prompt: string = $state('');
    let files: File[] = $state([]);
    let isDragging: boolean = $state(false);
    
    let isProcessing: boolean = $state(false);
    let processPhase: 'idle' | 'thinking' | 'uploading' = $state('idle');
    
    let uploadProgress: number = $state(0);
    let result: string | null = $state(null);
    let error: string | null = $state(null);
    let textareaEl: HTMLTextAreaElement;
    let fileInputEl: HTMLInputElement;

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
        const dropped = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
        files = [...files, ...dropped];
        tick().then(() => textareaEl?.focus());
    }

    function handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            files = [...files, ...Array.from(input.files)];
            input.value = '';
        }
    }

    function removeFile(i: number) {
        files = files.filter((_, idx) => idx !== i);
    }

    // Small helper to get dimensions quickly without blocking the UI
    function getDimensions(file: File): Promise<{w: number, h: number}> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                window.URL.revokeObjectURL(img.src);
                resolve({ w: img.width, h: img.height });
            };
            img.onerror = () => {
                window.URL.revokeObjectURL(img.src);
                resolve({ w: 0, h: 0 }); // Fallback if image is corrupt
            };
            img.src = window.URL.createObjectURL(file);
        });
    }

    async function submit() {
        if (!prompt.trim() || files.length === 0 || isProcessing) return;
        
        isProcessing = true;
        processPhase = 'thinking';
        uploadProgress = 0;
        result = null;
        error = null;

        // Fake loading messages to mask the Together AI Schema delay
        let thinkingMessages = ["Waking up the brain...", "Analyzing instructions...", "Mapping dimensions..."];
        let msgIdx = 0;
        const msgInterval = setInterval(() => {
            if (processPhase === 'thinking') {
                msgIdx++; // You can bind this to a UI variable if you want text to change!
            } else {
                clearInterval(msgInterval);
            }
        }, 2000);

        try {
            // 1. Gather all files WITH their dimensions in parallel!
            const fileDetails = await Promise.all(files.map(async (f) => {
                const dims = await getDimensions(f);
                return { name: f.name, width: dims.w, height: dims.h };
            }));

            // 2. Send the rich JSON payload to the C++ Backend
            const nlpResponse = await fetch('https://api.mochify.xyz/v1/nlp/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    fileData: fileDetails // <-- Sending objects, not just strings
                })
            });

            if (!nlpResponse.ok) throw new Error(`Failed to understand prompt (Status: ${nlpResponse.status})`);

            const parsedData = await nlpResponse.json();
            
            // 3. Convert the strict Array back into a Map for our upload loop
            const fileArray = parsedData.files || [];
            const fileMap = {};
            fileArray.forEach(item => {
                fileMap[item.filename] = item;
            });

            processPhase = 'uploading';
            let completedFiles = 0;

            // 3. Process all images in PARALLEL (The 11s -> 4s trick)
            const uploadPromises = files.map(async (file) => {
                const fileConfig = fileMap[file.name] || {}; 
                const params = new URLSearchParams();
                
                if (fileConfig.type) params.append('type', fileConfig.type);
                if (fileConfig.smartCompress) params.append('smartCompress', '1');
                if (fileConfig.removeBackground) params.append('removeBackground', '1');
                
                for (const [key, value] of Object.entries(fileConfig)) {
                    if (key !== 'smartCompress' && key !== 'type' && key !== 'removeBackground') {
                        if (value !== false && value !== 0) params.append(key, String(value));
                    }
                }

                const response = await fetch(`https://api.mochify.xyz/v1/squish?${params.toString()}`, {
                    method: 'POST',
                    headers: { 'Content-Type': file.type || 'application/octet-stream' },
                    body: file
                });

                if (!response.ok) throw new Error(`Failed processing ${file.name}`);

                const blob = await response.blob();
                
                // Track progress
                completedFiles++;
                uploadProgress = Math.round((completedFiles / files.length) * 100);

                // Download immediately as they finish
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const newExtension = fileConfig.type || file.name.split('.').pop();
                const downloadUrl = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = `${baseName}_mochified.${newExtension}`;
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    window.URL.revokeObjectURL(downloadUrl);
                    document.body.removeChild(a);
                }, 100);
            });

            // Wait for all parallel uploads to finish
            await Promise.all(uploadPromises);

            result = `Successfully squished ${completedFiles} image${completedFiles === 1 ? '' : 's'}!`;
            
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        } finally {
            isProcessing = false;
            processPhase = 'idle';
            clearInterval(msgInterval);
        }
    }
</script>

<svelte:head>
    <title>Mochify Flow | Prompt-driven Image Processing</title>
    <meta name="description" content="Describe what you want done to your images, drop them in, and Mochify handles the rest.">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] flex flex-col selection:bg-[#FFF0F3] selection:text-pink-900 relative">
    <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="animate-float absolute -top-48 -right-48 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-pink-300/40 to-transparent blur-[110px]"></div>
        <div class="animate-float-slow absolute -bottom-60 -left-48 w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-rose-200/40 to-transparent blur-[130px]"></div>
        <div class="animate-float-slow absolute top-24 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-purple-200/30 to-transparent blur-[70px]"></div>
    </div>

    <Navigation />

    <main class="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-16 pb-28 sm:px-6 sm:pb-36">
        <div class="text-center mb-10">
            <h1 class="text-4xl md:text-6xl font-black text-[#4A2C2C] leading-tight tracking-tight mb-3">
                What should we do<br class="hidden sm:block"> with your images?
            </h1>
            <p class="shimmer-text text-xl md:text-2xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
                Prompt. Drop. Done.
            </p>
            <p class="text-[#6C3F31] text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                Describe what you want in plain English, drop your files in, and hit enter.
            </p>
        </div>

        <div class="w-full max-w-2xl">
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
                        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md pointer-events-none rounded-[2rem]">
                            <div class="w-14 h-14 rounded-2xl bg-white/90 shadow-xl shadow-pink-200/50 flex items-center justify-center mb-3 animate-bounce">
                                <svg class="w-6 h-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                                </svg>
                            </div>
                            <p class="text-[#4A2C2C] font-bold text-lg tracking-tight shadow-white drop-shadow-md">Drop it like it's hot</p>
                        </div>
                    {/if}

                    {#if files.length > 0}
                        <div class="flex items-center gap-3 flex-wrap px-6 pt-6 pb-2">
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
                                        class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/90 text-pink-500 hover:text-red-500 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 cursor-pointer backdrop-blur-sm"
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
                                class="liquid-bubble flex-shrink-0 w-16 h-16 rounded-2xl border border-dashed border-pink-300/50 hover:bg-white/40 transition-all flex items-center justify-center text-pink-400 hover:text-[#F06292] hover:scale-105 cursor-pointer"
                                aria-label="Add more images"
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                                </svg>
                            </button>
                        </div>
                    {/if}

                    <div class="flex items-center gap-3 px-6 py-5">
                        <button onclick={() => fileInputEl?.click()} class="flex-shrink-0 p-3 rounded-2xl text-[#875F42]/70 hover:text-[#F06292] hover:bg-white/40 transition-all shadow-sm cursor-pointer">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
                            </svg>
                        </button>
                        <input bind:this={fileInputEl} type="file" multiple accept="image/*" onchange={handleFileSelect} class="hidden"/>
                        
                        <textarea bind:this={textareaEl} bind:value={prompt} oninput={autoGrow} onkeydown={handleKeydown} placeholder="Describe what you want…" rows="1" class="flex-1 resize-none border-0 bg-transparent text-[#4A2C2C] placeholder-[#875F42]/40 text-lg leading-relaxed focus:outline-none focus:ring-0 font-medium min-h-[32px] max-h-[200px] overflow-y-auto py-1 [appearance:none]"></textarea>
                        
                        <button onclick={submit} disabled={!prompt.trim() || files.length === 0 || isProcessing} class="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 {prompt.trim() && files.length > 0 && !isProcessing ? 'bg-gradient-to-br from-[#F06292] to-[#e040a0] text-white shadow-[0_4px_16px_rgba(240,98,146,0.4)] hover:shadow-[0_8px_24px_rgba(240,98,146,0.6)] hover:-translate-y-0.5 cursor-pointer' : 'bg-white/30 text-pink-300/50 cursor-not-allowed shadow-inner'}">
                            {#if isProcessing}
                                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                                </svg>
                            {:else}
                                <svg class="w-5 h-5 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                                </svg>
                            {/if}
                        </button>
                    </div>

                    <div class="border-t border-white/20 bg-white/10 backdrop-blur-sm">
                        {#if isProcessing}
                            <div class="h-1.5 bg-white/20 overflow-hidden relative">
                                {#if processPhase === 'thinking'}
                                    <div class="absolute inset-0 bg-gradient-to-r from-[#F06292] to-[#e040a0] opacity-60 animate-pulse"></div>
                                {:else}
                                    <div class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(240,98,146,0.5)]" style="width: {uploadProgress}%"></div>
                                {/if}
                            </div>
                        {/if}
                        
                        <div class="flex items-center justify-between px-6 py-3">
                            <span class="text-sm text-[#875F42]/70 font-medium tracking-wide">
                                {#if isProcessing}
                                    {#if processPhase === 'thinking'}
                                        AI is analyzing instructions…
                                    {:else}
                                        {uploadProgress < 100 ? `Processing images (${uploadProgress}%)` : 'Finishing up…'}
                                    {/if}
                                {:else if files.length === 0}
                                    Drop images into this box or use the clip button
                                {:else}
                                    {files.length} {files.length === 1 ? 'image' : 'images'} attached
                                {/if}
                            </span>
                            <span class="text-sm text-[#875F42]/50 font-medium bg-white/30 px-2 py-0.5 rounded-md shadow-sm">↵ enter</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {#if result || error}
            <div class="w-full max-w-2xl mt-8 animate-fade-in">
                <div class="liquid-glass rounded-2xl overflow-hidden">
                    <div class="px-5 py-3 border-b border-white/20 bg-white/10 flex items-center gap-2">
                        {#if error}
                            <span class="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)] flex-shrink-0"></span>
                            <span class="text-sm font-bold text-red-600">Error</span>
                        {:else}
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] flex-shrink-0"></span>
                            <span class="text-sm font-bold text-[#4A2C2C]">Response</span>
                        {/if}
                    </div>
                    <pre class="px-5 py-4 text-sm text-[#4A2C2C] whitespace-pre-wrap break-words font-mono leading-relaxed {error ? 'text-red-700' : ''} bg-white/5">{error ?? result}</pre>
                </div>
            </div>
        {/if}
    </main>

    <Footer />
</div>

<style>
    /* Centralizing the complex properties to keep HTML clean */
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