import Stripe from 'stripe'

// Create Stripe instance with fallback for demo mode
export const stripe = process.env.STRIPE_SECRET_KEY?.startsWith('sk_') 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })
  : null // Demo mode - no real Stripe instance

export const getStripeSession = async (
  priceId: string,
  userId: string,
  userEmail: string
) => {
  if (!stripe) {
    // Demo mode
    return {
      id: 'demo_session_id',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?demo_payment=success`
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  })

  return session
}