// Performance Monitoring and SLA Enforcement
// Response time monitoring, uptime tracking, SLA compliance

export interface PerformanceMetric {
  endpoint: string
  responseTime: number
  statusCode: number
  timestamp: Date
}

export interface SLAConfig {
  maxResponseTime: number // ms
  minUptime: number // percentage
  errorRateThreshold: number // percentage
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private slaConfig: SLAConfig = {
    maxResponseTime: 2000,
    minUptime: 99.9,
    errorRateThreshold: 1
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  recordMetric(endpoint: string, responseTime: number, statusCode: number): void {
    this.metrics.push({
      endpoint,
      responseTime,
      statusCode,
      timestamp: new Date()
    })

    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000)
    }

    if (responseTime > this.slaConfig.maxResponseTime) {
      console.warn(`SLA violation: ${endpoint} took ${responseTime}ms (max: ${this.slaConfig.maxResponseTime}ms)`)
    }
  }

  getAverageResponseTime(endpoint?: string): number {
    const filtered = endpoint ? 
      this.metrics.filter(m => m.endpoint === endpoint) : 
      this.metrics

    if (filtered.length === 0) return 0

    const sum = filtered.reduce((acc, m) => acc + m.responseTime, 0)
    return sum / filtered.length
  }

  getUptime(hours: number = 24): number {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    const recent = this.metrics.filter(m => m.timestamp >= cutoff)

    if (recent.length === 0) return 100

    const successful = recent.filter(m => m.statusCode < 500).length
    return (successful / recent.length) * 100
  }

  getSLACompliance(): { compliant: boolean; violations: string[] } {
    const violations: string[] = []

    const avgResponseTime = this.getAverageResponseTime()
    if (avgResponseTime > this.slaConfig.maxResponseTime) {
      violations.push(`Average response time ${avgResponseTime.toFixed(0)}ms exceeds ${this.slaConfig.maxResponseTime}ms`)
    }

    const uptime = this.getUptime()
    if (uptime < this.slaConfig.minUptime) {
      violations.push(`Uptime ${uptime.toFixed(2)}% below ${this.slaConfig.minUptime}%`)
    }

    return {
      compliant: violations.length === 0,
      violations
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
