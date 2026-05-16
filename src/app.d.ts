/// <reference types="@cloudflare/workers-types" />

declare global {
	namespace App {
		interface Locals {
			user: import("better-auth").User | null
			session: import("better-auth").Session | null
		}
		interface PageData {
			user: import("better-auth").User | null
			session: import("better-auth").Session | null
		}
		interface Platform {
			env: {
				USAGE_KV: KVNamespace
				DB: D1Database
				RESEND_API_KEY: string | undefined
			}
			context?: {
				waitUntil(promise: Promise<unknown>): void
			}
		}
	}

	interface BeforeInstallPromptEvent extends Event {
		prompt(): Promise<void>;
		readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}
}

export {};
