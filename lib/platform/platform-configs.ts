// Platform Configuration Database
// Defines constraints, algorithms, and best practices for each platform

import { PlatformConfig, PlatformType } from './types'

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  twitter: {
    name: 'twitter',
    displayName: 'Twitter/X',
    constraints: {
      maxLength: 280,
      maxHashtags: 2,
      maxMentions: 10,
      supportedFormats: ['text', 'image', 'video', 'thread'],
      imageRequirements: {
        minWidth: 600,
        minHeight: 335,
        maxWidth: 4096,
        maxHeight: 4096,
        aspectRatios: ['16:9', '1:1', '4:5'],
        maxFileSize: 5,
        formats: ['jpg', 'png', 'gif', 'webp']
      },
      videoRequirements: {
        minDuration: 0.5,
        maxDuration: 140,
        maxFileSize: 512,
        formats: ['mp4', 'mov'],
        aspectRatios: ['16:9', '1:1', '9:16']
      },
      linkHandling: 'inline'
    },
    algorithm: {
      prioritizes: ['engagement', 'recency', 'relevance', 'media', 'threads'],
      penalizes: ['external_links', 'excessive_hashtags', 'spam'],
      optimalPostingFrequency: {
        min: 3,
        max: 15,
        unit: 'day'
      },
      engagementWindow: 24,
      viralityFactors: ['retweets', 'quote_tweets', 'replies', 'likes', 'bookmarks']
    },
    optimalTiming: {
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      bestHours: [9, 12, 15, 18],
      timezone: 'UTC',
      audienceActivityPeaks: [9, 12, 18]
    },
    supportedFormats: ['text', 'image', 'video', 'thread']
  },

  linkedin: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    constraints: {
      maxLength: 3000,
      maxHashtags: 5,
      supportedFormats: ['text', 'image', 'video', 'article', 'carousel'],
      imageRequirements: {
        minWidth: 1200,
        minHeight: 627,
        maxWidth: 7680,
        maxHeight: 4320,
        aspectRatios: ['1.91:1', '1:1', '4:5'],
        maxFileSize: 10,
        formats: ['jpg', 'png']
      },
      videoRequirements: {
        minDuration: 3,
        maxDuration: 600,
        maxFileSize: 5120,
        formats: ['mp4', 'mov', 'avi'],
        aspectRatios: ['16:9', '1:1', '9:16', '4:5']
      },
      linkHandling: 'inline'
    },
    algorithm: {
      prioritizes: ['professional_content', 'engagement', 'dwell_time', 'expertise', 'thought_leadership'],
      penalizes: ['clickbait', 'personal_content', 'excessive_self_promotion'],
      optimalPostingFrequency: {
        min: 1,
        max: 5,
        unit: 'day'
      },
      engagementWindow: 48,
      viralityFactors: ['comments', 'shares', 'reactions', 'profile_views']
    },
    optimalTiming: {
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      bestHours: [8, 10, 12, 17],
      timezone: 'UTC',
      audienceActivityPeaks: [8, 12, 17]
    },
    supportedFormats: ['text', 'image', 'video', 'article', 'carousel']
  },

  instagram: {
    name: 'instagram',
    displayName: 'Instagram',
    constraints: {
      maxLength: 2200,
      maxHashtags: 30,
      supportedFormats: ['image', 'video', 'carousel', 'story', 'reel'],
      imageRequirements: {
        minWidth: 1080,
        minHeight: 566,
        maxWidth: 1080,
        maxHeight: 1350,
        aspectRatios: ['1:1', '4:5', '9:16'],
        maxFileSize: 30,
        formats: ['jpg', 'png']
      },
      videoRequirements: {
        minDuration: 3,
        maxDuration: 90,
        maxFileSize: 4096,
        formats: ['mp4', 'mov'],
        aspectRatios: ['1:1', '4:5', '9:16']
      },
      linkHandling: 'bio'
    },
    algorithm: {
      prioritizes: ['engagement', 'saves', 'shares', 'watch_time', 'relevance', 'timeliness'],
      penalizes: ['low_quality', 'reposted_content', 'watermarks'],
      optimalPostingFrequency: {
        min: 1,
        max: 3,
        unit: 'day'
      },
      engagementWindow: 48,
      viralityFactors: ['likes', 'comments', 'saves', 'shares', 'reach']
    },
    optimalTiming: {
      bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      bestHours: [11, 13, 19, 21],
      timezone: 'UTC',
      audienceActivityPeaks: [11, 19, 21]
    },
    supportedFormats: ['image', 'video', 'carousel', 'story', 'reel']
  },

  youtube: {
    name: 'youtube',
    displayName: 'YouTube',
    constraints: {
      maxLength: 5000,
      maxHashtags: 15,
      supportedFormats: ['video'],
      videoRequirements: {
        minDuration: 60,
        maxDuration: 43200,
        maxFileSize: 256000,
        formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
        aspectRatios: ['16:9', '9:16', '1:1']
      },
      linkHandling: 'inline'
    },
    algorithm: {
      prioritizes: ['watch_time', 'ctr', 'engagement', 'session_time', 'viewer_satisfaction'],
      penalizes: ['clickbait', 'misleading_thumbnails', 'low_retention'],
      optimalPostingFrequency: {
        min: 1,
        max: 7,
        unit: 'week'
      },
      engagementWindow: 168,
      viralityFactors: ['views', 'watch_time', 'likes', 'comments', 'shares', 'subscribers']
    },
    optimalTiming: {
      bestDays: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
      bestHours: [14, 15, 16, 17, 18, 19, 20],
      timezone: 'UTC',
      audienceActivityPeaks: [15, 18, 20]
    },
    supportedFormats: ['video']
  },

  tiktok: {
    name: 'tiktok',
    displayName: 'TikTok',
    constraints: {
      maxLength: 2200,
      maxHashtags: 10,
      supportedFormats: ['video'],
      videoRequirements: {
        minDuration: 3,
        maxDuration: 600,
        maxFileSize: 287,
        formats: ['mp4', 'mov', 'webm'],
        aspectRatios: ['9:16', '1:1']
      },
      linkHandling: 'bio'
    },
    algorithm: {
      prioritizes: ['completion_rate', 'rewatches', 'engagement', 'trending_sounds', 'relevance'],
      penalizes: ['low_quality', 'watermarks', 'duplicate_content'],
      optimalPostingFrequency: {
        min: 1,
        max: 4,
        unit: 'day'
      },
      engagementWindow: 24,
      viralityFactors: ['views', 'likes', 'comments', 'shares', 'completion_rate', 'rewatches']
    },
    optimalTiming: {
      bestDays: ['Tuesday', 'Thursday', 'Friday'],
      bestHours: [6, 10, 19, 22],
      timezone: 'UTC',
      audienceActivityPeaks: [10, 19, 22]
    },
    supportedFormats: ['video']
  },

  medium: {
    name: 'medium',
    displayName: 'Medium',
    constraints: {
      maxLength: 100000,
      minLength: 300,
      maxHashtags: 5,
      supportedFormats: ['article', 'text', 'image'],
      imageRequirements: {
        minWidth: 1400,
        minHeight: 700,
        maxWidth: 10000,
        maxHeight: 10000,
        aspectRatios: ['2:1', '16:9', '1:1'],
        maxFileSize: 25,
        formats: ['jpg', 'png', 'gif']
      },
      linkHandling: 'inline'
    },
    algorithm: {
      prioritizes: ['reading_time', 'claps', 'highlights', 'responses', 'quality_content'],
      penalizes: ['clickbait', 'thin_content', 'excessive_self_promotion'],
      optimalPostingFrequency: {
        min: 1,
        max: 3,
        unit: 'week'
      },
      engagementWindow: 168,
      viralityFactors: ['claps', 'responses', 'highlights', 'reading_time', 'shares']
    },
    optimalTiming: {
      bestDays: ['Monday', 'Tuesday', 'Wednesday'],
      bestHours: [7, 8, 12, 19],
      timezone: 'UTC',
      audienceActivityPeaks: [7, 12, 19]
    },
    supportedFormats: ['article', 'text', 'image']
  },

  facebook: {
    name: 'facebook',
    displayName: 'Facebook',
    constraints: {
      maxLength: 63206,
      maxHashtags: 3,
      supportedFormats: ['text', 'image', 'video', 'carousel'],
      imageRequirements: {
        minWidth: 1200,
        minHeight: 630,
        maxWidth: 8192,
        maxHeight: 8192,
        aspectRatios: ['1.91:1', '1:1', '4:5'],
        maxFileSize: 10,
        formats: ['jpg', 'png', 'gif']
      },
      videoRequirements: {
        minDuration: 1,
        maxDuration: 240,
        maxFileSize: 4096,
        formats: ['mp4', 'mov'],
        aspectRatios: ['16:9', '1:1', '9:16', '4:5']
      },
      linkHandling: 'inline'
    },
    algorithm: {
      prioritizes: ['meaningful_interactions', 'engagement', 'video_watch_time', 'shares'],
      penalizes: ['clickbait', 'engagement_bait', 'low_quality'],
      optimalPostingFrequency: {
        min: 1,
        max: 2,
        unit: 'day'
      },
      engagementWindow: 48,
      viralityFactors: ['reactions', 'comments', 'shares', 'clicks']
    },
    optimalTiming: {
      bestDays: ['Wednesday', 'Thursday', 'Friday'],
      bestHours: [9, 13, 15],
      timezone: 'UTC',
      audienceActivityPeaks: [9, 13, 15]
    },
    supportedFormats: ['text', 'image', 'video', 'carousel']
  },

  blog: {
    name: 'blog',
    displayName: 'Blog/Website',
    constraints: {
      maxLength: 100000,
      minLength: 300,
      maxHashtags: 10,
      supportedFormats: ['article', 'text', 'image', 'video'],
      imageRequirements: {
        minWidth: 1200,
        minHeight: 630,
        maxWidth: 10000,
        maxHeight: 10000,
        aspectRatios: ['16:9', '2:1', '1:1'],
        maxFileSize: 10,
        formats: ['jpg', 'png', 'webp', 'gif']
      },
      linkHandling: 'inline'
    },
    algorithm: {
      prioritizes: ['seo', 'content_quality', 'reading_time', 'backlinks', 'freshness'],
      penalizes: ['thin_content', 'keyword_stuffing', 'duplicate_content'],
      optimalPostingFrequency: {
        min: 2,
        max: 5,
        unit: 'week'
      },
      engagementWindow: 720,
      viralityFactors: ['pageviews', 'time_on_page', 'social_shares', 'backlinks']
    },
    optimalTiming: {
      bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      bestHours: [7, 10, 14],
      timezone: 'UTC',
      audienceActivityPeaks: [7, 10, 14]
    },
    supportedFormats: ['article', 'text', 'image', 'video']
  }
}

export function getPlatformConfig(platform: PlatformType): PlatformConfig {
  return PLATFORM_CONFIGS[platform]
}

export function getAllPlatforms(): PlatformType[] {
  return Object.keys(PLATFORM_CONFIGS) as PlatformType[]
}

export function getPlatformsByFormat(format: string): PlatformType[] {
  return getAllPlatforms().filter(platform => 
    PLATFORM_CONFIGS[platform].supportedFormats.includes(format as any)
  )
}
