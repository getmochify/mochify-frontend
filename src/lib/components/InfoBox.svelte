<script lang="ts">
    export let type: string = 'pink';
    export let title: string = 'FOR COMPLIANCE TEAMS';

    // Map legacy type names to the two supported themes
    const themeMap: Record<string, 'pink' | 'blue'> = {
        pink: 'pink',
        tip: 'pink',
        warning: 'pink',
        blue: 'blue',
        note: 'blue',
        technical: 'blue',
    };

    $: theme = themeMap[type] ?? 'pink';
</script>

<aside class="infobox" class:pink={theme === 'pink'} class:blue={theme === 'blue'}>
    <div class="info-header">
        <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8h.01M12 12v4"/>
        </svg>
        <span class="info-label">{title}</span>
    </div>
    <div class="info-body">
        <slot />
    </div>
</aside>

<style>
    .infobox {
        border-radius: 16px;
        padding: 1.25rem 1.5rem;
        margin: 1.75rem 0;
        border: 1px solid;
    }

    .infobox.pink {
        background: #fff5f6;
        border-color: #ffe0e3;
        --accent: #d14d64;
        --body: #4a2c2c;
    }

    .infobox.blue {
        background: #f0f7ff;
        border-color: #d4e7fe;
        --accent: #2b6cb0;
        --body: #1e3a5f;
    }

    .info-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    }

    .icon {
        color: var(--accent);
        flex-shrink: 0;
    }

    .info-label {
        font-size: 0.95rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--accent);
        line-height: 1;
    }

    .info-body {
        font-size: 1.05rem;
        line-height: 1.6;
        color: var(--body);
    }

    .info-body :global(p:first-child) { margin-top: 0; }
    .info-body :global(p:last-child) { margin-bottom: 0; }

    .info-body :global(code) {
        font-size: 0.875rem;
        overflow-wrap: break-word;
        word-break: break-word;
    }
</style>
