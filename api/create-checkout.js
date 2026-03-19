import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { email } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      allow_promotion_codes: true,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: '🚀 EDUCX Premium',
            description: 'Accès illimité à tous les cours — Maths, Physique, Chimie',
          },
          recurring: { interval: 'month' },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      success_url: 'https://educx-coral.vercel.app/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://educx-coral.vercel.app/index.html',
      metadata: { source: 'educx_website' },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

