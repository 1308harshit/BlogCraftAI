// Third-Party Platform Integrations
// CRM, email marketing, social media, analytics platforms

export interface Integration {
  id: string
  platform: string
  type: 'crm' | 'email' | 'social' | 'analytics'
  credentials: Record<string, string>
  active: boolean
  lastSyncAt?: Date
  createdAt: Date
}

export class IntegrationManager {
  private static instance: IntegrationManager
  private integrations: Map<string, Integration> = new Map()

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager()
    }
    return IntegrationManager.instance
  }

  async connectIntegration(platform: string, type: Integration['type'], credentials: Record<string, string>): Promise<Integration> {
    const integration: Integration = {
      id: `int_${Date.now()}`,
      platform,
      type,
      credentials,
      active: true,
      createdAt: new Date()
    }

    this.integrations.set(integration.id, integration)
    console.log(`Connected integration: ${platform}`)
    return integration
  }

  async syncData(integrationId: string): Promise<void> {
    const integration = this.integrations.get(integrationId)
    if (!integration || !integration.active) return

    console.log(`Syncing data for ${integration.platform}...`)
    integration.lastSyncAt = new Date()
  }

  getIntegrations(): Integration[] {
    return Array.from(this.integrations.values())
  }
}

export const integrationManager = IntegrationManager.getInstance()
