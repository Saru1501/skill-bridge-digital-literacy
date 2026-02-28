const mongoose = require("mongoose");

const sponsorshipProgramSchema = new mongoose.Schema(
  {
    ngoUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    maxStudents: {
      type: Number,
      default: 0, // 0 means unlimited
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SponsorshipProgram", sponsorshipProgramSchema);