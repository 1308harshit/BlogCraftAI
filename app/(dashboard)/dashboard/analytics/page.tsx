'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const contentData = [
  { month: 'Jan', articles: 12, seo: 78 },
  { month: 'Feb', articles: 19, seo: 82 },
  { month: 'Mar', articles: 24, seo: 85 },
  { month: 'Apr', articles: 31, seo: 88 },
  { month: 'May', articles: 28, seo: 91 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Content performance and productivity metrics</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Articles published</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
              <Bar dataKey="articles" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Avg SEO score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="seo" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
