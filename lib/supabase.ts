import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          plan: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          name: string
          plan?: string
          status?: string
        }
        Update: {
          email?: string
          name?: string
          plan?: string
          status?: string
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          keywords: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          content: string
          keywords?: string
          status?: string
        }
        Update: {
          title?: string
          content?: string
          keywords?: string
          status?: string
        }
      }
    }
  }
}