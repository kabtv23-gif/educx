// ─────────────────────────────────────────────
//  Netlify Function : create-checkout.js
//  Crée une session Stripe Checkout (abonnement mensuel)
//  Déployé automatiquement sur Netlify
// ─────────────────────────────────────────────

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Autoriser uniquement POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Headers CORS pour que ton HTML puisse appeler cette fonction
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const customerEmail = body.email || undefined;

    // Crée la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: '🚀 EDUCX Premium',
              description: 'Accès illimité à tous les cours — Maths, Physique, Chimie',
              images: [],
            },
            unit_amount: 1000, // 10,00 € en centimes
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      // Redirection après paiement réussi
      success_url: `${process.env.URL || 'http://localhost:8888'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      // Redirection si l'utilisateur annule
      cancel_url: `${process.env.URL || 'http://localhost:8888'}/index.html`,
      // Métadonnées utiles pour retrouver l'abonnement
      metadata: {
        source: 'educx_website',
      },
      // Permettre la promotion codes
      allow_promotion_codes: true,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
