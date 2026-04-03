// Error Handling and Recovery System
// Graceful degradation, circuit breaker, retry mechanisms

export class CircuitBreaker {
  private failures: number = 0
  private lastFailureTime?: Date
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private threshold: number = 5
  private timeout: number = 60000

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open'
      } else {
        throw new Error('Circuit breaker is open')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = new Date()

    if (this.failures >= this.threshold) {
      this.state = 'open'
      console.warn('Circuit breaker opened due to failures')
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false
    return Date.now() - this.lastFailureTime.getTime() > this.timeout
  }
}

export class RetryHandler {
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)))
        }
      }
    }

    throw lastError
  }
}

export const circuitBreaker = new CircuitBreaker()
export const retryHandler = new RetryHandler()
