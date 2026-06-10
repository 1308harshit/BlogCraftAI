// Backwards-compatible re-exports.
// New code should import `createSupabaseBrowserClient` and `createSupabaseServerClient`.
export { createSupabaseBrowserClient as createBrowserSupabase } from '@/lib/supabase/browser'
export { createSupabaseServerClient as createServerSupabase } from '@/lib/supabase/server'
