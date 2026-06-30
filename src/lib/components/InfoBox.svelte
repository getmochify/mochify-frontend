<script lang="ts">
    export let type: 'tip' | 'technical' | 'note' | 'warning' = 'note';
    export let title = '';

    const configs = {
        tip: {
            bgColor: 'bg-[#FFF5F7]',
            borderColor: 'border-pink-100',
            dotColor: 'bg-[#F06292]',
            titleColor: 'text-[#D81B60]',
            label: 'Pro Tip'
        },
        technical: {
            bgColor: 'bg-[#FFF9F5]',
            borderColor: 'border-[#FFE4D6]',
            dotColor: 'bg-[#875F42]',
            titleColor: 'text-[#875F42]',
            label: 'Technical Note'
        },
        note: {
            bgColor: 'bg-[#F5F9FF]',
            borderColor: 'border-blue-100',
            dotColor: 'bg-blue-400',
            titleColor: 'text-blue-600',
            label: 'Note'
        },
        warning: {
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            dotColor: 'bg-amber-400',
            titleColor: 'text-amber-700',
            label: 'Important'
        }
    };

    $: config = configs[type] || configs.note;
    $: displayTitle = title || config.label;
</script>

<aside class="my-6 {config.bgColor} rounded-2xl p-5 border {config.borderColor} shadow-sm">
    <div class="flex gap-3 items-start">
        <span class="w-2 h-2 rounded-full {config.dotColor} shrink-0 mt-1.5"></span>
        <div class="flex-1 min-w-0">
            <h4 class="text-xs font-black {config.titleColor} uppercase tracking-wider mb-1.5">
                {displayTitle}
            </h4>
            <div class="text-[#4A2C2C] text-sm leading-relaxed">
                <slot />
            </div>
        </div>
    </div>
</aside>

<style>
    h4 {
        margin-top: 0;
    }

    aside :global(code) {
        font-size: 0.8125rem;
        overflow-wrap: break-word;
        word-break: break-word;
    }
</style>
