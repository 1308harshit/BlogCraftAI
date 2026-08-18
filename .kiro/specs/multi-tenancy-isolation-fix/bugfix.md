# Bugfix Requirements Document

## Introduction

BlogCraft AI has **CRITICAL** multi-tenancy isolation vulnerabilities that allow authenticated users to access, modify, and delete other users' data. This represents a severe security breach with potential GDPR/CCPA violations and data breach liability.

The bug affects four major security boundaries:
1. **Database-level isolation** (broken RLS policies)
2. **API authentication** (15+ unprotected routes)
3. **User identity verification** (user-controlled userId parameters)
4. **Authorization controls** (missing RBAC for workspace operations)

**Severity**: CRITICAL  
**Impact**: Data breach, unauthorized data access, regulatory violations, revenue data exposure  
**Scope**: All user data including projects, articles, brand memory, automations, usage logs, workspaces, and revenue analytics

## Bug Analysis

### Current Behavior (Defect)

#### 1. Broken Row-Level Security (RLS) Policies

1.1 WHEN any authenticated user queries the `projects` table directly via Supabase client THEN the system returns ALL projects from ALL users (not just the requester's projects)

1.2 WHEN any authenticated user queries the `brand_memory` table directly THEN the system returns ALL brand memory records from ALL users

1.3 WHEN any authenticated user queries the `automations` table directly THEN the system returns ALL automation configurations from ALL users

1.4 WHEN any authenticated user queries the `usage_logs` table directly THEN the system returns ALL usage logs from ALL users including sensitive usage data

1.5 WHEN any authenticated user queries the `workspaces`, `workspace_members`, or `workspace_invites` tables directly THEN the system returns ALL workspace data from ALL users

1.6 WHEN any authenticated user queries the `profiles` table directly THEN the system returns ALL user profiles including email addresses and personal information

#### 2. Unprotected API Routes (Missing Authentication)

1.7 WHEN an unauthenticated user sends a request to `/api/generate` THEN the system processes the request and generates content without requiring authentication

1.8 WHEN an unauthenticated user sends a request to `/api/research` THEN the system performs research operations without requiring authentication

1.9 WHEN an unauthenticated user sends a request to `/api/ai-brain` THEN the system provides AI brain functionality without requiring authentication

1.10 WHEN an unauthenticated user sends a request to `/api/competitor-analysis` THEN the system performs competitor analysis without requiring authentication

1.11 WHEN an unauthenticated user sends a request to `/api/content-remix` THEN the system performs content remixing without requiring authentication

1.12 WHEN an unauthenticated user sends a request to `/api/ai-images` THEN the system generates images without requiring authentication

1.13 WHEN an unauthenticated user sends a request to `/api/revenue/dashboard` THEN the system returns revenue analytics data without requiring authentication

1.14 WHEN an unauthenticated user sends a request to `/api/automations` THEN the system returns automation data without requiring authentication

1.15 WHEN an unauthenticated user sends a request to `/api/export` THEN the system exports data without requiring authentication

#### 3. User-Controlled Identity Parameters

1.16 WHEN User A sends a POST request to `/api/generate` with `userId: "user-b-id"` in the request body THEN the system generates content attributed to User B and stores it under User B's account

1.17 WHEN User A sends a GET request to `/api/revenue/dashboard?userId=user-b-id` THEN the system returns User B's revenue analytics data to User A

1.18 WHEN User A manipulates the `userId` parameter in any API request THEN the system uses that user-provided value instead of the authenticated session's userId

1.19 WHEN User A provides a different userId in the request body THEN the system bypasses rate limits associated with User A's account by using User B's quotas

#### 4. Missing Role-Based Access Control (RBAC)

1.20 WHEN a non-owner/non-admin user attempts to invite members to a workspace THEN the system allows the operation without checking workspace permissions

1.21 WHEN any workspace member attempts to modify workspace settings THEN the system allows the operation without verifying owner/admin role

1.22 WHEN any user attempts to delete a workspace THEN the system allows the operation without verifying the user is the workspace owner

### Expected Behavior (Correct)

#### 1. Row-Level Security (RLS) Policies - Database Isolation

2.1 WHEN any authenticated user queries the `projects` table directly via Supabase client THEN the system SHALL return ONLY projects where `user_id = auth.uid()` (requester's own projects)

2.2 WHEN any authenticated user queries the `brand_memory` table directly THEN the system SHALL return ONLY brand memory records where `user_id = auth.uid()`

2.3 WHEN any authenticated user queries the `automations` table directly THEN the system SHALL return ONLY automation configurations where `user_id = auth.uid()`

2.4 WHEN any authenticated user queries the `usage_logs` table directly THEN the system SHALL return ONLY usage logs where `user_id = auth.uid()`

2.5 WHEN any authenticated user queries the `workspaces` table directly THEN the system SHALL return ONLY workspaces where the user is the owner OR is a member (via `workspace_members` join)

2.6 WHEN any authenticated user queries the `workspace_members` table directly THEN the system SHALL return ONLY membership records for workspaces where the user is the owner OR is a member

2.7 WHEN any authenticated user queries the `workspace_invites` table directly THEN the system SHALL return ONLY invites for workspaces where the user is the owner OR is the invitee

2.8 WHEN any authenticated user queries the `profiles` table directly THEN the system SHALL return ONLY the user's own profile record where `id = auth.uid()`

#### 2. API Authentication - Protected Routes

2.9 WHEN an unauthenticated user sends a request to `/api/generate` THEN the system SHALL reject the request with a 401 Unauthorized status and error message "Authentication required"

2.10 WHEN an unauthenticated user sends a request to `/api/research` THEN the system SHALL reject the request with a 401 Unauthorized status

2.11 WHEN an unauthenticated user sends a request to `/api/ai-brain` THEN the system SHALL reject the request with a 401 Unauthorized status

2.12 WHEN an unauthenticated user sends a request to `/api/competitor-analysis` THEN the system SHALL reject the request with a 401 Unauthorized status

2.13 WHEN an unauthenticated user sends a request to `/api/content-remix` THEN the system SHALL reject the request with a 401 Unauthorized status

2.14 WHEN an unauthenticated user sends a request to `/api/ai-images` THEN the system SHALL reject the request with a 401 Unauthorized status

2.15 WHEN an unauthenticated user sends a request to `/api/revenue/dashboard` THEN the system SHALL reject the request with a 401 Unauthorized status

2.16 WHEN an unauthenticated user sends a request to `/api/automations` THEN the system SHALL reject the request with a 401 Unauthorized status

2.17 WHEN an unauthenticated user sends a request to `/api/export` THEN the system SHALL reject the request with a 401 Unauthorized status

#### 3. Session-Based User Identity - No User-Controlled Parameters

2.18 WHEN any authenticated user sends a POST request to `/api/generate` THEN the system SHALL use the userId from the authenticated session (`user.id` from `requireUser()`) and SHALL ignore any `userId` parameter in the request body

2.19 WHEN any authenticated user sends a GET request to `/api/revenue/dashboard` THEN the system SHALL use the userId from the authenticated session and SHALL ignore any `userId` query parameter

2.20 WHEN any authenticated user makes any API request THEN the system SHALL derive the userId exclusively from the authenticated session token, never from request body, query parameters, or headers

2.21 WHEN any authenticated user attempts to access resources THEN the system SHALL verify that the resource's `user_id` matches the authenticated session's userId before allowing access

#### 4. Role-Based Access Control (RBAC) - Workspace Authorization

2.22 WHEN a non-owner/non-admin user attempts to invite members to a workspace THEN the system SHALL reject the request with a 403 Forbidden status and error message "Only workspace owners and admins can invite members"

2.23 WHEN a non-owner/non-admin workspace member attempts to modify workspace settings THEN the system SHALL reject the request with a 403 Forbidden status

2.24 WHEN a non-owner user attempts to delete a workspace THEN the system SHALL reject the request with a 403 Forbidden status and error message "Only workspace owners can delete workspaces"

2.25 WHEN any user attempts a workspace operation THEN the system SHALL first verify the user's role in that workspace before allowing the operation

### Unchanged Behavior (Regression Prevention)

#### Legitimate User Access

3.1 WHEN an authenticated user accesses their own projects via the application UI THEN the system SHALL CONTINUE TO return the user's projects with correct data and metadata

3.2 WHEN an authenticated user creates a new project THEN the system SHALL CONTINUE TO create the project with `user_id` set to the authenticated user's ID

3.3 WHEN an authenticated user updates their own brand memory THEN the system SHALL CONTINUE TO save the changes successfully

3.4 WHEN an authenticated user creates an automation for their own account THEN the system SHALL CONTINUE TO create and execute the automation successfully

#### Workspace Collaboration

3.5 WHEN a workspace owner invites a member to their workspace THEN the system SHALL CONTINUE TO send the invitation and allow the member to join upon acceptance

3.6 WHEN a workspace member views shared workspace resources THEN the system SHALL CONTINUE TO display those resources correctly based on workspace membership

3.7 WHEN multiple members collaborate on a shared workspace project THEN the system SHALL CONTINUE TO allow collaborative editing and access based on workspace membership

#### Public/Health Routes

3.8 WHEN an unauthenticated user accesses `/api/health` THEN the system SHALL CONTINUE TO return the health check status without requiring authentication

3.9 WHEN an unauthenticated user accesses public marketing pages THEN the system SHALL CONTINUE TO display those pages without requiring authentication

3.10 WHEN webhook services call `/api/webhooks/*` endpoints THEN the system SHALL CONTINUE TO process webhooks using signature verification instead of user authentication

#### Rate Limiting and Usage Tracking

3.11 WHEN an authenticated user makes API requests THEN the system SHALL CONTINUE TO track usage against their own account's quotas and rate limits

3.12 WHEN an authenticated user exceeds their rate limit THEN the system SHALL CONTINUE TO return a 429 Too Many Requests status

3.13 WHEN an authenticated user generates content THEN the system SHALL CONTINUE TO increment their usage counters correctly
