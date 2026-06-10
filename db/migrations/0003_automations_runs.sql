-- Automations + run history

create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  trigger_type text not null default 'manual',
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists automations_user_id_created_at_idx on public.automations (user_id, created_at desc);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists automation_runs_user_id_created_at_idx on public.automation_runs (user_id, created_at desc);

alter table public.automations enable row level security;
alter table public.automation_runs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'automations' and policyname = 'automations_owner_rw'
  ) then
    create policy automations_owner_rw on public.automations
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'automation_runs' and policyname = 'automation_runs_owner_read'
  ) then
    create policy automation_runs_owner_read on public.automation_runs
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'automation_runs' and policyname = 'automation_runs_owner_insert'
  ) then
    create policy automation_runs_owner_insert on public.automation_runs
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

