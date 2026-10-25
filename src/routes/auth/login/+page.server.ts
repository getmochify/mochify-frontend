import { redirect } from '@sveltejs/kit'
import { sanitiseNext } from '$lib/server/next'
import { microsoftLoginEnabled } from '$lib/auth'

export const load = async ({ locals, url }) => {
    const next = sanitiseNext(url.searchParams.get('next'))
    if (locals.session) throw redirect(303, next)
    return { next, microsoft: microsoftLoginEnabled() }
}
