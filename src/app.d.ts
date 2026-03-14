import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>
		}
		interface PageData {
			session: Session | null
			user: User | null
		}
		interface Platform {
			env: {
				USAGE_KV: KVNamespace
			}
		}
	}

	interface Window {
		umami?: {
			track: (event: string, data?: Record<string, unknown>) => void;
		};
	}
}

export {};
