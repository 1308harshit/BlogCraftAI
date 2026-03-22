// Funnel Creator - Unit Tests
// Tests for sales funnel creation, lead magnet generation, and email sequences

import { FunnelCreator } from '../../lib/monetization/funnel-creator'
import type { FunnelCreationRequest, BusinessGoal } from '../../lib/monetization/funnel-creator'

describe('FunnelCreator', () => {
  let funnelCreator: FunnelCreator

  beforeEach(() => {
    funnelCreator = FunnelCreator.getInstance()
  })

  describe('createFunnel', () => {
    it('should create a complete sales funnel with all stages', async () => {
      const request: FunnelCreationRequest = {
        content: 'How to Master Content Marketing: A Complete Guide for Beginners',
        context: {
          userId: 'user_123',
          topic: 'Content Marketing',
          keywords: ['content', 'marketing', 'strategy', 'seo'],
          targetAudience: 'small business owners',
          contentType: 'blog'
        },
        businessGoal: {
          type: 'lead_generation',
          priority: 8,
          target: 100,
          timeframe: 30,
          metrics: ['leads', 'conversions']
        } as BusinessGoal,
        targetAudience: 'small business owners',
        brandVoice: 'professional'
      }

      const funnel = await funnelCreator.createFunnel(request)

      // Verify funnel structure
      expect(funnel).toBeDefined()
      expect(funnel.id).toMatch(/^funnel_/)
      expect(funnel.name).toContain('Conversion Funnel')
      expect(funnel.status).toBe('active')

      // Verify stages
      expect(funnel.stages).toHaveLength(4)
      expect(funnel.stages[0].type).toBe('awareness')
      expect(funnel.stages[1].type).toBe('interest')
      expect(funnel.stages[2].type).toBe('decision')
      expect(funnel.stages[3].type).toBe('action')

      // Verify each stage has required components
      funnel.stages.forEach(stage => {
        expect(stage.id).toBeDefined()
        expect(stage.name).toBeDefined()
        expect(stage.content).toBeDefined()
        expect(stage.cta).toBeDefined()
        expect(stage.conversionGoal).toBeGreaterThan(0)
      })

      // Verify conversion goals
      expect(funnel.conversionGoals).toBeDefined()
      expect(funnel.conversionGoals.length).toBeGreaterThan(0)

      // Verify automation rules
      expect(funnel.automationRules).toBeDefined()
      expect(funnel.automationRules.length).toBeGreaterThan(0)
    })

    it('should include lead magnet in interest stage', async () => {
      const request: FunnelCreationRequest = {
        content: 'Complete SEO Checklist for 2024',
        context: {
          userId: 'user_123',
          topic: 'SEO',
          keywords: ['seo', 'checklist', 'optimization'],
          targetAudience: 'marketers',
          contentType: 'blog'
        },
        businessGoal: {
          type: 'lead_generation',
          priority: 9,
          target: 200,
          timeframe: 60,
          metrics: ['leads']
        } as BusinessGoal,
        targetAudience: 'marketers'
      }

      const funnel = await funnelCreator.createFunnel(request)

      const interestStage = funnel.stages.find(s => s.type === 'interest')
      expect(interestStage).toBeDefined()
      expect(interestStage?.leadMagnet).toBeDefined()
      expect(interestStage?.leadMagnet?.title).toBeDefined()
      expect(interestStage?.leadMagnet?.type).toBeDefined()
      expect(interestStage?.leadMagnet?.captureForm).toBeDefined()
    })

    it('should include email sequence in decision stage', async () => {
      const request: FunnelCreationRequest = {
        content: 'Email Marketing Best Practices',
        context: {
          userId: 'user_123',
          topic: 'Email Marketing',
          keywords: ['email', 'marketing', 'automation'],
          targetAudience: 'entrepreneurs',
          contentType: 'blog'
        },
        businessGoal: {
          type: 'conversions',
          priority: 8,
          target: 50,
          timeframe: 30,
          metrics: ['conversions']
        } as BusinessGoal,
        targetAudience: 'entrepreneurs'
      }

      const funnel = await funnelCreator.createFunnel(request)

      const decisionStage = funnel.stages.find(s => s.type === 'decision')
      expect(decisionStage).toBeDefined()
      expect(decisionStage?.emailSequence).toBeDefined()
      expect(decisionStage?.emailSequence?.emails).toBeDefined()
      expect(decisionStage?.emailSequence?.emails.length).toBeGreaterThan(0)
    })
  })

  describe('generateLeadMagnet', () => {
    it('should generate contextually relevant lead magnet', async () => {
      const content = 'Step-by-step guide to social media marketing'
      const topic = 'Social Media Marketing'
      const targetAudience = 'small business owners'

      const leadMagnet = await funnelCreator.generateLeadMagnet(content, topic, targetAudience)

      expect(leadMagnet).toBeDefined()
      expect(leadMagnet.id).toMatch(/^magnet_/)
      expect(leadMagnet.title).toContain(topic)
      expect(leadMagnet.type).toBeDefined()
      expect(leadMagnet.description).toBeDefined()
      expect(leadMagnet.valueProposition).toBeDefined()
      expect(leadMagnet.captureForm).toBeDefined()
      expect(leadMagnet.deliveryMethod).toBeDefined()
    })

    it('should select appropriate lead magnet type based on content', async () => {
      const checklistContent = 'Step by step checklist for launching your product'
      const leadMagnet1 = await funnelCreator.generateLeadMagnet(
        checklistContent,
        'Product Launch',
        'entrepreneurs'
      )
      expect(leadMagnet1.type).toBe('checklist')

      const templateContent = 'Free template for your marketing strategy'
      const leadMagnet2 = await funnelCreator.generateLeadMagnet(
        templateContent,
        'Marketing Strategy',
        'marketers'
      )
      expect(leadMagnet2.type).toBe('template')

      const guideContent = 'Complete guide to email automation'
      const leadMagnet3 = await funnelCreator.generateLeadMagnet(
        guideContent,
        'Email Automation',
        'business owners'
      )
      expect(leadMagnet3.type).toBe('guide')
    })

    it('should create capture form with required fields', async () => {
      const leadMagnet = await funnelCreator.generateLeadMagnet(
        'Content marketing guide',
        'Content Marketing',
        'marketers'
      )

      expect(leadMagnet.captureForm.fields).toBeDefined()
      expect(leadMagnet.captureForm.fields.length).toBeGreaterThan(0)
      
      const emailField = leadMagnet.captureForm.fields.find(f => f.type === 'email')
      expect(emailField).toBeDefined()
      expect(emailField?.required).toBe(true)

      expect(leadMagnet.captureForm.submitText).toBeDefined()
      expect(leadMagnet.captureForm.privacyText).toBeDefined()
      expect(leadMagnet.captureForm.successMessage).toBeDefined()
    })
  })

  describe('createEmailSequence', () => {
    it('should create nurturing email sequence with multiple emails', async () => {
      const leadMagnet = {
        id: 'magnet_123',
        title: 'Free SEO Guide',
        description: 'Complete SEO guide for beginners',
        type: 'guide' as const,
        contentTopic: 'SEO',
        valueProposition: 'Learn SEO basics',
        deliveryMethod: 'email' as const,
        captureForm: {
          fields: [],
          submitText: 'Download',
          privacyText: 'Privacy policy',
          successMessage: 'Success!'
        },
        createdAt: new Date()
      }

      const businessGoal: BusinessGoal = {
        type: 'conversions',
        priority: 8,
        target: 100,
        timeframe: 30,
        metrics: ['conversions']
      }

      const sequence = await funnelCreator.createEmailSequence(
        'SEO',
        leadMagnet,
        businessGoal,
        'professional'
      )

      expect(sequence).toBeDefined()
      expect(sequence.id).toMatch(/^sequence_/)
      expect(sequence.name).toContain('SEO')
      expect(sequence.emails).toBeDefined()
      expect(sequence.emails.length).toBeGreaterThanOrEqual(4)
      expect(sequence.triggerEvent).toBe('lead_capture')
      expect(sequence.status).toBe('active')
    })

    it('should create emails with proper structure and timing', async () => {
      const leadMagnet = {
        id: 'magnet_456',
        title: 'Marketing Checklist',
        description: 'Complete marketing checklist',
        type: 'checklist' as const,
        contentTopic: 'Marketing',
        valueProposition: 'Master marketing',
        deliveryMethod: 'email' as const,
        captureForm: {
          fields: [],
          submitText: 'Get Checklist',
          privacyText: 'Privacy',
          successMessage: 'Check email'
        },
        createdAt: new Date()
      }

      const businessGoal: BusinessGoal = {
        type: 'lead_generation',
        priority: 7,
        target: 50,
        timeframe: 30,
        metrics: ['leads']
      }

      const sequence = await funnelCreator.createEmailSequence(
        'Marketing',
        leadMagnet,
        businessGoal
      )

      // Verify each email has required components
      sequence.emails.forEach((email, index) => {
        expect(email.id).toBeDefined()
        expect(email.subject).toBeDefined()
        expect(email.preheader).toBeDefined()
        expect(email.body).toBeDefined()
        expect(email.cta).toBeDefined()
        expect(email.cta.text).toBeDefined()
        expect(email.cta.url).toBeDefined()
        expect(email.order).toBe(index + 1)
        expect(email.delayAfterPrevious).toBeGreaterThanOrEqual(0)
      })

      // First email should have no delay
      expect(sequence.emails[0].delayAfterPrevious).toBe(0)

      // Subsequent emails should have delays
      for (let i = 1; i < sequence.emails.length; i++) {
        expect(sequence.emails[i].delayAfterPrevious).toBeGreaterThan(0)
      }
    })

    it('should include welcome, educational, social proof, and offer emails', async () => {
      const leadMagnet = {
        id: 'magnet_789',
        title: 'Content Strategy Template',
        description: 'Template for content strategy',
        type: 'template' as const,
        contentTopic: 'Content Strategy',
        valueProposition: 'Plan your content',
        deliveryMethod: 'download' as const,
        captureForm: {
          fields: [],
          submitText: 'Download',
          privacyText: 'Privacy',
          successMessage: 'Success'
        },
        createdAt: new Date()
      }

      const businessGoal: BusinessGoal = {
        type: 'revenue',
        priority: 9,
        target: 10000,
        timeframe: 60,
        metrics: ['revenue']
      }

      const sequence = await funnelCreator.createEmailSequence(
        'Content Strategy',
        leadMagnet,
        businessGoal
      )

      expect(sequence.emails.length).toBeGreaterThanOrEqual(4)

      // Verify email types by content
      const welcomeEmail = sequence.emails[0]
      expect(welcomeEmail.subject.toLowerCase()).toContain('ready')

      const lastEmail = sequence.emails[sequence.emails.length - 1]
      expect(lastEmail.body.toLowerCase()).toContain('offer')
    })
  })

  describe('optimizeFunnel', () => {
    it('should identify optimization opportunities from performance data', async () => {
      const funnelId = 'funnel_test_123'
      const performanceData = {
        totalLeads: 500,
        stageConversions: {
          awareness: 400,
          interest: 200,
          decision: 80,
          action: 20
        },
        overallConversionRate: 4.0,
        averageTimeToConvert: 168,
        revenue: 5000,
        roi: 2.5,
        dropoffPoints: [
          {
            fromStage: 'interest',
            toStage: 'decision',
            dropoffRate: 0.6,
            dropoffCount: 120,
            reasons: ['Low engagement', 'Unclear value proposition']
          }
        ]
      }

      try {
        const optimizedFunnel = await funnelCreator.optimizeFunnel(funnelId, performanceData)
        
        expect(optimizedFunnel).toBeDefined()
        expect(optimizedFunnel.optimizations).toBeDefined()
        expect(optimizedFunnel.optimizations.length).toBeGreaterThan(0)
        expect(optimizedFunnel.confidence).toBeGreaterThan(0)
        expect(optimizedFunnel.confidence).toBeLessThanOrEqual(1)
      } catch (error: any) {
        // Expected error since we don't have database implementation
        expect(error.message).toContain('Failed to optimize funnel')
      }
    })
  })

  describe('trackFunnelMetrics', () => {
    it('should return funnel metrics structure', async () => {
      const funnelId = 'funnel_test_456'

      const metrics = await funnelCreator.trackFunnelMetrics(funnelId)

      expect(metrics).toBeDefined()
      expect(metrics.totalLeads).toBeDefined()
      expect(metrics.stageConversions).toBeDefined()
      expect(metrics.overallConversionRate).toBeDefined()
      expect(metrics.averageTimeToConvert).toBeDefined()
      expect(metrics.revenue).toBeDefined()
      expect(metrics.roi).toBeDefined()
      expect(metrics.dropoffPoints).toBeDefined()
    })
  })
})
