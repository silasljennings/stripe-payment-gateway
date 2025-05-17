const dotenv = require('dotenv');
const express = require('express');

(process.env.NODE_ENV === 'development')  ? dotenv.config({ path: '.env.local' }) : dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3005;

// MUST REMAIN ABOVE THE app.use(express.json()) MIDDLEWARE LINE BELOW
// Webhook to handle Stripe events (e.g., successful payment, payment failure)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify the webhook signature and construct the event
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    console.log('Webhook received:', event);  // Log the event data

    // Handle the event (example for payment intent creation)
    if (event.type === 'payment_intent.created') {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent created: ${paymentIntent.id}`);
    }

    // Acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Endpoint to create a Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body; // The price ID passed from the client or API call

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // The Stripe price ID (can be for one-time or subscription)
          quantity: 1,
        },
      ],
      mode: 'payment', // Use 'subscription' if you want recurring payments
      success_url: `${process.env.BASE_URL}/success`,  // Success redirect
      cancel_url: `${process.env.BASE_URL}/cancel`,    // Cancel redirect
    });

    // Send session ID back to the client or calling service
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;  // amount and currency from the request body

  try {
    // Create a Payment Intent for a one-time payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,  // Amount in cents (e.g., 2000 for $20.00)
      currency: currency,  // Currency (e.g., "usd")
      payment_method_types: ['card'],  // Accepts card payments
    });

    // Return the client secret for the frontend to complete the payment
    res.json({
      clientSecret: paymentIntent.client_secret,  // Used on the frontend to confirm the payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

