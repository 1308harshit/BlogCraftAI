'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Zap, Server, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Total users', value: '18,240', icon: Users },
  { label: 'AI tokens (24h)', value: '2.1M', icon: Zap },
  { label: 'Uptime', value: '99.9%', icon: Server },
  { label: 'MRR', value: '$42K', icon: BarChart3 },
]

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch('/api/admin/check-access')
        if (res.ok) {
          setHasAccess(true)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    checkAccess()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">System health, subscriptions, and AI usage</p>
        <Badge className="mt-2" variant="secondary">
          <ShieldAlert className="mr-1 h-3 w-3" />
          Restricted Access
        </Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>API</span>
            <Badge variant="success">Healthy</Badge>
          </div>
          <div className="flex justify-between">
            <span>Supabase</span>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="flex justify-between">
            <span>Razorpay webhooks</span>
            <Badge variant="secondary">Configure in dashboard</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
