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
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Use mock database in demo mode
    if (mockDb.isDemoMode()) {
      console.log('Using mock database for demo')
      
      const user = await mockDb.getUser(email)
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ 
        user: {
          ...user,
          articleCount: user.articleCount || 0
        }
      })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        subscriptions (*)
      `)
      .eq('email', email)
      .single()

    if (error) {
      throw error
    }

    // Get article count
    const { count: articleCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({ 
      user: {
        ...user,
        articleCount: articleCount || 0
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Use mock database in demo mode
    if (mockDb.isDemoMode()) {
      console.log('Using mock database for demo')
      
      const user = await mockDb.updateUser(userId, updates)
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ user })
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}