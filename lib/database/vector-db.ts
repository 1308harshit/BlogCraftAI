// Vector DB stub — configure Pinecone in production for semantic search

export const VECTOR_INDEXES = {
  CONTENT_EMBEDDINGS: 'content-embeddings',
  SUCCESS_PATTERNS: 'success-patterns',
} as const

export interface ContentEmbedding {
  id: string
  content?: string
  values?: number[]
  metadata?: Record<string, unknown>
}

export interface SuccessPatternEmbedding {
  id: string
  pattern?: string
  values?: number[]
  metadata?: Record<string, unknown>
}

export interface UserPreferenceEmbedding {
  userId: string
  preferences?: Record<string, unknown>
  values?: number[]
  metadata?: Record<string, unknown>
}

export function getPineconeClient() {
  return null
}

export function getOpenAIClient() {
  return null
}

export async function initializeVectorIndexes() {
  console.log('Vector indexes: skipped (Pinecone not configured)')
}

export async function vectorHealthCheck() {
  return { healthy: true, mode: 'stub' }
}

export async function generateEmbedding(_text: string): Promise<number[]> {
  return []
}

export async function storeContentEmbedding(
  idOrEmbed: string | ContentEmbedding,
  contentMaybe?: string,
  metadataMaybe?: Record<string, unknown>
) {
  if (typeof idOrEmbed === 'string') {
    return { id: idOrEmbed, stored: false, content: contentMaybe, metadata: metadataMaybe }
  }
  return { id: idOrEmbed.id, stored: false }
}

export async function storeSuccessPatternEmbedding(
  idOrEmbed: string | SuccessPatternEmbedding,
  patternMaybe?: string
) {
  if (typeof idOrEmbed === 'string') {
    return { id: idOrEmbed, stored: false, pattern: patternMaybe }
  }
  return { id: idOrEmbed.id, stored: false }
}

export async function storeUserPreferenceEmbedding(
  userIdOrEmbed: string | UserPreferenceEmbedding,
  prefsMaybe?: Record<string, unknown>
) {
  if (typeof userIdOrEmbed === 'string') {
    return { userId: userIdOrEmbed, stored: false, preferences: prefsMaybe }
  }
  return { userId: userIdOrEmbed.userId, stored: false }
}

export async function searchSimilarContent(_query: string, _topK = 5) {
  return [] as ContentEmbedding[]
}

export async function searchSuccessPatterns(_userId: string, _topK = 5) {
  return [] as SuccessPatternEmbedding[]
}

export async function getUserPreferences(_userId: string) {
  return null as UserPreferenceEmbedding | null
}
