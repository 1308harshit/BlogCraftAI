'use client'

import { useState, useEffect } from 'react'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Building2,
  Palette,
  Globe,
  Key,
  Bell,
  Shield,
  Trash2,
  Save,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabId = 'profile' | 'brand' | 'integrations' | 'notifications' | 'security' | 'danger'

const tabs = [
  { id: 'profile' as TabId, label: 'Profile', icon: User },
  { id: 'brand' as TabId, label: 'Brand', icon: Building2 },
  { id: 'integrations' as TabId, label: 'Integrations', icon: Globe },
  { id: 'notifications' as TabId, label: 'Notifications', icon: Bell },
  { id: 'security' as TabId, label: 'Security', icon: Shield },
  { id: 'danger' as TabId, label: 'Danger Zone', icon: Trash2 },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const brandMemory = useWorkspaceStore((s) => s.brandMemory)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Failed to load user', error)
      }
    }
    loadUser()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account, brand preferences, and integrations
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <nav className="w-48 shrink-0">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && <ProfileTab user={user} onSave={handleSave} saving={saving} />}
          {activeTab === 'brand' && (
            <BrandTab brandMemory={brandMemory} onSave={handleSave} saving={saving} />
          )}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'notifications' && <NotificationsTab onSave={handleSave} saving={saving} />}
          {activeTab === 'security' && <SecurityTab onSave={handleSave} saving={saving} />}
          {activeTab === 'danger' && <DangerZoneTab />}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({
  user,
  onSave,
  saving,
}: {
  user: { email?: string; name?: string } | null
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input id="name" defaultValue={user?.name || ''} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email || ''}
              placeholder="you@example.com"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea id="bio" placeholder="Tell us about yourself" rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function BrandTab({
  brandMemory,
  onSave,
  saving,
}: {
  brandMemory: any
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Memory
          </CardTitle>
          <CardDescription>Configure your brand voice and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {brandMemory ? (
            <>
              <div className="space-y-2">
                <label htmlFor="niche" className="text-sm font-medium">
                  Niche
                </label>
                <Input id="niche" defaultValue={brandMemory.niche || ''} placeholder="e.g., SaaS" />
              </div>
              <div className="space-y-2">
                <label htmlFor="writingStyle" className="text-sm font-medium">
                  Writing Style
                </label>
                <Input
                  id="writingStyle"
                  defaultValue={brandMemory.writingStyle || ''}
                  placeholder="e.g., Conversational"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="targetAudience" className="text-sm font-medium">
                  Target Audience
                </label>
                <Input
                  id="targetAudience"
                  defaultValue={brandMemory.targetAudience || ''}
                  placeholder="e.g., Startup Founders"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="brandTone" className="text-sm font-medium">
                  Brand Tone
                </label>
                <Input
                  id="brandTone"
                  defaultValue={brandMemory.brandTone || ''}
                  placeholder="e.g., Bold"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="seoGoals" className="text-sm font-medium">
                  SEO Goals
                </label>
                <Textarea
                  id="seoGoals"
                  defaultValue={brandMemory.seoGoals || ''}
                  placeholder="Describe your SEO objectives"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No brand memory configured yet.</p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/onboarding">Complete Onboarding</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {brandMemory && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function IntegrationsTab() {
  const integrations = [
    {
      name: 'WordPress',
      description: 'Publish directly to your WordPress site',
      connected: false,
      icon: '🌐',
    },
    {
      name: 'Google Analytics',
      description: 'Track content performance',
      connected: false,
      icon: '📊',
    },
    {
      name: 'Search Console',
      description: 'Monitor search performance',
      connected: false,
      icon: '🔍',
    },
    {
      name: 'Medium',
      description: 'Cross-publish to Medium',
      connected: false,
      icon: '📝',
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Integrations
          </CardTitle>
          <CardDescription>Connect external services to extend functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration, idx) => (
            <div key={idx}>
              {idx > 0 && <Separator className="my-4" />}
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Button variant={integration.connected ? 'outline' : 'default'} size="sm">
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationsTab({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  const notifications = [
    { id: 'email_digest', label: 'Daily email digest', description: 'Receive daily performance updates' },
    {
      id: 'content_published',
      label: 'Content published',
      description: 'Get notified when content goes live',
    },
    {
      id: 'seo_alerts',
      label: 'SEO alerts',
      description: 'Alerts for SEO improvements and issues',
    },
    {
      id: 'revenue_updates',
      label: 'Revenue updates',
      description: 'Weekly revenue attribution reports',
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification, idx) => (
            <div key={notification.id}>
              {idx > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{notification.label}</h3>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function SecurityTab({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </label>
            <Input id="current-password" type="password" placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </label>
            <Input id="new-password" type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm New Password
            </label>
            <Input id="confirm-password" type="password" placeholder="Confirm new password" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API access tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Production API Key</p>
              <code className="text-xs text-muted-foreground">bc_prod_••••••••••••1234</code>
            </div>
            <Button variant="outline" size="sm">
              <Key className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Create New API Key
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Password
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function DangerZoneTab() {
  return (
    <div className="space-y-6">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions - proceed with caution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/50 p-4">
              <h3 className="font-medium">Export All Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download all your content, analytics, and account data
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Request Export
              </Button>
            </div>

            <div className="rounded-lg border border-destructive/50 p-4">
              <h3 className="font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="outline" size="sm" className="mt-3 border-red-500 text-red-500 hover:bg-red-500/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
