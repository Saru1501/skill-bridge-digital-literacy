const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    studentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amountLKR: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "lkr",
      lowercase: true,
      trim: true,
    },

    purpose: {
      type: String,
      trim: true,
      default: "course_payment",
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["CREATED", "SUCCEEDED", "FAILED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);