import { redirect } from '@sveltejs/kit'

// Better Auth handles OAuth callbacks at /api/auth/callback/* via svelteKitHandler.
// This route exists only as a fallback redirect for any stale links.
export const GET = async () => {
    throw redirect(303, '/dashboard')
}
