// Vector database configuration for content embeddings and success patterns
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

// Initialize Pinecone client
let pinecone: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })
  }
  return pinecone
}

// Initialize OpenAI for embeddings
let openai: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })
  }
  return openai
}

// Vector database indexes
export const VECTOR_INDEXES = {
  CONTENT_EMBEDDINGS: 'content-embeddings',
  SUCCESS_PATTERNS: 'success-patterns',
  USER_PREFERENCES: 'user-preferences',
  VIRAL_PATTERNS: 'viral-patterns'
} as const

// Content embedding interface
export interface ContentEmbedding {
  id: string // content_id
  values: number[] // 1536-dimensional embedding
  metadata: {
    userId: string
    contentType: string
    title: string
    keywords: string[]
    performance: number
    viralScore: number
    seoScore: number
    createdAt: string
    platform?: string
  }
}

// Success pattern embedding interface
export interface SuccessPatternEmbedding {
  id: string // pattern_id
  values: number[] // embedding of successful content
  metadata: {
    userId: string
    patternType: string
    successMetrics: {
      engagement: number
      conversions: number
      revenue: number
      viralScore: number
    }
    replicationCount: number
    lastUsed: string
    contentType: string
    platform?: string
  }
}

// User preference embedding interface
export interface UserPreferenceEmbedding {
  id: string // user_id
  values: number[] // embedding of user preferences
  metadata: {
    userId: string
    brandVoice: string
    targetAudience: string
    contentGoals: string[]
    preferredPlatforms: string[]
    lastUpdated: string
  }
}

// Viral pattern embedding interface
export interface ViralPatternEmbedding {
  id: string // pattern_id
  values: number[] // embedding of viral content elements
  metadata: {
    patternType: string
    viralScore: number
    platform: string
    contentType: string
    emotionalTriggers: string[]
    structuralElements: string[]
    engagementRate: number
    shareRate: number
    discoveredAt: string
  }
}

// Generate embeddings using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const openai = getOpenAIClient()
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    throw new Error('Embedding generation failed')
  }
}

// Store content embedding
export async function storeContentEmbedding(embedding: ContentEmbedding): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.CONTENT_EMBEDDINGS)
    
    await index.upsert([{
      id: embedding.id,
      values: embedding.values,
      metadata: embedding.metadata
    }])
  } catch (error) {
    console.error('Failed to store content embedding:', error)
    throw new Error('Content embedding storage failed')
  }
}

// Store success pattern embedding
export async function storeSuccessPatternEmbedding(embedding: SuccessPatternEmbedding): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.SUCCESS_PATTERNS)
    
    await index.upsert([{
      id: embedding.id,
      values: embedding.values,
      metadata: embedding.metadata
    }])
  } catch (error) {
    console.error('Failed to store success pattern embedding:', error)
    throw new Error('Success pattern embedding storage failed')
  }
}

// Store user preference embedding
export async function storeUserPreferenceEmbedding(embedding: UserPreferenceEmbedding): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.USER_PREFERENCES)
    
    await index.upsert([{
      id: embedding.id,
      values: embedding.values,
      metadata: embedding.metadata
    }])
  } catch (error) {
    console.error('Failed to store user preference embedding:', error)
    throw new Error('User preference embedding storage failed')
  }
}

// Store viral pattern embedding
export async function storeViralPatternEmbedding(embedding: ViralPatternEmbedding): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.VIRAL_PATTERNS)
    
    await index.upsert([{
      id: embedding.id,
      values: embedding.values,
      metadata: embedding.metadata
    }])
  } catch (error) {
    console.error('Failed to store viral pattern embedding:', error)
    throw new Error('Viral pattern embedding storage failed')
  }
}

// Search similar content
export async function searchSimilarContent(
  queryEmbedding: number[],
  userId: string,
  topK: number = 10,
  filter?: Record<string, any>
): Promise<ContentEmbedding[]> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.CONTENT_EMBEDDINGS)
    
    const queryFilter = {
      userId: { $eq: userId },
      ...filter
    }
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      filter: queryFilter,
      includeMetadata: true
    })
    
    return queryResponse.matches?.map(match => ({
      id: match.id,
      values: match.values || [],
      metadata: match.metadata as ContentEmbedding['metadata']
    })) || []
  } catch (error) {
    console.error('Failed to search similar content:', error)
    throw new Error('Content similarity search failed')
  }
}

// Search success patterns
export async function searchSuccessPatterns(
  queryEmbedding: number[],
  userId: string,
  contentType?: string,
  platform?: string,
  topK: number = 5
): Promise<SuccessPatternEmbedding[]> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.SUCCESS_PATTERNS)
    
    const queryFilter: Record<string, any> = {
      userId: { $eq: userId }
    }
    
    if (contentType) {
      queryFilter.contentType = { $eq: contentType }
    }
    
    if (platform) {
      queryFilter.platform = { $eq: platform }
    }
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      filter: queryFilter,
      includeMetadata: true
    })
    
    return queryResponse.matches?.map(match => ({
      id: match.id,
      values: match.values || [],
      metadata: match.metadata as SuccessPatternEmbedding['metadata']
    })) || []
  } catch (error) {
    console.error('Failed to search success patterns:', error)
    throw new Error('Success pattern search failed')
  }
}

// Search viral patterns
export async function searchViralPatterns(
  queryEmbedding: number[],
  contentType?: string,
  platform?: string,
  minViralScore: number = 70,
  topK: number = 10
): Promise<ViralPatternEmbedding[]> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.VIRAL_PATTERNS)
    
    const queryFilter: Record<string, any> = {
      viralScore: { $gte: minViralScore }
    }
    
    if (contentType) {
      queryFilter.contentType = { $eq: contentType }
    }
    
    if (platform) {
      queryFilter.platform = { $eq: platform }
    }
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      filter: queryFilter,
      includeMetadata: true
    })
    
    return queryResponse.matches?.map(match => ({
      id: match.id,
      values: match.values || [],
      metadata: match.metadata as ViralPatternEmbedding['metadata']
    })) || []
  } catch (error) {
    console.error('Failed to search viral patterns:', error)
    throw new Error('Viral pattern search failed')
  }
}

// Get user preferences
export async function getUserPreferences(userId: string): Promise<UserPreferenceEmbedding | null> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.USER_PREFERENCES)
    
    const queryResponse = await index.fetch([userId])
    const match = queryResponse.vectors?.[userId]
    
    if (!match) {
      return null
    }
    
    return {
      id: userId,
      values: match.values || [],
      metadata: match.metadata as UserPreferenceEmbedding['metadata']
    }
  } catch (error) {
    console.error('Failed to get user preferences:', error)
    return null
  }
}

// Delete embeddings
export async function deleteContentEmbedding(contentId: string): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    const index = pinecone.index(VECTOR_INDEXES.CONTENT_EMBEDDINGS)
    
    await index.deleteOne(contentId)
  } catch (error) {
    console.error('Failed to delete content embedding:', error)
    throw new Error('Content embedding deletion failed')
  }
}

// Initialize vector database indexes
export async function initializeVectorIndexes(): Promise<void> {
  try {
    const pinecone = getPineconeClient()
    
    // Check if indexes exist, create if they don't
    const indexes = await pinecone.listIndexes()
    const existingIndexNames = indexes.indexes?.map(idx => idx.name) || []
    
    for (const indexName of Object.values(VECTOR_INDEXES)) {
      if (!existingIndexNames.includes(indexName)) {
        console.log(`Creating vector index: ${indexName}`)
        await pinecone.createIndex({
          name: indexName,
          dimension: 1536, // OpenAI ada-002 embedding dimension
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        })
        
        // Wait for index to be ready
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    }
    
    console.log('Vector database indexes initialized successfully')
  } catch (error) {
    console.error('Failed to initialize vector indexes:', error)
    throw error
  }
}

// Health check for vector database
export async function vectorHealthCheck(): Promise<boolean> {
  try {
    const pinecone = getPineconeClient()
    const indexes = await pinecone.listIndexes()
    return indexes.indexes !== undefined
  } catch (error) {
    console.error('Vector database health check failed:', error)
    return false
  }
}