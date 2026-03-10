import { fail, redirect } from '@sveltejs/kit'
import { createClient } from '@supabase/supabase-js'
import { Polar } from '@polar-sh/sdk'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY, POLAR_ACCESS_TOKEN } from '$env/static/private'

export const actions = {
    deleteAccount: async ({ locals }) => {
        const { user } = await locals.safeGetSession()
        if (!user) return fail(401, { error: 'Not authenticated' })

        const adminClient = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // Cancel Polar subscription if the user has one
        const { data: profile } = await adminClient
            .from('profiles')
            .select('polar_subscription_id')
            .eq('user_id', user.id)
            .single()

        if (profile?.polar_subscription_id) {
            try {
                const polar = new Polar({ accessToken: POLAR_ACCESS_TOKEN })
                await polar.subscriptions.revoke({ id: profile.polar_subscription_id })
            } catch {
                // Log but don't block deletion — subscription may already be cancelled
            }
        }

        const { error } = await adminClient.auth.admin.deleteUser(user.id)
        if (error) return fail(500, { error: 'Failed to delete account' })

        throw redirect(303, '/?deleted=true')
    }
}
