-- New user bootstrap, storage bucket, and RLS fixes

-- Auto-provision free entitlements + brand profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.entitlements (user_id, plan_id, generations_limit)
  values (new.id, 'free', 10)
  on conflict (user_id) do nothing;

  insert into public.brand_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for AI-generated images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blogcraft-images',
  'blogcraft-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Workspace member visibility for owners
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'workspace_members'
      and policyname = 'workspace_members_workspace_read'
  ) then
    create policy workspace_members_workspace_read on public.workspace_members
      for select using (
        exists (
          select 1 from public.workspaces w
          where w.id = workspace_members.workspace_id
            and w.owner_id = auth.uid()
        )
        or auth.uid() = user_id
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'workspace_invites'
      and policyname = 'workspace_invites_owner_rw'
  ) then
    create policy workspace_invites_owner_rw on public.workspace_invites
      for all using (
        exists (
          select 1 from public.workspaces w
          where w.id = workspace_invites.workspace_id
            and w.owner_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.workspaces w
          where w.id = workspace_invites.workspace_id
            and w.owner_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'workspaces'
      and policyname = 'workspaces_owner_update'
  ) then
    create policy workspaces_owner_update on public.workspaces
      for update using (auth.uid() = owner_id)
      with check (auth.uid() = owner_id);
  end if;
end $$;

-- Allow workspace owners to add members
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'workspace_members'
      and policyname = 'workspace_members_owner_insert'
  ) then
    create policy workspace_members_owner_insert on public.workspace_members
      for insert with check (
        exists (
          select 1 from public.workspaces w
          where w.id = workspace_members.workspace_id
            and w.owner_id = auth.uid()
        )
      );
  end if;
end $$;
