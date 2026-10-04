// PostHog settings shared by both browser entry points:
//   - hooks.client.ts, for every page that runs the SvelteKit app;
//   - the standalone snippet in guides/+layout.svelte, for guide pages, which
//     ship csr = false and so never run hooks.client.ts.
// Keeping them in one place stops the two paths drifting apart. Everything
// here must stay JSON-serializable, because the guides snippet inlines it as
// JSON; function options (before_send) live in hooks.client.ts only.
export const posthogOptions = {
	ui_host: 'https://eu.posthog.com', // required with a proxy so in-app links resolve to PostHog
	defaults: '2026-01-30',
	person_profiles: 'identified_only',
	capture_exceptions: false,
	capture_performance: false,
	disable_session_recording: true,
	// Surveys are switched on in the PostHog project but no survey is rendered
	// anywhere in the code; this stops surveys.js (~34 KB compressed) loading on
	// every page.
	disable_surveys: true,
	// Dead-click events and heatmaps are both unused. Heatmaps load
	// dead-clicks-autocapture.js (~9 KB compressed) on every page even with
	// capture_dead_clicks off, so both have to be disabled to drop the script.
	capture_dead_clicks: false,
	enable_heatmaps: false
} as const;
