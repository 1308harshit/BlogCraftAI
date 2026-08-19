import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground">Reporting is being built from verified project and publishing events.</p></div>
      <Card><CardHeader><CardTitle>Analytics is not available yet</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">We removed sample charts so this page never presents fabricated performance data as your results.</CardContent></Card>
    </div>
  )
}
