const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    courseId: { type: String, required: true }, // keep as string now (later link to Course)
    amountLKR: { type: Number, required: true },

    method: { type: String, enum: ["CARD"], default: "CARD" },
    status: { type: String, enum: ["CREATED", "PAID", "FAILED"], default: "CREATED" },

    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);