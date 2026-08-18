# BlogCraft AI Multi-Tenancy Security Audit Report

**Date:** 2025-06-XX  
**Auditor:** Senior Software Engineer (10+ years experience)  
**Status:** ⚠️ CRITICAL ISSUES FOUND

---

## Executive Summary

BlogCraft AI has **CRITICAL security vulnerabilities** that allow unauthorized access to user data. The application lacks proper Row Level Security (RLS) policies, has unprotected API routes, and accepts user-controlled identifiers without validation.

**Risk Level:** 🔴 **HIGH** - Data breach possible  
**User Impact:** Users can potentially access other users' data  
**Immediate Action Required:** YES

---

## 1. Database Layer Security (RLS Policies)

### ❌ CRITICAL ISSUE: Ineffective RLS Policies

**Location:** `supabase/migrations/002_usage_and_rls.sql`

```sql
-- CURRENT (BROKEN):
create policy "Users read own profile" on profiles for select using (true);
create policy "Users read own projects" on projects for select using (true);
create policy "Users read own brand memory" on brand_memory for select using (true);
```

**Problem:** `using (true)` means **ANY authenticated user can read ALL rows** from these tables. This completely defeats multi-tenancy.

**Impact:**
- ✅ Database queries in code use `.eq('user_id', userId)` filters (GOOD)
- ❌ BUT RLS policies don't enforce user_id isolation (CRITICAL)
- ❌ A malicious user can bypass application code and query Supabase directly
- ❌ Any API route that forgets to add `.eq('user_id', ...)` will leak data

**Example Attack:**
```typescript
// Malicious user can call Supabase directly from browser:
const supabase = createClient(ANON_KEY)
const { data } = await supabase.auth.getUser() // Get their own session
const { data: allProjects } = await supabase
  .from('projects')
  .select('*') // Gets ALL projects from ALL users (because RLS policy is "true")
```

### ✅ CORRECT RLS POLICIES (What They Should Be):

```sql
-- profiles: Users can only see their own profile
create policy "Users read own profile" on profiles 
  for select 
  using (auth.uid()::text = clerk_user_id);

create policy "Users update own profile" on profiles 
  for update 
  using (auth.uid()::text = clerk_user_id);

-- projects: Users can only see their own projects
create policy "Users read own projects" on projects 
  for select 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users insert own projects" on projects 
  for insert 
  with check (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users update own projects" on projects 
  for update 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users delete own projects" on projects 
  for delete 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

-- brand_memory: Users can only see their own brand memory
create policy "Users read own brand_memory" on brand_memory 
  for select 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users insert own brand_memory" on brand_memory 
  for insert 
  with check (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users update own brand_memory" on brand_memory 
  for update 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users delete own brand_memory" on brand_memory 
  for delete 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

-- usage_logs: Users can only see their own usage logs
create policy "Users read own usage_logs" on usage_logs 
  for select 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

-- automations: Users can only see their own automations
create policy "Users read own automations" on automations 
  for select 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users insert own automations" on automations 
  for insert 
  with check (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users update own automations" on automations 
  for update 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));

create policy "Users delete own automations" on automations 
  for delete 
  using (user_id in (select id from profiles where clerk_user_id = auth.uid()::text));
```

### Missing RLS Policies for Additional Tables

The following tables are missing entirely from RLS configuration:
- `workspaces` - No RLS enabled
- `workspace_members` - No RLS enabled
- `workspace_invites` - No RLS enabled
- `project_comments` (if exists) - No RLS enabled

---

## 2. API Route Security

### ✅ PROTECTED Routes (Using `requireUser`)

These routes correctly use authentication:
- `/api/workspace/*` - Protected ✅
- `/api/automations/*` - Protected ✅
- `/api/razorpay/*` - Protected ✅
- `/api/projects/comments` - Protected ✅
- `/api/images/save` - Protected ✅
- `/api/integrations/wordpress/publish` - Protected ✅
- `/api/blog/pipeline` - Protected ✅
- `/api/ai/generate` - Protected ✅

### ❌ UNPROTECTED Routes (No Authentication)

**High Risk - User Data Leakage:**

1. **`/api/generate` - NO AUTH** 🔴 CRITICAL
   - Accepts `userId` from request body (user-controlled)
   - Anyone can pass any userId and generate content under another user's account
   - Usage limits can be bypassed by passing different userIds
   ```typescript
   const { topic, keywords, userId } = await request.json() // userId is user-controlled!
   if (userId) {
     await UsageLimitService.canGenerateArticle(userId) // Checking wrong user's limit
     await UsageLimitService.incrementUsage(userId) // Incrementing wrong user's usage
   }
   ```

2. **`/api/research` - NO AUTH** 🔴 CRITICAL
   - No user validation at all
   - Anyone can use the research API
   - No rate limiting per user

3. **`/api/revenue/dashboard` - BROKEN AUTH** 🔴 CRITICAL
   ```typescript
   const userId = searchParams.get('userId') // User-controlled from URL!
   const hasAccess = await checkRevenueDashboardAccess(userId) // Checking user-provided ID
   ```
   - User provides their own userId in URL
   - Mock access check that anyone can bypass
   - Revenue data for all users is accessible

4. **`/api/ai-brain` - NO AUTH** 🔴 CRITICAL
   - No authentication required
   - Anyone can use AI features
   - No user context or isolation

5. **`/api/competitor-analysis` - NO AUTH** 🔴
6. **`/api/content-remix` - NO AUTH** 🔴
7. **`/api/export` - NO AUTH** 🔴
8. **`/api/seo-score` - NO AUTH** 🔴
9. **`/api/seo/analyze` - NO AUTH** 🔴
10. **`/api/voice-to-blog` - NO AUTH** 🔴
11. **`/api/platform/performance` - NO AUTH** 🔴
12. **`/api/monetization/*` - NO AUTH** 🔴
13. **`/api/automation/research` - NO AUTH** 🔴
14. **`/api/ai-images` - NO AUTH** 🔴
15. **`/api/ai/transform` - NO AUTH** 🔴

### ⚠️ PUBLIC Routes (Intentionally Unprotected)

These should remain public:
- `/api/health` - Health check endpoint ✅
- `/api/webhooks/*` - External webhooks (validated by signature) ✅

---

## 3. Workspace & Team Management (RBAC)

### ⚠️ WEAK ACCESS CONTROL

**Location:** `/api/workspace/members/route.ts`

**Issues:**
1. No role-based access control verification
2. Any authenticated user can invite members to "their" workspace
3. No check that inviter is owner/admin
4. Workspace ownership not properly validated

**Example Vulnerable Code:**
```typescript
export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { email, role = 'member' } = await req.json()
  // MISSING: Check if authed.user has permission to invite
  // MISSING: Check if authed.user is owner/admin of workspace
  
  const workspace = await getOrCreateWorkspace(authed.supabase, authed.user.id)
  // Creates invite without verifying permissions
}
```

**Attack Scenario:**
- User A creates workspace
- User B (attacker) can potentially invite themselves to User A's workspace if they guess/know the workspace ID

---

## 4. Cache & Session Security

### ✅ GOOD: User-Scoped Cache Keys

**Location:** `lib/database/redis.ts`

```typescript
export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,    // ✅ User-scoped
  PREFERENCES: (userId: string) => `prefs:${userId}`,       // ✅ User-scoped
  PATTERNS: (userId: string) => `patterns:${userId}`,       // ✅ User-scoped
  METRICS: (id: string) => `metrics:${id}`,                 // ⚠️ Needs validation
  PREDICTION: (hash: string) => `prediction:${hash}`,       // ✅ Content-based
  CONTENT: (id: string) => `content:${id}`,                 // ⚠️ Needs validation
}
```

**Issue:**
- Cache keys are user-scoped when `userId` is in the key ✅
- BUT if API routes don't validate userId before using cache, attacker can access other users' cached data ❌

---

## 5. Authentication Implementation

### ✅ GOOD: Central Authentication Helper

**Location:** `lib/auth/require-user.ts`

```typescript
export async function requireUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  
  return { ok: true, supabase, user }
}
```

**Strengths:**
- Centralized auth logic ✅
- Uses Supabase session cookies ✅
- Returns authenticated Supabase client ✅

**Weakness:**
- Not used consistently across all API routes ❌
- Many routes don't call this function at all ❌

---

## 6. Middleware Protection

### ⚠️ PARTIAL PROTECTION

**Location:** `middleware.ts`

```typescript
// API routes handle their own auth (return JSON 401). Only protect page navigations here.
if (pathname.startsWith('/api/')) {
  return response // No middleware protection for API routes!
}
```

**Problem:**
- Middleware only protects page routes
- API routes are NOT protected by middleware
- Relies entirely on individual route implementations
- Many routes don't implement auth

---

## 7. IDOR (Insecure Direct Object Reference) Vulnerabilities

### ❌ CRITICAL: Multiple IDOR Vulnerabilities

**Pattern Found in Multiple Routes:**
```typescript
// Example: /api/workspace/projects
const projectId = searchParams.get('id')
await supabase.from('projects').delete().eq('id', projectId).eq('user_id', userId)
```

**Status:**
- ✅ GOOD: Most routes use double-check with `user_id` filter
- ❌ RISK: If RLS is broken (it is), this is the only defense
- ❌ RISK: Developer might forget `.eq('user_id')` in future code

**Recommendation:**
- Keep double-check in application code ✅
- FIX RLS policies to provide defense-in-depth ❌ (Currently missing)

---

## Summary of Vulnerabilities

| Vulnerability | Severity | Impact | Status |
|--------------|----------|---------|--------|
| Broken RLS Policies | 🔴 CRITICAL | Direct database access bypasses all app-level checks | OPEN |
| Unprotected API Routes | 🔴 CRITICAL | 15+ routes accessible without authentication | OPEN |
| User-Controlled IDs | 🔴 CRITICAL | `/api/generate` and `/api/revenue/dashboard` accept userId from request | OPEN |
| Missing Workspace RBAC | 🟡 HIGH | No role-based access control for team features | OPEN |
| Missing RLS on Additional Tables | 🟡 HIGH | workspaces, workspace_members, workspace_invites not protected | OPEN |
| Cache Key Validation | 🟡 MEDIUM | Cache functions assume trusted userId input | OPEN |

---

## Recommended Fixes (Priority Order)

### 🔴 PRIORITY 1 (IMMEDIATE):

1. **Fix RLS Policies**
   - Replace `using (true)` with proper user isolation
   - Add RLS to all tables
   - Test with multiple users

2. **Add Authentication to Unprotected Routes**
   - Add `requireUser()` call to all 15+ unprotected routes
   - Remove user-controlled userId from request bodies
   - Use `authed.user.id` from authentication instead

3. **Fix `/api/generate` Route**
   ```typescript
   // BEFORE (BROKEN):
   const { topic, keywords, userId } = await request.json()
   
   // AFTER (SECURE):
   const authed = await requireUser()
   if (!authed.ok) return authed.response
   
   const { topic, keywords } = await request.json()
   // Use authed.user.id instead of request userId
   const userId = authed.user.id
   ```

4. **Fix `/api/revenue/dashboard` Route**
   ```typescript
   // BEFORE (BROKEN):
   const userId = searchParams.get('userId')
   
   // AFTER (SECURE):
   const authed = await requireUser()
   if (!authed.ok) return authed.response
   
   // Verify user is admin/owner
   const isAdmin = await checkUserIsAdmin(authed.user.id)
   if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
   ```

### 🟡 PRIORITY 2 (Next Sprint):

5. **Implement Workspace RBAC**
   - Add permission checks before invite/member operations
   - Verify user is owner/admin of workspace
   - Add workspace_id validation

6. **Add RLS to Additional Tables**
   - Enable RLS on `workspaces`, `workspace_members`, `workspace_invites`
   - Create appropriate policies

7. **Audit All Database Queries**
   - Ensure all queries include user_id filter
   - Add automated tests for isolation

### 🟢 PRIORITY 3 (Future):

8. **Add API Route Tests**
   - Test that users cannot access other users' data
   - Test authentication enforcement
   - Test RBAC permissions

9. **Add Security Headers**
   - Implement CSP, CORS policies
   - Add rate limiting per user
   - Add request validation middleware

10. **Security Monitoring**
    - Log suspicious access patterns
    - Alert on authentication failures
    - Monitor for IDOR attempts

---

## Testing Recommendations

### Test Cases to Validate Fixes:

1. **RLS Policy Test:**
   ```typescript
   // User A creates project
   // User B tries to access User A's project directly via Supabase
   // Should fail with RLS error
   ```

2. **API Auth Test:**
   ```typescript
   // Call /api/generate without auth header
   // Should return 401 Unauthorized
   ```

3. **IDOR Test:**
   ```typescript
   // User A gets their projectId
   // User B tries to DELETE User A's project
   // Should return 403 Forbidden or not found
   ```

4. **RBAC Test:**
   ```typescript
   // User A invites User B to workspace
   // User B (member role) tries to invite User C
   // Should return 403 Forbidden (only owners can invite)
   ```

---

## Conclusion

BlogCraft AI currently has **CRITICAL multi-tenancy vulnerabilities** that could allow users to access each other's data. The primary issues are:

1. ❌ **RLS policies are ineffective** (`using (true)` allows all access)
2. ❌ **15+ API routes lack authentication**
3. ❌ **User-controlled identifiers are trusted without validation**

**Recommendation:** Implement Priority 1 fixes immediately before allowing multi-user production usage.

**Estimated Effort:**
- Priority 1 fixes: 2-3 days
- Priority 2 fixes: 3-5 days
- Priority 3 improvements: 1-2 weeks

**Risk if Not Fixed:**
- Data breach: Users can read/modify other users' content
- Compliance violations: GDPR, CCPA violations
- Reputation damage: Loss of user trust
- Legal liability: Data privacy lawsuits

---

**Audit Completed:** 2025-06-XX  
**Next Review:** After Priority 1 fixes are implemented
