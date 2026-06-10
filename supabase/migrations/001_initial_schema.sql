-- BlogCraft AI — Supabase schema
-- Run in Supabase SQL editor or via CLI

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text unique not null,
  email text,
  name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'business', 'enterprise')),
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists brand_memory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  niche text,
  writing_style text,
  target_audience text,
  brand_tone text,
  seo_goals text,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text default '',
  content_type text default 'blog',
  seo_score int,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  action text not null,
  tokens_used int default 0,
  provider text,
  created_at timestamptz default now()
);

create table if not exists automations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  trigger_type text not null,
  config jsonb default '{}',
  enabled boolean default true,
  last_run_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_profiles_clerk on profiles(clerk_user_id);
create index if not exists idx_projects_user on projects(user_id);

alter table profiles enable row level security;
alter table brand_memory enable row level security;
alter table projects enable row level security;
