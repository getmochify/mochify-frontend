<script lang="ts">
    // Non-interactive, looping showcase of the Magic Flow web workflow for the
    // landing page. Deliberately accepts no uploads — it's a preview that points
    // users to the real app via the CTA, so there's no "drop a file, get a fake
    // result" confusion. Honours prefers-reduced-motion with a static end-state.
    type Example = {
        file: string;
        kind: 'image' | 'pdf';
        prompt: string;
        out: string;
        before: string;
        after: string;
        pct: number;
    };

    const examples: Example[] = [
        { file: 'hero.jpg', kind: 'image', prompt: 'convert to webp, 1200px wide, strip exif', out: 'hero.webp', before: '2.1 MB', after: '142 KB', pct: 93 },
        { file: 'product.heic', kind: 'image', prompt: 'make these eBay-ready, square crop', out: 'product.jpg', before: '4.8 MB', after: '310 KB', pct: 94 },
        { file: 'report.pdf', kind: 'pdf', prompt: 'compress this PDF for email', out: 'report.pdf', before: '9.2 MB', after: '1.1 MB', pct: 88 }
    ];

    let exampleIndex = $state(0);
    let phase = $state<'enter' | 'typing' | 'processing' | 'done'>('enter');
    let typedLen = $state(0);

    const current = $derived(examples[exampleIndex]);
    const typed = $derived(current.prompt.slice(0, typedLen));

    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const wait = (ms: number) =>
        new Promise<void>((resolve) => {
            timers.push(setTimeout(resolve, ms));
        });

    async function run() {
        while (!cancelled) {
            const ex = examples[exampleIndex];
            phase = 'enter';
            typedLen = 0;
            await wait(750);
            phase = 'typing';
            for (let i = 1; i <= ex.prompt.length && !cancelled; i++) {
                typedLen = i;
                await wait(38);
            }
            await wait(450);
            phase = 'processing';
            await wait(1100);
            phase = 'done';
            await wait(2600);
            exampleIndex = (exampleIndex + 1) % examples.length;
        }
    }

    $effect(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            phase = 'done';
            typedLen = current.prompt.length;
            return;
        }
        cancelled = false;
        run();
        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
            timers = [];
        };
    });
</script>

<div class="relative rounded-3xl border border-pink-100 bg-white/80 backdrop-blur-md shadow-xl shadow-pink-100/40 p-5 sm:p-6">
    <!-- Preview badge — signals this is a showcase, not an interactive uploader -->
    <div class="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F06292] text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse"></span>
        Preview
    </div>

    <!-- File chip -->
    <div class="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white p-3">
        <span class="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 {current.kind === 'pdf' ? 'bg-red-50' : 'bg-pink-50'}">
            {#if current.kind === 'pdf'}
                <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            {:else}
                <svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>
            {/if}
        </span>
        <div class="min-w-0">
            <p class="font-bold text-[#4A2C2C] truncate">{current.file}</p>
            <p class="text-sm text-[#875F42]">{current.before}</p>
        </div>
    </div>

    <!-- Prompt line (auto-typing) -->
    <div class="mt-4 rounded-2xl border border-pink-100 bg-[#FFF5F7] px-4 py-3 min-h-[52px] flex items-center">
        <span class="text-[#F06292] font-mono text-sm mr-2 shrink-0">✦</span>
        <span class="text-[#4A2C2C] font-medium">{typed}</span>
        {#if phase === 'typing'}
            <span class="inline-block w-0.5 h-5 bg-[#F06292] ml-0.5 animate-pulse"></span>
        {/if}
    </div>

    <!-- Result / processing — floor sized to the tallest (done) state so the card never grows between phases -->
    <div class="mt-4 min-h-[104px]">
        {#if phase === 'enter' || phase === 'typing'}
            <!-- Keeps the card purposeful while the prompt types instead of an empty gap -->
            <div class="flex items-center gap-3 rounded-2xl border border-dashed border-pink-200 bg-[#FFF5F7]/50 px-4 py-5 text-[#875F42]/70">
                <span class="text-[#F06292]/60">✦</span>
                <span class="text-sm font-medium">Magic Flow reads your prompt and picks the format, size &amp; crop…</span>
            </div>
        {:else if phase === 'processing'}
            <div class="flex items-center justify-center gap-2 rounded-2xl border border-pink-100 bg-white py-6 text-[#875F42]">
                <svg class="w-5 h-5 animate-spin text-[#F06292]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <span class="font-bold">Squishing…</span>
            </div>
        {:else if phase === 'done'}
            <div class="rounded-2xl border border-green-100 bg-green-50/70 p-4 animate-fade-in">
                <div class="flex items-center justify-center gap-3 text-center">
                    <div>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-[#875F42]">Before</p>
                        <p class="font-heading font-black text-lg text-[#4A2C2C]">{current.before}</p>
                    </div>
                    <svg class="w-5 h-5 text-[#15803d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    <div>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-[#875F42]">After</p>
                        <p class="font-heading font-black text-lg text-[#15803d]">{current.after}</p>
                    </div>
                    <span class="ml-2 px-2.5 py-1 rounded-full bg-[#15803d] text-white text-xs font-black">−{current.pct}%</span>
                </div>
                <p class="mt-2 text-center text-xs text-[#875F42]/80 font-mono truncate">{current.out}</p>
            </div>
        {/if}
    </div>

    <!-- CTA into the real app -->
    <a href="/app" class="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#F06292] py-3.5 font-black text-white shadow-lg transition-all hover:bg-[#D81B60] hover:-translate-y-0.5 no-underline">
        Try it free — no signup
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </a>
</div>
