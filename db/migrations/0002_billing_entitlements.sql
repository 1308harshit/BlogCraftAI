-- Billing + entitlements + usage metering (Razorpay)

create table if not exists public.plan_catalog (
  id text primary key,
  name text not null,
  monthly_price_paise int not null,
  generations_limit int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'razorpay',
  plan_id text not null references public.plan_catalog(id),
  provider_subscription_id text,
  status text not null default 'created',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null references public.plan_catalog(id),
  generations_limit int not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  provider text,
  model text,
  tokens_in int,
  tokens_out int
);

create index if not exists ai_usage_user_id_created_at_idx on public.ai_usage (user_id, created_at desc);

alter table public.plan_catalog enable row level security;
alter table public.subscriptions enable row level security;
alter table public.entitlements enable row level security;
alter table public.ai_usage enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plan_catalog' and policyname = 'plan_catalog_read'
  ) then
    create policy plan_catalog_read on public.plan_catalog
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'subscriptions' and policyname = 'subscriptions_owner_rw'
  ) then
    create policy subscriptions_owner_rw on public.subscriptions
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'entitlements' and policyname = 'entitlements_owner_read'
  ) then
    create policy entitlements_owner_read on public.entitlements
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_usage' and policyname = 'ai_usage_owner_insert_read'
  ) then
    create policy ai_usage_owner_insert_read on public.ai_usage
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_usage' and policyname = 'ai_usage_owner_insert'
  ) then
    create policy ai_usage_owner_insert on public.ai_usage
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

-- Seed plans (adjust pricing/limits as desired)
insert into public.plan_catalog (id, name, monthly_price_paise, generations_limit)
values
  ('free', 'Free', 0, 10),
  ('pro', 'Pro', 99900, 999999),
  ('business', 'Business', 299900, 999999)
on conflict (id) do nothing;

