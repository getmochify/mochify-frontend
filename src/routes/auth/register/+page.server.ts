import { redirect } from '@sveltejs/kit'
import { sanitiseNext, planIntent } from '$lib/server/next'

export const load = async ({ locals, url }) => {
    // Carry the checkout intent through signup. Someone who clicked "Get Seller"
    // on /pricing arrives here via /api/checkout's redirect, and until now the
    // page ignored that entirely: it sold them the free plan and dropped them on
    // the dashboard afterwards.
    const next = sanitiseNext(url.searchParams.get('next'))
    if (locals.session) throw redirect(303, next)
    return { next, plan: planIntent(url, next) }
}
