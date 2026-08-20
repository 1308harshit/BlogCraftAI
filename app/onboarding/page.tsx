'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { toast } from 'sonner'
import {
  Sparkles,
  Target,
  Users,
  Wand2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react'

type OnboardingStep = 'welcome' | 'goal' | 'website' | 'brand' | 'analyzing' | 'complete'

interface OnboardingData {
  goal: string
  website: string
  niche: string
  targetAudience: string
  writingStyle: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const setBrandMemory = useWorkspaceStore((s) => s.setBrandMemory)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    goal: '',
    website: '',
    niche: '',
    targetAudience: '',
    writingStyle: '',
  })

  const stepProgress = {
    welcome: 0,
    goal: 25,
    website: 50,
    brand: 75,
    analyzing: 90,
    complete: 100,
  }

  const handleGoalSelect = (goal: string) => {
    setData({ ...data, goal })
    setCurrentStep('website')
  }

  const handleContinueToFinal = () => {
    if (!data.website.trim()) {
      toast.error('Please enter your website URL')
      return
    }
    setCurrentStep('brand')
  }

  const handleFinish = async () => {
    if (!data.niche.trim() || !data.targetAudience.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setCurrentStep('analyzing')
    
    // Simulate quick analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    setSaving(true)
    const brandMemory = {
      niche: data.niche,
      writingStyle: data.writingStyle || 'professional and engaging',
      targetAudience: data.targetAudience,
      brandTone: 'helpful',
      seoGoals: `Goal: ${data.goal}. Website: ${data.website}`,
    }
    
    setBrandMemory(brandMemory)

    try {
      const res = await fetch('/api/workspace/brand-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandMemory),
      })
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Save failed')
      }
      setCurrentStep('complete')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch {
      toast.error('Could not save — please try again')
      setCurrentStep('brand')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Setup Progress</span>
            <span className="text-sm text-muted-foreground">{stepProgress[currentStep]}%</span>
          </div>
          <Progress value={stepProgress[currentStep]} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-2">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Welcome to BlogCraft AI</CardTitle>
                  <CardDescription className="text-base mt-3">
                    Let's set up your content workspace in under 5 minutes.
                    We'll personalize the platform for your business goals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Define Your Goal</div>
                        <div className="text-xs text-muted-foreground">Tell us what you want to achieve</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Connect Your Website</div>
                        <div className="text-xs text-muted-foreground">We'll analyze your content strategy</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Set Brand Voice</div>
                        <div className="text-xs text-muted-foreground">AI learns your unique style</div>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => setCurrentStep('goal')}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Goal Selection */}
          {currentStep === 'goal' && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <Badge>Step 1 of 3</Badge>
                  </div>
                  <CardTitle>What's your main goal?</CardTitle>
                  <CardDescription>
                    This helps us recommend the best features and workflows for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button
                    onClick={() => handleGoalSelect('Grow organic traffic')}
                    className="w-full text-left p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Grow Organic Traffic</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Improve SEO, rank for keywords, increase visitors
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoalSelect('Generate leads')}
                    className="w-full text-left p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Generate Leads</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Capture emails, build audience, create lead magnets
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoalSelect('Build brand authority')}
                    className="w-full text-left p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Build Brand Authority</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Establish expertise, thought leadership, reputation
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoalSelect('Increase conversions')}
                    className="w-full text-left p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Increase Conversions</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Drive sales, boost revenue, optimize CTAs
                        </div>
                      </div>
                    </div>
                  </button>

                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => setCurrentStep('welcome')}
                  >
                    Back
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Website */}
          {currentStep === 'website' && (
            <motion.div
              key="website"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <Badge>Step 2 of 3</Badge>
                  </div>
                  <CardTitle>What's your website URL?</CardTitle>
                  <CardDescription>
                    We'll analyze your content strategy and provide personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={data.website}
                      onChange={(e) => setData({ ...data, website: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleContinueToFinal()}
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Don't have a website yet? Enter your social media or planned domain
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Wand2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium mb-1">What happens next:</div>
                        <div className="text-muted-foreground space-y-1">
                          <div>• We'll set up your workspace</div>
                          <div>• AI will learn your content preferences</div>
                          <div>• You'll get personalized content recommendations</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('goal')}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleContinueToFinal}
                      disabled={!data.website.trim()}
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Brand Info */}
          {currentStep === 'brand' && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <Badge>Step 3 of 3</Badge>
                  </div>
                  <CardTitle>Tell us about your brand</CardTitle>
                  <CardDescription>
                    This helps our AI write in your unique voice and style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      What's your niche or industry? *
                    </label>
                    <Input
                      placeholder="e.g., SaaS marketing, health & fitness, personal finance"
                      value={data.niche}
                      onChange={(e) => setData({ ...data, niche: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Who's your target audience? *
                    </label>
                    <Input
                      placeholder="e.g., startup founders, busy professionals, fitness enthusiasts"
                      value={data.targetAudience}
                      onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Writing style (optional)
                    </label>
                    <Input
                      placeholder="e.g., conversational, authoritative, witty, technical"
                      value={data.writingStyle}
                      onChange={(e) => setData({ ...data, writingStyle: e.target.value })}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Quick summary:</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>• Goal: {data.goal}</div>
                        <div>• Website: {data.website}</div>
                        {data.niche && <div>• Niche: {data.niche}</div>}
                        {data.targetAudience && <div>• Audience: {data.targetAudience}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('website')}
                      disabled={saving}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleFinish}
                      disabled={saving || !data.niche.trim() || !data.targetAudience.trim()}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Analyzing */}
          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Setting up your workspace...</h2>
                  <p className="text-muted-foreground mb-6">
                    Our AI is personalizing your content strategy
                  </p>
                  <div className="max-w-sm mx-auto space-y-2 text-sm">
                    <div className="flex items-center gap-3 text-left">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Analyzing your goals</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Setting up brand voice</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
                      <span>Preparing your dashboard...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 6: Complete */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-2 border-primary/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3">You're all set!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your workspace is ready. Redirecting to dashboard...
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading dashboard</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
