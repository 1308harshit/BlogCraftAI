import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

// Admin user IDs - Add creator/admin user IDs here
// In production, store these in environment variables or database
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS?.split(',') || []

// Admin emails - Alternative way to grant admin access
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [
  // Add creator emails here as fallback
]

export async function requireAdmin() {
  const authed = await requireUser()
  if (!authed.ok) return authed

  const isAdmin =
    ADMIN_USER_IDS.includes(authed.user.id) ||
    (authed.user.email && ADMIN_EMAILS.includes(authed.user.email))

  if (!isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 }),
    }
  }

  return { ok: true as const, supabase: authed.supabase, user: authed.user }
}

export async function isAdminUser(userId: string, userEmail?: string): Promise<boolean> {
  return ADMIN_USER_IDS.includes(userId) || (userEmail ? ADMIN_EMAILS.includes(userEmail) : false)
}
