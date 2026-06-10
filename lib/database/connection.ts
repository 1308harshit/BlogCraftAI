// Database connection and configuration for Revenue/Traffic Engine
import { Pool, PoolClient } from 'pg'
import { createClient } from '@supabase/supabase-js'
import { envPublic, envServer } from '@/lib/env'

// PostgreSQL connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: envServer.DATABASE_URL,
      ssl: envServer.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
  }
  return pool
}

// Execute query with connection pooling
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Execute transaction
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Transaction error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Supabase client for existing functionality
export const supabase = createClient(
  envPublic.NEXT_PUBLIC_SUPABASE_URL,
  envPublic.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Database health check
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as health')
    return result.length > 0
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Initialize database schema
export async function initializeSchema(): Promise<void> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const schemaPath = path.join(process.cwd(), 'lib/database/schema.sql')
    const schema = await fs.readFile(schemaPath, 'utf-8')
    
    await query(schema)
    console.log('Database schema initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database schema:', error)
    throw error
  }
}

// Close database connections
export async function closeConnections(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

// Database types
export interface DatabaseRow {
  [key: string]: any
}

export interface QueryResult<T = DatabaseRow> {
  rows: T[]
  rowCount: number
}

// Error handling
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Connection monitoring
let connectionCount = 0

export function getConnectionCount(): number {
  return connectionCount
}

// Performance monitoring
export async function queryWithMetrics<T = any>(
  text: string, 
  params?: any[],
  operation?: string
): Promise<T[]> {
  const startTime = Date.now()
  
  try {
    const result = await query<T>(text, params)
    const duration = Date.now() - startTime
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, {
        operation,
        query: text.substring(0, 100),
        duration
      })
    }
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Query failed after ${duration}ms:`, {
      operation,
      error: error instanceof Error ? error.message : error,
      query: text.substring(0, 100)
    })
    throw error
  }
}