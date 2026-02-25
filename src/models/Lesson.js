const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    content: { type: String },
    order: { type: Number, required: true },
    duration: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    resources: [
      {
        name: { type: String },
        url: { type: String },
        publicId: { type: String },
        type: { type: String, enum: ["pdf", "video", "slides", "other"] },
        size: { type: Number },
        isDownloadable: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);