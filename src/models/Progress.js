const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    completionPercentage: { type: Number, default: 0 },
    lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    lastAccessedAt: { type: Date, default: Date.now },
    downloadedResources: [{ type: String }],
    isCourseCompleted: { type: Boolean, default: false },
    courseCompletedAt: { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);