const Stripe = require("stripe");
const Payment = require("../models/Payment");

// Student: create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amountLKR, purpose } = req.body;

    if (amountLKR === undefined || amountLKR === null) {
      return res.status(400).json({ message: "amountLKR is required" });
    }

    const amount = Number(amountLKR);
    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: "amountLKR must be a number >= 0" });
    }

    const stripeAmount = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: "lkr",
      metadata: {
        studentUserId: String(req.user._id),
        purpose: purpose || "course_payment",
      },
    });

    const payment = await Payment.create({
      studentUser: req.user._id,
      amountLKR: amount,
      currency: "lkr",
      purpose: purpose || "course_payment",
      stripePaymentIntentId: paymentIntent.id,
      status: "CREATED",
    });

    return res.status(201).json({
      message: "Payment intent created",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      payment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { createPaymentIntent };