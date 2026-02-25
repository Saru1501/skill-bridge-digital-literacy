const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    referralPrefix: { type: String, default: "NGO" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("NGO", ngoSchema);