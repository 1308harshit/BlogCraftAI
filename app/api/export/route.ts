import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function toMarkdown(html: string, title: string) {
  const text = stripHtml(html)
  return `# ${title}\n\n${text}`
}

function toHtml(html: string, title: string) {
  const body = html.includes('<') ? html : `<p>${html.replace(/\n/g, '</p><p>')}</p>`
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${body}</body></html>`
}

export async function POST(req: NextRequest) {
  // SECURITY FIX: Require authentication
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { content, title = 'Blog Post', format } = await req.json()
  if (!content || !format) {
    return NextResponse.json({ error: 'content and format required' }, { status: 400 })
  }

  switch (format) {
    case 'markdown':
      return NextResponse.json({ data: toMarkdown(content, title), mimeType: 'text/markdown' })
    case 'html':
      return NextResponse.json({ data: toHtml(content, title), mimeType: 'text/html' })
    case 'text':
      return NextResponse.json({ data: stripHtml(content), mimeType: 'text/plain' })
    default:
      return NextResponse.json({ error: 'Unsupported format. Use markdown, html, or text.' }, { status: 400 })
  }
}
