const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null  // optional: tie to a specific lesson
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  submissionType: {
    type: String,
    enum: ['text', 'file', 'url', 'multiple_choice'],
    required: true
  },
  // if submissionType is multiple_choice
  options: [{ type: String }],
  correctOption: { type: Number, default: null },
  maxScore: { type: Number, default: 100 },
  isPublished: { type: Boolean, default: false },
  order: { type: Number, default: 0 }  // order within the course
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);