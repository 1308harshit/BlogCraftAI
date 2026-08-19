import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { fetchPublicUrl } from '@/lib/security/safe-fetch'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 503 })

  const { url, fileName } = await req.json()
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  let res: Response
  try {
    res = await fetchPublicUrl(url)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid image URL' }, { status: 400 })
  }
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 })
  const contentType = res.headers.get('content-type') ?? ''
  if (!['image/png', 'image/jpeg', 'image/webp'].some((type) => contentType.startsWith(type))) {
    return NextResponse.json({ error: 'Only PNG, JPEG, and WebP images can be saved' }, { status: 400 })
  }
  const contentLength = Number(res.headers.get('content-length') ?? 0)
  if (contentLength > MAX_IMAGE_BYTES) return NextResponse.json({ error: 'Image is too large' }, { status: 400 })

  const arrayBuffer = await res.arrayBuffer()
  if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) return NextResponse.json({ error: 'Image is too large' }, { status: 400 })
  const bytes = new Uint8Array(arrayBuffer)
  const extension = contentType.includes('jpeg') ? 'jpg' : contentType.includes('webp') ? 'webp' : 'png'
  const safeName = String(fileName ?? 'image').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80)
  const path = `generated-images/${authed.user.id}/${Date.now()}_${safeName}.${extension}`

  const upload = await admin.storage.from('blogcraft-images').upload(path, bytes, {
    contentType,
    upsert: false,
  })

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 })
  }

  const { data } = admin.storage.from('blogcraft-images').getPublicUrl(path)
  return NextResponse.json({ success: true, path, publicUrl: data.publicUrl })
}

