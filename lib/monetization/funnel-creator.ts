// Funnel Creator - Sales Funnel and Lead Generation System
// Automated funnel creation, lead magnet generation, and email nurturing sequences

import { ContentContext, MonetizationError } from './types'

export interface BusinessGoal {
  type: 'traffic' | 'engagement' | 'conversions' | 'revenue' | 'lead_generation'
  target: number
  priority?: number
  timeframe?: number
  metrics?: string[]
  description?: string
}

export interface SalesFunnel {
  id: string
  name: string
  contentId?: string
  stages: FunnelStage[]
  conversionGoals: ConversionGoal[]
  automationRules: AutomationRule[]
  performanceMetrics: FunnelMetrics
  status: 'active' | 'paused' | 'draft'
  createdAt: Date
  updatedAt: Date
}

export interface FunnelStage {
  id: string
  name: string
  type: 'awareness' | 'interest' | 'decision' | 'action'
  order: number
  content: StageContent
  cta: StageCTA
  leadMagnet?: LeadMagnet
  emailSequence?: EmailSequence
  conversionGoal: number
  actualConversion?: number
}

export interface StageContent {
  title: string
  description: string
  contentType: 'blog' | 'landing_page' | 'email' | 'video' | 'webinar'
  body: string
  keywords: string[]
}

export interface StageCTA {
  text: string
  type: 'button' | 'link' | 'form'
  targetUrl: string
  design: {
    color: string
    size: 'small' | 'medium' | 'large'
    urgency: boolean
  }
}

export interface LeadMagnet {
  id: string
  title: string
  description: string
  type: 'ebook' | 'checklist' | 'template' | 'guide' | 'webinar' | 'course' | 'tool'
  contentTopic: string
  valueProposition: string
  deliveryMethod: 'email' | 'download' | 'access_link'
  captureForm: CaptureForm
  conversionRate?: number
  downloads?: number
  createdAt: Date
}

export interface CaptureForm {
  fields: FormField[]
  submitText: string
  privacyText: string
  successMessage: string
}

export interface FormField {
  name: string
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox'
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface EmailSequence {
  id: string
  name: string
  emails: EmailTemplate[]
  triggerEvent: 'lead_capture' | 'download' | 'signup' | 'purchase'
  delayBetweenEmails: number // hours
  status: 'active' | 'paused'
  performanceMetrics: EmailSequenceMetrics
}

export interface EmailTemplate {
  id: string
  subject: string
  preheader: string
  body: string
  cta: {
    text: string
    url: string
  }
  order: number
  delayAfterPrevious: number // hours
  openRate?: number
  clickRate?: number
  conversionRate?: number
}

export interface EmailSequenceMetrics {
  totalSent: number
  totalOpened: number
  totalClicked: number
  totalConverted: number
  openRate: number
  clickRate: number
  conversionRate: number
  revenue: number
}

export interface ConversionGoal {
  type: 'lead_capture' | 'email_signup' | 'product_purchase' | 'consultation_booking'
  targetValue: number
  currentValue: number
  conversionRate: number
}

export interface AutomationRule {
  id: string
  trigger: 'stage_entry' | 'stage_exit' | 'time_delay' | 'action_taken' | 'goal_achieved'
  condition: RuleCondition
  action: RuleAction
  enabled: boolean
}

export interface RuleCondition {
  type: 'time_based' | 'behavior_based' | 'score_based'
  criteria: Record<string, any>
}

export interface RuleAction {
  type: 'send_email' | 'move_stage' | 'assign_tag' | 'notify_team' | 'trigger_webhook'
  parameters: Record<string, any>
}

export interface FunnelMetrics {
  totalLeads: number
  stageConversions: Record<string, number>
  overallConversionRate: number
  averageTimeToConvert: number // hours
  revenue: number
  roi: number
  dropoffPoints: DropoffAnalysis[]
}

export interface DropoffAnalysis {
  fromStage: string
  toStage: string
  dropoffRate: number
  dropoffCount: number
  reasons: string[]
}

export interface FunnelCreationRequest {
  content: string
  context: ContentContext
  businessGoal: BusinessGoal
  targetAudience: string
  brandVoice?: string
}

export interface OptimizedFunnel extends SalesFunnel {
  optimizations: FunnelOptimization[]
  abTestResults?: FunnelABTestResults
  confidence: number
}

export interface FunnelOptimization {
  type: 'stage_content' | 'cta_placement' | 'lead_magnet' | 'email_sequence' | 'timing'
  description: string
  oldValue: any
  newValue: any
  expectedImpact: number
  reason: string
}

export interface FunnelABTestResults {
  testId: string
  variants: FunnelVariant[]
  winner?: FunnelVariant
  statisticalSignificance: number
  testDuration: number
}

export interface FunnelVariant {
  variantId: string
  funnel: SalesFunnel
  leads: number
  conversions: number
  conversionRate: number
  revenue: number
}

export class FunnelCreator {
  private static instance: FunnelCreator

  static getInstance(): FunnelCreator {
    if (!FunnelCreator.instance) {
      FunnelCreator.instance = new FunnelCreator()
    }
    return FunnelCreator.instance
  }

  /**
   * Create complete sales funnel from content with automated stages
   */
  async createFunnel(request: FunnelCreationRequest): Promise<SalesFunnel> {
    try {
      const { content, context, businessGoal, targetAudience, brandVoice } = request

      // Extract topic and keywords from content
      const topic = this.extractTopic(content)
      const keywords = this.extractKeywords(content)

      // Generate funnel stages
      const stages = await this.generateFunnelStages(
        content,
        topic,
        keywords,
        businessGoal,
        targetAudience,
        brandVoice
      )

      // Define conversion goals for each stage
      const conversionGoals = this.defineConversionGoals(businessGoal, stages)

      // Create automation rules
      const automationRules = this.createAutomationRules(stages, businessGoal)

      const funnel: SalesFunnel = {
        id: `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${topic} Conversion Funnel`,
        contentId: context.contentId,
        stages,
        conversionGoals,
        automationRules,
        performanceMetrics: this.initializeMetrics(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return funnel
    } catch (error) {
      throw new MonetizationError('Failed to create funnel', 'FUNNEL_CREATION_ERROR', error)
    }
  }

  /**
   * Generate lead magnet based on content context
   */
  async generateLeadMagnet(
    content: string,
    topic: string,
    targetAudience: string
  ): Promise<LeadMagnet> {
    try {
      // Determine best lead magnet type based on content
      const magnetType = this.selectLeadMagnetType(content, topic)

      // Generate lead magnet title and description
      const { title, description, valueProposition } = this.generateLeadMagnetContent(
        topic,
        magnetType,
        targetAudience
      )

      // Create capture form
      const captureForm = this.createCaptureForm(magnetType)

      const leadMagnet: LeadMagnet = {
        id: `magnet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        type: magnetType,
        contentTopic: topic,
        valueProposition,
        deliveryMethod: this.selectDeliveryMethod(magnetType),
        captureForm,
        createdAt: new Date()
      }

      return leadMagnet
    } catch (error) {
      throw new MonetizationError('Failed to generate lead magnet', 'LEAD_MAGNET_ERROR', error)
    }
  }

  /**
   * Create email nurturing sequence for lead conversion
   */
  async createEmailSequence(
    topic: string,
    leadMagnet: LeadMagnet,
    businessGoal: BusinessGoal,
    brandVoice?: string
  ): Promise<EmailSequence> {
    try {
      // Generate email templates for nurturing sequence
      const emails = await this.generateEmailTemplates(
        topic,
        leadMagnet,
        businessGoal,
        brandVoice || 'professional'
      )

      const sequence: EmailSequence = {
        id: `sequence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${topic} Nurturing Sequence`,
        emails,
        triggerEvent: 'lead_capture',
        delayBetweenEmails: 48, // 2 days default
        status: 'active',
        performanceMetrics: {
          totalSent: 0,
          totalOpened: 0,
          totalClicked: 0,
          totalConverted: 0,
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
          revenue: 0
        }
      }

      return sequence
    } catch (error) {
      throw new MonetizationError('Failed to create email sequence', 'EMAIL_SEQUENCE_ERROR', error)
    }
  }

  /**
   * Optimize funnel based on performance data
   */
  async optimizeFunnel(
    funnelId: string,
    performanceData: FunnelMetrics
  ): Promise<OptimizedFunnel> {
    try {
      // This would fetch the funnel from database in production
      // For now, we'll create a mock funnel structure
      const funnel = await this.getFunnelById(funnelId)
      const optimizations: FunnelOptimization[] = []

      // Analyze dropoff points and optimize
      if (performanceData.dropoffPoints && performanceData.dropoffPoints.length > 0) {
        for (const dropoff of performanceData.dropoffPoints) {
          if (dropoff.dropoffRate > 0.5) {
            // High dropoff rate - optimize this stage
            const optimization = this.optimizeStage(funnel, dropoff)
            optimizations.push(optimization)
          }
        }
      }

      // Optimize conversion rates
      if (performanceData.overallConversionRate < 5.0) {
        const conversionOptimization = this.optimizeConversionRate(funnel)
        optimizations.push(conversionOptimization)
      }

      // Calculate confidence based on sample size
      const confidence = this.calculateOptimizationConfidence(performanceData)

      return {
        ...funnel,
        optimizations,
        confidence,
        performanceMetrics: performanceData
      }
    } catch (error) {
      throw new MonetizationError('Failed to optimize funnel', 'FUNNEL_OPTIMIZATION_ERROR', error)
    }
  }

  /**
   * Track funnel metrics and performance
   */
  async trackFunnelMetrics(funnelId: string): Promise<FunnelMetrics> {
    try {
      // In production, this would query the database for actual metrics
      // For now, return mock metrics structure
      return {
        totalLeads: 0,
        stageConversions: {},
        overallConversionRate: 0,
        averageTimeToConvert: 0,
        revenue: 0,
        roi: 0,
        dropoffPoints: []
      }
    } catch (error) {
      throw new MonetizationError('Failed to track funnel metrics', 'METRICS_TRACKING_ERROR', error)
    }
  }

  // Private helper methods

  private extractTopic(content: string): string {
    // Extract main topic from content (simplified)
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    const firstLine = lines[0] || 'Content Topic'
    return firstLine.substring(0, 100).trim()
  }

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction (in production, use NLP)
    const words = content.toLowerCase().split(/\s+/)
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'])
    const keywords = words
      .filter(w => w.length > 4 && !commonWords.has(w))
      .slice(0, 10)
    return [...new Set(keywords)]
  }

  private async generateFunnelStages(
    content: string,
    topic: string,
    keywords: string[],
    businessGoal: BusinessGoal,
    targetAudience: string,
    brandVoice?: string
  ): Promise<FunnelStage[]> {
    const stages: FunnelStage[] = []

    // Stage 1: Awareness - Blog post or content piece
    const awarenessStage: FunnelStage = {
      id: 'stage_awareness',
      name: 'Awareness',
      type: 'awareness',
      order: 1,
      content: {
        title: topic,
        description: `Educational content about ${topic}`,
        contentType: 'blog',
        body: content,
        keywords
      },
      cta: {
        text: 'Learn More',
        type: 'button',
        targetUrl: '#interest',
        design: {
          color: '#3B82F6',
          size: 'medium',
          urgency: false
        }
      },
      conversionGoal: 30 // 30% should move to interest stage
    }
    stages.push(awarenessStage)

    // Stage 2: Interest - Lead magnet offer
    const leadMagnet = await this.generateLeadMagnet(content, topic, targetAudience)
    const interestStage: FunnelStage = {
      id: 'stage_interest',
      name: 'Interest',
      type: 'interest',
      order: 2,
      content: {
        title: `Get Your Free ${leadMagnet.type}`,
        description: leadMagnet.description,
        contentType: 'landing_page',
        body: this.generateLandingPageContent(leadMagnet, topic),
        keywords
      },
      cta: {
        text: 'Download Now',
        type: 'form',
        targetUrl: '#capture',
        design: {
          color: '#10B981',
          size: 'large',
          urgency: true
        }
      },
      leadMagnet,
      conversionGoal: 20 // 20% should provide email
    }
    stages.push(interestStage)

    // Stage 3: Decision - Email nurturing sequence
    const emailSequence = await this.createEmailSequence(topic, leadMagnet, businessGoal, brandVoice)
    const decisionStage: FunnelStage = {
      id: 'stage_decision',
      name: 'Decision',
      type: 'decision',
      order: 3,
      content: {
        title: 'Nurturing Email Series',
        description: `Educational emails about ${topic} with value and offers`,
        contentType: 'email',
        body: 'Multi-email sequence to build trust and demonstrate value',
        keywords
      },
      cta: {
        text: 'Get Started',
        type: 'button',
        targetUrl: '#action',
        design: {
          color: '#EF4444',
          size: 'large',
          urgency: true
        }
      },
      emailSequence,
      conversionGoal: 10 // 10% should take action
    }
    stages.push(decisionStage)

    // Stage 4: Action - Conversion/Purchase
    const actionStage: FunnelStage = {
      id: 'stage_action',
      name: 'Action',
      type: 'action',
      order: 4,
      content: {
        title: this.generateActionTitle(businessGoal),
        description: this.generateActionDescription(businessGoal, topic),
        contentType: 'landing_page',
        body: this.generateActionPageContent(businessGoal, topic),
        keywords
      },
      cta: {
        text: this.generateActionCTA(businessGoal),
        type: 'button',
        targetUrl: '#convert',
        design: {
          color: '#EF4444',
          size: 'large',
          urgency: true
        }
      },
      conversionGoal: 5 // 5% final conversion rate
    }
    stages.push(actionStage)

    return stages
  }

  private selectLeadMagnetType(content: string, topic: string): LeadMagnet['type'] {
    const contentLower = content.toLowerCase()
    
    // Determine best lead magnet type based on content
    if (contentLower.includes('step') || contentLower.includes('how to')) {
      return 'checklist'
    } else if (contentLower.includes('template') || contentLower.includes('framework')) {
      return 'template'
    } else if (contentLower.includes('guide') || contentLower.includes('complete')) {
      return 'guide'
    } else if (contentLower.includes('tool') || contentLower.includes('calculator')) {
      return 'tool'
    } else if (contentLower.includes('course') || contentLower.includes('training')) {
      return 'course'
    } else {
      return 'ebook'
    }
  }

  private generateLeadMagnetContent(
    topic: string,
    type: LeadMagnet['type'],
    targetAudience: string
  ): { title: string; description: string; valueProposition: string } {
    const typeLabels: Record<LeadMagnet['type'], string> = {
      ebook: 'Free eBook',
      checklist: 'Free Checklist',
      template: 'Free Template',
      guide: 'Free Guide',
      webinar: 'Free Webinar',
      course: 'Free Mini-Course',
      tool: 'Free Tool'
    }

    const title = `${typeLabels[type]}: ${topic}`
    const description = `Get instant access to our comprehensive ${type} that helps ${targetAudience} master ${topic}.`
    const valueProposition = `Learn the proven strategies and actionable steps to succeed with ${topic}.`

    return { title, description, valueProposition }
  }

  private createCaptureForm(magnetType: LeadMagnet['type']): CaptureForm {
    const baseFields: FormField[] = [
      {
        name: 'name',
        type: 'text',
        label: 'Your Name',
        required: true,
        placeholder: 'John Doe'
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'john@example.com'
      }
    ]

    // Add additional fields for certain magnet types
    if (magnetType === 'webinar' || magnetType === 'course') {
      baseFields.push({
        name: 'company',
        type: 'text',
        label: 'Company (Optional)',
        required: false,
        placeholder: 'Your Company'
      })
    }

    return {
      fields: baseFields,
      submitText: 'Get Instant Access',
      privacyText: 'We respect your privacy. Unsubscribe at any time.',
      successMessage: 'Success! Check your email for your download link.'
    }
  }

  private selectDeliveryMethod(magnetType: LeadMagnet['type']): LeadMagnet['deliveryMethod'] {
    if (magnetType === 'webinar' || magnetType === 'course') {
      return 'access_link'
    } else if (magnetType === 'tool') {
      return 'access_link'
    } else {
      return 'email'
    }
  }

  private async generateEmailTemplates(
    topic: string,
    leadMagnet: LeadMagnet,
    businessGoal: BusinessGoal,
    brandVoice: string
  ): Promise<EmailTemplate[]> {
    const emails: EmailTemplate[] = []

    // Email 1: Welcome + Deliver Lead Magnet
    emails.push({
      id: 'email_1',
      subject: `Your ${leadMagnet.type} is ready! 🎉`,
      preheader: `Get instant access to ${leadMagnet.title}`,
      body: this.generateWelcomeEmail(leadMagnet, topic, brandVoice),
      cta: {
        text: 'Access Your Resource',
        url: '#download'
      },
      order: 1,
      delayAfterPrevious: 0
    })

    // Email 2: Value + Education (2 days later)
    emails.push({
      id: 'email_2',
      subject: `Quick tip: How to get the most from ${topic}`,
      preheader: `Here's what successful people do differently`,
      body: this.generateEducationalEmail(topic, brandVoice),
      cta: {
        text: 'Learn More',
        url: '#learn'
      },
      order: 2,
      delayAfterPrevious: 48
    })

    // Email 3: Social Proof + Case Study (4 days later)
    emails.push({
      id: 'email_3',
      subject: `How [Customer] achieved [Result] with ${topic}`,
      preheader: `Real results from real people`,
      body: this.generateSocialProofEmail(topic, brandVoice),
      cta: {
        text: 'See Their Story',
        url: '#case-study'
      },
      order: 3,
      delayAfterPrevious: 48
    })

    // Email 4: Offer + Conversion (6 days later)
    emails.push({
      id: 'email_4',
      subject: this.generateOfferSubject(businessGoal, topic),
      preheader: `Special offer for ${topic} enthusiasts`,
      body: this.generateOfferEmail(businessGoal, topic, brandVoice),
      cta: {
        text: this.generateActionCTA(businessGoal),
        url: '#offer'
      },
      order: 4,
      delayAfterPrevious: 48
    })

    return emails
  }

  private generateWelcomeEmail(leadMagnet: LeadMagnet, topic: string, brandVoice: string): string {
    return `Hi there!

Thanks for downloading ${leadMagnet.title}. You're about to discover ${leadMagnet.valueProposition}

Here's what you'll find inside:
• Proven strategies for ${topic}
• Step-by-step action plans
• Real-world examples and case studies
• Expert tips and best practices

Click the button below to access your resource immediately.

Looking forward to helping you succeed!

Best regards,
The Team`
  }

  private generateEducationalEmail(topic: string, brandVoice: string): string {
    return `Hi again!

I wanted to share a quick tip that can make a huge difference with ${topic}.

Most people struggle because they [common problem]. But here's what works:

[Key insight or strategy]

This simple shift can help you [benefit].

Want to learn more? Check out our latest resources.

Best,
The Team`
  }

  private generateSocialProofEmail(topic: string, brandVoice: string): string {
    return `Hi there,

I wanted to share an inspiring story with you.

[Customer Name] was struggling with ${topic}, just like many others. But after implementing our strategies, they achieved [impressive result].

Here's what they did differently:
• [Strategy 1]
• [Strategy 2]
• [Strategy 3]

You can achieve similar results. Want to see how?

Best,
The Team`
  }

  private generateOfferEmail(businessGoal: BusinessGoal, topic: string, brandVoice: string): string {
    return `Hi,

Over the past week, you've learned a lot about ${topic}.

Now I have something special for you.

For a limited time, we're offering [special offer/product] that will help you [achieve goal].

This includes:
• [Feature 1]
• [Feature 2]
• [Feature 3]

Plus, you'll get [bonus] when you act now.

Ready to take the next step?

Best,
The Team

P.S. This offer expires in 48 hours, so don't miss out!`
  }

  private generateOfferSubject(businessGoal: BusinessGoal, topic: string): string {
    return `Special offer: Master ${topic} faster`
  }

  private generateActionTitle(businessGoal: BusinessGoal): string {
    const goalTitles: Record<string, string> = {
      traffic: 'Boost Your Traffic Today',
      engagement: 'Increase Engagement Now',
      conversions: 'Start Converting More Leads',
      revenue: 'Grow Your Revenue',
      lead_generation: 'Generate More Leads',
      brand_awareness: 'Build Your Brand'
    }
    return goalTitles[businessGoal.type] || 'Take Action Now'
  }

  private generateActionDescription(businessGoal: BusinessGoal, topic: string): string {
    return `Ready to achieve real results with ${topic}? Join thousands of successful users who have transformed their business.`
  }

  private generateActionPageContent(businessGoal: BusinessGoal, topic: string): string {
    return `Transform your results with our proven ${topic} system. Get started today and see measurable improvements within 30 days.`
  }

  private generateActionCTA(businessGoal: BusinessGoal): string {
    const goalCTAs: Record<string, string> = {
      traffic: 'Boost My Traffic',
      engagement: 'Increase Engagement',
      conversions: 'Start Converting',
      revenue: 'Grow Revenue',
      lead_generation: 'Generate Leads',
      brand_awareness: 'Build My Brand'
    }
    return goalCTAs[businessGoal.type] || 'Get Started Now'
  }

  private generateLandingPageContent(leadMagnet: LeadMagnet, topic: string): string {
    return `Get Your Free ${leadMagnet.type}

${leadMagnet.description}

What You'll Learn:
• Master the fundamentals of ${topic}
• Discover proven strategies that work
• Avoid common mistakes and pitfalls
• Get actionable steps you can implement today

${leadMagnet.valueProposition}

Download now and start seeing results!`
  }

  private defineConversionGoals(businessGoal: BusinessGoal, stages: FunnelStage[]): ConversionGoal[] {
    return [
      {
        type: 'lead_capture',
        targetValue: 100,
        currentValue: 0,
        conversionRate: 0
      },
      {
        type: 'email_signup',
        targetValue: 50,
        currentValue: 0,
        conversionRate: 0
      },
      {
        type: businessGoal.type === 'revenue' ? 'product_purchase' : 'consultation_booking',
        targetValue: businessGoal.target,
        currentValue: 0,
        conversionRate: 0
      }
    ]
  }

  private createAutomationRules(stages: FunnelStage[], businessGoal: BusinessGoal): AutomationRule[] {
    const rules: AutomationRule[] = []

    // Rule 1: Send welcome email on lead capture
    rules.push({
      id: 'rule_welcome',
      trigger: 'stage_entry',
      condition: {
        type: 'behavior_based',
        criteria: { stage: 'interest', action: 'form_submit' }
      },
      action: {
        type: 'send_email',
        parameters: { emailId: 'email_1' }
      },
      enabled: true
    })

    // Rule 2: Move to decision stage after email open
    rules.push({
      id: 'rule_decision',
      trigger: 'action_taken',
      condition: {
        type: 'behavior_based',
        criteria: { action: 'email_open', emailId: 'email_1' }
      },
      action: {
        type: 'move_stage',
        parameters: { toStage: 'decision' }
      },
      enabled: true
    })

    // Rule 3: Send offer email after engagement
    rules.push({
      id: 'rule_offer',
      trigger: 'time_delay',
      condition: {
        type: 'time_based',
        criteria: { delay: 144, unit: 'hours' } // 6 days
      },
      action: {
        type: 'send_email',
        parameters: { emailId: 'email_4' }
      },
      enabled: true
    })

    return rules
  }

  private initializeMetrics(): FunnelMetrics {
    return {
      totalLeads: 0,
      stageConversions: {},
      overallConversionRate: 0,
      averageTimeToConvert: 0,
      revenue: 0,
      roi: 0,
      dropoffPoints: []
    }
  }

  private async getFunnelById(funnelId: string): Promise<SalesFunnel> {
    // In production, fetch from database
    // For now, return a mock funnel
    throw new Error('Funnel not found - implement database fetch')
  }

  private optimizeStage(funnel: SalesFunnel, dropoff: DropoffAnalysis): FunnelOptimization {
    return {
      type: 'stage_content',
      description: `Optimize ${dropoff.fromStage} to reduce ${dropoff.dropoffRate * 100}% dropoff`,
      oldValue: dropoff.fromStage,
      newValue: 'Optimized stage content with better engagement',
      expectedImpact: 0.25,
      reason: `High dropoff rate of ${dropoff.dropoffRate * 100}% detected`
    }
  }

  private optimizeConversionRate(funnel: SalesFunnel): FunnelOptimization {
    return {
      type: 'cta_placement',
      description: 'Improve CTA placement and urgency across all stages',
      oldValue: 'Standard CTA placement',
      newValue: 'Optimized CTA with urgency and better positioning',
      expectedImpact: 0.30,
      reason: 'Overall conversion rate below 5% threshold'
    }
  }

  private calculateOptimizationConfidence(metrics: FunnelMetrics): number {
    const sampleSize = metrics.totalLeads
    if (sampleSize < 100) return 0.5
    if (sampleSize < 500) return 0.7
    if (sampleSize < 1000) return 0.85
    return 0.95
  }
}

// Export singleton instance
export const funnelCreator = FunnelCreator.getInstance()
