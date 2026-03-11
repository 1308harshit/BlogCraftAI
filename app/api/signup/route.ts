import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockDb } from '@/lib/mock-db'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, plan } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Use mock database in demo mode
    if (mockDb.isDemoMode()) {
      console.log('Using mock database for demo')
      
      // Check if user already exists
      const existingUser = await mockDb.getUser(email)
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        )
      }

      // Create new user
      const user = await mockDb.createUser({
        email,
        name,
        plan: plan || 'founder',
        status: 'trial'
      })

      return NextResponse.json({ 
        message: 'Account created successfully (Demo Mode)',
        user: { id: user.id, email: user.email, name: user.name, plan: user.plan }
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          name,
          plan: 'founder',
          status: 'trial',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    // TODO: Send welcome email
    // TODO: Create Stripe customer
    // TODO: Set up subscription

    return NextResponse.json({ 
      message: 'Account created successfully',
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}