# BlogCraft AI — Production Build Guide

## Architecture

```
app/
├── (marketing)/          # Landing page
├── (dashboard)/          # Protected workspace
├── api/                  # REST APIs
│   ├── ai/               # Generate + transform
│   ├── blog/pipeline/    # Full content workflow
│   ├── workspace/        # Brand memory + projects
│   ├── razorpay/         # Billing checkout + verify
│   └── webhooks/razorpay # Subscription lifecycle
lib/
├── ai/router.ts          # OpenAI → Gemini fallback
├── auth/                 # Session + user bootstrap
├── seo/analyzer.ts       # SEO scoring
└── razorpay.ts           # Plans + Razorpay client
```

## Prerequisites

1. **Supabase** — PostgreSQL, Auth, Storage
2. **OpenAI** — Primary AI + DALL-E images
3. **Google AI** — Gemini fallback
4. **Razorpay** — INR subscriptions

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

### Environment variables

See `.env.local.example` for all keys. Required for production:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB writes (webhooks, billing) |
| `OPENAI_API_KEY` | AI generation |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Checkout |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification |
| `RAZORPAY_PLAN_PRO` / `RAZORPAY_PLAN_BUSINESS` | Plan IDs from Razorpay dashboard |

### Database

Run migrations in order — see **[db/README.md](../db/README.md)**.

### Supabase Auth

1. Enable Email, Google, and GitHub under Authentication → Providers
2. Add redirect URL: `https://your-domain.com/auth/callback`
3. For local dev: `http://localhost:3000/auth/callback`

### Razorpay

1. Create subscription plans: Pro (₹999/mo), Business (₹2,999/mo)
2. Copy plan IDs to `RAZORPAY_PLAN_PRO` and `RAZORPAY_PLAN_BUSINESS`
3. Webhook endpoint: `https://your-domain.com/api/webhooks/razorpay`
4. Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`

## Feature map

| Feature | Route | API |
|---------|-------|-----|
| AI Writer | `/dashboard/writer` | `/api/ai/generate`, `/api/ai/transform` |
| Full pipeline | Writer → Full pipeline | `/api/blog/pipeline` |
| Research | `/dashboard/research` | `/api/research` |
| SEO Engine | `/dashboard/seo` | `/api/seo/analyze` |
| Images | `/dashboard/images` | `/api/ai-images`, `/api/images/save` |
| Automations | `/dashboard/automations` | `/api/automations` |
| Billing | `/dashboard/billing` | `/api/razorpay/subscribe` |

## Deploy (Vercel)

```bash
npm run build
vercel --prod
```

Add all env vars in Vercel project settings.

## Security

- Supabase middleware protects dashboard pages; API routes return JSON 401
- Rate limiting on AI routes (30 req/min)
- Usage limits by plan enforced server-side via `entitlements` + `ai_usage`
- Never commit `.env.local`
- Service role key is server-only (`lib/supabase/admin.ts`)

## Optional: FastAPI microservice

For heavy AI workloads, run `services/ai-service` via Docker Compose. Point `AI_SERVICE_URL` from Next.js when ready.
