import { chromium } from 'playwright'
import { join } from 'path'

const OUT = join(process.cwd(), 'test-results')
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' })
await page.fill('input[type="email"]', `test-${Date.now()}@example.com`)
await page.fill('input[type="password"]', 'testpass123456')
await page.click('button:has-text("Sign up")')
await page.waitForTimeout(3000)

const toast = await page.locator('[data-sonner-toast]').first().textContent().catch(() => 'No toast visible')
await page.screenshot({ path: join(OUT, '07-signup-attempt.png'), fullPage: true })

console.log('Toast message:', toast)
console.log('Final URL:', page.url())

await browser.close()
