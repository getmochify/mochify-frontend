import { redirect } from '@sveltejs/kit'

function sanitiseNext(raw: string | null): string {
    const candidate = raw ?? '/dashboard'
    // Allow only same-origin paths: must start with / and must not contain ://
    if (candidate.startsWith('/') && !candidate.includes('://')) return candidate
    return '/dashboard'
}

export const load = async ({ locals, url }) => {
    const next = sanitiseNext(url.searchParams.get('next'))
    if (locals.session) throw redirect(303, next)
    return { next }
}
