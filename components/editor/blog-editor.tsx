'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useCallback, useEffect, useState } from 'react'
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Sparkles,
  Wand2,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BlogEditorProps {
  content?: string
  onChange?: (content: string) => void
  onSEOUpdate?: (score: number) => void
}

export function BlogEditor({ content = '', onChange, onSEOUpdate }: BlogEditorProps) {
  const [aiLoading, setAiLoading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing or type / for commands...' }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[400px] focus:outline-none px-4 py-3 prose-headings:text-foreground prose-p:text-muted-foreground',
      },
    },
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML()
      onChange?.(html)
    },
  })

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const runAITransform = useCallback(
    async (task: 'rewrite' | 'summarize' | 'expand') => {
      if (!editor) return
      const text = editor.getText()
      if (!text.trim()) {
        toast.error('Write some content first')
        return
      }
      setAiLoading(true)
      try {
        const res = await fetch('/api/ai/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text, task }),
        })
        const data = await res.json()
        if (data.content) {
          editor.commands.setContent(`<p>${data.content.replace(/\n/g, '</p><p>')}</p>`)
          toast.success(`${task} complete`)
        }
      } catch {
        toast.error('AI transform failed')
      } finally {
        setAiLoading(false)
      }
    },
    [editor]
  )

  const analyzeSEO = useCallback(async () => {
    if (!editor) return
    const text = editor.getText()
    const res = await fetch('/api/seo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    })
    const data = await res.json()
    onSEOUpdate?.(data.score)
    toast.success(`SEO Score: ${data.score}/100`)
  }, [editor, onSEOUpdate])

  if (!editor) return null

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') && 'bg-accent')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') && 'bg-accent')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-border" />

        <Button variant="ghost" size="sm" disabled={aiLoading} onClick={() => runAITransform('rewrite')}>
          <RefreshCw className="mr-1 h-3 w-3" /> Rewrite
        </Button>
        <Button variant="ghost" size="sm" disabled={aiLoading} onClick={() => runAITransform('expand')}>
          <Maximize2 className="mr-1 h-3 w-3" /> Expand
        </Button>
        <Button variant="ghost" size="sm" disabled={aiLoading} onClick={() => runAITransform('summarize')}>
          <Minimize2 className="mr-1 h-3 w-3" /> Summarize
        </Button>
        <Button variant="ghost" size="sm" onClick={analyzeSEO}>
          <Wand2 className="mr-1 h-3 w-3" /> SEO
        </Button>

        <span className="ml-auto text-xs text-muted-foreground">
          {editor.storage.characterCount.characters()} chars
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
