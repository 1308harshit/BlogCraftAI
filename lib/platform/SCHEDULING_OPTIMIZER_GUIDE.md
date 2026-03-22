# Scheduling Optimizer Guide

## Overview

The Scheduling Optimizer is an intelligent timing and audience activity analysis system that predicts optimal posting times for each platform based on:

- Platform-specific best practices and algorithm requirements
- Historical audience activity patterns
- Performance data from previous posts
- Timezone distribution and global audience reach
- Platform posting frequency limits

## Key Features

### 1. Intelligent Time Prediction

Predicts the optimal posting time for content on each platform by combining:
- Platform algorithm preferences (peak engagement hours)
- Learned audience activity patterns
- Historical performance data
- User-specified constraints (timezone, excluded hours/days)

### 2. Audience Activity Pattern Analysis

Analyzes historical performance data to identify:
- Hourly activity scores (0-100) for each hour of the day
- Daily activity scores for each day of the week
- Peak engagement hours and days
- Timezone distribution of audience
- Performance correlations with timing

### 3. Batch Scheduling Optimization

Generates optimized schedules for multiple content pieces across platforms:
- Respects platform posting frequency limits
- Distributes content across optimal time slots
- Avoids scheduling conflicts
- Maximizes expected reach and engagement
- Provides warnings when constraints cannot be met

### 4. Continuous Learning

Updates audience patterns based on new performance data:
- Maintains rolling 90-day performance history
- Recalculates patterns as new data arrives
- Improves prediction accuracy over time
- Adapts to changing audience behavior

## Usage Examples

### Basic Optimal Time Prediction

```typescript
import { schedulingOptimizer } from '@/lib/platform'

// Get optimal posting time for Twitter
const recommendation = await schedulingOptimizer.predictOptimalTime(
  'twitter',
  'user-123'
)

console.log('Optimal time:', recommendation.optimalTime)
console.log('Confidence:', recommendation.confidence)
console.log('Reasoning:', recommendation.reasoning)
console.log('Expected engagement:', recommendation.expectedEngagement)
console.log('Alternative times:', recommendation.alternativeTimes)
```

### Prediction with Constraints

```typescript
// Get optimal time with specific constraints
const recommendation = await schedulingOptimizer.predictOptimalTime(
  'linkedin',
  'user-123',
  {
    timezone: 'America/New_York',
    startDate: new Date('2024-02-01'),
    excludeHours: [0, 1, 2, 3, 4, 5, 22, 23], // Exclude late night/early morning
    excludeDays: ['Saturday', 'Sunday'] // Business days only
  }
)
```

### Analyze Audience Activity

```typescript
import { HistoricalPerformanceData } from '@/lib/platform'

// Prepare historical performance data
const historicalData: HistoricalPerformanceData[] = [
  {
    contentId: 'post-1',
    platform: 'instagram',
    publishedTime: new Date('2024-01-15T19:00:00Z'),
    metrics: {
      views: 5000,
      likes: 250,
      comments: 50,
      shares: 30,
      clicks: 100,
      engagement: 430,
      reach: 6000,
      impressions: 7500,
      lastUpdated: new Date()
    },
    dayOfWeek: 'Monday',
    hourOfDay: 19,
    timezone: 'UTC'
  },
  // ... more historical data
]

// Analyze audience activity patterns
const pattern = await schedulingOptimizer.analyzeAudienceActivity(
  'user-123',
  'instagram',
  historicalData
)

console.log('Peak hours:', pattern.peakHours)
console.log('Peak days:', pattern.peakDays)
console.log('Hourly activity:', pattern.hourlyActivity)
console.log('Daily activity:', pattern.dailyActivity)
console.log('Timezone distribution:', pattern.timezoneDistribution)
```

### Batch Schedule Generation

```typescript
// Generate schedule for 30 posts across multiple platforms over 30 days
const startDate = new Date()
startDate.setDate(startDate.getDate() + 1)

const endDate = new Date(startDate)
endDate.setDate(endDate.getDate() + 30)

const batchSchedule = await schedulingOptimizer.generateBatchSchedule({
  userId: 'user-123',
  contentCount: 30,
  platforms: ['twitter', 'linkedin', 'instagram', 'facebook'],
  startDate,
  endDate,
  timezone: 'America/New_York',
  avoidWeekends: false
})

console.log('Total slots scheduled:', batchSchedule.totalSlots)
console.log('Utilization rate:', batchSchedule.utilizationRate)
console.log('Expected total reach:', batchSchedule.expectedTotalReach)

// Get schedule for each platform
batchSchedule.schedules.forEach((times, platform) => {
  console.log(`${platform}: ${times.length} posts scheduled`)
  times.forEach(time => {
    console.log(`  - ${time.toISOString()}`)
  })
})

// Check for warnings
if (batchSchedule.warnings.length > 0) {
  console.log('Warnings:', batchSchedule.warnings)
}
```

### Update Audience Pattern with New Data

```typescript
// After publishing content, update the audience pattern
await schedulingOptimizer.updateAudiencePattern(
  'user-123',
  'twitter',
  {
    contentId: 'new-post-1',
    platform: 'twitter',
    publishedTime: new Date('2024-01-20T15:00:00Z'),
    metrics: {
      views: 2000,
      likes: 100,
      comments: 20,
      shares: 15,
      clicks: 50,
      engagement: 185,
      reach: 2500,
      impressions: 3000,
      lastUpdated: new Date()
    },
    dayOfWeek: 'Saturday',
    hourOfDay: 15,
    timezone: 'UTC'
  }
)
```

### Get Platform Scheduling Strategy

```typescript
// Get platform-specific scheduling best practices
const strategy = schedulingOptimizer.getPlatformStrategy('youtube')

console.log('Optimal frequency:', strategy.optimalFrequency)
// { min: 1, max: 7, unit: 'week' }

console.log('Best hours:', strategy.bestHours)
// [14, 15, 16, 17, 18, 19, 20]

console.log('Best days:', strategy.bestDays)
// ['Thursday', 'Friday', 'Saturday', 'Sunday']

console.log('Engagement window:', strategy.engagementWindow)
// 168 (hours)
```

## Integration with MultiPlatformManager

The Scheduling Optimizer is integrated with the MultiPlatformManager for seamless scheduling:

```typescript
import { multiPlatformManager } from '@/lib/platform'

// Get scheduling recommendation for a platform
const recommendation = await multiPlatformManager.getSchedulingRecommendation(
  'twitter',
  'user-123',
  {
    timezone: 'America/Los_Angeles',
    excludeHours: [0, 1, 2, 3, 4, 5]
  }
)

// Generate batch schedule
const batchSchedule = await multiPlatformManager.generateBatchSchedule(
  'user-123',
  20, // 20 posts
  ['twitter', 'linkedin', 'instagram'],
  new Date('2024-02-01'),
  new Date('2024-02-28'),
  {
    timezone: 'America/New_York',
    avoidWeekends: true
  }
)

// Update audience pattern after publishing
await multiPlatformManager.updateAudiencePattern(
  'user-123',
  'instagram',
  'content-123',
  new Date('2024-01-20T19:00:00Z'),
  {
    views: 5000,
    likes: 250,
    comments: 50,
    shares: 30,
    clicks: 100,
    engagement: 430,
    reach: 6000,
    impressions: 7500,
    lastUpdated: new Date()
  }
)

// Get platform scheduling strategy
const strategy = multiPlatformManager.getPlatformSchedulingStrategy('tiktok')
```

## Data Models

### SchedulingRecommendation

```typescript
interface SchedulingRecommendation {
  platform: PlatformType
  optimalTime: Date
  confidence: number // 0-1, based on data availability
  reasoning: string[] // Human-readable explanations
  alternativeTimes: Date[] // Up to 3 alternative times
  expectedEngagement: number // Estimated engagement score
  audienceReach: number // Estimated audience reach
}
```

### AudienceActivityPattern

```typescript
interface AudienceActivityPattern {
  userId: string
  platform: PlatformType
  hourlyActivity: Record<number, number> // hour (0-23) -> score (0-100)
  dailyActivity: Record<string, number> // day name -> score (0-100)
  timezoneDistribution: Record<string, number> // timezone -> percentage
  peakHours: number[] // Top 3 hours with highest activity
  peakDays: string[] // Top 3 days with highest activity
  lastUpdated: Date
}
```

### BatchSchedulingResult

```typescript
interface BatchSchedulingResult {
  schedules: Map<PlatformType, Date[]> // Platform -> scheduled times
  totalSlots: number // Total time slots scheduled
  utilizationRate: number // 0-1, percentage of requested slots filled
  expectedTotalReach: number // Sum of expected reach across all posts
  warnings: string[] // Warnings about scheduling constraints
}
```

### HistoricalPerformanceData

```typescript
interface HistoricalPerformanceData {
  contentId: string
  platform: PlatformType
  publishedTime: Date
  metrics: PerformanceMetrics
  dayOfWeek: string
  hourOfDay: number
  timezone: string
}
```

## Platform-Specific Best Practices

### Twitter/X
- **Best Days**: Tuesday, Wednesday, Thursday
- **Best Hours**: 9, 12, 15, 18
- **Posting Frequency**: 3-15 posts per day
- **Engagement Window**: 24 hours

### LinkedIn
- **Best Days**: Tuesday, Wednesday, Thursday
- **Best Hours**: 8, 10, 12, 17
- **Posting Frequency**: 1-5 posts per day
- **Engagement Window**: 48 hours

### Instagram
- **Best Days**: Monday, Tuesday, Wednesday, Friday
- **Best Hours**: 11, 13, 19, 21
- **Posting Frequency**: 1-3 posts per day
- **Engagement Window**: 48 hours

### YouTube
- **Best Days**: Thursday, Friday, Saturday, Sunday
- **Best Hours**: 14, 15, 16, 17, 18, 19, 20
- **Posting Frequency**: 1-7 posts per week
- **Engagement Window**: 168 hours (7 days)

### TikTok
- **Best Days**: Tuesday, Thursday, Friday
- **Best Hours**: 6, 10, 19, 22
- **Posting Frequency**: 1-4 posts per day
- **Engagement Window**: 24 hours

### Medium
- **Best Days**: Monday, Tuesday, Wednesday
- **Best Hours**: 7, 8, 12, 19
- **Posting Frequency**: 1-3 posts per week
- **Engagement Window**: 168 hours (7 days)

### Facebook
- **Best Days**: Wednesday, Thursday, Friday
- **Best Hours**: 9, 13, 15
- **Posting Frequency**: 1-2 posts per day
- **Engagement Window**: 48 hours

### Blog/Website
- **Best Days**: Monday, Tuesday, Wednesday, Thursday
- **Best Hours**: 7, 10, 14
- **Posting Frequency**: 2-5 posts per week
- **Engagement Window**: 720 hours (30 days)

## Confidence Scoring

The confidence score (0-1) indicates how reliable the prediction is:

- **0.5**: Base confidence (using platform defaults only)
- **+0.2**: Audience pattern data available
- **+0.1**: 10+ historical posts analyzed
- **+0.1**: 30+ historical posts analyzed
- **+0.1**: 100+ historical posts analyzed

**Maximum confidence**: 1.0 (with extensive historical data)

## Best Practices

1. **Start with Platform Defaults**: When you have no historical data, the system uses platform best practices
2. **Collect Performance Data**: Track metrics for every post to improve predictions
3. **Update Patterns Regularly**: Call `updateAudiencePattern()` after each post
4. **Use Batch Scheduling**: For content calendars, use batch scheduling to optimize across multiple posts
5. **Respect Platform Limits**: Don't exceed platform posting frequency recommendations
6. **Consider Timezones**: Specify timezone for global audiences
7. **Monitor Confidence**: Higher confidence scores indicate more reliable predictions
8. **Review Reasoning**: Check the reasoning array to understand why times were chosen
9. **Use Alternative Times**: If optimal time doesn't work, use the provided alternatives
10. **Avoid Over-Posting**: Respect the engagement window for each platform

## Performance Considerations

- **Pattern Analysis**: Requires at least 10 historical posts for meaningful patterns
- **Confidence Threshold**: Aim for 0.7+ confidence for critical posts
- **Data Retention**: Keeps 90 days of performance history per platform
- **Batch Optimization**: More efficient than individual scheduling for multiple posts
- **Real-time Updates**: Patterns update automatically as new data arrives

## Troubleshooting

### Low Confidence Scores
- **Cause**: Insufficient historical data
- **Solution**: Continue posting and tracking performance; confidence will improve over time

### No Optimal Times Found
- **Cause**: Too many constraints (excluded hours/days)
- **Solution**: Relax constraints or extend the date range

### Batch Schedule Warnings
- **Cause**: Cannot schedule all content within constraints
- **Solution**: Extend date range, reduce content count, or adjust platform selection

### Unexpected Scheduling Times
- **Cause**: Audience patterns differ from platform defaults
- **Solution**: Review audience activity patterns; this is expected as the system learns

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 5.2**: Intelligent scheduling with optimal posting times for each platform ✓
- **Requirement 7.3**: Optimal timing prediction for maximum viral potential ✓
- **Property 12**: Optimal Platform Scheduling ✓

The Scheduling Optimizer ensures content is posted at times that maximize engagement and reach based on both platform algorithms and learned audience behavior patterns.
