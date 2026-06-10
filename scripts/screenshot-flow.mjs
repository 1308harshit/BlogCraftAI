import { chromium } from 'playwright'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const BASE = 'http://localhost:3000'
const OUT = join(process.cwd(), 'test-results')

const pages = [
  { name: '01-landing', url: '/' },
  { name: '02-signup', url: '/signup' },
  { name: '03-login', url: '/login' },
  { name: '04-dashboard-redirect', url: '/dashboard' },
  { name: '05-onboarding-redirect', url: '/onboarding' },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await context.newPage()

const report = []

for (const p of pages) {
  const response = await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1000)
  const shot = join(OUT, `${p.name}.png`)
  await page.screenshot({ path: shot, fullPage: true })
  report.push({
    page: p.name,
    url: p.url,
    status: response?.status(),
    finalUrl: page.url(),
    screenshot: shot,
  })
  console.log(`📸 ${p.name} → ${response?.status()} (final: ${page.url()})`)
}

// Export API demo
const exportRes = await fetch(`${BASE}/api/export`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: '<h1>AI Blogging Tips</h1><p>Write consistently, research keywords, and optimize headings for SEO.</p>',
    title: 'AI Blogging Tips',
    format: 'markdown',
  }),
})
const exportJson = await exportRes.json()
await writeFile(join(OUT, '06-export-output.md'), exportJson.data)

report.push({
  page: '06-export-api',
  status: exportRes.status,
  output: exportJson.data,
})

await writeFile(join(OUT, 'report.json'), JSON.stringify(report, null, 2))
await browser.close()
console.log(`\nResults saved to ${OUT}`)
