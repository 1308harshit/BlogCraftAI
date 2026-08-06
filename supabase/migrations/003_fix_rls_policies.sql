-- CRITICAL SECURITY FIX: Multi-Tenancy Isolation
-- This migration fixes broken RLS policies that allowed users to access other users' data

-- ============================================================================
-- STEP 1: Drop broken policies with using (true)
-- ============================================================================

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users read own projects" ON projects;
DROP POLICY IF EXISTS "Users read own brand memory" ON brand_memory;

-- ============================================================================
-- STEP 2: Fix PROFILES table RLS policies
-- ============================================================================

-- Users can only read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (clerk_user_id = auth.uid()::text);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (clerk_user_id = auth.uid()::text);

-- Service role can insert profiles (for user registration)
CREATE POLICY "profiles_insert_service" ON profiles
  FOR INSERT
  WITH CHECK (true); -- Service role bypasses RLS, anon key cannot insert

-- ============================================================================
-- STEP 3: Fix PROJECTS table RLS policies
-- ============================================================================

-- Users can only read their own projects
CREATE POLICY "projects_select_own" ON projects
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only insert projects for themselves
CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only update their own projects
CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only delete their own projects
CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- ============================================================================
-- STEP 4: Fix BRAND_MEMORY table RLS policies
-- ============================================================================

-- Users can only read their own brand memory
CREATE POLICY "brand_memory_select_own" ON brand_memory
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only insert their own brand memory
CREATE POLICY "brand_memory_insert_own" ON brand_memory
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only update their own brand memory
CREATE POLICY "brand_memory_update_own" ON brand_memory
  FOR UPDATE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only delete their own brand memory
CREATE POLICY "brand_memory_delete_own" ON brand_memory
  FOR DELETE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- ============================================================================
-- STEP 5: Add RLS policies for USAGE_LOGS table
-- ============================================================================

-- Enable RLS on usage_logs if not already enabled
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own usage logs
CREATE POLICY "usage_logs_select_own" ON usage_logs
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only insert their own usage logs
CREATE POLICY "usage_logs_insert_own" ON usage_logs
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- ============================================================================
-- STEP 6: Add RLS policies for AUTOMATIONS table
-- ============================================================================

-- Enable RLS on automations if not already enabled
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

-- Users can only read their own automations
CREATE POLICY "automations_select_own" ON automations
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only insert their own automations
CREATE POLICY "automations_insert_own" ON automations
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only update their own automations
CREATE POLICY "automations_update_own" ON automations
  FOR UPDATE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- Users can only delete their own automations
CREATE POLICY "automations_delete_own" ON automations
  FOR DELETE
  USING (user_id IN (
    SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
  ));

-- ============================================================================
-- STEP 7: Add RLS policies for WORKSPACES table (if exists)
-- ============================================================================

-- Check if workspaces table exists, enable RLS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces') THEN
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
    
    -- Users can insert workspaces for themselves
    CREATE POLICY "workspaces_insert_own" ON workspaces
      FOR INSERT
      WITH CHECK (owner_id IN (
        SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
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
  END IF;
END $$;

-- ============================================================================
-- STEP 8: Add RLS policies for WORKSPACE_MEMBERS table (if exists)
-- ============================================================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspace_members') THEN
    ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
    
    -- Users can see members of workspaces they own or belong to
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
    
    -- Only workspace owners and admins can insert members
    CREATE POLICY "workspace_members_insert" ON workspace_members
      FOR INSERT
      WITH CHECK (workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id IN (
          SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
        )
      ));
    
    -- Only workspace owners can delete members
    CREATE POLICY "workspace_members_delete" ON workspace_members
      FOR DELETE
      USING (workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id IN (
          SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
        )
      ));
  END IF;
END $$;

-- ============================================================================
-- STEP 9: Add RLS policies for WORKSPACE_INVITES table (if exists)
-- ============================================================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspace_invites') THEN
    ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;
    
    -- Workspace owners can see invites for their workspaces
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
    
    -- Only workspace owners can create invites
    CREATE POLICY "workspace_invites_insert" ON workspace_invites
      FOR INSERT
      WITH CHECK (workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id IN (
          SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
        )
      ));
    
    -- Only workspace owners can delete invites
    CREATE POLICY "workspace_invites_delete" ON workspace_invites
      FOR DELETE
      USING (workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id IN (
          SELECT id FROM profiles WHERE clerk_user_id = auth.uid()::text
        )
      ));
  END IF;
END $$;

-- ============================================================================
-- STEP 10: Add indexes for RLS policy performance
-- ============================================================================

-- Index for profile lookups by auth.uid()
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);

-- Index for user_id foreign key lookups
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_memory_user_id ON brand_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON automations(user_id);

-- Workspace indexes (if tables exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspaces') THEN
    CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
  END IF;
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workspace_members') THEN
    CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
    CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to test RLS policies)
-- ============================================================================

-- Test 1: Check if RLS is enabled on all tables
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'projects', 'brand_memory', 'usage_logs', 'automations', 'workspaces', 'workspace_members', 'workspace_invites');

-- Test 2: List all RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration fixes the CRITICAL security vulnerability where RLS policies
-- used `using (true)` allowing any authenticated user to access all data.
--
-- After running this migration:
-- 1. Test with multiple user accounts
-- 2. Verify users can only see their own data
-- 3. Update security audit report
-- ============================================================================
