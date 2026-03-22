import { redirect } from '@sveltejs/kit'

export const load = async ({ url }) => {
    const token = url.searchParams.get('token')
    if (!token) throw redirect(303, '/auth/forgot-password')
    return { token }
}
