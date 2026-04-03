// Role-Based Access Control System
// Manage user roles, permissions, and access control

import {
  UserRole,
  Permission,
  RoleDefinition,
  User,
  AuditLog
} from './types'

export class RBACManager {
  private static instance: RBACManager
  private roles: Map<UserRole, RoleDefinition> = new Map()
  private users: Map<string, User> = new Map()
  private auditLogs: AuditLog[] = []

  static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager()
      RBACManager.instance.initializeDefaultRoles()
    }
    return RBACManager.instance
  }

  // Initialize default roles
  private initializeDefaultRoles(): void {
    // Admin role - full access
    this.roles.set('admin', {
      role: 'admin',
      name: 'Administrator',
      description: 'Full system access and management',
      permissions: [
        { resource: '*', actions: ['create', 'read', 'update', 'delete', 'execute'] }
      ]
    })

    // Manager role
    this.roles.set('manager', {
      role: 'manager',
      name: 'Content Manager',
      description: 'Manage team, approve content, view analytics',
      permissions: [
        { resource: 'content', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'team', actions: ['read', 'update'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'approval', actions: ['create', 'read', 'update'] },
        { resource: 'workflow', actions: ['create', 'read', 'update', 'execute'] }
      ]
    })

    // Strategist role
    this.roles.set('strategist', {
      role: 'strategist',
      name: 'Content Strategist',
      description: 'Plan strategy, analyze performance, optimize campaigns',
      permissions: [
        { resource: 'content', actions: ['create', 'read', 'update'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'strategy', actions: ['create', 'read', 'update', 'execute'] },
        { resource: 'ab-test', actions: ['create', 'read', 'update', 'execute'] },
        { resource: 'automation', actions: ['create', 'read', 'update', 'execute'] }
      ]
    })

    // Creator role
    this.roles.set('creator', {
      role: 'creator',
      name: 'Content Creator',
      description: 'Create and edit content, submit for approval',
      permissions: [
        { resource: 'content', actions: ['create', 'read', 'update'] },
        { resource: 'template', actions: ['read'] },
        { resource: 'media', actions: ['create', 'read'] }
      ]
    })

    // Analyst role
    this.roles.set('analyst', {
      role: 'analyst',
      name: 'Data Analyst',
      description: 'View analytics, generate reports, track performance',
      permissions: [
        { resource: 'content', actions: ['read'] },
        { resource: 'analytics', actions: ['read', 'execute'] },
        { resource: 'report', actions: ['create', 'read'] }
      ]
    })

    console.log('Initialized default RBAC roles')
  }

  // Check if user has permission
  hasPermission(
    userId: string,
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'execute'
  ): boolean {
    const user = this.users.get(userId)
    if (!user) return false

    // Check custom permissions first
    if (user.customPermissions) {
      for (const perm of user.customPermissions) {
        if (this.matchesResource(perm.resource, resource) && perm.actions.includes(action)) {
          return true
        }
      }
    }

    // Check role permissions
    const roleDefinition = this.roles.get(user.role)
    if (!roleDefinition) return false

    for (const perm of roleDefinition.permissions) {
      if (this.matchesResource(perm.resource, resource) && perm.actions.includes(action)) {
        return true
      }
    }

    // Check inherited roles
    if (roleDefinition.inheritsFrom) {
      for (const inheritedRole of roleDefinition.inheritsFrom) {
        const inheritedDef = this.roles.get(inheritedRole)
        if (inheritedDef) {
          for (const perm of inheritedDef.permissions) {
            if (this.matchesResource(perm.resource, resource) && perm.actions.includes(action)) {
              return true
            }
          }
        }
      }
    }

    return false
  }

  // Match resource pattern
  private matchesResource(pattern: string, resource: string): boolean {
    if (pattern === '*') return true
    if (pattern === resource) return true
    
    // Support wildcard patterns like "content.*"
    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2)
      return resource.startsWith(prefix)
    }

    return false
  }

  // Add user
  addUser(user: User): void {
    this.users.set(user.id, user)
    this.logAudit(user.id, 'user.created', 'user', user.id, { role: user.role })
  }

  // Update user role
  updateUserRole(userId: string, newRole: UserRole, updatedBy: string): void {
    const user = this.users.get(userId)
    if (!user) throw new Error(`User ${userId} not found`)

    const oldRole = user.role
    user.role = newRole

    this.logAudit(updatedBy, 'user.role.updated', 'user', userId, {
      oldRole,
      newRole
    })

    console.log(`Updated user ${userId} role from ${oldRole} to ${newRole}`)
  }

  // Grant custom permission
  grantPermission(userId: string, permission: Permission, grantedBy: string): void {
    const user = this.users.get(userId)
    if (!user) throw new Error(`User ${userId} not found`)

    if (!user.customPermissions) {
      user.customPermissions = []
    }

    user.customPermissions.push(permission)

    this.logAudit(grantedBy, 'permission.granted', 'user', userId, {
      permission
    })

    console.log(`Granted permission to user ${userId}: ${permission.resource} [${permission.actions.join(', ')}]`)
  }

  // Revoke custom permission
  revokePermission(userId: string, resource: string, revokedBy: string): void {
    const user = this.users.get(userId)
    if (!user || !user.customPermissions) return

    user.customPermissions = user.customPermissions.filter(p => p.resource !== resource)

    this.logAudit(revokedBy, 'permission.revoked', 'user', userId, {
      resource
    })

    console.log(`Revoked permission from user ${userId}: ${resource}`)
  }

  // Log audit event
  private logAudit(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any>
  ): void {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date()
    }

    this.auditLogs.push(log)

    // Keep only last 10000 logs in memory
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000)
    }
  }

  // Get audit logs
  getAuditLogs(filters?: {
    userId?: string
    resource?: string
    action?: string
    startDate?: Date
    endDate?: Date
  }): AuditLog[] {
    let logs = this.auditLogs

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(l => l.userId === filters.userId)
      }
      if (filters.resource) {
        logs = logs.filter(l => l.resource === filters.resource)
      }
      if (filters.action) {
        logs = logs.filter(l => l.action === filters.action)
      }
      if (filters.startDate) {
        logs = logs.filter(l => l.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        logs = logs.filter(l => l.timestamp <= filters.endDate!)
      }
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get user
  getUser(userId: string): User | undefined {
    return this.users.get(userId)
  }

  // Get role definition
  getRole(role: UserRole): RoleDefinition | undefined {
    return this.roles.get(role)
  }

  // Get all roles
  getAllRoles(): RoleDefinition[] {
    return Array.from(this.roles.values())
  }
}

export const rbacManager = RBACManager.getInstance()
