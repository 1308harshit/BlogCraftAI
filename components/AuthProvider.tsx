'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  plan: string
  status: string
  articleCount?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const email = localStorage.getItem('userEmail')
      if (!email) {
        // Set demo user for testing
        const demoUser = {
          id: 'demo-user-1',
          email: 'demo@blogcraft-ai.com',
          name: 'Demo User',
          plan: 'founder',
          status: 'active',
          articleCount: 5
        }
        setUser(demoUser)
        localStorage.setItem('userEmail', demoUser.email)
        setLoading(false)
        return
      }

      const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Fallback to demo user
        const demoUser = {
          id: 'demo-user-1',
          email: email,
          name: 'Demo User',
          plan: 'founder',
          status: 'active',
          articleCount: 5
        }
        setUser(demoUser)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // Fallback to demo user
      const demoUser = {
        id: 'demo-user-1',
        email: 'demo@blogcraft-ai.com',
        name: 'Demo User',
        plan: 'founder',
        status: 'active',
        articleCount: 5
      }
      setUser(demoUser)
      localStorage.setItem('userEmail', demoUser.email)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    // Simple email-based auth for demo
    localStorage.setItem('userEmail', email)
    await refreshUser()
  }

  const logout = () => {
    localStorage.removeItem('userEmail')
    setUser(null)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}