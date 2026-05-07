<script lang="ts">
    export let type: 'tip' | 'technical' | 'note' | 'warning' = 'note';
    export let title = '';

    const configs = {
        tip: {
            icon: '💡',
            bgColor: 'bg-[#FFF5F7]',
            borderColor: 'border-pink-100',
            iconBg: 'bg-pink-50',
            iconBorder: 'border-pink-200',
            titleColor: 'text-[#D81B60]',
            label: 'Pro Tip'
        },
        technical: {
            icon: '⚙️',
            bgColor: 'bg-[#FFF9F5]',
            borderColor: 'border-[#FFE4D6]',
            iconBg: 'bg-[#FFF0E6]',
            iconBorder: 'border-[#FFD4B8]',
            titleColor: 'text-[#875F42]',
            label: 'Technical Note'
        },
        note: {
            icon: '📝',
            bgColor: 'bg-[#F5F9FF]',
            borderColor: 'border-blue-100',
            iconBg: 'bg-blue-50',
            iconBorder: 'border-blue-200',
            titleColor: 'text-blue-600',
            label: 'Note'
        },
        warning: {
            icon: '⚠️',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            iconBg: 'bg-amber-100',
            iconBorder: 'border-amber-300',
            titleColor: 'text-amber-700',
            label: 'Important'
        }
    };

    $: config = configs[type] || configs.note;
    $: displayTitle = title || config.label;
</script>

<aside class="my-6 {config.bgColor} rounded-2xl p-6 border {config.borderColor} shadow-sm">
    <div class="flex gap-4">
        <div class="shrink-0">
            <div class="w-10 h-10 {config.iconBg} rounded-xl flex items-center justify-center border {config.iconBorder} shadow-sm">
                <span class="text-xl">{config.icon}</span>
            </div>
        </div>
        <div class="flex-1 min-w-0">
            <h4 class="text-sm font-black {config.titleColor} uppercase tracking-wider mb-2">
                {displayTitle}
            </h4>
            <div class="text-cocoa-deep text-base leading-relaxed prose-sm">
                <slot />
            </div>
        </div>
    </div>
</aside>
