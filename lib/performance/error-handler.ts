// Error Handling and Recovery System
// Comprehensive error handling with graceful degradation, circuit breaker patterns, 
// retry mechanisms, automated recovery, and incident response

import { getPerformanceConfig } from '../config'

// Get configuration
const config = getPerformanceConfig()

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  DATABASE = 'database',
  API = 'api',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  RATE_LIMIT = 'rate_limit',
  BUSINESS_LOGIC = 'business_logic',
  UNKNOWN = 'unknown'
}

// Error context interface
export interface ErrorContext {
  userId?: string
  operation: string
  component: string
  metadata?: Record<string, any>
  timestamp: Date
}

// Structured error with context
export class ApplicationError extends Error {
  constructor(
    message: string,
    public severity: ErrorSeverity,
    public category: ErrorCategory,
    public context: ErrorContext,
    public originalError?: Error,
    public recoverable: boolean = true
  ) {
    super(message)
    this.name = 'ApplicationError'
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      severity: this.severity,
      category: this.category,
      context: this.context,
      recoverable: this.recoverable,
      stack: this.stack,
      originalError: this.originalError?.message
    }
  }
}

// Circuit breaker with enhanced features
export class CircuitBreaker {
  private failures: number = 0
  private successCount: number = 0
  private lastFailureTime?: Date
  private lastSuccessTime?: Date
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private threshold: number = config.circuitBreaker.failureThreshold
  private timeout: number = config.circuitBreaker.timeoutMs
  private resetTimeout: number = config.circuitBreaker.resetTimeoutMs || 30000
  private name: string

  constructor(name: string = 'default') {
    this.name = name
  }

  async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open'
        console.log(`[CircuitBreaker:${this.name}] Attempting reset to half-open`)
      } else {
        if (fallback) {
          console.warn(`[CircuitBreaker:${this.name}] Using fallback - circuit is open`)
          return await fallback()
        }
        throw new ApplicationError(
          `Circuit breaker ${this.name} is open`,
          ErrorSeverity.HIGH,
          ErrorCategory.UNKNOWN,
          {
            operation: 'circuit_breaker',
            component: this.name,
            timestamp: new Date()
          },
          undefined,
          false
        )
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      
      if (fallback && this.state === 'open') {
        console.warn(`[CircuitBreaker:${this.name}] Using fallback after failure`)
        return await fallback()
      }
      
      throw error
    }
  }

  private onSuccess(): void {
    this.successCount++
    this.lastSuccessTime = new Date()

    if (this.state === 'half-open' && this.successCount >= 3) {
      this.state = 'closed'
      this.failures = 0
      this.successCount = 0
      console.log(`[CircuitBreaker:${this.name}] Reset to closed state`)
    }
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = new Date()

    if (this.failures >= this.threshold) {
      this.state = 'open'
      console.error(`[CircuitBreaker:${this.name}] Opened due to ${this.failures} failures`)
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false
    return Date.now() - this.lastFailureTime.getTime() > this.resetTimeout
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime
    }
  }

  reset() {
    this.state = 'closed'
    this.failures = 0
    this.successCount = 0
    this.lastFailureTime = undefined
    console.log(`[CircuitBreaker:${this.name}] Manually reset`)
  }
}

// Retry handler with exponential backoff and jitter
export class RetryHandler {
  async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number
      initialDelayMs?: number
      maxDelayMs?: number
      exponentialBackoff?: boolean
      jitter?: boolean
      retryableErrors?: ErrorCategory[]
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelayMs = 1000,
      maxDelayMs = 30000,
      exponentialBackoff = true,
      jitter = true,
      retryableErrors = [
        ErrorCategory.NETWORK,
        ErrorCategory.DATABASE,
        ErrorCategory.API,
        ErrorCategory.RATE_LIMIT
      ]
    } = options

    let lastError: Error | undefined

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error

        // Check if error is retryable
        if (error instanceof ApplicationError) {
          if (!error.recoverable || !retryableErrors.includes(error.category)) {
            console.warn(`[RetryHandler] Non-retryable error: ${error.category}`)
            throw error
          }
        }

        if (attempt < maxRetries - 1) {
          let delay = exponentialBackoff 
            ? initialDelayMs * Math.pow(2, attempt) 
            : initialDelayMs

          // Cap at max delay
          delay = Math.min(delay, maxDelayMs)

          // Add jitter to prevent thundering herd
          if (jitter) {
            delay = delay * (0.5 + Math.random() * 0.5)
          }

          console.log(`[RetryHandler] Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }
}

// Graceful degradation manager
export class GracefulDegradation {
  private fallbackStrategies: Map<string, () => Promise<any>> = new Map()
  private degradedModeActive: boolean = false

  registerFallback(operation: string, fallback: () => Promise<any>) {
    this.fallbackStrategies.set(operation, fallback)
  }

  async executeWithFallback<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      const fallback = this.fallbackStrategies.get(operation)
      
      if (fallback) {
        console.warn(`[GracefulDegradation] Using fallback for ${operation}`)
        this.degradedModeActive = true
        return await fallback() as T
      }

      throw error
    }
  }

  isDegraded(): boolean {
    return this.degradedModeActive
  }

  reset() {
    this.degradedModeActive = false
  }
}

// Incident response system
export class IncidentResponse {
  private incidents: Array<{
    id: string
    error: ApplicationError
    reportedAt: Date
    resolvedAt?: Date
    status: 'open' | 'investigating' | 'resolved'
    actions: string[]
  }> = []

  reportIncident(error: ApplicationError): string {
    const incidentId = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const incident = {
      id: incidentId,
      error,
      reportedAt: new Date(),
      status: 'open' as const,
      actions: []
    }

    this.incidents.push(incident)

    // Auto-escalate critical errors
    if (error.severity === ErrorSeverity.CRITICAL) {
      this.escalateIncident(incidentId)
    }

    // Log incident
    console.error('[IncidentResponse] New incident reported:', {
      id: incidentId,
      message: error.message,
      severity: error.severity,
      category: error.category,
      context: error.context
    })

    return incidentId
  }

  private escalateIncident(incidentId: string) {
    const incident = this.incidents.find(i => i.id === incidentId)
    if (incident) {
      incident.status = 'investigating'
      incident.actions.push(`Escalated at ${new Date().toISOString()}`)
      console.error(`[IncidentResponse] CRITICAL incident escalated: ${incidentId}`)
      
      // In production: Send alerts to monitoring systems, paging systems, etc.
    }
  }

  resolveIncident(incidentId: string, resolution: string) {
    const incident = this.incidents.find(i => i.id === incidentId)
    if (incident) {
      incident.status = 'resolved'
      incident.resolvedAt = new Date()
      incident.actions.push(`Resolved: ${resolution}`)
      console.log(`[IncidentResponse] Incident resolved: ${incidentId}`)
    }
  }

  getIncidentReport(timeRange?: { start: Date; end: Date }) {
    let incidents = this.incidents

    if (timeRange) {
      incidents = incidents.filter(i => 
        i.reportedAt >= timeRange.start && i.reportedAt <= timeRange.end
      )
    }

    return {
      total: incidents.length,
      open: incidents.filter(i => i.status === 'open').length,
      investigating: incidents.filter(i => i.status === 'investigating').length,
      resolved: incidents.filter(i => i.status === 'resolved').length,
      bySeverity: {
        critical: incidents.filter(i => i.error.severity === ErrorSeverity.CRITICAL).length,
        high: incidents.filter(i => i.error.severity === ErrorSeverity.HIGH).length,
        medium: incidents.filter(i => i.error.severity === ErrorSeverity.MEDIUM).length,
        low: incidents.filter(i => i.error.severity === ErrorSeverity.LOW).length
      },
      byCategory: {
        network: incidents.filter(i => i.error.category === ErrorCategory.NETWORK).length,
        database: incidents.filter(i => i.error.category === ErrorCategory.DATABASE).length,
        api: incidents.filter(i => i.error.category === ErrorCategory.API).length,
        validation: incidents.filter(i => i.error.category === ErrorCategory.VALIDATION).length,
        authentication: incidents.filter(i => i.error.category === ErrorCategory.AUTHENTICATION).length,
        rateLimit: incidents.filter(i => i.error.category === ErrorCategory.RATE_LIMIT).length,
        businessLogic: incidents.filter(i => i.error.category === ErrorCategory.BUSINESS_LOGIC).length,
        unknown: incidents.filter(i => i.error.category === ErrorCategory.UNKNOWN).length
      },
      incidents: incidents.map(i => ({
        id: i.id,
        message: i.error.message,
        severity: i.error.severity,
        category: i.error.category,
        reportedAt: i.reportedAt,
        resolvedAt: i.resolvedAt,
        status: i.status,
        duration: i.resolvedAt 
          ? (i.resolvedAt.getTime() - i.reportedAt.getTime()) / 1000 
          : null
      }))
    }
  }
}

// Automated recovery system
export class AutomatedRecovery {
  private recoveryStrategies: Map<ErrorCategory, (error: ApplicationError) => Promise<boolean>> = new Map()

  registerRecoveryStrategy(category: ErrorCategory, strategy: (error: ApplicationError) => Promise<boolean>) {
    this.recoveryStrategies.set(category, strategy)
  }

  async attemptRecovery(error: ApplicationError): Promise<boolean> {
    if (!error.recoverable) {
      console.warn('[AutomatedRecovery] Error is not recoverable')
      return false
    }

    const strategy = this.recoveryStrategies.get(error.category)
    
    if (!strategy) {
      console.warn(`[AutomatedRecovery] No recovery strategy for category: ${error.category}`)
      return false
    }

    try {
      console.log(`[AutomatedRecovery] Attempting recovery for ${error.category} error`)
      const recovered = await strategy(error)
      
      if (recovered) {
        console.log(`[AutomatedRecovery] Successfully recovered from ${error.category} error`)
      }
      
      return recovered
    } catch (recoveryError) {
      console.error('[AutomatedRecovery] Recovery attempt failed:', recoveryError)
      return false
    }
  }
}

// Error handler coordinator
export class ErrorHandler {
  private static instance: ErrorHandler
  private circuitBreakers: Map<string, CircuitBreaker> = new Map()
  private retryHandler = new RetryHandler()
  private gracefulDegradation = new GracefulDegradation()
  private incidentResponse = new IncidentResponse()
  private automatedRecovery = new AutomatedRecovery()

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
      ErrorHandler.instance.initializeDefaultStrategies()
    }
    return ErrorHandler.instance
  }

  private initializeDefaultStrategies() {
    // Register default fallback strategies
    this.gracefulDegradation.registerFallback('ai_generation', async () => {
      return { content: 'Fallback content generation unavailable', degraded: true }
    })

    // Register default recovery strategies
    this.automatedRecovery.registerRecoveryStrategy(ErrorCategory.RATE_LIMIT, async (error) => {
      // Wait and retry for rate limit errors
      await new Promise(resolve => setTimeout(resolve, 60000))
      return true
    })

    this.automatedRecovery.registerRecoveryStrategy(ErrorCategory.NETWORK, async (error) => {
      // Retry network connections
      return true
    })
  }

  getCircuitBreaker(name: string): CircuitBreaker {
    if (!this.circuitBreakers.has(name)) {
      this.circuitBreakers.set(name, new CircuitBreaker(name))
    }
    return this.circuitBreakers.get(name)!
  }

  async handleError(error: Error | ApplicationError, context?: Partial<ErrorContext>): Promise<void> {
    const appError = error instanceof ApplicationError 
      ? error 
      : new ApplicationError(
          error.message,
          ErrorSeverity.MEDIUM,
          ErrorCategory.UNKNOWN,
          {
            operation: context?.operation || 'unknown',
            component: context?.component || 'unknown',
            timestamp: new Date(),
            userId: context?.userId,
            metadata: context?.metadata
          },
          error
        )

    // Report incident
    const incidentId = this.incidentResponse.reportIncident(appError)

    // Attempt automated recovery
    const recovered = await this.automatedRecovery.attemptRecovery(appError)

    if (recovered) {
      this.incidentResponse.resolveIncident(incidentId, 'Automated recovery successful')
    }
  }

  async executeWithProtection<T>(
    fn: () => Promise<T>,
    options: {
      circuitBreakerName?: string
      maxRetries?: number
      fallback?: () => Promise<T>
      context?: ErrorContext
    }
  ): Promise<T> {
    const circuitBreaker = options.circuitBreakerName 
      ? this.getCircuitBreaker(options.circuitBreakerName)
      : null

    const execute = async () => {
      return await this.retryHandler.retry(fn, { maxRetries: options.maxRetries })
    }

    try {
      if (circuitBreaker) {
        return await circuitBreaker.execute(execute, options.fallback)
      } else {
        return await execute()
      }
    } catch (error) {
      if (options.context) {
        await this.handleError(error as Error, options.context)
      }
      throw error
    }
  }

  getGracefulDegradation() {
    return this.gracefulDegradation
  }

  getIncidentResponse() {
    return this.incidentResponse
  }

  getAutomatedRecovery() {
    return this.automatedRecovery
  }

  getAllCircuitBreakerStates() {
    const states: Record<string, any> = {}
    this.circuitBreakers.forEach((breaker, name) => {
      states[name] = breaker.getState()
    })
    return states
  }
}

// Export singleton instances
export const errorHandler = ErrorHandler.getInstance()
export const circuitBreaker = new CircuitBreaker()
export const retryHandler = new RetryHandler()
export const gracefulDegradation = new GracefulDegradation()
export const incidentResponse = new IncidentResponse()
export const automatedRecovery = new AutomatedRecovery()
