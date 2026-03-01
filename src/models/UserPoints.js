const mongoose = require("mongoose");
 
const userPointsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    totalPoints: { type: Number, default: 0 },
    history: [
      {
        action: { type: String },
        points: { type: Number },
        description: { type: String },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("UserPoints", userPointsSchema);
