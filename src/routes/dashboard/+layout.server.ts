import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
    const { session, user } = await locals.safeGetSession()
    if (!session) throw redirect(303, '/auth/login')

    const { data: profile } = await locals.supabase
        .from('profiles')
        .select('plan, ops_limit, quota_period_end')
        .eq('user_id', user!.id)
        .single()

    return { session, user, profile }
}
