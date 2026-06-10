-- BlogCraft AI core tables (Supabase Postgres)
-- Apply in Supabase SQL editor or via migrations tooling.

-- Brand memory / onboarding profile
create table if not exists public.brand_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  niche text not null default '',
  writing_style text not null default '',
  target_audience text not null default '',
  brand_tone text not null default '',
  seo_goals text not null default '',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects (documents)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  content_type text not null default 'blog',
  seo_score int,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_updated_at_idx on public.projects (user_id, updated_at desc);

-- RLS
alter table public.brand_profiles enable row level security;
alter table public.projects enable row level security;

-- Policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'brand_profiles' and policyname = 'brand_profiles_owner_rw'
  ) then
    create policy brand_profiles_owner_rw on public.brand_profiles
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'projects_owner_rw'
  ) then
    create policy projects_owner_rw on public.projects
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

