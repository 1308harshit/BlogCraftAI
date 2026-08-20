'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Share2,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Twitter,
  Linkedin,
  Facebook,
  Globe,
  Rss,
  Plus,
  Send,
  Settings,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Platform {
  id: string
  name: string
  icon: any
  connected: boolean
  autoPublish: boolean
  lastPublished?: string
  publishedCount: number
  status: 'active' | 'pending' | 'error'
}

export default function DistributionPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: Globe,
      connected: true,
      autoPublish: true,
      lastPublished: '2 hours ago',
      publishedCount: 42,
      status: 'active',
    },
    {
      id: 'medium',
      name: 'Medium',
      icon: Globe,
      connected: true,
      autoPublish: false,
      lastPublished: '1 day ago',
      publishedCount: 28,
      status: 'active',
    },
    {
      id: 'devto',
      name: 'Dev.to',
      icon: Globe,
      connected: true,
      autoPublish: true,
      lastPublished: '3 hours ago',
      publishedCount: 18,
      status: 'active',
    },
    {
      id: 'hashnode',
      name: 'Hashnode',
      icon: Globe,
      connected: false,
      autoPublish: false,
      publishedCount: 0,
      status: 'pending',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      connected: true,
      autoPublish: true,
      lastPublished: '1 hour ago',
      publishedCount: 35,
      status: 'active',
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      connected: false,
      autoPublish: false,
      publishedCount: 0,
      status: 'pending',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      connected: false,
      autoPublish: false,
      publishedCount: 0,
      status: 'pending',
    },
    {
      id: 'email',
      name: 'Email Newsletter',
      icon: Mail,
      connected: true,
      autoPublish: false,
      lastPublished: '2 days ago',
      publishedCount: 24,
      status: 'active',
    },
    {
      id: 'rss',
      name: 'RSS Feed',
      icon: Rss,
      connected: true,
      autoPublish: true,
      lastPublished: 'Auto-synced',
      publishedCount: 42,
      status: 'active',
    },
  ])

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      title: 'Complete Guide to AI Content Marketing',
      platforms: ['wordpress', 'medium', 'linkedin'],
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: '2',
      title: '10 SEO Strategies That Actually Work',
      platforms: ['wordpress', 'devto', 'linkedin'],
      timestamp: '1 day ago',
      status: 'success',
    },
    {
      id: '3',
      title: 'How to Build a Content Strategy',
      platforms: ['wordpress', 'email'],
      timestamp: '2 days ago',
      status: 'success',
    },
  ])

  const toggleAutoPublish = (platformId: string) => {
    setPlatforms(
      platforms.map((p) =>
        p.id === platformId ? { ...p, autoPublish: !p.autoPublish } : p
      )
    )
  }

  const connectedPlatforms = platforms.filter((p) => p.connected)
  const availablePlatforms = platforms.filter((p) => !p.connected)

  const getStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-500" />
    return <Clock className="h-4 w-4 text-yellow-500" />
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId)
    if (!platform) return Globe
    return platform.icon
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold sm:text-3xl flex items-center gap-2"
          >
            <Share2 className="h-8 w-8 text-primary" />
            Multi-Platform Distribution
          </motion.h1>
          <p className="mt-1 text-muted-foreground">
            Publish content across platforms, automate distribution, track performance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connect Platform
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedPlatforms.length}</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-500" />
              Total Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platforms.reduce((sum, p) => sum + p.publishedCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Auto-Publishing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platforms.filter((p) => p.autoPublish && p.connected).length}
            </div>
            <p className="text-xs text-muted-foreground">Platforms on autopilot</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platforms">
            <Share2 className="mr-2 h-4 w-4" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="mr-2 h-4 w-4" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Connected Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>Manage your active publishing integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {platform.name}
                          <Badge variant="secondary">{platform.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {platform.publishedCount} articles • Last: {platform.lastPublished}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Auto-publish</div>
                        <Switch
                          checked={platform.autoPublish}
                          onCheckedChange={() => toggleAutoPublish(platform.id)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Platforms</CardTitle>
              <CardDescription>Connect more platforms to expand your reach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availablePlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-dashed bg-card/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Publishing Activity</CardTitle>
              <CardDescription>Track your multi-platform content distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(activity.status)}
                        <h3 className="font-medium">{activity.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Published to:</span>
                    {activity.platforms.map((platformId) => {
                      const Icon = getPlatformIcon(platformId)
                      return (
                        <Badge key={platformId} variant="secondary" className="text-xs">
                          <Icon className="mr-1 h-3 w-3" />
                          {platforms.find((p) => p.id === platformId)?.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Settings</CardTitle>
              <CardDescription>Configure your publishing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-publish on approval</div>
                    <p className="text-sm text-muted-foreground">
                      Automatically publish to enabled platforms when content is approved
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Cross-post to social media</div>
                    <p className="text-sm text-muted-foreground">
                      Share article links on connected social platforms
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email notification on publish</div>
                    <p className="text-sm text-muted-foreground">
                      Get notified when content is successfully published
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Canonical URL management</div>
                    <p className="text-sm text-muted-foreground">
                      Automatically set canonical URLs to avoid duplicate content issues
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-3">Publishing Schedule</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set optimal publishing times for each platform
                </p>
                <Button variant="outline">Configure Schedule</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Share2 className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable auto-publishing on WordPress, Medium, and LinkedIn for maximum reach.
                    These platforms drive 80% of organic traffic for most content creators.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
