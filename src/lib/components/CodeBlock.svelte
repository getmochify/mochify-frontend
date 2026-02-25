<script>
    export let filename = '';
    export let code = '';

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
</script>

<div class="my-6 bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-lg">
    <div class="flex items-center gap-2 px-5 py-3 bg-[#2C2C2E] border-b border-white/5">
        <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
        <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="w-3 h-3 rounded-full bg-[#28C941]"></div>
        {#if filename}
            <span class="ml-3 text-xs text-white/40 font-mono">{filename}</span>
        {/if}
    </div>
    <pre class="p-5 text-sm font-mono text-[#E5E7EB] overflow-x-auto leading-relaxed"><code>{@html escapeHtml(code)}</code></pre>
</div>
