'use client'

import { BarChart3, Users, Zap, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Total users', value: '18,240', icon: Users },
  { label: 'AI tokens (24h)', value: '2.1M', icon: Zap },
  { label: 'Uptime', value: '99.9%', icon: Server },
  { label: 'MRR', value: '$42K', icon: BarChart3 },
]

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">System health, subscriptions, and AI usage</p>
        <Badge className="mt-2" variant="secondary">
          Restrict access via ADMIN_USER_IDS in production
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
