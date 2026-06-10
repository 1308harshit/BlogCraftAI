import { envServer } from '@/lib/env-server'

export async function publishToWordpress(input: {
  title: string
  html: string
  status?: 'draft' | 'publish'
}) {
  const site = envServer.WORDPRESS_SITE_URL
  const username = envServer.WORDPRESS_USERNAME
  const appPassword = envServer.WORDPRESS_APP_PASSWORD

  if (!site || !username || !appPassword) {
    return { ok: false as const, error: 'WordPress is not configured' }
  }

  const url = `${site.replace(/\/$/, '')}/wp-json/wp/v2/posts`
  const auth = Buffer.from(`${username}:${appPassword}`).toString('base64')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      title: input.title,
      content: input.html,
      status: input.status ?? 'draft',
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false as const, error: `WordPress publish failed: ${res.status} ${text}` }
  }

  const data = await res.json()
  return { ok: true as const, postId: data.id as number, link: data.link as string }
}

