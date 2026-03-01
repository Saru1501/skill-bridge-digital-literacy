const mongoose = require("mongoose");
 
const feeReductionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    discountPercentage: { type: Number, required: true },
    reason: { type: String },
    pointsUsed: { type: Number, default: 0 },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
    expiresAt: { type: Date },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("FeeReduction", feeReductionSchema);
