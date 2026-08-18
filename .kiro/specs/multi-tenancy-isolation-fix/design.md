# Multi-Tenancy Isolation Fix - Technical Design

## Overview

This design document specifies the technical implementation for fixing CRITICAL multi-tenancy isolation vulnerabilities in BlogCraft AI. The fix implements defense-in-depth security across four layers:

1. **Database Layer**: Row-Level Security (RLS) policies
2. **API Layer**: Authentication enforcement
3. **Application Layer**: Session-based identity
4. **Authorization Layer**: Role-Based Access Control (RBAC)

## Architecture Components

### 1. Database Security Layer (RLS Policies)

**File**: `supabase/migrations/003_fix_rls_policies.sql`

**Purpose**: Enforce data isolation at the database level so that even direct Supabase client queries cannot bypass user isolation.

**Implementation**:

```sql
-- Drop broken policies
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users read own projects" ON projects;
DROP POLICY IF EXISTS "Users read own brand memory" ON brand_memory;

-- PROFILES: User can only access their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- PROJECTS: User can only access their own projects
CREATE POLICY "projects_select_own" ON projects
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Similar policies for: brand_memory, usage_logs, automations
-- Workspace policies (users can access workspaces they own or are members of)
```

**Testing Strategy**:
- Create test users A and B
- User A creates a project
- User B attempts direct Supabase query: `supabase.from('projects').select('*')`
- Verify User B only sees their own projects (empty if they have none)

### 2. API Authentication Layer

**Component**: Enhanced API route wrappers

**Affected Files**: 15+ route files in `app/api/**/route.ts`

**Pattern**:
```typescript
// BEFORE (Vulnerable):
export async function POST(request: NextRequest) {
  const { topic, keywords, userId } = await request.json()
  // Process without auth check
}

// AFTER (Secure):
export async function POST(request: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response
  
  const { topic, keywords } = await request.json()
  const userId = authed.user.id // From session, not request
  // Process with authenticated userId
}
```

**Routes to Update**:
1. `/api/generate/route.ts` - Add `requireUser()` at function start
2. `/api/research/route.ts` - Add `requireUser()`
3. `/api/ai-brain/route.ts` - Add `requireUser()`
4. `/api/competitor-analysis/route.ts` - Add `requireUser()`
5. `/api/content-remix/route.ts` - Add `requireUser()`
6. `/api/export/route.ts` - Add `requireUser()`
7. `/api/seo-score/route.ts` - Add `requireUser()`
8. `/api/seo/analyze/route.ts` - Add `requireUser()`
9. `/api/voice-to-blog/route.ts` - Add `requireUser()`
10. `/api/platform/performance/route.ts` - Add `requireUser()`
11. `/api/monetization/cta/route.ts` - Add `requireUser()`
12. `/api/monetization/funnel/route.ts` - Add `requireUser()`
13. `/api/monetization/performance/route.ts` - Add `requireUser()`
14. `/api/automation/research/route.ts` - Add `requireUser()`
15. `/api/ai-images/route.ts` - Add `requireUser()`
16. `/api/ai/transform/route.ts` - Add `requireUser()`

**Routes to Keep Public** (No auth needed):
- `/api/health/route.ts` - Health check
- `/api/webhooks/*` - External webhooks (verified by signature)

### 3. User Identity Verification Layer

**Component**: Remove user-controlled userId parameters

**Critical Files**:

#### `/api/generate/route.ts`
```typescript
// BEFORE:
const { topic, keywords, userId } = await request.json()
if (userId) {
  await UsageLimitService.canGenerateArticle(userId)
  await UsageLimitService.incrementUsage(userId)
}

// AFTER:
const authed = await requireUser()
if (!authed.ok) return authed.response

const { topic, keywords } = await request.json()
// Use authenticated user ID from session
await UsageLimitService.canGenerateArticle(authed.user.id)
await UsageLimitService.incrementUsage(authed.user.id)
```

#### `/api/revenue/dashboard/route.ts`
```typescript
// BEFORE:
const userId = searchParams.get('userId')
if (!userId) {
  return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
}
const hasAccess = await checkRevenueDashboardAccess(userId)

// AFTER:
const authed = await requireUser()
if (!authed.ok) return authed.response

// Check if authenticated user is admin/owner using their session ID
const isAdmin = await checkUserIsAdmin(authed.user.id)
if (!isAdmin) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
}
// Return revenue data for authenticated admin only
```

### 4. Role-Based Access Control (RBAC) Layer

**Component**: Workspace permission verification

**New Module**: `lib/auth/workspace-rbac.ts`

```typescript
export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface WorkspacePermissions {
  canInviteMembers: boolean
  canRemoveMembers: boolean
  canModifySettings: boolean
  canDeleteWorkspace: boolean
  canViewAnalytics: boolean
}

export async function getUserWorkspaceRole(
  supabase: SupabaseClient,
  userId: string,
  workspaceId: string
): Promise<WorkspaceRole | null> {
  // Check if user is workspace owner
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('owner_id')
    .eq('id', workspaceId)
    .single()
  
  if (workspace?.owner_id === userId) {
    return 'owner'
  }
  
  // Check workspace_members table for role
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single()
  
  return (member?.role as WorkspaceRole) || null
}

export function getPermissionsForRole(role: WorkspaceRole): WorkspacePermissions {
  const permissions: Record<WorkspaceRole, WorkspacePermissions> = {
    owner: {
      canInviteMembers: true,
      canRemoveMembers: true,
      canModifySettings: true,
      canDeleteWorkspace: true,
      canViewAnalytics: true,
    },
    admin: {
      canInviteMembers: true,
      canRemoveMembers: true,
      canModifySettings: true,
      canDeleteWorkspace: false,
      canViewAnalytics: true,
    },
    member: {
      canInviteMembers: false,
      canRemoveMembers: false,
      canModifySettings: false,
      canDeleteWorkspace: false,
      canViewAnalytics: false,
    },
  }
  return permissions[role]
}

export async function requireWorkspacePermission(
  supabase: SupabaseClient,
  userId: string,
  workspaceId: string,
  permission: keyof WorkspacePermissions
): Promise<{ allowed: boolean; role: WorkspaceRole | null }> {
  const role = await getUserWorkspaceRole(supabase, userId, workspaceId)
  if (!role) {
    return { allowed: false, role: null }
  }
  
  const permissions = getPermissionsForRole(role)
  return { allowed: permissions[permission], role }
}
```

**Usage in Routes**:

#### `/api/workspace/members/route.ts` (POST - Invite members)
```typescript
export async function POST(req: NextRequest) {
  const authed = await requireUser()
  if (!authed.ok) return authed.response

  const { email, role = 'member', workspaceId } = await req.json()
  
  // Verify user has permission to invite members
  const { allowed, role: userRole } = await requireWorkspacePermission(
    authed.supabase,
    authed.user.id,
    workspaceId,
    'canInviteMembers'
  )
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Only workspace owners and admins can invite members' },
      { status: 403 }
    )
  }
  
  // Proceed with invitation
}
```

### 5. Additional Tables RLS Policies

**Workspaces Table**:
```sql
-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Users can see workspaces they own
CREATE POLICY "workspaces_select_owned" ON workspaces
  FOR SELECT
  USING (owner_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can see workspaces they are members of
CREATE POLICY "workspaces_select_member" ON workspaces
  FOR SELECT
  USING (id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id IN (
      SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
    )
  ));

-- Only owners can update their workspaces
CREATE POLICY "workspaces_update_owned" ON workspaces
  FOR UPDATE
  USING (owner_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Only owners can delete their workspaces
CREATE POLICY "workspaces_delete_owned" ON workspaces
  FOR DELETE
  USING (owner_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));
```

**Workspace Members Table**:
```sql
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Users can see members of workspaces they belong to
CREATE POLICY "workspace_members_select" ON workspace_members
  FOR SELECT
  USING (workspace_id IN (
    -- Workspaces owned by user
    SELECT id FROM workspaces WHERE owner_id IN (
      SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
    )
    UNION
    -- Workspaces where user is a member
    SELECT workspace_id FROM workspace_members WHERE user_id IN (
      SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
    )
  ));
```

**Workspace Invites Table**:
```sql
ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

-- Owners can see invites for their workspaces
CREATE POLICY "workspace_invites_select_owner" ON workspace_invites
  FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id IN (
      SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
    )
  ));

-- Invitees can see invites sent to their email
CREATE POLICY "workspace_invites_select_invitee" ON workspace_invites
  FOR SELECT
  USING (email IN (
    SELECT email FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));
```

**Usage Logs Table**:
```sql
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_select_own" ON usage_logs
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "usage_logs_insert_own" ON usage_logs
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));
```

**Automations Table**:
```sql
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "automations_select_own" ON automations
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "automations_insert_own" ON automations
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "automations_update_own" ON automations
  FOR UPDATE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

CREATE POLICY "automations_delete_own" ON automations
  FOR DELETE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));
```

## Implementation Plan

### Phase 1: Database Layer (Highest Priority)
1. Create migration file `003_fix_rls_policies.sql`
2. Drop broken RLS policies
3. Create correct RLS policies for all tables
4. Run migration in Supabase
5. Test with multiple user accounts

### Phase 2: API Authentication (Highest Priority)
1. Update `/api/generate/route.ts` - Add auth, remove userId param
2. Update `/api/revenue/dashboard/route.ts` - Add auth, fix userId handling
3. Update remaining 14 unprotected routes
4. Test each route with/without auth token

### Phase 3: RBAC Implementation (High Priority)
1. Create `lib/auth/workspace-rbac.ts` module
2. Update `/api/workspace/members/route.ts` with permission checks
3. Add permission checks to workspace settings routes
4. Test workspace operations with different roles

### Phase 4: Testing & Validation (High Priority)
1. Write integration tests for data isolation
2. Write tests for auth enforcement
3. Write tests for RBAC permissions
4. Perform security audit verification

## Security Testing Checklist

### Database Isolation Tests
- [ ] User A cannot query User B's projects via Supabase client
- [ ] User A cannot query User B's brand_memory via Supabase client
- [ ] User A cannot query User B's automations via Supabase client
- [ ] User A cannot see User B's profile via Supabase client
- [ ] User A cannot modify User B's data via Supabase client

### API Authentication Tests
- [ ] Unauthenticated request to `/api/generate` returns 401
- [ ] Unauthenticated request to `/api/research` returns 401
- [ ] Unauthenticated request to `/api/ai-brain` returns 401
- [ ] Unauthenticated request to `/api/revenue/dashboard` returns 401
- [ ] All 15 unprotected routes now require auth

### User Identity Tests
- [ ] `/api/generate` ignores userId from request body
- [ ] `/api/generate` uses userId from authenticated session
- [ ] `/api/revenue/dashboard` ignores userId from query params
- [ ] Rate limits apply to authenticated user, not request userId
- [ ] Usage tracking uses authenticated user ID

### RBAC Tests
- [ ] Workspace member cannot invite new members (403)
- [ ] Workspace admin can invite new members (200)
- [ ] Workspace owner can invite new members (200)
- [ ] Workspace member cannot delete workspace (403)
- [ ] Workspace owner can delete workspace (200)

### Regression Tests
- [ ] Authenticated user can access their own projects
- [ ] Authenticated user can create new projects
- [ ] Workspace owner can manage their workspace
- [ ] Workspace members can collaborate on shared projects
- [ ] Public routes still work without auth

## Rollback Plan

If critical issues are discovered after deployment:

1. **Database Layer**: Keep old policies active until new ones are verified
2. **API Routes**: Deploy auth changes incrementally (one route at a time)
3. **RBAC**: Feature flag for workspace permission checks
4. **Monitoring**: Alert on 401/403 spike indicating broken auth

## Performance Considerations

### RLS Policy Performance
- RLS policies use subqueries which may impact query performance
- Solution: Add indexes on `clerk_user_id` and `user_id` columns
- Monitor query performance after RLS deployment

### Auth Check Overhead
- Each API call now requires `requireUser()` check
- Impact: ~10-20ms per request (negligible)
- Supabase session validation is cached

## Deployment Strategy

### Pre-Deployment
1. Test RLS policies in staging environment
2. Verify no existing functionality breaks
3. Prepare rollback SQL scripts

### Deployment
1. Deploy database migration (003_fix_rls_policies.sql)
2. Deploy API route changes (authentication layer)
3. Deploy RBAC module
4. Monitor error rates and auth failures

### Post-Deployment
1. Run security validation tests
2. Monitor for 401/403 errors
3. Check user feedback for access issues
4. Update security audit report

## Success Criteria

- [ ] All RLS policies enforce user isolation
- [ ] All 15 unprotected routes now require authentication
- [ ] No user-controlled userId parameters remain
- [ ] Workspace operations verify permissions
- [ ] All security tests pass
- [ ] No regression in existing functionality
- [ ] Security audit issues marked as resolved

## Documentation Updates

- Update API documentation with auth requirements
- Update workspace collaboration docs with role permissions
- Update developer guide with security best practices
- Update security audit report with fix verification
