const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Basic IT", "Internet Safety", "Online Jobs", "Digital Payments", "Digital Tools"],
      required: true,
    },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    thumbnail: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    totalLessons: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);