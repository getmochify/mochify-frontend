<script>
    import { onMount } from 'svelte';
    
    let scrollProgress = $state(0);
    
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        
        // Calculate how far down the page we've scrolled (0-100%)
        const maxScroll = documentHeight - windowHeight;
        const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        
        scrollProgress = Math.min(100, Math.max(0, progress));
    }
    
    onMount(() => {
        updateProgress();
        
        // Use passive listener for better scroll performance
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    });
</script>

<div class="read-progress-container">
    <div 
        class="read-progress-bar" 
        style="width: {scrollProgress}%"
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Reading progress"
    ></div>
</div>

<style>
    .read-progress-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(255, 240, 243, 0.3);
        z-index: 9999;
        pointer-events: none;
    }
    
    .read-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #FFB3C6 0%, #F06292 50%, #E0ACD5 100%);
        box-shadow: 0 0 10px rgba(240, 98, 146, 0.3);
        transition: width 0.1s ease-out;
        will-change: width;
    }
</style>
