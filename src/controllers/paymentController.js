const Stripe = require("stripe");
const Payment = require("../models/Payment");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Student: create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amountLKR, purpose } = req.body;

    if (amountLKR === undefined || amountLKR === null) {
      return res.status(400).json({ message: "amountLKR is required" });
    }

    const amount = Number(amountLKR);
    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: "amountLKR must be a number >= 0" });
    }

    // Stripe uses smallest currency unit. LKR is typically treated as 2 decimal places by Stripe,
    // but for simplicity we’ll treat input as a whole amount and convert to cents-like unit.
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