const mongoose = require("mongoose");
 
const gamificationConfigSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true
    },
    isEnabled: { type: Boolean, default: true },
    pointsEnabled: { type: Boolean, default: true },
    badgesEnabled: { type: Boolean, default: true },
    certificatesEnabled: { type: Boolean, default: true },
    leaderboardEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("GamificationConfig", gamificationConfigSchema);
