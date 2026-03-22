#!/usr/bin/env tsx
// Database initialization script for Revenue/Traffic Engine
import { initializeSchema, healthCheck, closeConnections } from '../lib/database/connection'
import { initializeVectorIndexes, vectorHealthCheck } from '../lib/database/vector-db'
import { redisHealthCheck, closeRedisConnection } from '../lib/database/redis'

async function initializeDatabase() {
  console.log('🚀 Initializing Revenue/Traffic Engine Database...')
  
  try {
    // Check database health
    console.log('📊 Checking PostgreSQL connection...')
    const dbHealthy = await healthCheck()
    if (!dbHealthy) {
      throw new Error('PostgreSQL connection failed')
    }
    console.log('✅ PostgreSQL connected successfully')
    
    // Initialize schema
    console.log('🏗️  Initializing database schema...')
    await initializeSchema()
    console.log('✅ Database schema initialized')
    
    // Check Redis connection
    console.log('🔄 Checking Redis connection...')
    const redisHealthy = await redisHealthCheck()
    if (!redisHealthy) {
      console.warn('⚠️  Redis connection failed - caching will be disabled')
    } else {
      console.log('✅ Redis connected successfully')
    }
    
    // Initialize vector database
    if (process.env.PINECONE_API_KEY) {
      console.log('🧠 Checking Pinecone connection...')
      const vectorHealthy = await vectorHealthCheck()
      if (!vectorHealthy) {
        console.warn('⚠️  Pinecone connection failed - vector search will be disabled')
      } else {
        console.log('✅ Pinecone connected successfully')
        
        console.log('🔍 Initializing vector indexes...')
        await initializeVectorIndexes()
        console.log('✅ Vector indexes initialized')
      }
    } else {
      console.warn('⚠️  PINECONE_API_KEY not found - vector search will be disabled')
    }
    
    console.log('🎉 Database initialization completed successfully!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  } finally {
    // Close connections
    await closeConnections()
    await closeRedisConnection()
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase()
}

export { initializeDatabase }