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
				// Optional: undefined until the `services` binding is added to
				// wrangler.jsonc, so callers must fall back to a public fetch.
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
			/** Queues `cb` until the Turnstile API has finished initialising. */
			ready(cb: () => void): void;
			render(el: HTMLElement, options: Record<string, unknown>): string | undefined;
			remove(widgetId: string): void;
			reset(widgetId?: string): void;
		};
		/** Named in the api.js `onload=` param; Turnstile calls it once the API is ready. */
		onloadTurnstileCallback?: () => void;
	}
}

export {};
