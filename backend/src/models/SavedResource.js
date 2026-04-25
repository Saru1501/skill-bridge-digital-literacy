//SavedResource.js
const mongoose = require("mongoose");

const savedResourceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    resourceId: { type: String, required: true },
    resourceName: { type: String, default: "" },
    resourceType: { type: String, default: "other" },
    resourceUrl: { type: String, required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedResourceSchema.index({ student: 1, lesson: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model("SavedResource", savedResourceSchema);
