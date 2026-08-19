import { fetchPublicUrl } from '@/lib/security/safe-fetch'

export async function fetchSourceText(url: string, timeoutMs = 12000): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetchPublicUrl(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'BlogCraftAI/1.0 (+https://example.com)',
        accept: 'text/html,text/plain;q=0.9,*/*;q=0.8',
      },
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const contentType = res.headers.get('content-type') ?? ''
    const raw = await res.text()

    // Very small sanitizer: remove scripts/styles and strip tags.
    const cleaned =
      contentType.includes('text/html')
        ? raw
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
        : raw

    return cleaned.replace(/\s+/g, ' ').trim().slice(0, 20000)
  } finally {
    clearTimeout(timeout)
  }
}

