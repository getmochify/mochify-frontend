/// <reference types="@cloudflare/workers-types" />

declare global {
	namespace App {
		interface Locals {
			user: import('better-auth').User | null;
			session: import('better-auth').Session | null;
		}
		interface PageData {
			user: import('better-auth').User | null;
			session: import('better-auth').Session | null;
		}
		interface Platform {
			env: {
				USAGE_KV: KVNamespace;
				DB: D1Database;
				RESEND_API_KEY: string | undefined;
				TURNSTILE_SECRET: string | undefined;
				// Service binding to the tokens worker (usage + API-key store).
				// Bound in wrangler.jsonc, so this is always present in
				// production. Still optional because `platform` is undefined
				// under plain `vite dev` — that, not a missing binding, is why
				// callers keep a public-fetch fallback. Prefer reaching it via
				// tokensFetch() in src/lib/server/tokensWorker.ts.
				TOKENS?: Fetcher;
			};
			context?: {
				waitUntil(promise: Promise<unknown>): void;
			};
		}
	}

	interface BeforeInstallPromptEvent extends Event {
		prompt(): Promise<void>;
		readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	interface Window {
		turnstile?: {
			// `ready()` is deliberately not declared. It throws when api.js was loaded
			// async or deferred, which is always true for a script we inject via
			// createElement — use the `onload=` callback for readiness instead.
			render(el: HTMLElement, options: Record<string, unknown>): string | undefined;
			remove(widgetId: string): void;
			reset(widgetId?: string): void;
		};
		/** Named in the api.js `onload=` param; Turnstile calls it once the API is ready. */
		onloadTurnstileCallback?: () => void;
	}
}

export {};
