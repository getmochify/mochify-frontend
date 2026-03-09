<script lang="ts">
    import { env } from '$env/dynamic/public';
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import jxlDecWasmUrl from '@jsquash/jxl/codec/dec/jxl_dec.wasm?url';

    const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.xyz';

    // ── JXL polyfill helpers ─────────────────────────────────────
    let jxlNativeSupport: boolean | null = $state(null);
    let jxlDecoderReady = false;
    let jxlPolyfillActive: boolean = $state(false);

    async function checkJxlSupport(): Promise<boolean> {
        if (jxlNativeSupport !== null) return jxlNativeSupport;
        return new Promise(resolve => {
            const img = new Image();
            img.onload  = () => { jxlNativeSupport = true;  resolve(true);  };
            img.onerror = () => { jxlNativeSupport = false; resolve(false); };
            // Minimal valid 1×1 JXL image (base64)
            img.src = 'data:image/jxl;base64,/woIELASCAgQAFwASxLFgkWACS8wChRAFAeKAFPoAFBKABDIBgEAAABhBgAAAfgACfgGAAFjEAD/jAAA';
        });
    }

    async function ensureJxlDecoder(): Promise<void> {
        if (jxlDecoderReady) return;
        const { init } = await import('@jsquash/jxl/decode');
        // Pass the hashed Vite asset URL via locateFile so Emscripten fetches
        // and instantiates the WASM itself — avoids Content-Type: application/wasm
        // requirements that compileStreaming enforces.
        await init({ locateFile: () => jxlDecWasmUrl });
        jxlDecoderReady = true;
    }

    async function decodeJxlToObjectUrl(blob: Blob): Promise<string> {
        await ensureJxlDecoder();
        const { default: decode } = await import('@jsquash/jxl/decode');
        const ab = await blob.arrayBuffer();
        const imageData = await decode(ab);
        const canvas = document.createElement('canvas');
        canvas.width  = imageData.width;
        canvas.height = imageData.height;
        canvas.getContext('2d')!.putImageData(imageData, 0, 0);
        return await new Promise<string>((res, rej) =>
            canvas.toBlob(b => b ? res(URL.createObjectURL(b)) : rej(new Error('toBlob failed')), 'image/png')
        );
    }

    // Upload state
    let uploadedFile: File | null = $state(null);
    let originalUrl: string | null = $state(null);
    let originalSize: number = $state(0);

    // Compression state
    let compressedUrl: string | null = $state(null);
    let compressedSize: number = $state(0);
    let isProcessing: boolean = $state(false);
    let errorMessage: string = $state('');
    let compressedRenderFailed: boolean = $state(false);

    // Options
    let imageType: string = $state('webp');
    let smartCompress: boolean = $state(false);

    // Slider
    let sliderPosition: number = $state(50);
    let isDragging: boolean = $state(false);
    let comparisonContainer: HTMLElement | null = $state(null);

    // File input
    let fileInputElement: HTMLInputElement = $state(null as unknown as HTMLInputElement);
    let isDragOver: boolean = $state(false);

    const formats = [
        { value: 'jpg',  label: 'JPG',  detail: 'Universal'  },
        { value: 'webp', label: 'WebP', detail: 'Modern'     },
        { value: 'avif', label: 'AVIF', detail: 'Best ratio' },
        { value: 'jxl',  label: 'JXL',  detail: 'Future'     },
    ];

    const jxlSelected = $derived(imageType === 'jxl');
    const savedBytes   = $derived(compressedSize > 0 ? originalSize - compressedSize : 0);
    const savedPercent = $derived(
        compressedSize > 0 && originalSize > 0
            ? Math.round((savedBytes / originalSize) * 100)
            : 0
    );

    function formatSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), 2);
        return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB'][i];
    }

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files?.[0]) { loadFile(target.files[0]); target.value = ''; }
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        isDragOver = false;
        const file = event.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) loadFile(file);
    }

    function loadFile(file: File) {
        if (originalUrl)    URL.revokeObjectURL(originalUrl);
        if (compressedUrl)  URL.revokeObjectURL(compressedUrl);
        uploadedFile    = file;
        originalUrl     = URL.createObjectURL(file);
        originalSize    = file.size;
        compressedUrl   = null;
        compressedSize  = 0;
        errorMessage    = '';
        compressedRenderFailed = false;
        sliderPosition  = 50;
    }

    async function processImage() {
        if (!uploadedFile) return;
        isProcessing = true;
        errorMessage = '';
        compressedUrl = null;
        compressedSize = 0;
        compressedRenderFailed = false;

        try {
            const resp = await fetch(
                `${API_URL}/v1/squish?type=${imageType}${smartCompress ? '&smartCompress=1' : ''}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': uploadedFile.type || 'application/octet-stream' },
                    body: uploadedFile,
                }
            );
            if (!resp.ok) throw new Error(`Server error ${resp.status}`);
            const blob = await resp.blob();
            compressedSize = blob.size;

            if (imageType === 'jxl') {
                const hasNative = await checkJxlSupport();
                if (!hasNative) {
                    jxlPolyfillActive = true;
                    try {
                        compressedUrl = await decodeJxlToObjectUrl(blob);
                    } catch (polyfillErr) {
                        console.error('[JXL polyfill] decode failed:', polyfillErr);
                        throw new Error('JXL WASM decode failed. Please try a different format.');
                    } finally {
                        jxlPolyfillActive = false;
                    }
                } else {
                    compressedUrl = URL.createObjectURL(blob);
                }
            } else {
                compressedUrl = URL.createObjectURL(blob);
            }

            sliderPosition = 50;
        } catch (e) {
            errorMessage = e instanceof Error ? e.message : 'Compression failed. Please try again.';
        } finally {
            isProcessing = false;
        }
    }

    function resetTool() {
        if (originalUrl)    URL.revokeObjectURL(originalUrl);
        if (compressedUrl)  URL.revokeObjectURL(compressedUrl);
        uploadedFile    = null;
        originalUrl     = null;
        compressedUrl   = null;
        originalSize    = 0;
        compressedSize  = 0;
        errorMessage    = '';
        compressedRenderFailed = false;
        sliderPosition  = 50;
    }

    function downloadCompressed() {
        if (!compressedUrl || !uploadedFile) return;
        const a = document.createElement('a');
        a.href = compressedUrl;
        a.download = uploadedFile.name.replace(/\.[^.]+$/, '') + `_mochify.${imageType}`;
        a.click();
    }

    // Eagerly probe JXL support the first time the tab is selected
    $effect(() => {
        if (jxlSelected && jxlNativeSupport === null) checkJxlSupport();
    });

    // --- Slider pointer handling ---
    function sliderPosFromPointer(e: PointerEvent): number {
        if (!comparisonContainer) return sliderPosition;
        const rect = comparisonContainer.getBoundingClientRect();
        return Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    }

    function onPointerDown(e: PointerEvent) {
        isDragging = true;
        sliderPosition = sliderPosFromPointer(e);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
        if (isDragging) sliderPosition = sliderPosFromPointer(e);
    }

    function onPointerUp() {
        isDragging = false;
    }
</script>

<svelte:head>
    <title>Image Quality Comparison Tool | Mochify</title>
    <meta name="description" content="Compare your original image against Mochify's compressed output with a Squoosh‑style slider. Supports WebP, AVIF, JXL and JPG with optional smart compression.">
    <meta property="og:title" content="Image Comparison Tool – See the savings in real time">
    <meta property="og:description" content="Upload once, drag to compare. Choose WebP, AVIF, JXL or JPG and see exactly how much space Mochify saves without touching quality.">
    
    <script type="application/ld+json">{
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mochify Image Comparison Tool",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Upload an image and compare the original side-by-side with a compressed version using a drag slider. Supports WebP, AVIF, JPEG XL, and JPG output with optional smart compression.",
            "url": "https://mochify.xyz/comparison",
            "featureList": ["WebP compression", "AVIF compression", "JPEG XL compression", "JPG compression", "Side-by-side drag slider comparison", "Smart compression mode", "File size savings display"]
        },
        {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to compare image quality before and after compression",
            "description": "Use Mochify's comparison tool to visually compare an original image against its compressed version and see exactly how much file size is saved.",
            "step": [
                {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Upload your image",
                    "text": "Drag and drop your image onto the tool or click to browse. Supports JPG, PNG, WebP, AVIF, and HEIC files up to 20 MB."
                },
                {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Choose an output format",
                    "text": "Select your target format: WebP (modern and widely supported), AVIF (best compression ratio), JPEG XL (next-generation), or JPG (universal compatibility)."
                },
                {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Compress the image",
                    "text": "Click 'Compress & Compare' to send the image to Mochify's compression engine. Optionally enable Smart Compress for content-aware quality tuning."
                },
                {
                    "@type": "HowToStep",
                    "position": 4,
                    "name": "Drag the slider to compare",
                    "text": "Drag the handle left and right to reveal the original and compressed versions side by side. The stats panel shows original size, compressed size, and percentage saved."
                },
                {
                    "@type": "HowToStep",
                    "position": 5,
                    "name": "Download the compressed image",
                    "text": "Click 'Download' to save the compressed file. Use 'Change settings' to try a different format or toggle smart compression."
                }
            ]
        }
    }</script>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">

    <!-- Ambient background orbs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="animate-float absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-pink-200/20 blur-[80px]"></div>
        <div class="animate-float-slow absolute -bottom-56 -left-40 w-[560px] h-[560px] rounded-full bg-rose-100/15 blur-[100px]"></div>
        <div class="animate-float absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-pink-50/20 blur-[70px]"></div>
    </div>

    <Navigation />

    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <!-- ── Header ─────────────────────────────────────────────── -->
        <header class="text-center mb-12">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE5F0] shadow-sm text-[#BE185D] text-sm font-bold border border-pink-100 mb-5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 9l-4 3 4 3M16 9l4 3-4 3"/>
                </svg>
                Quality Comparison
            </div>

            <h1 class="text-5xl md:text-6xl font-black text-[#4A2C2C] leading-tight mb-4">
                See the
                <span class="bg-gradient-to-r from-[#FFB3C6] to-[#F06292] bg-clip-text text-transparent">difference</span>
                for yourself
            </h1>
            <p class="text-[#6C3F31] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Upload an image, pick your format, then drag the slider to compare original vs. compressed side‑by‑side.
            </p>
        </header>

        <!-- ── Glass card wrapping the whole tool ───────────────── -->
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#FFF0F3] overflow-hidden">
            <div class="p-8 lg:p-12">

                <!-- ── Drop zone (no file loaded) ─────────────────── -->
                {#if !uploadedFile}
                <label for="compare-file-input" class="block cursor-pointer">
                    <input
                        bind:this={fileInputElement}
                        id="compare-file-input"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        onchange={handleFileSelect}
                    />
                    <div
                        class="border-[4px] border-dashed {isDragOver ? 'border-[#F06292] bg-[#FFF0F3]' : 'border-[#FFE5EC] hover:border-[#FFD6E0]'} rounded-2xl p-16 text-center transition-all duration-300 bg-[#FFF5F7] group"
                        role="presentation"
                        ondragover={(e) => { e.preventDefault(); isDragOver = true; }}
                        ondragleave={() => isDragOver = false}
                        ondrop={handleDrop}
                    >
                        <svg class="w-16 h-16 mx-auto mb-4 text-[#FFB3C6] group-hover:text-[#F06292] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p class="text-lg text-[#6C3F31] font-semibold mb-1">Drop your image here or click to browse</p>
                        <p class="text-sm text-[#B38B91]">JPG · PNG · WebP · AVIF · HEIC / HEIF · up to 20 MB</p>
                    </div>
                </label>
                {/if}

                <!-- ── Main tool (file loaded) ─────────────────────── -->
                {#if uploadedFile}
                <div class="space-y-6">

                    <!-- Options row -->
                    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <!-- Format tabs -->
                        <div class="flex flex-wrap gap-2">
                            {#each formats as fmt}
                            <button
                                class="px-4 py-2 rounded-xl text-sm font-bold transition-all {imageType === fmt.value
                                    ? 'bg-gradient-to-r from-[#F06292] to-[#E91E63] text-white shadow-sm'
                                    : 'bg-[#FFF5F7] text-[#6C3F31] border border-[#FFE5EC] hover:border-[#FFD6E0] hover:bg-[#FFF0F3]'}"
                                onclick={() => { imageType = fmt.value; compressedUrl = null; compressedSize = 0; compressedRenderFailed = false; }}
                            >
                                {fmt.label}
                                <span class="opacity-60 text-xs font-medium ml-1">{fmt.detail}</span>
                            </button>
                            {/each}
                        </div>

                        <!-- Smart compress toggle -->
                        <label class="flex items-center gap-3 cursor-pointer select-none shrink-0">
                            <div class="relative">
                                <input type="checkbox" bind:checked={smartCompress} class="sr-only" />
                                <div class="w-10 h-5 rounded-full transition-colors {smartCompress ? 'bg-[#F06292]' : 'bg-[#FFD6E0]'}"></div>
                                <div class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform {smartCompress ? 'translate-x-5' : ''}"></div>
                            </div>
                            <span class="text-sm font-semibold text-[#6C3F31]">Smart Compress</span>
                        </label>
                    </div>

                    <!-- JXL browser support banner -->
                    {#if jxlSelected}
                    <div class="flex items-start gap-3 px-5 py-4 {jxlNativeSupport === false ? 'bg-[#E8F5E9] border-green-200 text-[#1B5E20]' : 'bg-amber-50 border-amber-200 text-amber-800'} border rounded-2xl text-sm leading-relaxed">
                        {#if jxlNativeSupport === false}
                        <svg class="w-5 h-5 mt-0.5 shrink-0 text-[#66BB6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div>
                            <span class="font-bold">WASM polyfill active.</span>
                            Your browser doesn't support JXL natively — Mochify will decode it client-side via WebAssembly so you still see a live preview in the slider.
                        </div>
                        {:else}
                        <svg class="w-5 h-5 mt-0.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        </svg>
                        <div>
                            <span class="font-bold">Checking JXL support…</span>
                            Safari 17+ renders JPEG XL natively. For other browsers, a WASM polyfill will be loaded automatically.
                        </div>
                        {/if}
                    </div>
                    {/if}

                    <!-- Error -->
                    {#if errorMessage}
                    <div class="px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
                        {errorMessage}
                    </div>
                    {/if}

                    <!-- Pre-compression preview -->
                    {#if !compressedUrl && originalUrl}
                    <div class="relative rounded-2xl overflow-hidden border border-[#FFE5EC] shadow-sm">
                        <img
                            src={originalUrl}
                            alt="Uploaded"
                            class="block w-full max-h-[55vh] object-contain bg-[#FFF5F7]"
                            draggable="false"
                        />
                        <div class="absolute top-3 left-3">
                            <span class="px-3 py-1.5 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                                {uploadedFile.name} · {formatSize(originalSize)}
                            </span>
                        </div>
                        <button
                            class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                            onclick={resetTool}
                            aria-label="Remove image"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    {/if}

                    <!-- Compress button -->
                    {#if !compressedUrl}
                    <button
                        class="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-[#F06292] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        onclick={processImage}
                        disabled={isProcessing || jxlPolyfillActive}
                    >
                        {#if jxlPolyfillActive}
                        <span class="flex items-center justify-center gap-3">
                            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Decoding JXL via WASM…
                        </span>
                        {:else if isProcessing}
                        <span class="flex items-center justify-center gap-3">
                            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Compressing…
                        </span>
                        {:else}
                            Compress &amp; Compare →
                        {/if}
                    </button>
                    {/if}

                    <!-- ── Comparison slider ──────────────────────── -->
                    {#if compressedUrl && originalUrl}
                    <div class="space-y-5">

                        <!-- Stats row -->
                        <div class="grid grid-cols-3 gap-3 text-center">
                            <div class="bg-[#FFF5F7] border border-[#FFE5EC] rounded-2xl p-4">
                                <p class="text-xs font-bold text-[#B38B91] uppercase tracking-wide mb-1">Original</p>
                                <p class="text-xl font-black text-[#4A2C2C]">{formatSize(originalSize)}</p>
                            </div>
                            <div class="bg-gradient-to-br from-[#FFF0F3] to-[#FFE5EC] border border-[#FFD6E0] rounded-2xl p-4">
                                <p class="text-xs font-bold text-[#F06292] uppercase tracking-wide mb-1">Saved</p>
                                <p class="text-xl font-black {savedPercent >= 0 ? 'text-[#F06292]' : 'text-amber-500'}">
                                    {savedPercent >= 0 ? `${savedPercent}%` : `+${Math.abs(savedPercent)}%`}
                                </p>
                                <p class="text-xs text-[#B38B91] mt-0.5">
                                    {savedPercent >= 0 ? `−${formatSize(savedBytes)}` : `+${formatSize(-savedBytes)}`}
                                </p>
                            </div>
                            <div class="bg-[#FFF5F7] border border-[#FFE5EC] rounded-2xl p-4">
                                <p class="text-xs font-bold text-[#B38B91] uppercase tracking-wide mb-1">{imageType.toUpperCase()}</p>
                                <p class="text-xl font-black text-[#4A2C2C]">{formatSize(compressedSize)}</p>
                            </div>
                        </div>

                        <!-- Slider container -->
                        <div
                            class="relative w-full rounded-2xl overflow-hidden border border-[#FFE5EC] shadow-sm select-none"
                            bind:this={comparisonContainer}
                            style="cursor: {isDragging ? 'grabbing' : 'ew-resize'}; touch-action: none;"
                            onpointerdown={onPointerDown}
                            onpointermove={onPointerMove}
                            onpointerup={onPointerUp}
                            onpointercancel={onPointerUp}
                            role="slider"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(sliderPosition)}
                            aria-label="Drag to compare original and compressed image"
                            tabindex="0"
                            onkeydown={(e) => {
                                if (e.key === 'ArrowLeft')  sliderPosition = Math.max(0,   sliderPosition - 2);
                                if (e.key === 'ArrowRight') sliderPosition = Math.min(100, sliderPosition + 2);
                            }}
                        >
                            <!-- Original (defines height) -->
                            <img
                                src={originalUrl}
                                alt="Original"
                                class="block w-full max-h-[68vh] object-contain bg-[#FFF5F7]"
                                draggable="false"
                            />

                            <!-- Compressed overlay, clipped from the right -->
                            <div class="absolute inset-0" style="clip-path: inset(0 0 0 {sliderPosition}%);">
                                {#if !compressedRenderFailed}
                                <img
                                    src={compressedUrl}
                                    alt="Compressed {imageType.toUpperCase()}"
                                    class="w-full h-full object-contain bg-[#FFF5F7]"
                                    draggable="false"
                                    onerror={() => compressedRenderFailed = true}
                                />
                                {:else}
                                <div class="absolute inset-0 flex flex-col items-center justify-center bg-amber-50 gap-4">
                                    <svg class="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    <p class="text-amber-700 font-bold text-sm text-center px-6 leading-relaxed">
                                        {imageType.toUpperCase()} preview not supported in this browser
                                    </p>
                                    <button
                                        class="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-colors active:scale-95"
                                        onclick={(e) => { e.stopPropagation(); downloadCompressed(); }}
                                    >
                                        Download {imageType.toUpperCase()} ({formatSize(compressedSize)})
                                    </button>
                                </div>
                                {/if}
                            </div>

                            <!-- Side labels -->
                            <div class="absolute top-3 left-3 pointer-events-none">
                                <span class="px-3 py-1.5 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-sm">Original</span>
                            </div>
                            <div class="absolute top-3 right-3 pointer-events-none">
                                <span class="px-3 py-1.5 bg-[#F06292]/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">{imageType.toUpperCase()}</span>
                            </div>

                            <!-- Divider + handle -->
                            <div
                                class="absolute inset-y-0 w-0.5 bg-white/90 pointer-events-none"
                                style="left: {sliderPosition}%; transform: translateX(-50%); box-shadow: 0 0 8px rgba(0,0,0,0.25);"
                            >
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-[#F06292] flex items-center justify-center">
                                    <svg class="w-5 h-5 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 9l-4 3 4 3M16 9l4 3-4 3"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <p class="text-center text-xs text-[#B38B91] font-medium">← Drag the handle or use arrow keys to compare →</p>

                        <!-- Action buttons -->
                        <div class="flex flex-col sm:flex-row gap-3 pt-1">
                            <button
                                class="flex-1 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-[#F06292] to-[#E91E63] hover:from-[#E91E63] hover:to-[#C2185B] transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                onclick={downloadCompressed}
                            >
                                Download {imageType.toUpperCase()}
                            </button>
                            <button
                                class="py-3 px-6 rounded-2xl font-semibold text-[#6C3F31] bg-[#FFF5F7] border border-[#FFE5EC] hover:bg-[#FFF0F3] hover:border-[#FFD6E0] transition-all active:scale-[0.98]"
                                onclick={() => { compressedUrl = null; compressedSize = 0; compressedRenderFailed = false; }}
                            >
                                Change settings
                            </button>
                            <button
                                class="py-3 px-6 rounded-2xl font-semibold text-[#6C3F31] bg-[#FFF5F7] border border-[#FFE5EC] hover:bg-[#FFF0F3] hover:border-[#FFD6E0] transition-all active:scale-[0.98]"
                                onclick={resetTool}
                            >
                                New image
                            </button>
                        </div>

                        <!-- Upsell CTA -->
                        <div class="mt-2 pt-5 border-t border-[#FFE5EC] text-center">
                            <p class="text-sm text-[#875F42]/70 mb-3">Ready to compress in bulk?</p>
                            <a
                                href="/"
                                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-[#FFE5EC] hover:border-[#F06292]/40 hover:bg-[#FFF5F7] text-[#F06292] font-bold text-sm transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                            >
                                Compress up to 25 images at once
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    {/if}

                </div>
                {/if}

            </div>
        </div>

    </main>

    <div class="mt-16 md:mt-24">
        <Footer />
    </div>
</div>
