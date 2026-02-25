const mongoose = require("mongoose");

const sponsorshipApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "SponsorshipProgram", required: true },

    fullName: { type: String, required: true },
    nic: { type: String, required: true }, // Sri Lanka NIC
    phone: { type: String, required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    sponsorshipCode: { type: String }, // issued on approval
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // NGO/Admin
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SponsorshipApplication", sponsorshipApplicationSchema);