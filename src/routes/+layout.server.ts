export const load = async ({ locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    return { session, user: session?.user ?? null }
}
