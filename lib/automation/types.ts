// Automation System - Types and Interfaces
// Type definitions for automation loops and workflow orchestration

export interface AutomationLoop {
  loopId: string
  userId: string
  name: string
  description: string
  type: 'content_generation' | 'research' | 'optimization' | 'publishing' | 'analysis'
  status: 'active' | 'paused' | 'completed' | 'failed'
  schedule: AutomationSchedule
  steps: AutomationStep[]
  config: AutomationConfig
  metrics: AutomationMetrics
  createdAt: Date
  lastRun?: Date
  nextRun?: Date
}

export interface AutomationStep {
  stepId: string
  name: string
  type: 'research' | 'generate' | 'optimize' | 'schedule' | 'publish' | 'analyze' | 'notify'
  order: number
  config: StepConfig
  dependencies: string[]
  retryPolicy: RetryPolicy
  timeout: number
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  result?: StepResult
  error?: StepError
}

export interface AutomationSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom'
  interval?: number
  startDate: Date
  endDate?: Date
  timezone: string
  daysOfWeek?: number[]
  timeOfDay?: string
}

export interface AutomationConfig {
  autoRetry: boolean
  maxRetries: number
  notifyOnFailure: boolean
  notifyOnSuccess: boolean
  parallelExecution: boolean
  maxParallel: number
  continueOnError: boolean
}

export interface AutomationMetrics {
  totalRuns: number
  successfulRuns: number
  failedRuns: number
  avgExecutionTime: number
  lastExecutionTime: number
  successRate: number
  contentGenerated: number
  revenueGenerated: number
}

export interface StepConfig {
  [key: string]: any
  inputSource?: string
  outputDestination?: string
  parameters?: Record<string, any>
}

export interface RetryPolicy {
  maxAttempts: number
  backoffStrategy: 'linear' | 'exponential' | 'fixed'
  initialDelay: number
  maxDelay: number
  retryableErrors: string[]
}

export interface StepResult {
  success: boolean
  output: any
  executionTime: number
  timestamp: Date
  metadata?: Record<string, any>
  error?: StepError
}

export interface StepError {
  code: string
  message: string
  details?: any
  timestamp: Date
  retryable: boolean
}

export interface WorkflowExecution {
  executionId: string
  loopId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startTime: Date
  endTime?: Date
  steps: StepExecution[]
  result?: WorkflowResult
  error?: WorkflowError
}

export interface StepExecution {
  stepId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startTime?: Date
  endTime?: Date
  attempts: number
  result?: StepResult
  error?: StepError
}

export interface WorkflowResult {
  success: boolean
  stepsCompleted: number
  stepsTotal: number
  outputs: Record<string, any>
  metrics: Record<string, number>
}

export interface WorkflowError {
  step: string
  code: string
  message: string
  recoverable: boolean
}

// Error types
export class AutomationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message)
    this.name = 'AutomationError'
  }
}

export class WorkflowExecutionError extends AutomationError {
  constructor(message: string, details?: any) {
    super(message, 'WORKFLOW_EXECUTION_ERROR', details)
  }
}

export class StepExecutionError extends AutomationError {
  constructor(message: string, details?: any) {
    super(message, 'STEP_EXECUTION_ERROR', details)
  }
}
