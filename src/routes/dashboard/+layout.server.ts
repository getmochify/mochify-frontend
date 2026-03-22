import { redirect } from '@sveltejs/kit'

// TODO: replace with D1 profiles table once migrated from Supabase.
const PLAN_LIMITS: Record<string, number> = { free: 25, pro: 1000 }

export const load = async ({ locals }) => {
    if (!locals.session || !locals.user) throw redirect(303, '/auth/login')

    const plan = 'free'
    const profile = { plan, ops_limit: PLAN_LIMITS[plan] }

    return { session: locals.session, user: locals.user, profile }
}
