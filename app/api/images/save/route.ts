import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 503 })

  const { url, fileName } = await req.json()
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const res = await fetch(url)
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch image' }, { status: 400 })

  const arrayBuffer = await res.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const path = `generated-images/${authed.user.id}/${Date.now()}_${fileName ?? 'image'}.png`

  const upload = await admin.storage.from('blogcraft-images').upload(path, bytes, {
    contentType: 'image/png',
    upsert: false,
  })

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 })
  }

  const { data } = admin.storage.from('blogcraft-images').getPublicUrl(path)
  return NextResponse.json({ success: true, path, publicUrl: data.publicUrl })
}

