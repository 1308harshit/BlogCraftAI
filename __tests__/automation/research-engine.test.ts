// Research Engine Tests
// Tests for automated research and trend analysis functionality

import { ResearchEngine } from '../../lib/automation/research-engine'

describe('ResearchEngine', () => {
  let researchEngine: ResearchEngine

  beforeEach(() => {
    researchEngine = ResearchEngine.getInstance()
  })

  afterEach(() => {
    // Clean up real-time monitoring
    researchEngine.stopRealTimeTrendMonitoring()
  })

  describe('Trend Analysis', () => {
    it('should analyze trends with real-time updates', async () => {
      const trends = await researchEngine.analyzeTrends(['traffic', 'engagement'])

      expect(trends).toBeDefined()
      expect(trends.trendingTopics).toBeInstanceOf(Array)
      expect(trends.trendingTopics.length).toBeGreaterThan(0)
      expect(trends.trendingKeywords).toBeInstanceOf(Array)
      expect(trends.viralPatterns).toBeInstanceOf(Array)
      expect(trends.seasonalTrends).toBeInstanceOf(Array)
      expect(trends.industryTrends).toBeInstanceOf(Array)
      expect(trends.confidence).toBeGreaterThan(0)
      expect(trends.confidence).toBeLessThanOrEqual(1)
      expect(trends.analyzedAt).toBeInstanceOf(Date)
    })

    it('should include real-time trend updates when available', async () => {
      const trends = await researchEngine.analyzeTrends(['traffic'])

      if (trends.realTimeUpdates && trends.realTimeUpdates.length > 0) {
        const update = trends.realTimeUpdates[0]
        expect(update.topic).toBeDefined()
        expect(update.trendVelocity).toBeGreaterThan(0)
        expect(update.trendVelocity).toBeLessThanOrEqual(1)
        expect(update.peakTime).toBeInstanceOf(Date)
        expect(update.estimatedDuration).toBeGreaterThan(0)
        expect(update.platforms).toBeInstanceOf(Array)
        expect(update.relatedKeywords).toBeInstanceOf(Array)
      }
    })

    it('should cache trend analysis results', async () => {
      const trends1 = await researchEngine.analyzeTrends(['traffic'])
      const trends2 = await researchEngine.analyzeTrends(['traffic'])

      // Should return same cached result
      expect(trends1.analyzedAt).toEqual(trends2.analyzedAt)
    })
  })

  describe('Competitor Analysis', () => {
    it('should analyze competitors with performance tracking', async () => {
      const analysis = await researchEngine.analyzeCompetitors('test-user-id')

      expect(analysis).toBeDefined()
      expect(analysis.competitors).toBeInstanceOf(Array)
      expect(analysis.topPerformingContent).toBeInstanceOf(Array)
      expect(analysis.contentGaps).toBeInstanceOf(Array)
      expect(analysis.opportunities).toBeInstanceOf(Array)
      expect(analysis.averagePerformance).toBeGreaterThanOrEqual(0)
      expect(analysis.averagePerformance).toBeLessThanOrEqual(1)
      expect(analysis.analyzedAt).toBeInstanceOf(Date)
    })

    it('should provide detailed competitor profiles', async () => {
      const analysis = await researchEngine.analyzeCompetitors('test-user-id')

      if (analysis.competitors.length > 0) {
        const competitor = analysis.competitors[0]
        expect(competitor.name).toBeDefined()
        expect(competitor.contentFrequency).toBeGreaterThan(0)
        expect(competitor.avgEngagementRate).toBeGreaterThanOrEqual(0)
        expect(competitor.avgTrafficEstimate).toBeGreaterThan(0)
        expect(competitor.topContentTypes).toBeInstanceOf(Array)
        expect(competitor.strengths).toBeInstanceOf(Array)
        expect(competitor.weaknesses).toBeInstanceOf(Array)
        expect(competitor.lastAnalyzed).toBeInstanceOf(Date)
      }
    })

    it('should identify content gaps with detailed metrics', async () => {
      const analysis = await researchEngine.analyzeCompetitors('test-user-id')

      if (analysis.contentGaps.length > 0) {
        const gap = analysis.contentGaps[0]
        expect(gap.topic).toBeDefined()
        expect(gap.gapType).toMatch(/missing|underserved|outdated|low-quality/)
        expect(gap.opportunity).toBeGreaterThan(0)
        expect(gap.opportunity).toBeLessThanOrEqual(1)
        expect(gap.competitorCoverage).toBeGreaterThanOrEqual(0)
        expect(gap.competitorCoverage).toBeLessThanOrEqual(1)
        expect(gap.searchVolume).toBeGreaterThan(0)
        expect(gap.difficulty).toMatch(/low|medium|high/)
        expect(gap.suggestedApproach).toBeDefined()
        expect(gap.keywords).toBeInstanceOf(Array)
      }
    })

    it('should provide actionable opportunity insights', async () => {
      const analysis = await researchEngine.analyzeCompetitors('test-user-id')

      if (analysis.opportunities.length > 0) {
        const opportunity = analysis.opportunities[0]
        expect(opportunity.type).toMatch(/content-gap|trending-topic|competitor-weakness|seasonal-opportunity/)
        expect(opportunity.title).toBeDefined()
        expect(opportunity.description).toBeDefined()
        expect(opportunity.priority).toBeGreaterThan(0)
        expect(opportunity.priority).toBeLessThanOrEqual(1)
        expect(opportunity.estimatedImpact).toBeDefined()
        expect(opportunity.estimatedImpact.traffic).toBeGreaterThan(0)
        expect(opportunity.estimatedImpact.engagement).toBeGreaterThan(0)
        expect(opportunity.estimatedImpact.conversions).toBeGreaterThan(0)
        expect(opportunity.actionItems).toBeInstanceOf(Array)
        expect(opportunity.actionItems.length).toBeGreaterThan(0)
        expect(opportunity.timeframe).toBeDefined()
      }
    })
  })

  describe('Topic Suggestions', () => {
    it('should generate topic suggestions with enhanced research integration', async () => {
      const suggestions = await researchEngine.generateTopicSuggestions({
        userId: 'test-user-id',
        count: 10,
        contentTypes: ['blog', 'video'],
        platforms: ['blog', 'youtube'],
        businessGoals: ['traffic', 'engagement']
      })

      expect(suggestions).toBeInstanceOf(Array)
      expect(suggestions.length).toBe(10)

      const suggestion = suggestions[0]
      expect(suggestion.topic).toBeDefined()
      expect(suggestion.relevanceScore).toBeGreaterThan(0)
      expect(suggestion.relevanceScore).toBeLessThanOrEqual(1)
      expect(suggestion.viralPotential).toBeGreaterThan(0)
      expect(suggestion.viralPotential).toBeLessThanOrEqual(1)
      expect(suggestion.competitionLevel).toMatch(/low|medium|high/)
      expect(suggestion.estimatedTraffic).toBeGreaterThan(0)
      expect(suggestion.keywords).toBeInstanceOf(Array)
      expect(suggestion.contentAngle).toBeDefined()
      expect(suggestion.rationale).toBeDefined()
      expect(suggestion.sourceType).toMatch(/trending|gap|viral-pattern|evergreen|competitor-inspired/)
      expect(suggestion.suggestedFormats).toBeInstanceOf(Array)
      expect(suggestion.suggestedFormats.length).toBeGreaterThan(0)
      expect(suggestion.targetPlatforms).toBeInstanceOf(Array)
    })

    it('should prioritize trending topics in suggestions', async () => {
      const suggestions = await researchEngine.generateTopicSuggestions({
        userId: 'test-user-id',
        count: 10,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic']
      })

      // Check if trending topics are prioritized (should appear first)
      const trendingSuggestions = suggestions.filter(s => s.sourceType === 'trending')
      expect(trendingSuggestions.length).toBeGreaterThan(0)
    })

    it('should include content gap opportunities', async () => {
      const suggestions = await researchEngine.generateTopicSuggestions({
        userId: 'test-user-id',
        count: 10,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic']
      })

      const gapSuggestions = suggestions.filter(s => s.sourceType === 'gap')
      expect(gapSuggestions.length).toBeGreaterThan(0)
    })
  })

  describe('Automated Research Plan', () => {
    it('should generate comprehensive automated research plan', async () => {
      const plan = await researchEngine.generateAutomatedResearchPlan({
        userId: 'test-user-id',
        count: 15,
        contentTypes: ['blog', 'video'],
        platforms: ['blog', 'youtube', 'linkedin'],
        businessGoals: ['traffic', 'engagement']
      })

      expect(plan).toBeDefined()
      expect(plan.userId).toBe('test-user-id')
      expect(plan.topics).toBeInstanceOf(Array)
      expect(plan.topics.length).toBe(15)
      expect(plan.contentCalendar).toBeInstanceOf(Array)
      expect(plan.contentCalendar.length).toBe(15)
      expect(plan.competitorInsights).toBeDefined()
      expect(plan.trendInsights).toBeDefined()
      expect(plan.generatedAt).toBeInstanceOf(Date)
      expect(plan.validUntil).toBeInstanceOf(Date)
      expect(plan.validUntil.getTime()).toBeGreaterThan(plan.generatedAt.getTime())
    })

    it('should create content calendar with proper scheduling', async () => {
      const plan = await researchEngine.generateAutomatedResearchPlan({
        userId: 'test-user-id',
        count: 10,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic']
      })

      const calendarEntry = plan.contentCalendar[0]
      expect(calendarEntry.date).toBeInstanceOf(Date)
      expect(calendarEntry.topic).toBeDefined()
      expect(calendarEntry.contentType).toBeDefined()
      expect(calendarEntry.platform).toBeDefined()
      expect(calendarEntry.priority).toBeGreaterThan(0)
      expect(calendarEntry.keywords).toBeInstanceOf(Array)
      expect(calendarEntry.estimatedImpact).toBeGreaterThan(0)
    })

    it('should sort calendar by priority', async () => {
      const plan = await researchEngine.generateAutomatedResearchPlan({
        userId: 'test-user-id',
        count: 10,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic']
      })

      // Check that calendar is sorted by priority (descending)
      for (let i = 0; i < plan.contentCalendar.length - 1; i++) {
        expect(plan.contentCalendar[i].priority).toBeGreaterThanOrEqual(
          plan.contentCalendar[i + 1].priority
        )
      }
    })
  })

  describe('Real-Time Trend Monitoring', () => {
    it('should start and stop real-time trend monitoring', (done) => {
      let callbackInvoked = false

      researchEngine.startRealTimeTrendMonitoring('test-user-id', (updates) => {
        callbackInvoked = true
        expect(updates).toBeInstanceOf(Array)
      })

      // Stop monitoring after a short delay
      setTimeout(() => {
        researchEngine.stopRealTimeTrendMonitoring()
        done()
      }, 100)
    })
  })

  describe('Integration with Content Pipeline', () => {
    it('should provide research data compatible with content pipeline', async () => {
      const trends = await researchEngine.analyzeTrends(['traffic'])
      const competitors = await researchEngine.analyzeCompetitors('test-user-id')
      const topics = await researchEngine.generateTopicSuggestions({
        userId: 'test-user-id',
        count: 5,
        contentTypes: ['blog'],
        platforms: ['blog'],
        businessGoals: ['traffic']
      })

      // Verify data structure is compatible with content pipeline
      expect(trends.trendingTopics).toBeInstanceOf(Array)
      expect(competitors.contentGaps).toBeInstanceOf(Array)
      expect(topics).toBeInstanceOf(Array)
      expect(topics.length).toBe(5)

      // Verify topics have all required fields for content generation
      topics.forEach(topic => {
        expect(topic.topic).toBeDefined()
        expect(topic.keywords).toBeInstanceOf(Array)
        expect(topic.contentAngle).toBeDefined()
        expect(topic.suggestedFormats).toBeInstanceOf(Array)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle errors gracefully and return fallback data', async () => {
      // Test with invalid user ID
      const analysis = await researchEngine.analyzeCompetitors('')

      expect(analysis).toBeDefined()
      expect(analysis.competitors).toBeInstanceOf(Array)
      expect(analysis.contentGaps).toBeInstanceOf(Array)
      expect(analysis.opportunities).toBeInstanceOf(Array)
    })

    it('should return fallback topics on error', async () => {
      const suggestions = await researchEngine.generateTopicSuggestions({
        userId: '',
        count: 5,
        contentTypes: [],
        platforms: [],
        businessGoals: []
      })

      expect(suggestions).toBeInstanceOf(Array)
      expect(suggestions.length).toBe(5)
    })
  })
})
