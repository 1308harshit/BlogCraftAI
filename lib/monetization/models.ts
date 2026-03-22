// Monetization Models - Database interaction layer
// Manages monetization elements and affiliate data persistence

import { query } from '../database/connection'
import {
  AffiliateProduct,
  MonetizedContent,
  InsertedProduct,
  MonetizationError
} from './types'

export class MonetizationElementModel {
  /**
   * Save monetization elements for content
   */
  static async saveMonetizationElements(
    contentId: string,
    monetizedContent: MonetizedContent
  ): Promise<void> {
    try {
      // Save each inserted product as a monetization element
      for (const inserted of monetizedContent.insertedProducts) {
        await query(`
          INSERT INTO monetization_elements (
            content_id,
            element_type,
            element_data,
            placement_info,
            performance_metrics,
            revenue_generated,
            conversion_rate
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          contentId,
          'affiliate_link',
          JSON.stringify({
            product: inserted.product,
            insertionType: inserted.insertionType
          }),
          JSON.stringify({
            position: inserted.position,
            contextSnippet: inserted.contextSnippet
          }),
          JSON.stringify({
            relevanceScore: inserted.relevanceScore,
            naturalness: inserted.naturalness
          }),
          0, // Initial revenue
          0  // Initial conversion rate
        ])
      }
    } catch (error) {
      throw new MonetizationError('Failed to save monetization elements', 'SAVE_ERROR', error)
    }
  }

  /**
   * Get monetization elements for content
   */
  static async getMonetizationElements(contentId: string): Promise<InsertedProduct[]> {
    try {
      const result = await query(`
        SELECT * FROM monetization_elements
        WHERE content_id = $1
        ORDER BY created_at ASC
      `, [contentId])

      return result.map(row => {
        const elementData = row.element_data
        const placementInfo = row.placement_info
        const performanceMetrics = row.performance_metrics

        return {
          product: elementData.product,
          insertionType: elementData.insertionType,
          position: placementInfo.position,
          contextSnippet: placementInfo.contextSnippet,
          relevanceScore: performanceMetrics.relevanceScore,
          naturalness: performanceMetrics.naturalness
        }
      })
    } catch (error) {
      throw new MonetizationError('Failed to get monetization elements', 'GET_ERROR', error)
    }
  }

  /**
   * Update monetization element performance
   */
  static async updatePerformance(
    elementId: string,
    revenue: number,
    conversionRate: number
  ): Promise<void> {
    try {
      await query(`
        UPDATE monetization_elements
        SET revenue_generated = $1,
            conversion_rate = $2,
            last_optimized = NOW()
        WHERE id = $3
      `, [revenue, conversionRate, elementId])
    } catch (error) {
      throw new MonetizationError('Failed to update performance', 'UPDATE_ERROR', error)
    }
  }
}

export class AffiliateProductModel {
  /**
   * Get affiliate products by category
   */
  static async getByCategory(category: string, limit: number = 10): Promise<AffiliateProduct[]> {
    try {
      // In production, this would query a products database
      // For now, return mock data
      return []
    } catch (error) {
      throw new MonetizationError('Failed to get products by category', 'GET_CATEGORY_ERROR', error)
    }
  }

  /**
   * Search affiliate products
   */
  static async search(query: string, limit: number = 10): Promise<AffiliateProduct[]> {
    try {
      // In production, this would perform full-text search
      // For now, return mock data
      return []
    } catch (error) {
      throw new MonetizationError('Failed to search products', 'SEARCH_ERROR', error)
    }
  }

  /**
   * Get top performing products
   */
  static async getTopPerforming(userId: string, limit: number = 10): Promise<AffiliateProduct[]> {
    try {
      // In production, this would query based on user's conversion history
      // For now, return mock data
      return []
    } catch (error) {
      throw new MonetizationError('Failed to get top performing products', 'GET_TOP_ERROR', error)
    }
  }
}
