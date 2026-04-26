# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Mochify SvelteKit frontend. PostHog is initialised client-side via `src/hooks.client.ts` using an `/ingest` reverse proxy (EU region) to avoid ad blockers, with session replay enabled via `paths.relative: false` in `svelte.config.js`. A server-side singleton (`src/lib/server/posthog.ts`) powers event capture on API routes and webhooks. Users are identified by email on login and signup. Client-side errors are automatically captured via `captureException`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `src/routes/auth/register/+page.svelte` |
| `user_logged_in` | User successfully signed in | `src/routes/auth/login/+page.svelte` |
| `manual_compress_started` | User clicked Squish in the manual ImageUpload flow | `src/lib/components/ImageUpload.svelte` |
| `manual_compress_completed` | Manual compression finished successfully | `src/lib/components/ImageUpload.svelte` |
| `manual_compress_rate_limited` | Manual compression hit the token/rate cap mid-batch | `src/lib/components/ImageUpload.svelte` |
| `manual_compress_failed` | Manual compression threw an unhandled error | `src/lib/components/ImageUpload.svelte` |
| `signup_cta_shown` | Unauthenticated user hit rate limit and signup modal was shown | `src/lib/components/ImageUpload.svelte` |
| `magic_flow_submitted` | User submitted a natural-language prompt in PromptForm | `src/lib/components/PromptForm.svelte` |
| `magic_flow_completed` | Magic Flow finished processing all files successfully | `src/lib/components/PromptForm.svelte` |
| `magic_flow_failed` | Magic Flow encountered an error | `src/lib/components/PromptForm.svelte` |
| `checkout_initiated` | User clicked upgrade and was redirected to Polar checkout (server-side) | `src/routes/api/checkout/+server.ts` |
| `subscription_activated` | Polar webhook confirmed subscription became active (server-side) | `src/routes/api/webhooks/polar/+server.ts` |
| `subscription_cancelled` | Polar webhook confirmed subscription was cancelled/revoked (server-side) | `src/routes/api/webhooks/polar/+server.ts` |
| `api_key_created` | User generated a new API key from the dashboard | `src/routes/dashboard/+page.svelte` |
| `server_error` | Unhandled server-side error (via `handleError`) | `src/hooks.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://eu.posthog.com/project/154897/dashboard/608036
- **Signups & Logins** (daily trend): https://eu.posthog.com/project/154897/insights/Dloigd2H
- **Signup → Checkout → Subscription Funnel** (conversion funnel): https://eu.posthog.com/project/154897/insights/tY60wn69
- **Image Compressions Completed** (manual + magic flow): https://eu.posthog.com/project/154897/insights/4vJPyu0P
- **Rate Limits & Signup CTA Shown** (free-tier friction): https://eu.posthog.com/project/154897/insights/qCd0AhS1
- **Subscription Activations vs Cancellations** (churn monitor): https://eu.posthog.com/project/154897/insights/KA1WX2gD

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
