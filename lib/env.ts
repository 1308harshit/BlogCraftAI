import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  RAZORPAY_PLAN_PRO: z.string().min(1).optional(),
  RAZORPAY_PLAN_BUSINESS: z.string().min(1).optional(),
  WORDPRESS_SITE_URL: z.string().url().optional(),
  WORDPRESS_USERNAME: z.string().min(1).optional(),
  WORDPRESS_APP_PASSWORD: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  DEMO_MODE: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
})

function formatZodError(error: z.ZodError) {
  return error.issues
    .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n')
}

export const envPublic = (() => {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  if (!parsed.success) {
    throw new Error(`Invalid public environment variables:\n${formatZodError(parsed.error)}`)
  }

  return parsed.data
})()

export const envServer = (() => {
  if (typeof window !== 'undefined') {
    // Prevent accidental client-bundle access to secrets.
    throw new Error('envServer must not be imported in the browser.')
  }

  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    RAZORPAY_PLAN_PRO: process.env.RAZORPAY_PLAN_PRO,
    RAZORPAY_PLAN_BUSINESS: process.env.RAZORPAY_PLAN_BUSINESS,
    WORDPRESS_SITE_URL: process.env.WORDPRESS_SITE_URL,
    WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME,
    WORDPRESS_APP_PASSWORD: process.env.WORDPRESS_APP_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    DEMO_MODE: process.env.DEMO_MODE,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!parsed.success) {
    throw new Error(`Invalid server environment variables:\n${formatZodError(parsed.error)}`)
  }

  return parsed.data
})()

