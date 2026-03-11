import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockDb } from '@/lib/mock-db'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Use mock database in demo mode
    if (mockDb.isDemoMode()) {
      console.log('Using mock database for demo')
      
      const articles = await mockDb.getArticles(userId)
      return NextResponse.json({ articles })
    }

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, content, keywords } = await request.json()

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'User ID, title, and content are required' },
        { status: 400 }
      )
    }

    // Use mock database in demo mode
    if (mockDb.isDemoMode()) {
      console.log('Using mock database for demo')
      
      const article = await mockDb.createArticle({
        user_id: userId,
        title,
        content,
        keywords: keywords || '',
        status: 'draft'
      })

      return NextResponse.json({ article })
    }

    const { data: article, error } = await supabase
      .from('articles')
      .insert([
        {
          user_id: userId,
          title,
          content,
          keywords: keywords || '',
          status: 'draft',
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}