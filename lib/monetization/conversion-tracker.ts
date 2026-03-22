// Conversion Tracker - Affiliate Performance Analytics
// Tracks clicks, conversions, and revenue attribution for affiliate content

import { query } from '../database/connection'
import {
  ConversionMetrics,
  AffiliateConversion,
  ProductClickMetrics,
  ProductConversionMetrics,
  ConversionTrackingError
} from './types'

export class ConversionTracker {
  private static instance: ConversionTracker

  static getInstance(): ConversionTracker {
    if (!ConversionTracker.instance) {
      ConversionTracker.instance = new ConversionTracker()
    }
    return ConversionTracker.instance
  }

  /**
   * Track affiliate link click
   */
  async trackClick(
    contentId: string,
    userId: string,
    productId: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await query(`
        INSERT INTO affiliate_conversions (
          content_id, user_id, product_id, clicked_at, status, metadata
        ) VALUES ($1, $2, $3, NOW(), 'pending', $4)
      `, [contentId, userId, productId, JSON.stringify(metadata)])
    } catch (error) {
      throw new ConversionTrackingError('Failed to track click', error)
    }
  }

  /**
   * Track affiliate conversion
   */
  async trackConversion(
    conversionId: string,
    orderValue: number,
    commission: number
  ): Promise<void> {
    try {
      await query(`
        UPDATE affiliate_conversions
        SET converted_at = NOW(),
            order_value = $1,
            commission = $2,
            status = 'confirmed'
        WHERE id = $3
      `, [orderValue, commission, conversionId])
    } catch (error) {
      throw new ConversionTrackingError('Failed to track conversion', error)
    }
  }

  /**
   * Get conversion metrics for content
   */
  async getConversionMetrics(
    contentId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ConversionMetrics> {
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const end = endDate || new Date()

      // Get aggregate metrics
      const aggregateResult = await query(`
        SELECT 
          COUNT(*) as total_clicks,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as total_conversions,
          COALESCE(SUM(CASE WHEN status = 'confirmed' THEN order_value ELSE 0 END), 0) as total_revenue,
          COALESCE(AVG(CASE WHEN status = 'confirmed' THEN order_value END), 0) as avg_order_value
        FROM affiliate_conversions
        WHERE content_id = $1
          AND clicked_at BETWEEN $2 AND $3
      `, [contentId, start, end])

      const aggregate = aggregateResult[0]
      const totalClicks = parseInt(aggregate.total_clicks)
      const totalConversions = parseInt(aggregate.total_conversions)
      const totalRevenue = parseFloat(aggregate.total_revenue)
      const averageOrderValue = parseFloat(aggregate.avg_order_value)
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

      // Get clicks by product
      const clicksByProductResult = await query(`
        SELECT 
          product_id,
          COUNT(*) as clicks
        FROM affiliate_conversions
        WHERE content_id = $1
          AND clicked_at BETWEEN $2 AND $3
        GROUP BY product_id
        ORDER BY clicks DESC
      `, [contentId, start, end])

      const clicksByProduct: ProductClickMetrics[] = clicksByProductResult.map((row, index) => ({
        productId: row.product_id,
        productName: `Product ${row.product_id}`,
        clicks: parseInt(row.clicks),
        clickRate: totalClicks > 0 ? (parseInt(row.clicks) / totalClicks) * 100 : 0,
        position: index + 1
      }))

      // Get conversions by product
      const conversionsByProductResult = await query(`
        SELECT 
          product_id,
          COUNT(*) as conversions,
          SUM(order_value) as revenue,
          SUM(commission) as commission
        FROM affiliate_conversions
        WHERE content_id = $1
          AND clicked_at BETWEEN $2 AND $3
          AND status = 'confirmed'
        GROUP BY product_id
        ORDER BY revenue DESC
      `, [contentId, start, end])

      const conversionsByProduct: ProductConversionMetrics[] = conversionsByProductResult.map(row => {
        const productClicks = clicksByProduct.find(c => c.productId === row.product_id)?.clicks || 0
        return {
          productId: row.product_id,
          productName: `Product ${row.product_id}`,
          conversions: parseInt(row.conversions),
          revenue: parseFloat(row.revenue),
          conversionRate: productClicks > 0 ? (parseInt(row.conversions) / productClicks) * 100 : 0,
          commission: parseFloat(row.commission)
        }
      })

      return {
        contentId,
        totalClicks,
        totalConversions,
        totalRevenue,
        conversionRate,
        averageOrderValue,
        clicksByProduct,
        conversionsByProduct,
        timeframe: { start, end }
      }
    } catch (error) {
      throw new ConversionTrackingError('Failed to get conversion metrics', error)
    }
  }

  /**
   * Get all conversions for a user
   */
  async getUserConversions(
    userId: string,
    limit: number = 100
  ): Promise<AffiliateConversion[]> {
    try {
      const result = await query(`
        SELECT *
        FROM affiliate_conversions
        WHERE user_id = $1
        ORDER BY clicked_at DESC
        LIMIT $2
      `, [userId, limit])

      return result.map(row => ({
        id: row.id,
        contentId: row.content_id,
        userId: row.user_id,
        productId: row.product_id,
        clickedAt: row.clicked_at,
        convertedAt: row.converted_at,
        orderValue: parseFloat(row.order_value || 0),
        commission: parseFloat(row.commission || 0),
        status: row.status,
        metadata: row.metadata || {}
      }))
    } catch (error) {
      throw new ConversionTrackingError('Failed to get user conversions', error)
    }
  }

  /**
   * Get revenue attribution for content
   */
  async getRevenueAttribution(
    contentId: string,
    timeframe: { start: Date; end: Date }
  ): Promise<{
    directRevenue: number
    commission: number
    conversions: number
    roi: number
  }> {
    try {
      const result = await query(`
        SELECT 
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as conversions,
          COALESCE(SUM(CASE WHEN status = 'confirmed' THEN order_value ELSE 0 END), 0) as direct_revenue,
          COALESCE(SUM(CASE WHEN status = 'confirmed' THEN commission ELSE 0 END), 0) as commission
        FROM affiliate_conversions
        WHERE content_id = $1
          AND clicked_at BETWEEN $2 AND $3
      `, [contentId, timeframe.start, timeframe.end])

      const data = result[0]
      const directRevenue = parseFloat(data.direct_revenue)
      const commission = parseFloat(data.commission)
      const conversions = parseInt(data.conversions)

      // Calculate ROI (assuming content creation cost of $50)
      const contentCost = 50
      const roi = contentCost > 0 ? ((commission - contentCost) / contentCost) * 100 : 0

      return {
        directRevenue,
        commission,
        conversions,
        roi
      }
    } catch (error) {
      throw new ConversionTrackingError('Failed to get revenue attribution', error)
    }
  }
}

// Export singleton instance
export const conversionTracker = ConversionTracker.getInstance()
