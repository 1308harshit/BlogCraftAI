'use client'

import { useState } from 'react'
import { ImageIcon, Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  altText: string
}

export default function ImagesPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])

  const downloadResized = async (url: string, fileName: string, width: number, height: number) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0, width, height)

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName
    a.click()
  }

  const saveToLibrary = async (img: GeneratedImage) => {
    const res = await fetch('/api/images/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: img.url, fileName: img.id }),
    })
    const data = await res.json()
    if (data.success) toast.success('Saved to Supabase Storage')
    else toast.error(data.error ?? 'Save failed')
  }

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `# ${prompt}\n\nBlog thumbnail for: ${prompt}`, imageCount: 3 }),
      })
      const data = await res.json()
      if (data.images?.length) {
        setImages(data.images)
        toast.success(`Generated ${data.images.length} images`)
      } else {
        toast.error(data.error ?? 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Images</h1>
        <p className="text-muted-foreground">Blog thumbnails, feature images, and social graphics</p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Describe your blog thumbnail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generate()}
        />
        <Button onClick={generate} disabled={loading || !prompt.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0
          ? [1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="flex aspect-video items-center justify-center rounded-lg bg-muted/30 p-6">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                </CardContent>
              </Card>
            ))
          : images.map((img) => (
              <Card key={img.id}>
                <CardHeader>
                  <CardTitle className="truncate text-sm">{img.prompt.slice(0, 40)}...</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.altText} className="aspect-video w-full rounded-lg object-cover" />
                  <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                    <a href={img.url} download target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-3 w-3" /> Download
                    </a>
                  </Button>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadResized(img.url, `${img.id}_1200x630.png`, 1200, 630)}
                    >
                      Resize 1200×630
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => saveToLibrary(img)}>
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}
