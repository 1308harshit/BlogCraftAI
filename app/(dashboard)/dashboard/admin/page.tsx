import { BarChart3, Users, Zap, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { requireAdminPage } from '@/lib/auth/require-admin'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export default async function AdminPage() {
  await requireAdminPage()
  const admin = getSupabaseAdmin()

  const [profilesResult, usageResult, subscriptionsResult] = admin
    ? await Promise.all([
        admin.from('brand_profiles').select('*', { count: 'exact', head: true }),
        admin.from('ai_usage').select('*', { count: 'exact', head: true }),
        admin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      ])
    : [null, null, null]

  const stats = [
    { label: 'Registered users', value: profilesResult?.count?.toLocaleString() ?? 'Unavailable', icon: Users },
    { label: 'AI generations', value: usageResult?.count?.toLocaleString() ?? '0', icon: Zap },
    { label: 'Active subscriptions', value: subscriptionsResult?.count?.toLocaleString() ?? '0', icon: BarChart3 },
    { label: 'System status', value: admin ? 'Connected' : 'Unavailable', icon: Server },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Live operational counts for BlogCraft AI.</p>
        <Badge className="mt-2" variant="secondary">Restricted to administrators</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{stat.value}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
