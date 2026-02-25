const mongoose = require("mongoose");

const sponsorshipProgramSchema = new mongoose.Schema(
  {
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
    title: { type: String, required: true },
    description: { type: String },
    maxStudents: { type: Number, default: 100 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SponsorshipProgram", sponsorshipProgramSchema);