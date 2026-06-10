# Database migrations

Run these SQL files **in order** in the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

1. `0001_blogcraft_core.sql` — brand profiles, projects, RLS
2. `0002_billing_entitlements.sql` — plans, subscriptions, entitlements, usage metering
3. `0003_automations_runs.sql` — automations and run history
4. `0004_workspaces_collab.sql` — workspaces, invites, comments
5. `0005_bootstrap_storage.sql` — new-user trigger, image storage bucket, RLS fixes

## After migrations

1. **Auth providers** — Enable Email, Google, and GitHub under Authentication → Providers.
2. **Redirect URLs** — Add `http://localhost:3000/auth/callback` (and your production URL).
3. **Storage** — Migration `0005` creates the `blogcraft-images` public bucket.
4. **Razorpay** — Create Pro/Business subscription plans; copy plan IDs to `.env.local`.

## Verify

```sql
select * from plan_catalog;
select tablename from pg_tables where schemaname = 'public' order by 1;
```

New signups automatically receive a free `entitlements` row and empty `brand_profiles` row via the `on_auth_user_created` trigger.
