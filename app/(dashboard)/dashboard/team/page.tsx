import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold">Team workspace</h1><p className="text-muted-foreground">Collaboration is being completed for a later beta release.</p></div>
      <Card><CardHeader><CardTitle>Personal workspace active</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Your projects remain private to your account. Invitations are temporarily unavailable while shared-project permissions and collaboration views are finalized.</CardContent></Card>
    </div>
  )
}
