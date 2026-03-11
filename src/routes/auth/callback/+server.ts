import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals }) => {
    const code = url.searchParams.get('code')

    if (code) {
        const { error } = await locals.supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error('Auth callback error:', error.message)
            throw redirect(303, '/auth/login?error=callback_failed')
        }
    }

    throw redirect(303, '/dashboard')
}
