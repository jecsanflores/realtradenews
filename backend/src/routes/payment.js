const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { plan, email } = req.body;

  const prices = {
    'pro': 'price_pro_monthly',
    'enterprise': 'price_enterprise_monthly'
  };

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        plan,
        email
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for subscription updates
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      console.log(`Subscription ${subscription.id} for ${subscription.metadata.email}`);
      // TODO: Update user plan in database
      break;

    case 'customer.subscription.deleted':
      const deleted = event.data.object;
      console.log(`Subscription ${deleted.id} cancelled`);
      // TODO: Downgrade user to free plan
      break;
  }

  res.json({ received: true });
});

// Get subscription status
router.get('/status/:email', async (req, res) => {
  try {
    const customers = await stripe.customers.list({ email: req.params.email });
    if (customers.data.length === 0) {
      return res.json({ plan: 'free' });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id });

    if (subscriptions.data.length === 0) {
      return res.json({ plan: 'free' });
    }

    const subscription = subscriptions.data[0];
    res.json({
      plan: subscription.metadata.plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
