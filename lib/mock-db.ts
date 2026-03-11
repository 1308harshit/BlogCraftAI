// Mock database for testing without Supabase
interface MockUser {
  id: string
  email: string
  name: string
  plan: string
  status: string
  created_at: string
  articleCount?: number
}

interface MockArticle {
  id: string
  user_id: string
  title: string
  content: string
  keywords: string
  status: string
  created_at: string
}

// In-memory storage for demo
let mockUsers: MockUser[] = [
  {
    id: 'demo-user-1',
    email: 'demo@blogcraft-ai.com',
    name: 'Demo User',
    plan: 'founder',
    status: 'active',
    created_at: new Date().toISOString(),
    articleCount: 5
  }
]

let mockArticles: MockArticle[] = [
  {
    id: 'article-1',
    user_id: 'demo-user-1',
    title: 'How to Improve SEO Rankings in 2024',
    content: 'Complete SEO guide...',
    keywords: 'SEO, rankings, optimization',
    status: 'published',
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'article-2',
    user_id: 'demo-user-1',
    title: 'Content Marketing Strategies That Work',
    content: 'Content marketing best practices...',
    keywords: 'content marketing, strategy',
    status: 'draft',
    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
]

export const mockDb = {
  // Users
  async getUser(email: string): Promise<MockUser | null> {
    return mockUsers.find(user => user.email === email) || null
  },

  async createUser(userData: Omit<MockUser, 'id' | 'created_at'>): Promise<MockUser> {
    const newUser: MockUser = {
      ...userData,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
      articleCount: 0
    }
    mockUsers.push(newUser)
    return newUser
  },

  async updateUser(userId: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    const userIndex = mockUsers.findIndex(user => user.id === userId)
    if (userIndex === -1) return null
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    return mockUsers[userIndex]
  },

  // Articles
  async getArticles(userId: string): Promise<MockArticle[]> {
    return mockArticles.filter(article => article.user_id === userId)
  },

  async createArticle(articleData: Omit<MockArticle, 'id' | 'created_at'>): Promise<MockArticle> {
    const newArticle: MockArticle = {
      ...articleData,
      id: `article-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    mockArticles.push(newArticle)
    
    // Update user article count
    const userIndex = mockUsers.findIndex(user => user.id === articleData.user_id)
    if (userIndex !== -1) {
      mockUsers[userIndex].articleCount = (mockUsers[userIndex].articleCount || 0) + 1
    }
    
    return newArticle
  },

  // Check if using demo mode
  isDemoMode(): boolean {
    return !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || 
           process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo')
  }
}