import { DashboardShell } from '@/components/dashboard/shell'
import { isCurrentUserAdmin } from '@/lib/auth/require-admin'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isCurrentUserAdmin()
  return <DashboardShell isAdmin={isAdmin}>{children}</DashboardShell>
}
