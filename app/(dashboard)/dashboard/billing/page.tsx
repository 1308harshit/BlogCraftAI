import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold">Billing</h1><p className="text-muted-foreground">Billing is intentionally disabled during the public beta.</p></div>
      <Card><CardHeader><CardTitle>Public beta access <Badge className="ml-2" variant="secondary">Free</Badge></CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p>No payment method is collected and no paid entitlement can be granted while payments are disabled.</p><p>Paid plans will be introduced only after checkout and webhook verification are fully configured.</p></CardContent></Card>
    </div>
  )
}
