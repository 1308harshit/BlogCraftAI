// Funnel Creator Integration Example
// Demonstrates how to use the funnel creator system

import { funnelCreator } from './funnel-creator'
import type { FunnelCreationRequest, BusinessGoal } from './funnel-creator'

/**
 * Example 1: Create a complete sales funnel from blog content
 */
export async function createBlogToSalesFunnel() {
  const blogContent = `
    How to Master Email Marketing in 2024
    
    Email marketing remains one of the most effective channels for business growth.
    In this comprehensive guide, we'll cover everything you need to know to build
    a successful email marketing strategy.
    
    From list building to automation, you'll learn the proven tactics that drive
    real results for businesses of all sizes.
  `

  const request: FunnelCreationRequest = {
    content: blogContent,
    context: {
      userId: 'user_123',
      topic: 'Email Marketing',
      keywords: ['email', 'marketing', 'automation', 'strategy'],
      targetAudience: 'small business owners',
      contentType: 'blog'
    },
    businessGoal: {
      type: 'lead_generation',
      priority: 9,
      target: 500,
      timeframe: 90,
      metrics: ['leads', 'conversions', 'revenue']
    } as BusinessGoal,
    targetAudience: 'small business owners',
    brandVoice: 'professional'
  }

  const funnel = await funnelCreator.createFunnel(request)

  console.log('Created funnel:', funnel.name)
  console.log('Stages:', funnel.stages.length)
  console.log('Conversion goals:', funnel.conversionGoals.length)
  console.log('Automation rules:', funnel.automationRules.length)

  return funnel
}

/**
 * Example 2: Generate a lead magnet for content
 */
export async function generateContentLeadMagnet() {
  const content = 'Complete SEO checklist for 2024: Step-by-step guide'
  const topic = 'SEO Optimization'
  const targetAudience = 'digital marketers'

  const leadMagnet = await funnelCreator.generateLeadMagnet(
    content,
    topic,
    targetAudience
  )

  console.log('Lead magnet created:', leadMagnet.title)
  console.log('Type:', leadMagnet.type)
  console.log('Delivery method:', leadMagnet.deliveryMethod)
  console.log('Form fields:', leadMagnet.captureForm.fields.length)

  return leadMagnet
}

/**
 * Example 3: Create email nurturing sequence
 */
export async function createNurturingSequence() {
  const leadMagnet = {
    id: 'magnet_123',
    title: 'Free Content Marketing Guide',
    description: 'Complete guide to content marketing success',
    type: 'guide' as const,
    contentTopic: 'Content Marketing',
    valueProposition: 'Learn proven content strategies',
    deliveryMethod: 'email' as const,
    captureForm: {
      fields: [
        {
          name: 'email',
          type: 'email' as const,
          label: 'Email',
          required: true
        }
      ],
      submitText: 'Download Guide',
      privacyText: 'We respect your privacy',
      successMessage: 'Check your email!'
    },
    createdAt: new Date()
  }

  const businessGoal: BusinessGoal = {
    type: 'conversions',
    priority: 8,
    target: 100,
    timeframe: 60,
    metrics: ['conversions', 'revenue']
  }

  const sequence = await funnelCreator.createEmailSequence(
    'Content Marketing',
    leadMagnet,
    businessGoal,
    'friendly'
  )

  console.log('Email sequence created:', sequence.name)
  console.log('Number of emails:', sequence.emails.length)
  console.log('Trigger event:', sequence.triggerEvent)

  sequence.emails.forEach((email, index) => {
    console.log(`Email ${index + 1}:`, email.subject)
    console.log(`  Delay: ${email.delayAfterPrevious} hours`)
    console.log(`  CTA: ${email.cta.text}`)
  })

  return sequence
}

/**
 * Example 4: Complete funnel workflow with all components
 */
export async function completeFunnelWorkflow() {
  console.log('=== Starting Complete Funnel Workflow ===\n')

  // Step 1: Create the funnel
  console.log('Step 1: Creating sales funnel...')
  const funnel = await createBlogToSalesFunnel()
  console.log(`✓ Funnel created: ${funnel.id}\n`)

  // Step 2: Extract lead magnet from interest stage
  console.log('Step 2: Extracting lead magnet...')
  const interestStage = funnel.stages.find(s => s.type === 'interest')
  if (interestStage?.leadMagnet) {
    console.log(`✓ Lead magnet: ${interestStage.leadMagnet.title}`)
    console.log(`  Type: ${interestStage.leadMagnet.type}`)
    console.log(`  Capture form fields: ${interestStage.leadMagnet.captureForm.fields.length}\n`)
  }

  // Step 3: Extract email sequence from decision stage
  console.log('Step 3: Extracting email sequence...')
  const decisionStage = funnel.stages.find(s => s.type === 'decision')
  if (decisionStage?.emailSequence) {
    console.log(`✓ Email sequence: ${decisionStage.emailSequence.name}`)
    console.log(`  Emails: ${decisionStage.emailSequence.emails.length}`)
    console.log(`  Status: ${decisionStage.emailSequence.status}\n`)
  }

  // Step 4: Display funnel structure
  console.log('Step 4: Funnel structure:')
  funnel.stages.forEach((stage, index) => {
    console.log(`  ${index + 1}. ${stage.name} (${stage.type})`)
    console.log(`     Goal: ${stage.conversionGoal}% conversion`)
    console.log(`     CTA: ${stage.cta.text}`)
  })
  console.log()

  // Step 5: Display automation rules
  console.log('Step 5: Automation rules:')
  funnel.automationRules.forEach((rule, index) => {
    console.log(`  ${index + 1}. ${rule.id}`)
    console.log(`     Trigger: ${rule.trigger}`)
    console.log(`     Action: ${rule.action.type}`)
  })
  console.log()

  console.log('=== Funnel Workflow Complete ===')

  return {
    funnel,
    leadMagnet: interestStage?.leadMagnet,
    emailSequence: decisionStage?.emailSequence
  }
}

/**
 * Example 5: API usage example
 */
export async function apiFunnelExample() {
  // Example API request to create a funnel
  const apiRequest = {
    action: 'create_funnel',
    content: 'Social media marketing guide for beginners',
    context: {
      userId: 'user_456',
      topic: 'Social Media Marketing',
      keywords: ['social', 'media', 'marketing', 'strategy'],
      targetAudience: 'entrepreneurs',
      contentType: 'blog'
    },
    businessGoal: {
      type: 'lead_generation',
      priority: 8,
      target: 200,
      timeframe: 60,
      metrics: ['leads']
    },
    targetAudience: 'entrepreneurs',
    brandVoice: 'casual'
  }

  console.log('API Request:', JSON.stringify(apiRequest, null, 2))

  // In a real application, you would make an HTTP request:
  // const response = await fetch('/api/monetization/funnel', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(apiRequest)
  // })
  // const data = await response.json()

  return apiRequest
}

// Run examples if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await completeFunnelWorkflow()
    } catch (error) {
      console.error('Error running examples:', error)
    }
  })()
}
