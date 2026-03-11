// Script to set up Stripe products and prices
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    // Create the main product
    const product = await stripe.products.create({
      name: 'BlogCraft AI',
      description: 'Generate unlimited SEO-optimized blog posts with AI',
      images: ['https://blogcraft-ai.vercel.app/logo.svg'],
    });

    console.log('Product created:', product.id);

    // Create founder pricing (₹999/month)
    const founderPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 99900, // ₹999 in paise
      currency: 'inr',
      recurring: {
        interval: 'month',
      },
      nickname: 'Founder Special',
      metadata: {
        plan: 'founder',
      },
    });

    console.log('Founder price created:', founderPrice.id);

    // Create regular pricing (₹2,999/month)
    const regularPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 299900, // ₹2,999 in paise
      currency: 'inr',
      recurring: {
        interval: 'month',
      },
      nickname: 'Regular Plan',
      metadata: {
        plan: 'regular',
      },
    });

    console.log('Regular price created:', regularPrice.id);

    // Create annual founder pricing (₹9,999/year - 2 months free)
    const founderAnnualPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 999900, // ₹9,999 in paise
      currency: 'inr',
      recurring: {
        interval: 'year',
      },
      nickname: 'Founder Annual',
      metadata: {
        plan: 'founder-annual',
      },
    });

    console.log('Founder annual price created:', founderAnnualPrice.id);

    console.log('\n=== Setup Complete ===');
    console.log('Add these to your .env.local:');
    console.log(`STRIPE_PRODUCT_ID=${product.id}`);
    console.log(`STRIPE_FOUNDER_PRICE_ID=${founderPrice.id}`);
    console.log(`STRIPE_REGULAR_PRICE_ID=${regularPrice.id}`);
    console.log(`STRIPE_FOUNDER_ANNUAL_PRICE_ID=${founderAnnualPrice.id}`);

  } catch (error) {
    console.error('Error setting up Stripe products:', error);
  }
}

setupStripeProducts();