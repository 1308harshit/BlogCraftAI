-- Workspaces + collaboration (minimal v1)

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  token text not null unique,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_approvals (
  project_id uuid primary key references public.projects(id) on delete cascade,
  status text not null default 'draft',
  requested_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invites enable row level security;
alter table public.project_comments enable row level security;
alter table public.project_approvals enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='workspaces' and policyname='workspaces_owner_read'
  ) then
    create policy workspaces_owner_read on public.workspaces
      for select using (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='workspaces' and policyname='workspaces_owner_insert'
  ) then
    create policy workspaces_owner_insert on public.workspaces
      for insert with check (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='workspace_members' and policyname='workspace_members_owner_rw'
  ) then
    create policy workspace_members_owner_rw on public.workspace_members
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='project_comments' and policyname='project_comments_owner_rw'
  ) then
    create policy project_comments_owner_rw on public.project_comments
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='project_approvals' and policyname='project_approvals_owner_rw'
  ) then
    create policy project_approvals_owner_rw on public.project_approvals
      for all
      using (true)
      with check (true);
  end if;
end $$;

