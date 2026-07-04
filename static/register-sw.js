if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        // The worker installs but waits (no skipWaiting/clientsClaim), so a deploy
        // mid-session never seizes an open page or evicts the precached chunks it
        // still references — the old worker keeps serving the old build until the
        // page goes away. HTML is never precached (navigateFallback: null, no html
        // in globPatterns), so every navigation already runs the newest build;
        // that makes it safe to activate a worker left waiting by a previous
        // session right here at load, with no reload needed. A worker that
        // finishes installing later in this session simply waits for the next
        // page load (or for all tabs to close, the browser default).
        const registration = await navigator.serviceWorker.register('/sw.js');
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
}
