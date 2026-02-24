const mongoose = require("mongoose");

const savedCourseSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedCourseSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("SavedCourse", savedCourseSchema);