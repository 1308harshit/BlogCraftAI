// Webhook Management System
// Real-time data synchronization and event-driven architecture

export interface Webhook {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  retryPolicy: RetryPolicy
  createdAt: Date
}

export interface RetryPolicy {
  maxRetries: number
  backoffMultiplier: number
  initialDelayMs: number
}

export interface WebhookEvent {
  id: string
  webhookId: string
  event: string
  payload: any
  status: 'pending' | 'delivered' | 'failed'
  attempts: number
  lastAttemptAt?: Date
  deliveredAt?: Date
  createdAt: Date
}

export class WebhookManager {
  private static instance: WebhookManager
  private webhooks: Map<string, Webhook> = new Map()
  private events: Map<string, WebhookEvent> = new Map()

  static getInstance(): WebhookManager {
    if (!WebhookManager.instance) {
      WebhookManager.instance = new WebhookManager()
    }
    return WebhookManager.instance
  }

  async createWebhook(url: string, events: string[]): Promise<Webhook> {
    const webhook: Webhook = {
      id: `webhook_${Date.now()}`,
      url,
      events,
      secret: Math.random().toString(36).substr(2, 32),
      active: true,
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelayMs: 1000
      },
      createdAt: new Date()
    }

    this.webhooks.set(webhook.id, webhook)
    return webhook
  }

  async triggerEvent(event: string, payload: any): Promise<void> {
    const webhooks = Array.from(this.webhooks.values())
      .filter(w => w.active && w.events.includes(event))

    for (const webhook of webhooks) {
      const webhookEvent: WebhookEvent = {
        id: `event_${Date.now()}`,
        webhookId: webhook.id,
        event,
        payload,
        status: 'pending',
        attempts: 0,
        createdAt: new Date()
      }

      this.events.set(webhookEvent.id, webhookEvent)
      await this.deliverEvent(webhookEvent, webhook)
    }
  }

  private async deliverEvent(event: WebhookEvent, webhook: Webhook): Promise<void> {
    event.attempts++
    event.lastAttemptAt = new Date()

    try {
      // In production, make actual HTTP request
      console.log(`Delivering webhook event ${event.event} to ${webhook.url}`)
      event.status = 'delivered'
      event.deliveredAt = new Date()
    } catch (error) {
      event.status = 'failed'
      
      if (event.attempts < webhook.retryPolicy.maxRetries) {
        const delay = webhook.retryPolicy.initialDelayMs * 
          Math.pow(webhook.retryPolicy.backoffMultiplier, event.attempts - 1)
        
        setTimeout(() => this.deliverEvent(event, webhook), delay)
      }
    }
  }
}

export const webhookManager = WebhookManager.getInstance()
