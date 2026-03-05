import { redirect } from '@sveltejs/kit'

export const load = async ({ url, locals }) => {
    const code = url.searchParams.get('code')

    if (!code) {
        throw redirect(303, '/auth/forgot-password')
    }

    const { error } = await locals.supabase.auth.exchangeCodeForSession(code)

    if (error) {
        throw redirect(303, '/auth/forgot-password')
    }
}
