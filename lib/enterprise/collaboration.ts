// Team Collaboration System
// Approval workflows, content review, and team coordination

import { Team, ApprovalWorkflow, ApprovalStage, User } from './types'

export interface ContentReview {
  id: string
  contentId: string
  reviewerId: string
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested'
  comments: ReviewComment[]
  stage: number
  createdAt: Date
  completedAt?: Date
}

export interface ReviewComment {
  id: string
  userId: string
  text: string
  position?: number
  resolved: boolean
  createdAt: Date
}

export class CollaborationManager {
  private static instance: CollaborationManager
  private teams: Map<string, Team> = new Map()
  private reviews: Map<string, ContentReview> = new Map()

  static getInstance(): CollaborationManager {
    if (!CollaborationManager.instance) {
      CollaborationManager.instance = new CollaborationManager()
    }
    return CollaborationManager.instance
  }

  async submitForReview(contentId: string, teamId: string, submitterId: string): Promise<ContentReview> {
    const team = this.teams.get(teamId)
    if (!team || !team.settings.approvalWorkflow.enabled) {
      throw new Error('Approval workflow not enabled')
    }

    const review: ContentReview = {
      id: `review_${Date.now()}`,
      contentId,
      reviewerId: team.settings.approvalWorkflow.stages[0].approvers[0],
      status: 'pending',
      comments: [],
      stage: 0,
      createdAt: new Date()
    }

    this.reviews.set(review.id, review)
    return review
  }

  async approveContent(reviewId: string, approverId: string): Promise<void> {
    const review = this.reviews.get(reviewId)
    if (!review) throw new Error('Review not found')

    review.status = 'approved'
    review.completedAt = new Date()
  }

  async rejectContent(reviewId: string, approverId: string, reason: string): Promise<void> {
    const review = this.reviews.get(reviewId)
    if (!review) throw new Error('Review not found')

    review.status = 'rejected'
    review.completedAt = new Date()
    review.comments.push({
      id: `comment_${Date.now()}`,
      userId: approverId,
      text: reason,
      resolved: false,
      createdAt: new Date()
    })
  }
}

export const collaborationManager = CollaborationManager.getInstance()
