import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LandingPricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold">Public beta access</h2>
        <p className="mt-4 text-muted-foreground">BlogCraft AI is currently collecting feedback. Billing is not enabled during the beta.</p>
        <Card className="mx-auto mt-10 max-w-md text-left">
          <CardHeader><CardTitle>Beta</CardTitle><CardDescription>Free while beta access is available</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {['AI writing workspace', 'Projects stored in your account', 'Research and SEO tools', 'Feedback-driven releases'].map((item) => (
              <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{item}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
