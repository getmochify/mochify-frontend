// Not on individual guide pages: they are one-off reads from search that ship
// no app code, and registering would start the whole precache download in the
// background for a visitor who may never open the app. The /guides index (no
// trailing segment) still registers. Returning visitors' existing worker keeps
// controlling guide pages either way.
if ('serviceWorker' in navigator && !/^\/guides\/[^/]+/.test(location.pathname)) {
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
