const mongoose = require('mongoose');

const missionSubmissionSchema = new mongoose.Schema({
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  responseText: { type: String, default: null },
  responseFileUrl: { type: String, default: null },
  responseUrl: { type: String, default: null },
  selectedOption: { type: Number, default: null },
  score: { type: Number, default: null },       // admin-graded score
  status: {
    type: String,
    enum: ['submitted', 'graded', 'resubmitted'],
    default: 'submitted'
  },
  feedback: { type: String, default: null },    // admin feedback
  isCompleted: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
  gradedAt: { type: Date, default: null }
}, { timestamps: true });

// one submission per student per mission (latest wins via update)
missionSubmissionSchema.index({ mission: 1, student: 1 });

module.exports = mongoose.model('MissionSubmission', missionSubmissionSchema);