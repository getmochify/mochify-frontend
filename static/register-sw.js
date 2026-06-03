if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // The autoUpdate worker does skipWaiting + clientsClaim, so a new deploy
        // takes control of this already-open page and evicts (cleanupOutdatedCaches)
        // the old hashed chunks it still references. Reload once when control
        // passes to the new worker so the page runs the same build as the cache —
        // without this, the next dynamic import 404s ("Importing a module script
        // failed" / "Load failed"), which long-lived iOS standalone PWAs hit often.
        const hadController = !!navigator.serviceWorker.controller;
        let reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            // First install (no prior controller) is already a fresh page — skip.
            if (!hadController || reloading) return;
            reloading = true;
            window.location.reload();
        });

        navigator.serviceWorker.register('/sw.js');
    });
}
