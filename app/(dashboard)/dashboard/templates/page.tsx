'use client'

import Link from 'next/link'
import { FileText, List, Mail, ShoppingBag, Newspaper } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const templates = [
  { name: 'Long-form SEO Blog', icon: FileText, desc: '1500+ word optimized article' },
  { name: 'Listicle', icon: List, desc: 'Numbered tips and roundup posts' },
  { name: 'Newsletter', icon: Mail, desc: 'Engaging email newsletter' },
  { name: 'Product Review', icon: ShoppingBag, desc: 'Affiliate-friendly review' },
  { name: 'Tutorial', icon: Newspaper, desc: 'Step-by-step how-to guide' },
]

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Templates</h1>
        <p className="text-muted-foreground">Start faster with proven content structures</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.name} className="transition-all hover:border-primary/40">
            <CardHeader>
              <t.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-base">{t.name}</CardTitle>
              <CardDescription>{t.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard/writer">Use template</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
