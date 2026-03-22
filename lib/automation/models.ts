// Automation Models - Database interaction layer
// Manages automation loops and workflow executions

import { query, queryWithMetrics } from '../database/connection'
import {
  AutomationLoop,
  WorkflowExecution,
  AutomationError
} from './types'

export class AutomationLoopModel {
  // Create automation loop
  static async create(userId: string, loop: Omit<AutomationLoop, 'loopId' | 'createdAt'>): Promise<AutomationLoop> {
    try {
      const result = await query(`
        INSERT INTO automation_workflows (
          user_id, name, description, type, status,
          schedule, steps, config, metrics
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        userId,
        loop.name,
        loop.description,
        loop.type,
        loop.status,
        JSON.stringify(loop.schedule),
        JSON.stringify(loop.steps),
        JSON.stringify(loop.config),
        JSON.stringify(loop.metrics)
      ])

      return this.mapToAutomationLoop(result[0])
    } catch (error) {
      throw new AutomationError('Failed to create automation loop', 'CREATE_LOOP_ERROR', error)
    }
  }

  // Get automation loop by ID
  static async getById(loopId: string): Promise<AutomationLoop | null> {
    try {
      const result = await queryWithMetrics(`
        SELECT * FROM automation_workflows WHERE id = $1
      `, [loopId], 'get_automation_loop')

      if (result.length === 0) return null

      return this.mapToAutomationLoop(result[0])
    } catch (error) {
      throw new AutomationError('Failed to get automation loop', 'GET_LOOP_ERROR', error)
    }
  }

  // Get all loops for user
  static async getByUserId(userId: string): Promise<AutomationLoop[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT * FROM automation_workflows 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `, [userId], 'get_user_loops')

      return result.map(row => this.mapToAutomationLoop(row))
    } catch (error) {
      throw new AutomationError('Failed to get user loops', 'GET_USER_LOOPS_ERROR', error)
    }
  }

  // Update loop status
  static async updateStatus(loopId: string, status: AutomationLoop['status']): Promise<void> {
    try {
      await query(`
        UPDATE automation_workflows 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
      `, [status, loopId])
    } catch (error) {
      throw new AutomationError('Failed to update loop status', 'UPDATE_STATUS_ERROR', error)
    }
  }

  // Update loop metrics
  static async updateMetrics(loopId: string, metrics: Partial<AutomationLoop['metrics']>): Promise<void> {
    try {
      await query(`
        UPDATE automation_workflows 
        SET metrics = metrics || $1::jsonb,
            updated_at = NOW()
        WHERE id = $2
      `, [JSON.stringify(metrics), loopId])
    } catch (error) {
      throw new AutomationError('Failed to update metrics', 'UPDATE_METRICS_ERROR', error)
    }
  }

  // Update last run time
  static async updateLastRun(loopId: string, lastRun: Date, nextRun?: Date): Promise<void> {
    try {
      await query(`
        UPDATE automation_workflows 
        SET last_run = $1, next_run = $2, updated_at = NOW()
        WHERE id = $3
      `, [lastRun, nextRun, loopId])
    } catch (error) {
      throw new AutomationError('Failed to update run times', 'UPDATE_RUN_ERROR', error)
    }
  }

  private static mapToAutomationLoop(row: any): AutomationLoop {
    return {
      loopId: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      type: row.type,
      status: row.status,
      schedule: row.schedule,
      steps: row.steps,
      config: row.config,
      metrics: row.metrics,
      createdAt: row.created_at,
      lastRun: row.last_run,
      nextRun: row.next_run
    }
  }
}

export class WorkflowExecutionModel {
  // Create workflow execution
  static async create(execution: Omit<WorkflowExecution, 'executionId'>): Promise<WorkflowExecution> {
    try {
      const result = await query(`
        INSERT INTO automation_workflows (
          user_id, name, status, metadata
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [
        'system',
        `Execution for ${execution.loopId}`,
        execution.status,
        JSON.stringify(execution)
      ])

      return {
        executionId: result[0].id,
        ...execution
      }
    } catch (error) {
      throw new AutomationError('Failed to create execution', 'CREATE_EXECUTION_ERROR', error)
    }
  }

  // Update execution status
  static async updateStatus(
    executionId: string,
    status: WorkflowExecution['status'],
    result?: any,
    error?: any
  ): Promise<void> {
    try {
      await query(`
        UPDATE automation_workflows 
        SET status = $1,
            metadata = jsonb_set(metadata, '{result}', $2::jsonb),
            metadata = jsonb_set(metadata, '{error}', $3::jsonb),
            updated_at = NOW()
        WHERE id = $4
      `, [status, JSON.stringify(result || {}), JSON.stringify(error || {}), executionId])
    } catch (error) {
      throw new AutomationError('Failed to update execution', 'UPDATE_EXECUTION_ERROR', error)
    }
  }

  // Get execution history
  static async getHistory(loopId: string, limit: number = 50): Promise<WorkflowExecution[]> {
    try {
      const result = await queryWithMetrics(`
        SELECT metadata FROM automation_workflows 
        WHERE name LIKE $1
        ORDER BY created_at DESC
        LIMIT $2
      `, [`Execution for ${loopId}`, limit], 'get_execution_history')

      return result.map(row => row.metadata as WorkflowExecution)
    } catch (error) {
      throw new AutomationError('Failed to get execution history', 'GET_HISTORY_ERROR', error)
    }
  }
}
