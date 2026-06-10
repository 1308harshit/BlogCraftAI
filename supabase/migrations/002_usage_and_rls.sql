-- Add usage tracking column
alter table profiles add column if not exists articles_generated int default 0;

-- RLS policies (service role bypasses; anon uses Clerk + server routes)
create policy "Users read own profile" on profiles for select using (true);
create policy "Users read own projects" on projects for select using (true);
create policy "Users read own brand memory" on brand_memory for select using (true);
