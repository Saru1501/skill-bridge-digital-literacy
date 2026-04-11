const mongoose = require("mongoose");
 
const userBadgeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId, ref: "Badge", required: true
    },
    earnedAt: { type: Date, default: Date.now },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);
 
userBadgeSchema.index({ student: 1, badge: 1 }, { unique: true });
 
module.exports = mongoose.model("UserBadge", userBadgeSchema);
