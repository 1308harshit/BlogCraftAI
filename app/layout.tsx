import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/providers/app-providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'BlogCraft AI — AI Blogging Operating System',
    template: '%s | BlogCraft AI',
  },
  description:
    'Write smarter. Rank faster. Scale infinitely. The premium AI-powered blogging platform for creators, startups, and agencies.',
  keywords: ['AI blog writer', 'SEO content', 'content automation', 'BlogCraft AI'],
  openGraph: {
    title: 'BlogCraft AI',
    description: 'The AI blogging operating system',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
