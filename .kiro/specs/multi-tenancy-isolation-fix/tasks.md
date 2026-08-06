# Multi-Tenancy Isolation Fix - Implementation Tasks

## Overview

This task breakdown implements the fix for CRITICAL multi-tenancy isolation vulnerabilities using the bug condition methodology. The workflow follows:

1. **Explore** - Write tests BEFORE fix to understand the bug (Bug Condition)
2. **Preserve** - Write tests for non-buggy behavior (Preservation Requirements)
3. **Implement** - Apply the fix with understanding (Expected Behavior)
4. **Validate** - Verify fix works and doesn't break anything

## Bug Condition Summary

**C(X) - Bug Condition**: Identifies inputs that trigger security vulnerabilities:
- **Database**: Direct Supabase queries return ALL users' data (not filtered by authenticated user)
- **API**: Unauthenticated requests to 15+ routes are processed without rejection
- **Identity**: User-controlled userId parameters allow impersonation (e.g., `userId: "other-user-id"` in request body)
- **Authorization**: Missing RBAC allows any workspace member to perform owner-only operations

**P(result) - Expected Behavior**: For all buggy inputs, the system should:
- Return ONLY authenticated user's data (RLS enforcement)
- Reject unauthenticated requests with 401 status
- Use ONLY session-based userId (ignore request parameters)
- Verify workspace permissions before operations

**¬C(X) - Non-Buggy Inputs** (to preserve):
- Authenticated users accessing their own data
- Workspace owners/admins managing their workspaces
- Public routes (health checks, webhooks)
- Legitimate collaborative access within workspaces

---

## Implementation Plan

### Phase 1: Exploration Tests (Bug Condition) - Write BEFORE Fix

- [ ] 1. Write RLS policy exploration tests
  - **Property 1: Bug Condition** - Database Isolation Vulnerabilities
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate RLS policies are broken
  - Create test file: `tests/security/rls-policies.test.ts`
  - Test that User A can query User B's projects (Bug Condition: no RLS filtering)
  - Test that User A can query User B's brand_memory (Bug Condition: no RLS filtering)
  - Test that User A can query User B's automations (Bug Condition: no RLS filtering)
  - Test that User A can query User B's usage_logs (Bug Condition: no RLS filtering)
  - Test that User A can query User B's profile (Bug Condition: no RLS filtering)
  - Test that User A can query User B's workspace data (Bug Condition: no RLS filtering)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL showing User A can access User B's data (this proves the bug exists)
  - Document counterexamples found (e.g., "User A retrieved 15 projects belonging to User B")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6 (Bug Analysis - Broken RLS Policies)_

- [ ] 2. Write API authentication exploration tests
  - **Property 1: Bug Condition** - Missing Authentication on API Routes
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms missing auth
  - **DO NOT attempt to fix the tests or routes when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples demonstrating unauthenticated access is allowed
  - Create test file: `tests/security/api-auth.test.ts`
  - Test that unauthenticated request to `/api/generate` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/research` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/ai-brain` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/competitor-analysis` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/content-remix` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/ai-images` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/revenue/dashboard` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/automations` returns 200 (Bug Condition: no auth required)
  - Test that unauthenticated request to `/api/export` returns 200 (Bug Condition: no auth required)
  - Test remaining 7 unprotected routes (seo-score, seo/analyze, voice-to-blog, platform/performance, monetization routes, automation/research, ai/transform)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL showing routes accept unauthenticated requests (this proves the bug exists)
  - Document counterexamples found (e.g., "Unauthenticated POST to /api/generate returned 200 with generated content")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15 (Bug Analysis - Unprotected API Routes)_

- [ ] 3. Write user identity manipulation exploration tests
  - **Property 1: Bug Condition** - User-Controlled Identity Parameters
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms identity manipulation is possible
  - **DO NOT attempt to fix the tests or code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples demonstrating userId parameter manipulation works
  - Create test file: `tests/security/identity-verification.test.ts`
  - Test that User A can generate content as User B by sending `userId: "user-b-id"` (Bug Condition: user-controlled identity)
  - Test that User A can access User B's revenue data via `?userId=user-b-id` query param (Bug Condition: user-controlled identity)
  - Test that User A can bypass their rate limits by using User B's userId (Bug Condition: user-controlled identity)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL showing userId manipulation succeeds (this proves the bug exists)
  - Document counterexamples found (e.g., "User A successfully generated content under User B's account by passing userId parameter")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.16, 1.17, 1.18, 1.19 (Bug Analysis - User-Controlled Identity Parameters)_

- [ ] 4. Write RBAC exploration tests
  - **Property 1: Bug Condition** - Missing Role-Based Access Control
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms missing RBAC
  - **DO NOT attempt to fix the tests or code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples demonstrating unauthorized workspace operations succeed
  - Create test file: `tests/security/workspace-rbac.test.ts`
  - Test that workspace member (not owner/admin) can invite new members (Bug Condition: no permission check)
  - Test that workspace member (not owner/admin) can modify workspace settings (Bug Condition: no permission check)
  - Test that workspace member (not owner) can delete workspace (Bug Condition: no permission check)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL showing unauthorized operations succeed (this proves the bug exists)
  - Document counterexamples found (e.g., "Regular workspace member successfully deleted workspace without owner permission")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.20, 1.21, 1.22 (Bug Analysis - Missing RBAC)_

### Phase 2: Preservation Tests - Write BEFORE Fix

- [ ] 5. Write preservation tests for legitimate user access
  - **Property 2: Preservation** - Legitimate User Access Patterns
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: Authenticated users can successfully access their own projects on unfixed code
  - Observe: Authenticated users can successfully create new projects on unfixed code
  - Observe: Authenticated users can successfully update their brand_memory on unfixed code
  - Observe: Authenticated users can successfully create automations on unfixed code
  - Create test file: `tests/security/preservation-user-access.test.ts`
  - Write property-based test: Authenticated user can read/write their own projects (observed behavior)
  - Write property-based test: Authenticated user can create projects with correct user_id (observed behavior)
  - Write property-based test: Authenticated user can update their brand_memory (observed behavior)
  - Write property-based test: Authenticated user can create/execute automations (observed behavior)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4 (Preservation - Legitimate User Access)_

- [ ] 6. Write preservation tests for workspace collaboration
  - **Property 2: Preservation** - Workspace Collaboration Patterns
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: Workspace owners can successfully invite members on unfixed code
  - Observe: Workspace members can successfully view shared resources on unfixed code
  - Observe: Multiple members can successfully collaborate on shared projects on unfixed code
  - Create test file: `tests/security/preservation-workspace-collab.test.ts`
  - Write property-based test: Workspace owner invitations work correctly (observed behavior)
  - Write property-based test: Workspace members can view shared resources (observed behavior)
  - Write property-based test: Collaborative editing works for workspace projects (observed behavior)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.5, 3.6, 3.7 (Preservation - Workspace Collaboration)_

- [ ] 7. Write preservation tests for public routes and webhooks
  - **Property 2: Preservation** - Public Endpoint Patterns
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: `/api/health` works without authentication on unfixed code
  - Observe: Public marketing pages work without authentication on unfixed code
  - Observe: Webhook endpoints process valid signatures without user authentication on unfixed code
  - Create test file: `tests/security/preservation-public-routes.test.ts`
  - Write property-based test: Health check endpoint works without auth (observed behavior)
  - Write property-based test: Public pages accessible without auth (observed behavior)
  - Write property-based test: Webhooks verified by signature, not user auth (observed behavior)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.8, 3.9, 3.10 (Preservation - Public Routes)_

- [ ] 8. Write preservation tests for rate limiting and usage tracking
  - **Property 2: Preservation** - Usage Tracking Patterns
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: API requests increment usage counters correctly on unfixed code
  - Observe: Rate limits return 429 when exceeded on unfixed code
  - Observe: Usage is tracked against correct user account on unfixed code
  - Create test file: `tests/security/preservation-rate-limits.test.ts`
  - Write property-based test: Usage counters increment correctly for authenticated users (observed behavior)
  - Write property-based test: Rate limits enforce correctly with 429 response (observed behavior)
  - Write property-based test: Usage tracked against authenticated user's quotas (observed behavior)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.11, 3.12, 3.13 (Preservation - Rate Limiting)_

### Phase 3: Implementation - Apply the Fix

- [ ] 9. Implement Database RLS Policies (Layer 1)

  - [ ] 9.1 Create RLS migration file
    - Create file: `supabase/migrations/003_fix_rls_policies.sql`
    - Drop broken RLS policies for: profiles, projects, brand_memory
    - _Bug_Condition: Direct Supabase queries return ALL users' data (no user_id filtering)_
    - _Expected_Behavior: RLS policies enforce `auth.uid()` filtering so users see ONLY their own data_
    - _Preservation: Authenticated users continue to access their own data successfully_
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 9.2 Implement profiles table RLS policies
    - Create SELECT policy: `profiles_select_own` - users can only read their own profile where `clerk_user_id = auth.uid()`
    - Create UPDATE policy: `profiles_update_own` - users can only update their own profile
    - Enable RLS on profiles table
    - _Bug_Condition: User A can query User B's profile via Supabase client_
    - _Expected_Behavior: User A can ONLY query their own profile (WHERE clerk_user_id = auth.uid())_
    - _Preservation: User profile reads/updates continue to work for authenticated users_
    - _Requirements: 1.6, 2.8, 3.1_

  - [ ] 9.3 Implement projects table RLS policies
    - Create SELECT policy: `projects_select_own` - filter by user_id matching authenticated user
    - Create INSERT policy: `projects_insert_own` - enforce user_id matches auth.uid()
    - Create UPDATE policy: `projects_update_own` - users can only update their own projects
    - Create DELETE policy: `projects_delete_own` - users can only delete their own projects
    - Enable RLS on projects table
    - _Bug_Condition: User A can query User B's projects via Supabase client_
    - _Expected_Behavior: User A can ONLY query/modify their own projects (WHERE user_id matches auth.uid())_
    - _Preservation: Project CRUD operations continue to work for authenticated users_
    - _Requirements: 1.1, 2.1, 3.1, 3.2_

  - [ ] 9.4 Implement brand_memory table RLS policies
    - Create SELECT policy: `brand_memory_select_own` - filter by user_id
    - Create INSERT policy: `brand_memory_insert_own` - enforce user_id
    - Create UPDATE policy: `brand_memory_update_own` - users can only update their own brand memory
    - Create DELETE policy: `brand_memory_delete_own` - users can only delete their own brand memory
    - Enable RLS on brand_memory table
    - _Bug_Condition: User A can query User B's brand_memory via Supabase client_
    - _Expected_Behavior: User A can ONLY access their own brand_memory (WHERE user_id matches auth.uid())_
    - _Preservation: Brand memory operations continue to work for authenticated users_
    - _Requirements: 1.2, 2.2, 3.3_

  - [ ] 9.5 Implement usage_logs table RLS policies
    - Create SELECT policy: `usage_logs_select_own` - filter by user_id
    - Create INSERT policy: `usage_logs_insert_own` - enforce user_id
    - Enable RLS on usage_logs table
    - _Bug_Condition: User A can query User B's usage_logs via Supabase client_
    - _Expected_Behavior: User A can ONLY access their own usage_logs (WHERE user_id matches auth.uid())_
    - _Preservation: Usage tracking continues to work correctly for authenticated users_
    - _Requirements: 1.4, 2.4, 3.11, 3.12, 3.13_

  - [ ] 9.6 Implement automations table RLS policies
    - Create SELECT policy: `automations_select_own` - filter by user_id
    - Create INSERT policy: `automations_insert_own` - enforce user_id
    - Create UPDATE policy: `automations_update_own` - users can only update their own automations
    - Create DELETE policy: `automations_delete_own` - users can only delete their own automations
    - Enable RLS on automations table
    - _Bug_Condition: User A can query User B's automations via Supabase client_
    - _Expected_Behavior: User A can ONLY access their own automations (WHERE user_id matches auth.uid())_
    - _Preservation: Automation CRUD operations continue to work for authenticated users_
    - _Requirements: 1.3, 2.3, 3.4_

  - [ ] 9.7 Implement workspaces table RLS policies
    - Create SELECT policy: `workspaces_select_owned` - users can see workspaces they own
    - Create SELECT policy: `workspaces_select_member` - users can see workspaces they are members of
    - Create UPDATE policy: `workspaces_update_owned` - only owners can update
    - Create DELETE policy: `workspaces_delete_owned` - only owners can delete
    - Enable RLS on workspaces table
    - _Bug_Condition: User A can query User B's workspaces via Supabase client_
    - _Expected_Behavior: User A can ONLY see workspaces they own OR are members of_
    - _Preservation: Workspace owners continue to manage their workspaces, members see shared workspaces_
    - _Requirements: 1.5, 2.5, 3.5, 3.6, 3.7_

  - [ ] 9.8 Implement workspace_members table RLS policies
    - Create SELECT policy: `workspace_members_select` - users can see members of their workspaces
    - Enable RLS on workspace_members table
    - _Bug_Condition: User A can query workspace_members for workspaces they don't belong to_
    - _Expected_Behavior: User A can ONLY see members of workspaces they own or belong to_
    - _Preservation: Workspace member lists continue to display correctly for authorized users_
    - _Requirements: 1.5, 2.6, 3.6_

  - [ ] 9.9 Implement workspace_invites table RLS policies
    - Create SELECT policy: `workspace_invites_select_owner` - owners can see invites for their workspaces
    - Create SELECT policy: `workspace_invites_select_invitee` - invitees can see invites sent to their email
    - Enable RLS on workspace_invites table
    - _Bug_Condition: User A can query workspace_invites for workspaces they don't own_
    - _Expected_Behavior: Users can ONLY see invites for their workspaces or invites addressed to them_
    - _Preservation: Workspace invitations continue to work correctly_
    - _Requirements: 1.5, 2.7, 3.5_

  - [ ] 9.10 Deploy RLS migration to Supabase
    - Run migration: `supabase db push` (or equivalent deployment command)
    - Verify migration applied successfully
    - Check that all RLS policies are active
    - _Bug_Condition: No RLS enforcement before migration_
    - _Expected_Behavior: All tables enforce user isolation after migration_
    - _Preservation: Existing queries continue to work for authenticated users_
    - _Requirements: All 2.x requirements (Expected Behavior)_

  - [ ] 9.11 Verify RLS exploration tests now pass
    - **Property 1: Expected Behavior** - Database Isolation Enforcement
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms RLS policies enforce data isolation
    - Run RLS policy exploration tests from task 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms User A CANNOT access User B's data)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 (Expected Behavior - RLS Policies)_

  - [ ] 9.12 Verify RLS preservation tests still pass
    - **Property 2: Preservation** - Legitimate User Access Preserved
    - **IMPORTANT**: Re-run the SAME tests from task 5 - do NOT write new tests
    - Run preservation tests for legitimate user access from task 5
    - Run preservation tests for workspace collaboration from task 6
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in user access patterns)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7 (Preservation - User Access & Collaboration)_

- [ ] 10. Implement API Authentication Layer (Layer 2)

  - [ ] 10.1 Add authentication to `/api/generate/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request body destructuring
    - Use `authed.user.id` for all user identity operations
    - Remove any userId validation logic (no longer needed)
    - Update usage tracking to use `authed.user.id`
    - _Bug_Condition: Unauthenticated requests succeed; userId parameter allows impersonation_
    - _Expected_Behavior: Return 401 for unauthenticated requests; use session userId only_
    - _Preservation: Authenticated content generation continues to work_
    - _Requirements: 1.7, 1.16, 2.9, 2.18, 2.20, 3.1, 3.11_

  - [ ] 10.2 Add authentication to `/api/research/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for research operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated research functionality continues to work_
    - _Requirements: 1.8, 2.10, 2.20_

  - [ ] 10.3 Add authentication to `/api/ai-brain/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for AI brain operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated AI brain functionality continues to work_
    - _Requirements: 1.9, 2.11, 2.20_

  - [ ] 10.4 Add authentication to `/api/competitor-analysis/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for competitor analysis
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated competitor analysis continues to work_
    - _Requirements: 1.10, 2.12, 2.20_

  - [ ] 10.5 Add authentication to `/api/content-remix/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for content remix operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated content remix continues to work_
    - _Requirements: 1.11, 2.13, 2.20_

  - [ ] 10.6 Add authentication to `/api/ai-images/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for image generation
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated image generation continues to work_
    - _Requirements: 1.12, 2.14, 2.20_

  - [ ] 10.7 Add authentication to `/api/revenue/dashboard/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` query parameter handling
    - Implement admin role check using `authed.user.id`
    - Return 403 if user is not admin/owner
    - Use `authed.user.id` for revenue data queries
    - _Bug_Condition: Unauthenticated requests succeed; userId query param allows data access_
    - _Expected_Behavior: Return 401 for unauthenticated; verify admin role; use session userId_
    - _Preservation: Admin revenue dashboard access continues to work_
    - _Requirements: 1.13, 1.17, 2.15, 2.19, 2.20_

  - [ ] 10.8 Add authentication to `/api/automations/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for automation queries
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated automation management continues to work_
    - _Requirements: 1.14, 2.16, 2.20, 3.4_

  - [ ] 10.9 Add authentication to `/api/export/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for export operations
    - Verify user owns the data being exported
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests; verify data ownership_
    - _Preservation: Authenticated data export continues to work_
    - _Requirements: 1.15, 2.17, 2.20, 2.21_

  - [ ] 10.10 Add authentication to `/api/seo-score/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for SEO score operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated SEO scoring continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.11 Add authentication to `/api/seo/analyze/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for SEO analysis
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated SEO analysis continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.12 Add authentication to `/api/voice-to-blog/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for voice-to-blog operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated voice-to-blog continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.13 Add authentication to `/api/platform/performance/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for performance tracking
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated performance tracking continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.14 Add authentication to `/api/monetization/cta/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for CTA operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated CTA management continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.15 Add authentication to `/api/monetization/funnel/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for funnel operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated funnel management continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.16 Add authentication to `/api/monetization/performance/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for monetization performance tracking
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated monetization tracking continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.17 Add authentication to `/api/automation/research/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for automation research
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated automation research continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.18 Add authentication to `/api/ai/transform/route.ts`
    - Add `requireUser()` check at function start
    - Remove `userId` parameter from request handling
    - Use `authed.user.id` for AI transformation operations
    - _Bug_Condition: Unauthenticated requests succeed_
    - _Expected_Behavior: Return 401 for unauthenticated requests_
    - _Preservation: Authenticated AI transformation continues to work_
    - _Requirements: 2.9, 2.20_

  - [ ] 10.19 Verify API authentication exploration tests now pass
    - **Property 1: Expected Behavior** - API Authentication Enforcement
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - The tests from task 2 encode the expected behavior
    - When these tests pass, it confirms all routes require authentication
    - Run API authentication exploration tests from task 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms unauthenticated requests receive 401)
    - _Requirements: 2.9, 2.10, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16, 2.17 (Expected Behavior - API Auth)_

  - [ ] 10.20 Verify user identity exploration tests now pass
    - **Property 1: Expected Behavior** - Session-Based Identity Enforcement
    - **IMPORTANT**: Re-run the SAME tests from task 3 - do NOT write new tests
    - The tests from task 3 encode the expected behavior
    - When these tests pass, it confirms userId parameters are ignored
    - Run user identity manipulation exploration tests from task 3
    - **EXPECTED OUTCOME**: Tests PASS (confirms userId manipulation is prevented)
    - _Requirements: 2.18, 2.19, 2.20, 2.21 (Expected Behavior - User Identity)_

  - [ ] 10.21 Verify API preservation tests still pass
    - **Property 2: Preservation** - Legitimate API Usage Preserved
    - **IMPORTANT**: Re-run the SAME tests from tasks 5, 7, 8 - do NOT write new tests
    - Run preservation tests for legitimate user access from task 5
    - Run preservation tests for public routes from task 7
    - Run preservation tests for rate limiting from task 8
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in API functionality)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13 (Preservation)_

- [ ] 11. Implement RBAC Layer (Layer 4)

  - [ ] 11.1 Create workspace RBAC module
    - Create file: `lib/auth/workspace-rbac.ts`
    - Define `WorkspaceRole` type: 'owner' | 'admin' | 'member'
    - Define `WorkspacePermissions` interface with permission flags
    - Implement `getUserWorkspaceRole()` function to check user's role in workspace
    - Implement `getPermissionsForRole()` function to map role to permissions
    - Implement `requireWorkspacePermission()` function for permission checks
    - _Bug_Condition: No permission checks exist for workspace operations_
    - _Expected_Behavior: RBAC module provides permission verification functions_
    - _Preservation: N/A (new module)_
    - _Requirements: 1.20, 1.21, 1.22, 2.22, 2.23, 2.24, 2.25_

  - [ ] 11.2 Add RBAC to workspace member invitation route
    - Update `/api/workspace/members/route.ts` POST handler
    - Add `requireUser()` check at function start
    - Call `requireWorkspacePermission()` to verify `canInviteMembers` permission
    - Return 403 if user lacks permission
    - Proceed with invitation if user is owner/admin
    - _Bug_Condition: Any workspace member can invite new members_
    - _Expected_Behavior: Only owners and admins can invite members; others receive 403_
    - _Preservation: Workspace owners/admins continue to invite members successfully_
    - _Requirements: 1.20, 2.22, 2.25, 3.5_

  - [ ] 11.3 Add RBAC to workspace settings modification route
    - Update workspace settings route (identify appropriate route in `/api/workspace/`)
    - Add `requireUser()` check at function start
    - Call `requireWorkspacePermission()` to verify `canModifySettings` permission
    - Return 403 if user lacks permission
    - Proceed with settings update if user is owner/admin
    - _Bug_Condition: Any workspace member can modify settings_
    - _Expected_Behavior: Only owners and admins can modify settings; others receive 403_
    - _Preservation: Workspace owners/admins continue to modify settings successfully_
    - _Requirements: 1.21, 2.23, 2.25_

  - [ ] 11.4 Add RBAC to workspace deletion route
    - Update workspace deletion route (identify appropriate route in `/api/workspace/`)
    - Add `requireUser()` check at function start
    - Call `requireWorkspacePermission()` to verify `canDeleteWorkspace` permission
    - Return 403 if user lacks permission (only owners allowed)
    - Proceed with deletion if user is workspace owner
    - _Bug_Condition: Any workspace member can delete the workspace_
    - _Expected_Behavior: Only workspace owners can delete; all others receive 403_
    - _Preservation: Workspace owners continue to delete their workspaces successfully_
    - _Requirements: 1.22, 2.24, 2.25_

  - [ ] 11.5 Verify RBAC exploration tests now pass
    - **Property 1: Expected Behavior** - RBAC Permission Enforcement
    - **IMPORTANT**: Re-run the SAME tests from task 4 - do NOT write new tests
    - The tests from task 4 encode the expected behavior
    - When these tests pass, it confirms workspace permissions are enforced
    - Run RBAC exploration tests from task 4
    - **EXPECTED OUTCOME**: Tests PASS (confirms unauthorized operations receive 403)
    - _Requirements: 2.22, 2.23, 2.24, 2.25 (Expected Behavior - RBAC)_

  - [ ] 11.6 Verify RBAC preservation tests still pass
    - **Property 2: Preservation** - Workspace Collaboration Preserved
    - **IMPORTANT**: Re-run the SAME tests from task 6 - do NOT write new tests
    - Run preservation tests for workspace collaboration from task 6
    - **EXPECTED OUTCOME**: Tests PASS (confirms workspace collaboration still works)
    - _Requirements: 3.5, 3.6, 3.7 (Preservation - Workspace Collaboration)_

### Phase 4: Final Validation

- [ ] 12. Integration testing and security verification

  - [ ] 12.1 Run complete security test suite
    - Run all exploration tests (tasks 1-4) - ALL should PASS
    - Run all preservation tests (tasks 5-8) - ALL should PASS
    - Verify no test failures or regressions
    - _Bug_Condition: All four security layers were vulnerable_
    - _Expected_Behavior: All four layers enforce security correctly_
    - _Preservation: All legitimate functionality preserved_
    - _Requirements: All 1.x, 2.x, 3.x requirements_

  - [ ] 12.2 Manual security verification - Database isolation
    - Create two test user accounts (User A, User B)
    - User A creates a project, brand memory, automation
    - User B attempts direct Supabase queries for User A's data
    - Verify User B receives empty results (cannot see User A's data)
    - Verify User A can still access their own data successfully
    - _Bug_Condition: Direct Supabase queries bypass user isolation_
    - _Expected_Behavior: RLS policies enforce data isolation_
    - _Preservation: Legitimate user access works correctly_
    - _Requirements: 1.1-1.6, 2.1-2.8, 3.1-3.4_

  - [ ] 12.3 Manual security verification - API authentication
    - Send unauthenticated requests to all 16 protected routes
    - Verify all routes return 401 Unauthorized
    - Send authenticated requests to same routes
    - Verify authenticated requests succeed
    - Verify public routes (/api/health, webhooks) still work without auth
    - _Bug_Condition: Unauthenticated requests succeed on 15+ routes_
    - _Expected_Behavior: All protected routes require authentication_
    - _Preservation: Public routes continue to work; authenticated access works_
    - _Requirements: 1.7-1.15, 2.9-2.17, 3.8-3.10_

  - [ ] 12.4 Manual security verification - User identity
    - User A sends POST to `/api/generate` with `userId: "user-b-id"` in body
    - Verify content is created under User A's account (not User B)
    - User A sends GET to `/api/revenue/dashboard?userId=user-b-id`
    - Verify User A does not receive User B's data (receives 403 if not admin)
    - Verify rate limits apply to authenticated user (cannot bypass with userId param)
    - _Bug_Condition: User-controlled userId parameters allow impersonation_
    - _Expected_Behavior: Session userId is used; request params are ignored_
    - _Preservation: Legitimate usage tracking and rate limiting work correctly_
    - _Requirements: 1.16-1.19, 2.18-2.21, 3.11-3.13_

  - [ ] 12.5 Manual security verification - RBAC
    - Create workspace owned by User A
    - Add User B as regular member (not admin)
    - User B attempts to invite User C to workspace
    - Verify User B receives 403 Forbidden
    - User B attempts to modify workspace settings
    - Verify User B receives 403 Forbidden
    - User B attempts to delete workspace
    - Verify User B receives 403 Forbidden
    - User A (owner) performs same operations
    - Verify User A succeeds in all operations
    - _Bug_Condition: Any workspace member can perform owner/admin operations_
    - _Expected_Behavior: Only owners/admins can perform privileged operations_
    - _Preservation: Workspace owners/admins retain full management capabilities_
    - _Requirements: 1.20-1.22, 2.22-2.25, 3.5-3.7_

  - [ ] 12.6 Performance verification
    - Run performance tests on routes with RLS policies
    - Verify query performance is acceptable (<200ms for typical queries)
    - Check for any query performance degradation
    - If performance issues detected, add indexes on clerk_user_id and user_id columns
    - _Bug_Condition: N/A_
    - _Expected_Behavior: RLS policies do not significantly impact performance_
    - _Preservation: Application performance remains acceptable_
    - _Requirements: N/A (performance validation)_

  - [ ] 12.7 Error handling verification
    - Verify 401 errors have clear messages ("Authentication required")
    - Verify 403 errors have clear messages ("Only workspace owners can delete workspaces")
    - Verify error responses are consistent across all routes
    - Test error handling for expired tokens
    - Test error handling for invalid workspace IDs
    - _Bug_Condition: N/A_
    - _Expected_Behavior: Clear, consistent error messages guide users_
    - _Preservation: Error handling provides good user experience_
    - _Requirements: 2.9-2.17, 2.22-2.24 (error messages in Expected Behavior)_

- [ ] 13. Checkpoint - Final Security Audit
  - Ensure ALL exploration tests pass (confirms bugs are fixed)
  - Ensure ALL preservation tests pass (confirms no regressions)
  - Manual verification completed for all four security layers
  - Performance is acceptable
  - Error handling is clear and consistent
  - Document any remaining issues or follow-up items
  - Ask the user if questions arise or if sign-off is needed

---

## Success Criteria

✅ **Bug Condition Tests (Exploration)**: All tests from tasks 1-4 PASS after implementation (they FAILED before fix)
✅ **Preservation Tests**: All tests from tasks 5-8 PASS before AND after implementation (no regressions)
✅ **RLS Enforcement**: User A cannot access User B's data via direct Supabase queries
✅ **API Authentication**: All 16 protected routes require authentication (401 for unauthenticated)
✅ **User Identity**: Session userId is used exclusively; request parameters are ignored
✅ **RBAC Enforcement**: Workspace operations enforce role-based permissions (403 for unauthorized)
✅ **Performance**: Query performance remains acceptable with RLS policies active
✅ **Error Handling**: Clear, consistent error messages for authentication and authorization failures

## Notes

- **Migration File**: The RLS migration file `supabase/migrations/003_fix_rls_policies.sql` should be created based on the design document's SQL examples
- **requireUser() Helper**: Assumes a helper function exists (likely in `lib/auth/` or similar) that validates session and returns user info
- **Test Framework**: Tasks assume a testing framework is available (Jest, Vitest, or similar) for writing property-based tests
- **Property-Based Testing**: Consider using libraries like `fast-check` (JavaScript/TypeScript) for robust property-based test generation
- **Deployment**: RLS migration must be deployed to production Supabase instance after thorough staging verification
- **Rollback Plan**: Keep old RLS policies documented for quick rollback if issues are discovered
- **Monitoring**: Set up alerts for spikes in 401/403 errors to catch authentication/authorization issues early

## References

- **Bugfix Requirements**: `.kiro/specs/multi-tenancy-isolation-fix/bugfix.md`
- **Design Document**: `.kiro/specs/multi-tenancy-isolation-fix/design.md`
- **Bug Condition Methodology**: C(X) identifies buggy inputs, P(result) defines expected behavior, ¬C(X) identifies behavior to preserve
