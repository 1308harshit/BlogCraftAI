import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/require-user'

/** Server-side gate for privileged pages and actions. */
export async function requireAdminPage() {
  const authed = await requireUser()
  if (!authed.ok) redirect('/login')

  const role = authed.user.app_metadata?.role
  if (role !== 'admin') redirect('/dashboard')

  return authed
}

export async function isCurrentUserAdmin() {
  const authed = await requireUser()
  return authed.ok && authed.user.app_metadata?.role === 'admin'
}
