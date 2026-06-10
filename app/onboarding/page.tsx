'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { toast } from 'sonner'

const steps = [
  { key: 'niche', label: 'Your niche', placeholder: 'e.g. SaaS marketing, fitness, finance' },
  { key: 'writingStyle', label: 'Writing style', placeholder: 'e.g. Conversational, authoritative, witty' },
  { key: 'targetAudience', label: 'Target audience', placeholder: 'e.g. Startup founders, 25-40 professionals' },
  { key: 'brandTone', label: 'Brand tone', placeholder: 'e.g. Bold, friendly, expert' },
  { key: 'seoGoals', label: 'SEO goals', placeholder: 'e.g. Rank for long-tail keywords, drive affiliate revenue' },
] as const

export default function OnboardingPage() {
  const router = useRouter()
  const setBrandMemory = useWorkspaceStore((s) => s.setBrandMemory)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    niche: '',
    writingStyle: '',
    targetAudience: '',
    brandTone: '',
    seoGoals: '',
  })

  const current = steps[step]
  const isLast = step === steps.length - 1

  const finish = async () => {
    const value = form[current.key]
    if (!value.trim()) {
      toast.error('Please fill in this field')
      return
    }
    if (!isLast) {
      setStep((s) => s + 1)
      return
    }

    setSaving(true)
    setBrandMemory(form)
    try {
      const res = await fetch('/api/workspace/brand-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Save failed')
      }
      toast.success('Brand memory saved!')
      router.push('/dashboard')
    } catch {
      toast.error('Could not save — check database connection')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh-gradient p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to BlogCraft AI</CardTitle>
          <CardDescription>
            Step {step + 1} of {steps.length} — we&apos;ll remember your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">{current.label}</label>
            {current.key === 'seoGoals' ? (
              <Textarea
                className="mt-2"
                placeholder={current.placeholder}
                value={form[current.key]}
                onChange={(e) => setForm({ ...form, [current.key]: e.target.value })}
              />
            ) : (
              <Input
                className="mt-2"
                placeholder={current.placeholder}
                value={form[current.key]}
                onChange={(e) => setForm({ ...form, [current.key]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && finish()}
              />
            )}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={saving}>
                Back
              </Button>
            )}
            <Button className="flex-1" onClick={finish} disabled={saving}>
              {saving ? 'Saving...' : isLast ? 'Finish setup' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
