# 🔑 BlogCraft AI - API Keys Setup Guide

## **STEP 1: OpenAI API Key (5 minutes)**

1. **Go to**: https://platform.openai.com/api-keys
2. **Sign up/Login** with your account
3. **Click**: "Create new secret key"
4. **Name it**: "BlogCraft AI"
5. **Copy the key** (starts with sk-...)
6. **Add $10+ credit** to your account at https://platform.openai.com/account/billing

**Update .env.local:**
```
OPENAI_API_KEY=sk-your_actual_key_here
```

---

## **STEP 2: Supabase Database (5 minutes)**

1. **Go to**: https://supabase.com
2. **Sign up** and create new project
3. **Project name**: "blogcraft-ai"
4. **Database password**: Create a strong password
5. **Region**: Choose closest to you
6. **Wait 2 minutes** for project creation

**Get your keys:**
- Go to **Settings** → **API**
- Copy **Project URL** and **anon public key**
- Copy **service_role secret key**

**Update .env.local:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Set up database:**
- Go to **SQL Editor** in Supabase
- Copy and paste the SQL from `scripts/setup-database.sql`
- Click **Run**

---

## **STEP 3: Stripe Payments (5 minutes)**

1. **Go to**: https://stripe.com
2. **Sign up** for account
3. **Complete verification** (may take 1-2 days for live payments)
4. **For now, use test keys**

**Get test keys:**
- Go to **Developers** → **API Keys**
- Copy **Publishable key** (starts with pk_test_...)
- Copy **Secret key** (starts with sk_test_...)

**Update .env.local:**
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

## **STEP 4: Email Setup (5 minutes)**

1. **Create Gmail account**: hello@yourdomain.com (or use existing)
2. **Enable 2-Factor Authentication**
3. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

**Update .env.local:**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

---

## **STEP 5: Update App URL**

**For local development:**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For production (after deployment):**
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

---

## **✅ Final .env.local Example:**

```env
# OpenAI API Key
OPENAI_API_KEY=sk-proj-abc123...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_51abc123...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51abc123...
STRIPE_WEBHOOK_SECRET=whsec_abc123...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=hello@yourdomain.com
EMAIL_PASS=abcd efgh ijkl mnop

# Instantly.ai API (optional for now)
INSTANTLY_API_KEY=your_instantly_api_key
```

---

## **🚨 IMPORTANT NOTES:**

1. **Never commit .env.local to git** (it's already in .gitignore)
2. **Keep your API keys secret**
3. **Use test keys initially**, switch to live keys when ready
4. **OpenAI charges per API call** - monitor usage
5. **Supabase is free up to certain limits**

---

## **✅ Next Steps After API Setup:**

1. Test the application locally: `npm run dev`
2. Generate your first blog post
3. Deploy to Vercel
4. Start lead generation

**Need help?** Check the troubleshooting section in deployment-guide.md