-- Public release hardening: project approval isolation.
-- The previous policy used `using (true)`, exposing every approval record.

drop policy if exists project_approvals_owner_rw on public.project_approvals;

create policy project_approvals_project_owner_rw on public.project_approvals
  for all
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_approvals.project_id
        and projects.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_approvals.project_id
        and projects.user_id = auth.uid()
    )
  );
