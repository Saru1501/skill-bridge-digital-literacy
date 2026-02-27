const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  givenAnswer: { type: String, default: null },
  isCorrect: { type: Boolean, default: false },
  marksAwarded: { type: Number, default: 0 }
});

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
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
  answers: [answerSchema],
  totalMarksAwarded: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  isPassed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'timed_out'],
    default: 'in_progress'
  },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: null },
  attemptNumber: { type: Number, required: true }  // 1st, 2nd, 3rd attempt
}, { timestamps: true });

quizAttemptSchema.index({ quiz: 1, student: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);