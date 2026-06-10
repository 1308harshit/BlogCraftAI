'use client'

import { useWorkspaceStore } from '@/stores/workspace-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SettingsPage() {
  const brandMemory = useWorkspaceStore((s) => s.brandMemory)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Brand memory and preferences</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Brand Memory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {brandMemory ? (
            Object.entries(brandMemory).map(([key, value]) => (
              <div key={key}>
                <p className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p>{value}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No brand memory configured yet.</p>
          )}
          <Button asChild variant="outline" className="mt-4">
            <Link href="/onboarding">Update preferences</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
