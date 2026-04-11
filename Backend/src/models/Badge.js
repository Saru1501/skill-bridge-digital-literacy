const mongoose = require("mongoose");
 
const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: "" },
    iconPublicId: { type: String },
    criteria: {
      type: {
        type: String,
        enum: ["course_completion", "quiz_score", "points_threshold", "streak"],
required: true
      },
      threshold: { type: Number, required: true },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Badge", badgeSchema);
