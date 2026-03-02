<script lang="ts">
    let mobileMenuOpen = false;
    
    function toggleMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
    
    function closeMenu() {
        mobileMenuOpen = false;
    }
</script>

<nav class="relative z-20 w-full max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
    <a href="/" class="group flex items-center gap-2 transition-transform active:scale-95">
        <div class="w-8 h-8 bg-[#F06292] rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
            <span class="text-white font-black text-xl">M</span>
        </div>
        <span class="text-xl font-black text-[#4A2C2C] tracking-tight">Mochify</span>
    </a>

    <!-- Desktop Menu -->
    <div class="hidden sm:flex items-center gap-6">
        <a href="/solutions" class="text-sm font-medium text-[#6C3F31] hover:text-[#F06292] transition-colors">Solutions</a>
        <a href="/guides" class="text-sm font-medium text-[#6C3F31] hover:text-[#F06292] transition-colors">Guides</a>
        <a href="https://ko-fi.com/Z8Z41T1651" target="_blank" class="px-4 py-2 bg-[#FFF5F7] text-[#F06292] rounded-xl text-xs font-black border border-pink-100 hover:bg-pink-50 transition-all">
            Support ☕
        </a>
    </div>

    <!-- Mobile Menu Button -->
    <button 
        on:click={toggleMenu}
        class="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#FFF5F7] border border-pink-100 transition-all active:scale-95"
        aria-label="Toggle menu"
    >
        <div class="w-5 h-4 flex flex-col justify-between">
            <span class="w-full h-0.5 bg-[#F06292] rounded-full transition-all {mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}"></span>
            <span class="w-full h-0.5 bg-[#F06292] rounded-full transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></span>
            <span class="w-full h-0.5 bg-[#F06292] rounded-full transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
        </div>
    </button>
</nav>

<!-- Mobile Menu Panel -->
{#if mobileMenuOpen}
    <div class="sm:hidden fixed inset-0 z-50" on:click={closeMenu} on:keydown={(e) => e.key === 'Escape' && closeMenu()} role="button" tabindex="-1">
        <div class="absolute inset-0 bg-[#4A2C2C]/20 backdrop-blur-sm"></div>
        <div 
            class="absolute top-20 right-4 left-4 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden"
            on:click={(e) => e.stopPropagation()}
            on:keydown={() => {}}
            role="dialog"
            aria-modal="true"
            tabindex="0"
        >
            <div class="flex flex-col p-4 gap-2">
                <a 
                    href="/solutions" 
                    on:click={closeMenu}
                    class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95"
                >
                    Solutions
                </a>
                <a 
                    href="/guides"
                    on:click={closeMenu}
                    class="px-6 py-4 text-[#6C3F31] font-medium rounded-2xl hover:bg-[#FFF5F7] transition-all active:scale-95"
                >
                    Guides
                </a>
                <a 
                    href="https://ko-fi.com/Z8Z41T1651" 
                    target="_blank"
                    on:click={closeMenu}
                    class="px-6 py-4 bg-[#F06292] text-white font-black rounded-2xl hover:bg-[#E91E63] transition-all text-center active:scale-95 shadow-sm"
                >
                    Support ☕
                </a>
            </div>
        </div>
    </div>
{/if}