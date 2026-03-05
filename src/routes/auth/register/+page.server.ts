import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
    const { session } = await locals.safeGetSession()
    if (session) throw redirect(303, '/dashboard')
}
