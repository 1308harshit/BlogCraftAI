# Research Engine - Automated Research and Trend Analysis

## Overview

The Research Engine provides sophisticated automated research capabilities including competitor analysis, content gap identification, trending topic detection, and automated topic planning. It integrates seamlessly with the content pipeline to enable data-driven content strategy.

## Features

### 1. Real-Time Trend Analysis
- **Trending Topics Detection**: Identifies topics gaining momentum across platforms
- **Real-Time Updates**: Monitors trends with velocity tracking and peak time prediction
- **Seasonal Trends**: Analyzes seasonal patterns and opportunities
- **Industry Trends**: Tracks industry-specific developments
- **Viral Patterns**: Identifies content patterns with high viral potential

### 2. Competitor Analysis with Performance Tracking
- **Competitor Profiles**: Detailed profiles with content frequency, engagement rates, and traffic estimates
- **Performance Tracking**: Monitors competitor performance trends over time
- **Top Content Analysis**: Identifies competitor's best-performing content
- **Strengths & Weaknesses**: Analyzes competitor capabilities and gaps
- **Performance Benchmarking**: Compares performance against industry averages

### 3. Content Gap Identification
- **Gap Types**: Identifies missing, underserved, outdated, and low-quality content opportunities
- **Opportunity Scoring**: Rates gaps by opportunity potential (0-1 scale)
- **Competition Analysis**: Measures competitor coverage for each gap
- **Search Volume Estimates**: Provides traffic potential for each gap
- **Difficulty Assessment**: Rates content difficulty (low/medium/high)
- **Actionable Recommendations**: Suggests specific approaches for each gap

### 4. Automated Topic Suggestion
- **Multi-Source Topics**: Generates topics from trends, gaps, viral patterns, and evergreen content
- **Priority Ranking**: Sorts topics by relevance, viral potential, and opportunity
- **Format Suggestions**: Recommends optimal content formats for each topic
- **Platform Targeting**: Identifies best platforms for each topic
- **Keyword Integration**: Provides relevant keywords for SEO optimization
- **Rationale Explanation**: Explains why each topic is recommended

### 5. Automated Research Plans
- **Content Calendar**: Generates scheduled content calendar with priorities
- **Comprehensive Insights**: Combines trend and competitor analysis
- **Impact Estimation**: Predicts traffic, engagement, and conversion impact
- **Validity Period**: Plans remain valid for 7 days before refresh needed

## Usage Examples

### Basic Trend Analysis

```typescript
import { researchEngine } from '@/lib/automation/research-engine'

// Analyze current trends
const trends = await researchEngine.analyzeTrends(['traffic', 'engagement'])

console.log('Trending Topics:', trends.trendingTopics)
console.log('Trending Keywords:', trends.trendingKeywords)
console.log('Viral Patterns:', trends.viralPatterns)
console.log('Real-Time Updates:', trends.realTimeUpdates)
```

### Competitor Analysis

```typescript
// Analyze competitors
const analysis = await researchEngine.analyzeCompetitors('user-id')

// Review competitor profiles
analysis.competitors.forEach(competitor => {
  console.log(`${competitor.name}:`)
  console.log(`  Content Frequency: ${competitor.contentFrequency} posts/week`)
  console.log(`  Avg Engagement: ${(competitor.avgEngagementRate * 100).toFixed(2)}%`)
  console.log(`  Strengths: ${competitor.strengths.join(', ')}`)
  console.log(`  Weaknesses: ${competitor.weaknesses.join(', ')}`)
})

// Review content gaps
analysis.contentGaps.forEach(gap => {
  console.log(`Gap: ${gap.topic}`)
  console.log(`  Type: ${gap.gapType}`)
  console.log(`  Opportunity: ${(gap.opportunity * 100).toFixed(0)}%`)
  console.log(`  Approach: ${gap.suggestedApproach}`)
})
```

### Topic Suggestions

```typescript
// Generate topic suggestions
const topics = await researchEngine.generateTopicSuggestions({
  userId: 'user-id',
  count: 10,
  contentTypes: ['blog', 'video'],
  platforms: ['blog', 'youtube', 'linkedin'],
  businessGoals: ['traffic', 'engagement']
})

topics.forEach(topic => {
  console.log(`Topic: ${topic.topic}`)
  console.log(`  Relevance: ${(topic.relevanceScore * 100).toFixed(0)}%`)
  console.log(`  Viral Potential: ${(topic.viralPotential * 100).toFixed(0)}%`)
  console.log(`  Competition: ${topic.competitionLevel}`)
  console.log(`  Est. Traffic: ${topic.estimatedTraffic}`)
  console.log(`  Source: ${topic.sourceType}`)
  console.log(`  Formats: ${topic.suggestedFormats.join(', ')}`)
  console.log(`  Rationale: ${topic.rationale}`)
})
```

### Automated Research Plan

```typescript
// Generate comprehensive research plan
const plan = await researchEngine.generateAutomatedResearchPlan({
  userId: 'user-id',
  count: 30, // 30 days of content
  contentTypes: ['blog', 'video', 'social'],
  platforms: ['blog', 'youtube', 'linkedin', 'twitter'],
  businessGoals: ['traffic', 'engagement', 'conversions']
})

console.log(`Generated ${plan.topics.length} topics`)
console.log(`Content calendar: ${plan.contentCalendar.length} entries`)
console.log(`Valid until: ${plan.validUntil.toLocaleDateString()}`)

// Review content calendar
plan.contentCalendar.forEach(entry => {
  console.log(`${entry.date.toLocaleDateString()}: ${entry.topic}`)
  console.log(`  Type: ${entry.contentType}`)
  console.log(`  Platform: ${entry.platform}`)
  console.log(`  Priority: ${(entry.priority * 100).toFixed(0)}%`)
  console.log(`  Est. Impact: ${entry.estimatedImpact} visitors`)
})
```

### Real-Time Trend Monitoring

```typescript
// Start monitoring trends in real-time
researchEngine.startRealTimeTrendMonitoring('user-id', (updates) => {
  console.log('New trending topics detected:')
  updates.forEach(update => {
    console.log(`  ${update.topic}`)
    console.log(`    Velocity: ${(update.trendVelocity * 100).toFixed(0)}%`)
    console.log(`    Peak in: ${Math.round((update.peakTime.getTime() - Date.now()) / (60 * 60 * 1000))} hours`)
    console.log(`    Platforms: ${update.platforms.join(', ')}`)
  })
})

// Stop monitoring when done
researchEngine.stopRealTimeTrendMonitoring()
```

### Integration with Content Pipeline

```typescript
import { contentPipeline } from '@/lib/automation/content-pipeline'

// Generate content with research integration
const result = await contentPipeline.execute({
  userId: 'user-id',
  daysToGenerate: 30,
  contentTypes: ['blog', 'video'],
  platforms: ['blog', 'youtube'],
  businessGoals: ['traffic', 'engagement'],
  qualityThreshold: 0.8,
  includeResearch: true, // Enable research phase
  includeOptimization: true,
  includeScheduling: true
})

console.log(`Generated ${result.contentGenerated} pieces in ${result.timeElapsed}ms`)
console.log(`Average quality: ${(result.qualityScore * 100).toFixed(0)}%`)
```

## API Endpoints

### POST /api/automation/research

Generate automated research data.

**Request Body:**
```json
{
  "userId": "user-id",
  "action": "generate-plan",
  "count": 30,
  "contentTypes": ["blog", "video"],
  "platforms": ["blog", "youtube", "linkedin"],
  "businessGoals": ["traffic", "engagement"]
}
```

**Actions:**
- `analyze-trends`: Analyze current trends
- `analyze-competitors`: Analyze competitors
- `generate-topics`: Generate topic suggestions
- `generate-plan`: Generate complete research plan with calendar

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-id",
    "topics": [...],
    "contentCalendar": [...],
    "competitorInsights": {...},
    "trendInsights": {...},
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "validUntil": "2024-01-08T00:00:00.000Z"
  }
}
```

### GET /api/automation/research

Get cached research data.

**Query Parameters:**
- `userId`: User ID (required)
- `action`: `trends` or `competitors` (required)
- `businessGoals`: Comma-separated list (for trends action)

**Example:**
```
GET /api/automation/research?userId=user-id&action=trends&businessGoals=traffic,engagement
```

## Data Structures

### TrendAnalysis
```typescript
interface TrendAnalysis {
  trendingTopics: string[]
  trendingKeywords: string[]
  viralPatterns: string[]
  seasonalTrends: string[]
  industryTrends: string[]
  confidence: number
  analyzedAt: Date
  realTimeUpdates?: RealTimeTrendUpdate[]
}
```

### CompetitorAnalysis
```typescript
interface CompetitorAnalysis {
  competitors: CompetitorProfile[]
  topPerformingContent: CompetitorContent[]
  contentGaps: ContentGap[]
  opportunities: OpportunityInsight[]
  averagePerformance: number
  performanceTrends: PerformanceTrend[]
  analyzedAt: Date
}
```

### ContentGap
```typescript
interface ContentGap {
  topic: string
  gapType: 'missing' | 'underserved' | 'outdated' | 'low-quality'
  opportunity: number // 0-1 score
  competitorCoverage: number // 0-1 score
  searchVolume: number
  difficulty: 'low' | 'medium' | 'high'
  suggestedApproach: string
  keywords: string[]
}
```

### TopicSuggestion
```typescript
interface TopicSuggestion {
  topic: string
  relevanceScore: number
  viralPotential: number
  competitionLevel: 'low' | 'medium' | 'high'
  estimatedTraffic: number
  keywords: string[]
  contentAngle: string
  rationale: string
  sourceType: 'trending' | 'gap' | 'viral-pattern' | 'evergreen' | 'competitor-inspired'
  suggestedFormats: string[]
  targetPlatforms: string[]
}
```

## Best Practices

### 1. Regular Research Updates
- Run trend analysis daily to catch emerging topics
- Analyze competitors weekly to track performance changes
- Refresh research plans every 7 days

### 2. Prioritization Strategy
- Focus on high-opportunity, low-competition gaps first
- Capitalize on real-time trending topics within 24 hours
- Balance trending content with evergreen topics (70/30 split)

### 3. Content Calendar Management
- Schedule high-priority topics during peak engagement times
- Distribute content types evenly across the calendar
- Leave buffer time for trending topic opportunities

### 4. Competitor Monitoring
- Track top 3-5 competitors consistently
- Analyze their weaknesses for differentiation opportunities
- Learn from their successful content patterns

### 5. Performance Tracking
- Monitor which research-driven topics perform best
- Adjust research parameters based on performance data
- Feed performance data back to AI brain for learning

## Integration Points

### Content Pipeline
The research engine integrates with the content pipeline to provide:
- Topic suggestions for content generation
- Keyword data for SEO optimization
- Format recommendations for content types
- Platform targeting for distribution

### AI Brain
Research data feeds into the AI brain for:
- Learning successful content patterns
- Personalizing topic recommendations
- Adapting to user preferences
- Improving prediction accuracy

### Viral Prediction Engine
Research insights enhance viral prediction by:
- Identifying trending topics with viral potential
- Analyzing successful viral patterns
- Timing content for maximum impact
- Optimizing for platform algorithms

## Performance Considerations

### Caching
- Trend analysis cached for 1 hour
- Competitor analysis cached for 1 hour
- Cache invalidation on manual refresh

### Real-Time Monitoring
- Checks for trends every 15 minutes
- Minimal resource usage when idle
- Automatic cleanup on stop

### API Rate Limits
- Trend analysis: 100 requests/hour per user
- Competitor analysis: 50 requests/hour per user
- Topic generation: 200 requests/hour per user

## Future Enhancements

1. **External API Integration**
   - Google Trends API for real trend data
   - Twitter API for social trends
   - Reddit API for community insights
   - SEO tools for keyword data

2. **Machine Learning**
   - Predictive trend modeling
   - Automated gap detection
   - Performance forecasting
   - Personalized recommendations

3. **Advanced Analytics**
   - Sentiment analysis
   - Topic clustering
   - Competitive positioning
   - Market share analysis

4. **Collaboration Features**
   - Team research sharing
   - Collaborative topic planning
   - Research insights dashboard
   - Automated reporting

## Support

For questions or issues with the Research Engine:
- Check the test files in `__tests__/automation/research-engine.test.ts`
- Review the implementation in `lib/automation/research-engine.ts`
- Consult the API documentation above
- Contact the development team for advanced use cases
