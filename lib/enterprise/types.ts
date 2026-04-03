// Enterprise Features - Type Definitions
// Role-based access control, team collaboration, and enterprise security

export type UserRole = 'strategist' | 'creator' | 'analyst' | 'manager' | 'admin'

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete' | 'execute')[]
}

export interface RoleDefinition {
  role: UserRole
  name: string
  description: string
  permissions: Permission[]
  inheritsFrom?: UserRole[]
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  teamId: string
  customPermissions?: Permission[]
  createdAt: Date
  lastLoginAt?: Date
}

export interface Team {
  id: string
  name: string
  organizationId: string
  members: string[] // user IDs
  settings: TeamSettings
  createdAt: Date
}

export interface TeamSettings {
  brandGuidelines: BrandGuidelines
  approvalWorkflow: ApprovalWorkflow
  contentStandards: ContentStandards
}

export interface BrandGuidelines {
  tone: string[]
  voice: string
  prohibitedWords: string[]
  requiredElements: string[]
  styleGuide: string
}

export interface ApprovalWorkflow {
  enabled: boolean
  stages: ApprovalStage[]
  autoApproveThreshold?: number
}

export interface ApprovalStage {
  name: string
  approvers: string[] // user IDs or roles
  required: boolean
  order: number
}

export interface ContentStandards {
  minWordCount?: number
  maxWordCount?: number
  requiredSections: string[]
  seoRequirements: SEORequirements
  qualityThresholds: QualityThresholds
}

export interface SEORequirements {
  minSEOScore: number
  requireMetaDescription: boolean
  requireAltText: boolean
  minKeywordDensity: number
  maxKeywordDensity: number
}

export interface QualityThresholds {
  minReadabilityScore: number
  minEngagementPotential: number
  requireFactCheck: boolean
  requirePlagiarismCheck: boolean
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface AccessRequest {
  id: string
  userId: string
  resource: string
  action: string
  status: 'pending' | 'approved' | 'denied'
  requestedAt: Date
  reviewedBy?: string
  reviewedAt?: Date
  reason?: string
}