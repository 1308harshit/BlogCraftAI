# BlogCraft AI — AI Blogging Operating System

**Write smarter. Rank faster. Scale infinitely.**

Premium AI SaaS for creators, startups, agencies, and marketers. A complete blogging OS with research, writing, SEO, automations, and publishing.

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind, Framer Motion, Shadcn-style UI
- **Auth:** Supabase Auth (email/password + Google/GitHub OAuth)
- **Database:** Supabase PostgreSQL with RLS
- **AI:** OpenAI primary + Gemini fallback (`lib/ai/router.ts`)
- **Payments:** Razorpay subscriptions (INR-first)
- **Editor:** TipTap with inline AI transforms
- **State:** Zustand

## Quick start

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase, OpenAI/Gemini, and Razorpay keys
```

Apply database migrations — see **[db/README.md](db/README.md)**.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

See **[docs/BUILD.md](docs/BUILD.md)** for full setup, Razorpay webhooks, and deployment.

## Key routes

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/signup` | Create account (Supabase Auth) |
| `/login` | Sign in |
| `/onboarding` | Brand memory setup |
| `/dashboard` | Main workspace |
| `/dashboard/writer` | TipTap AI editor + full pipeline |
| `/dashboard/research` | Research agent |
| `/dashboard/seo` | SEO engine |
| `/dashboard/billing` | Razorpay plans |

## Plans

- **Free** — 10 generations/month
- **Pro** — Unlimited writing, SEO, research
- **Business** — Teams, automations, integrations

---

Built for the next generation of content creators.
