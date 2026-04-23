import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
    const next = url.searchParams.get('next') ?? '/dashboard'
    if (locals.session) throw redirect(303, next)
    return { next }
}
