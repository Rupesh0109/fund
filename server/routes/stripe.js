require('dotenv').config()
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const PaidUser = require('../models/PaidUser');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICES = {
  basic: 2000,
  standard: 4000,
  video: 2000
};

router.post('/create-checkout-session', async (req, res) => {
  const { plan, email } = req.body;
  try {
    console.log("Checking existing payment for email:", email);
    // Check if user already has an unused payment
    const existingUnusedPayment = await PaidUser.findOne({ email, used: false });
    if (existingUnusedPayment) {
      console.log("User has an unused payment, blocking new payment.");
      return res.status(400).json({ message: 'You have an unused payment. Please use it to raise a campaign before purchasing another plan.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` },
            unit_amount: PLAN_PRICES[plan],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?email=${encodeURIComponent(email)}&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/?canceled=true`,
      metadata: { email, plan }
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation error:", err);
    res.status(500).json({ message: 'Stripe session creation failed', error: err.message });
  }
});

// Recreated /record-payment route to record payment on success URL redirect
router.get('/record-payment', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ success: false, message: 'Missing session_id' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_email || session.metadata?.email;
    const plan = session.metadata?.plan;

    if (!email || !plan) {
      return res.status(400).json({ success: false, message: 'Email or plan missing from session' });
    }

    // Avoid duplicate
    const exists = await PaidUser.findOne({ sessionId: session_id });
    if (exists) return res.json({ success: true, message: 'Payment already recorded' });

    await PaidUser.create({
      email,
      plan,
      sessionId: session_id,
      paidAt: new Date(),
      stripeCustomerId: session.customer,
      used: false,
    });

    return res.json({ success: true, message: 'Payment recorded successfully' });
  } catch (err) {
    console.error("Payment recording failed", err.message);
    return res.status(500).json({ success: false, message: 'Error recording payment' });
  }
});


router.post('/check-paid', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await PaidUser.findOne({ email, used: false });
    if (user) {
      res.json({ paid: true, plan: user.plan || '' });
    } else {
      res.json({ paid: false, plan: '' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error checking payment status' });
  }
});

module.exports = router;
