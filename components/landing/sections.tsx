import { Badge } from '@/components/ui/badge'

export function LandingWorkflows() {
  return <section className="py-20"><div className="mx-auto max-w-5xl px-4 text-center"><Badge>Workflow</Badge><h2 className="mt-4 text-3xl font-bold">From topic to a saved draft</h2><p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Start with a topic, use research and AI writing tools, review the SEO, and keep the draft in your own workspace.</p></div></section>
}

export function LandingIntegrations() {
  return null
}

export function LandingTestimonials() {
  return <section className="border-y border-border/50 py-16"><div className="mx-auto max-w-3xl px-4 text-center"><h2 className="text-2xl font-bold">Help shape the beta</h2><p className="mt-3 text-muted-foreground">We&apos;re opening BlogCraft AI to early users and using their feedback to decide what to build next.</p></div></section>
}

export function LandingSEO() {
  return <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center"><h2 className="text-2xl font-bold">Writing tools, without inflated promises</h2><p className="mt-3 text-muted-foreground">BlogCraft AI helps you create and improve content. Results depend on your topic, audience, review process, and publishing strategy.</p></div></section>
}
