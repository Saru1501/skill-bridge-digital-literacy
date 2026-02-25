const Stripe = require("stripe");
const Payment = require("../models/Payment");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// STUDENT create payment intent
exports.createPaymentIntent = async (req, res) => {
  const { courseId, amountLKR } = req.body;
  if (!courseId || !amountLKR) {
    return res.status(400).json({ message: "courseId and amountLKR required" });
  }

  // Stripe works in smallest currency unit. LKR has no decimals => use amountLKR as is.
  const intent = await stripe.paymentIntents.create({
    amount: Number(amountLKR),
    currency: "lkr",
    automatic_payment_methods: { enabled: true },
    metadata: {
      courseId,
      studentId: req.user._id.toString(),
    },
  });

  const payment = await Payment.create({
    student: req.user._id,
    courseId,
    amountLKR,
    status: "CREATED",
    stripePaymentIntentId: intent.id,
  });

  res.status(201).json({
    clientSecret: intent.client_secret,
    paymentId: payment._id,
    stripePaymentIntentId: intent.id,
  });
};

// STUDENT confirm payment success (simplified)
exports.markPaid = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  // only owner can mark it
  if (payment.student.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  payment.status = "PAID";
  await payment.save();

  res.json(payment);
};