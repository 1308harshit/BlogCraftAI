# Configuration System Migration Guide

## Overview

All hard-coded values have been centralized into a configuration system. This document explains how to migrate existing code to use the new configuration manager.

## New Configuration Files

1. **`lib/config/defaults.ts`** - All default configuration values
2. **`lib/config/index.ts`** - Configuration manager with environment variable overrides
3. **`.env.local.example`** - Updated with all configuration options

## How to Use Configuration

### Step 1: Import the Config

```typescript
// Import the specific config section you need
import { getAIBrainConfig, getContentQualityConfig } from '../config'

// OR import everything
import { getConfig } from '../config'
```

### Step 2: Replace Hard-Coded Values

**Before:**
```typescript
export class AdaptationSystem {
  private adaptationThresholds = {
    performanceDropThreshold: 0.2,
    feedbackScoreThreshold: 6,
    patternConfidenceThreshold: 0.8
  }
}
```

**After:**
```typescript
import { getAIBrainConfig } from '../config'

const config = getAIBrainConfig()

export class AdaptationSystem {
  private adaptationThresholds = config.adaptation
}
```

## Files That Need Migration

### AI Brain & Learning (Priority: HIGH)
- [ ] `lib/ai-brain/adaptation-system.ts` - Replace adaptationThresholds
- [ ] `lib/ai-brain/learning-engine.ts` - Replace learningThresholds
- [ ] `lib/ai-brain/recommendation-engine.ts` - Use config values

### Content Quality (Priority: HIGH)
- [ ] `lib/automation/content-quality-validator.ts` - Replace threshold parameters
- [ ] `lib/content-dna/content-dna-analyzer.ts` - Use readability/SEO thresholds

### Monetization (Priority: HIGH)
- [ ] `lib/monetization/affiliate-engine.ts` - Replace relevance threshold (0.90)
- [ ] `lib/monetization/cta-generator.ts` - Use CTA config
- [ ] `lib/monetization/funnel-creator.ts` - Use conversion targets

### Viral Prediction (Priority: MEDIUM)
- [ ] `lib/viral-prediction/viral-engine.ts` - Use viral config thresholds

### A/B Testing (Priority: MEDIUM)
- [ ] `lib/ab-testing/ab-test-manager.ts` - Replace test config defaults

### Performance & SLA (Priority: HIGH)
- [ ] `lib/performance/performance-monitor.ts` - Use SLA config
- [ ] `lib/performance/error-handler.ts` - Use circuit breaker config

### Rate Limiting (Priority: HIGH)
- [ ] `lib/api/api-manager.ts` - Use rate limit config
- [ ] `lib/database/redis.ts` - Use Redis config

### Platform-Specific (Priority: MEDIUM)
- [ ] `lib/platform/platform-configs.ts` - Use platform config
- [ ] `lib/content-optimization/platform-optimizer.ts` - Use platform constraints

### Database (Priority: LOW)
- [ ] `lib/database/connection.ts` - Use connection pool config
- [ ] `lib/database/vector-db.ts` - Use vector DB config

## Migration Pattern Examples

### Example 1: Simple Threshold Replacement

**Before:**
```typescript
const qualityThreshold = 0.7
if (score >= qualityThreshold) {
  // ...
}
```

**After:**
```typescript
import { getContentQualityConfig } from '../config'

const config = getContentQualityConfig()
if (score >= config.defaultThreshold) {
  // ...
}
```

### Example 2: Platform-Specific Config

**Before:**
```typescript
const twitterMaxLength = 280
const linkedinMaxLength = 3000
```

**After:**
```typescript
import { getPlatformConfig } from '../config'

const twitterConfig = getPlatformConfig('twitter')
const linkedinConfig = getPlatformConfig('linkedin')

// Use: twitterConfig.maxLength, linkedinConfig.maxLength
```

### Example 3: Rate Limiting

**Before:**
```typescript
const rateLimit = 1000
const windowSeconds = 60
```

**After:**
```typescript
import { getRateLimitingConfig } from '../config'

const config = getRateLimitingConfig()
const rateLimit = config.api.requestsPerMinute
const windowSeconds = config.api.windowSeconds
```

## Environment Variables

All configuration can be overridden with environment variables. Add to your `.env.local`:

```bash
# AI Brain Configuration
AI_BRAIN_PERFORMANCE_THRESHOLD=0.2
AI_BRAIN_PATTERN_CONFIDENCE=0.8
AI_LEARNING_CONFIDENCE=0.7

# Content Quality
CONTENT_QUALITY_THRESHOLD=0.7
MIN_READABILITY_SCORE=60
MIN_SEO_SCORE=50

# Viral Prediction
VIRAL_TARGET_ACCURACY=0.85
VIRAL_SCORE_THRESHOLD=0.7

# Monetization
AFFILIATE_RELEVANCE_THRESHOLD=0.90
REVENUE_PER_CLICK=0.50

# A/B Testing
AB_TEST_MIN_SAMPLE_SIZE=100
AB_TEST_CONFIDENCE_LEVEL=0.95

# Performance
MAX_RESPONSE_TIME_MS=2000
CIRCUIT_BREAKER_THRESHOLD=5

# Rate Limiting
API_RATE_LIMIT=1000
CONTENT_GEN_RATE_LIMIT=100

# Database
REDIS_DEFAULT_TTL=3600
DB_CONNECTION_POOL_SIZE=20

# Security
SESSION_TIMEOUT_MS=3600000
MAX_LOGIN_ATTEMPTS=5
```

## Runtime Configuration Updates

For admin dashboard to update config at runtime:

```typescript
import { configManager } from '../config'

// Update a specific value
configManager.updateConfig('contentQuality.defaultThreshold', 0.8)

// Get current config
const currentConfig = configManager.getConfig()

// Reset to defaults
configManager.resetToDefaults()
```

## Benefits

1. **Single Source of Truth** - All configuration in one place
2. **Environment-Specific** - Different values for dev/staging/prod
3. **Runtime Updates** - Admin can adjust without code changes
4. **Type-Safe** - TypeScript ensures correct usage
5. **Easy Testing** - Mock config for unit tests
6. **Documentation** - All values documented with comments

## Testing

When writing tests, you can mock the configuration:

```typescript
import { configManager } from '../config'

beforeEach(() => {
  // Set test-specific config
  configManager.updateConfig('aiBrain.adaptation.performanceDropThreshold', 0.5)
})

afterEach(() => {
  // Reset to defaults
  configManager.resetToDefaults()
})
```

## Next Steps

1. Copy `.env.local.example` to `.env.local`
2. Adjust values for your environment
3. Migrate modules one at a time (start with high priority)
4. Test thoroughly after each migration
5. Create admin dashboard UI for runtime config updates

## Questions?

If you encounter issues during migration:
1. Check the default value in `lib/config/defaults.ts`
2. Verify environment variable name in `.env.local.example`
3. Ensure you're importing from `'../config'` correctly
4. Check TypeScript types match expected config structure
