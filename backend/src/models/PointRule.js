const mongoose = require("mongoose");
 
const pointRuleSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "lesson_completion", "quiz_pass", "course_completion",
        "mission_completion", "first_enrollment"
      ],
      required: true,
      unique: true,
    },
    points: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("PointRule", pointRuleSchema);
