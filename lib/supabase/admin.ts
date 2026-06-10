import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { envPublic, envServer } from '@/lib/env'

let client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!envServer.SUPABASE_SERVICE_ROLE_KEY) return null
  if (!client) {
    client = createClient(envPublic.NEXT_PUBLIC_SUPABASE_URL, envServer.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  }
  return client
}
