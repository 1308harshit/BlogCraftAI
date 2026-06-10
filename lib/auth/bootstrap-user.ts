import { createClient } from '@supabase/supabase-js'
import { envPublic } from '@/lib/env-public'
import { envServer } from '@/lib/env-server'

const admin = (() => {
  if (!envServer.SUPABASE_SERVICE_ROLE_KEY) return null
  return createClient(envPublic.NEXT_PUBLIC_SUPABASE_URL, envServer.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
})()

/** Ensures a new user has free entitlements and a brand profile row. */
export async function bootstrapUser(userId: string) {
  if (!admin) return

  await admin.from('entitlements').upsert(
    { user_id: userId, plan_id: 'free', generations_limit: 10, updated_at: new Date().toISOString() },
    { onConflict: 'user_id', ignoreDuplicates: true }
  )

  await admin.from('brand_profiles').upsert(
    { user_id: userId, updated_at: new Date().toISOString() },
    { onConflict: 'user_id', ignoreDuplicates: true }
  )
}
