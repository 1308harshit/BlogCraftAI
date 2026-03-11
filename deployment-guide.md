# 🚀 Complete Deployment Guide

## Prerequisites

1. **API Keys Required:**
   - OpenAI API key
   - Supabase project (URL + keys)
   - Stripe account (keys + webhook secret)
   - Gmail app password (for outreach)

2. **Accounts to Create:**
   - Vercel account (for hosting)
   - Supabase account (for database)
   - Stripe account (for payments)
   - Gmail account (for outreach emails)

## Step 1: Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your API keys in `.env.local`:**
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

## Step 2: Database Setup

1. **Create Supabase project:**
   - Go to https://supabase.com
   - Create new project
   - Copy URL and keys to `.env.local`

2. **Run database setup:**
   - Open Supabase SQL Editor
   - Copy and run the SQL from `scripts/setup-database.sql`

## Step 3: Stripe Setup

1. **Create Stripe account:**
   - Go to https://stripe.com
   - Create account and get API keys

2. **Set up products and pricing:**
   ```bash
   cd scripts
   npm install
   node setup-stripe-products.js
   ```

3. **Configure webhook:**
   - In Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`

## Step 4: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Set environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.local`

## Step 5: Lead Generation Setup

1. **Install dependencies for scripts:**
   ```bash
   cd scripts
   npm install
   ```

2. **Run lead scraping:**
   ```bash
   npm run scrape-leads
   ```

3. **Start automated outreach:**
   ```bash
   npm run daily-outreach
   ```

## Step 6: Monitoring & Analytics

1. **View campaign dashboard:**
   ```bash
   npm run analytics
   ```

2. **Generate weekly reports:**
   ```bash
   npm run weekly-report
   ```

## Step 7: Scale Your Operations

### Daily Routine:
```bash
# Morning: Check analytics
npm run analytics

# Run daily outreach (100 emails)
npm run daily-outreach

# Evening: Check results
npm run weekly-report
```

### Weekly Routine:
```bash
# Monday: Scrape new leads
npm run scrape-leads

# Wednesday: Run follow-up campaign
npm run follow-up

# Friday: Export data for analysis
node analytics-tracker.js export
```

## Revenue Optimization

### Month 1-2: Foundation
- Target: 50-100 customers
- Focus: Founder pricing (₹999/month)
- Revenue goal: ₹50,000-₹100,000/month

### Month 3-6: Scale
- Target: 500 customers
- Add: Annual plans, team features
- Revenue goal: ₹500,000/month

### Month 6-12: Expansion
- Target: 1000+ customers
- Add: API access, white-label
- Revenue goal: ₹1,000,000+/month

## Key Metrics to Track

1. **Email Metrics:**
   - Open rate: Target 25%+
   - Click rate: Target 3%+
   - Reply rate: Target 2%+

2. **Conversion Metrics:**
   - Email to signup: Target 1%+
   - Signup to paid: Target 10%+
   - Overall conversion: Target 0.1%+

3. **Revenue Metrics:**
   - Monthly recurring revenue (MRR)
   - Customer acquisition cost (CAC)
   - Lifetime value (LTV)

## Troubleshooting

### Common Issues:

1. **OpenAI API errors:**
   - Check API key validity
   - Monitor usage limits
   - Handle rate limiting

2. **Email delivery issues:**
   - Use Gmail app passwords
   - Monitor bounce rates
   - Warm up email domain

3. **Stripe webhook failures:**
   - Verify webhook URL
   - Check endpoint security
   - Monitor webhook logs

### Performance Optimization:

1. **Database:**
   - Add indexes for frequently queried fields
   - Monitor query performance
   - Set up connection pooling

2. **Email Outreach:**
   - Rotate email accounts
   - Use email warming services
   - Monitor sender reputation

3. **Lead Quality:**
   - Refine scraping criteria
   - Improve lead scoring
   - A/B test email templates

## Legal Considerations

1. **Email Compliance:**
   - Include unsubscribe links
   - Follow CAN-SPAM Act
   - Respect GDPR requirements

2. **Data Privacy:**
   - Secure lead data storage
   - Implement data retention policies
   - Provide data deletion options

3. **Terms of Service:**
   - Create clear terms and privacy policy
   - Handle refunds and cancellations
   - Comply with local regulations

## Success Checklist

- [ ] All API keys configured
- [ ] Database tables created
- [ ] Stripe products set up
- [ ] Application deployed to Vercel
- [ ] Lead scraping working
- [ ] Email outreach running
- [ ] Analytics tracking conversions
- [ ] First customers acquired

## Support & Maintenance

### Daily Tasks:
- Monitor email delivery
- Check conversion metrics
- Respond to customer inquiries

### Weekly Tasks:
- Analyze campaign performance
- Update lead generation scripts
- Optimize email templates

### Monthly Tasks:
- Review financial metrics
- Plan feature updates
- Scale infrastructure as needed

---

**Ready to launch your AI startup? Follow this guide step by step and you'll have a fully operational business generating revenue within 30 days!**

For questions or support, refer to the individual script documentation or check the troubleshooting section above.