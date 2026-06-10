const BASE = process.env.BASE_URL || 'http://localhost:3000'

const results = []

async function step(name, fn) {
  try {
    const detail = await fn()
    results.push({ step: name, status: 'PASS', detail })
    console.log(`✅ ${name}`)
    if (detail) console.log(`   ${String(detail).slice(0, 200)}`)
  } catch (err) {
    results.push({ step: name, status: 'FAIL', detail: err.message })
    console.log(`❌ ${name}`)
    console.log(`   ${err.message}`)
  }
}

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = { _raw: text.slice(0, 300) }
  }
  return { res, json, text }
}

await step('Health check', async () => {
  const { res, json } = await fetchJson('/api/health')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return JSON.stringify(json)
})

await step('Landing page loads', async () => {
  const res = await fetch(`${BASE}/`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  if (!html.includes('BlogCraft')) throw new Error('Missing BlogCraft branding')
  return `HTTP ${res.status}, ${html.length} bytes`
})

await step('Signup page loads', async () => {
  const res = await fetch(`${BASE}/signup`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  if (!html.includes('Create your account')) throw new Error('Signup form not found')
  return `HTTP ${res.status}`
})

await step('Unauthenticated dashboard redirects to login', async () => {
  const res = await fetch(`${BASE}/dashboard`, { redirect: 'manual' })
  if (res.status !== 307 && res.status !== 302) throw new Error(`Expected redirect, got ${res.status}`)
  const loc = res.headers.get('location') || ''
  if (!loc.includes('/login')) throw new Error(`Redirected to ${loc}`)
  return `→ ${loc}`
})

await step('Unauthenticated onboarding redirects to login', async () => {
  const res = await fetch(`${BASE}/onboarding`, { redirect: 'manual' })
  if (res.status !== 307 && res.status !== 302) throw new Error(`Expected redirect, got ${res.status}`)
  return `→ ${res.headers.get('location')}`
})

await step('Export API (no auth required)', async () => {
  const { res, json } = await fetchJson('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: '<h1>AI Blogging Tips</h1><p>Write consistently and optimize for SEO.</p>',
      title: 'AI Blogging Tips',
      format: 'markdown',
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`)
  if (!json.data?.includes('AI Blogging Tips')) throw new Error('Export missing title')
  return json.data.slice(0, 120) + '...'
})

await step('SEO analyze API', async () => {
  const { res, json } = await fetchJson('/api/seo/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: '# AI Blogging\n\nA guide to writing with AI tools for better SEO rankings.',
      keywords: ['AI', 'blogging'],
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return `score=${json.score}, words=${json.wordCount}`
})

await step('AI generate rejects unauthenticated requests', async () => {
  const { res, json } = await fetchJson('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'AI blogging tips' }),
  })
  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  return json.error
})

await step('Supabase signup (demo credentials)', async () => {
  const email = `test-${Date.now()}@blogcraft-test.local`
  const password = 'testpass123456'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || url.includes('demo-project')) {
    throw new Error('Supabase not configured — .env.local still has demo-project.supabase.co placeholder keys')
  }
  const res = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return `Created ${email}`
})

console.log('\n--- SUMMARY ---')
const passed = results.filter((r) => r.status === 'PASS').length
const failed = results.filter((r) => r.status === 'FAIL').length
console.log(`${passed} passed, ${failed} failed`)
console.log(JSON.stringify(results, null, 2))
