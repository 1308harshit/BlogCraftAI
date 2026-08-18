# Remaining API Routes to Fix

This document lists the API routes that still need authentication added. The critical ones (`/api/generate`, `/api/ai-brain`, `/api/research`, `/api/revenue/dashboard`) have been fixed.

## High Priority Routes (Need Auth Immediately)

### 1. `/app/api/content-remix/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

```typescript
// Add import
import { requireUser } from '@/lib/auth/require-user'

// In POST function, add at start:
const authed = await requireUser()
if (!authed.ok) return authed.response
```

### 2. `/app/api/competitor-analysis/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 3. `/app/api/export/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 4. `/app/api/seo-score/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 5. `/app/api/seo/analyze/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 6. `/app/api/voice-to-blog/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 7. `/app/api/ai-images/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 8. `/app/api/ai/transform/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of POST handler

### 9. `/app/api/platform/performance/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of both GET and POST handlers

### 10. `/app/api/monetization/cta/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of GET and POST handlers

### 11. `/app/api/monetization/funnel/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of GET and POST handlers

### 12. `/app/api/monetization/performance/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of GET and POST handlers

### 13. `/app/api/automation/research/route.ts`
**Status:** UNPROTECTED  
**Fix:** Add `requireUser()` at start of GET and POST handlers

## Fixed Routes ✅

- ✅ `/api/generate/route.ts` - Fixed (removed userId from request, added requireUser)
- ✅ `/api/ai-brain/route.ts` - Fixed (added requireUser)
- ✅ `/api/research/route.ts` - Fixed (added requireUser)
- ✅ `/api/revenue/dashboard/route.ts` - Fixed (added requireUser, removed userId from query params)

## Already Protected Routes ✅

- ✅ `/api/workspace/**` - Already uses requireUser
- ✅ `/api/automations/**` - Already uses requireUser
- ✅ `/api/razorpay/**` - Already uses requireUser
- ✅ `/api/projects/**` - Already uses requireUser
- ✅ `/api/images/save` - Already uses requireUser
- ✅ `/api/integrations/wordpress/publish` - Already uses requireUser
- ✅ `/api/blog/pipeline` - Already uses requireUser
- ✅ `/api/ai/generate` - Already uses requireUser (BlogCraftAI folder)

## Public Routes (No Auth Needed)

- ✅ `/api/health` - Health check endpoint
- ✅ `/api/webhooks/**` - External webhooks (verified by signature)

## Next Steps

1. Fix the remaining 13 unprotected routes listed above
2. Run the RLS migration script in Supabase
3. Test with multiple user accounts to verify isolation
4. Update security audit report with fixes
5. Deploy to production

## Standard Auth Pattern

For all routes that need protection, use this pattern:

```typescript
import { requireUser } from '@/lib/auth/require-user'

export async function POST(request: NextRequest) {
  // Add authentication check at the very start
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  // Now proceed with the rest of the logic
  // Use authed.user.id for any user-specific operations
  // Use authed.supabase for database queries (RLS will apply)
  
  const body = await request.json()
  // ... rest of implementation
}
```

## Testing Checklist

After fixing all routes:

- [ ] Unauthenticated request to each route returns 401
- [ ] Authenticated request works correctly
- [ ] User can only access their own data
- [ ] No regression in existing functionality
- [ ] Rate limits apply to correct user
- [ ] Usage tracking uses authenticated user ID
