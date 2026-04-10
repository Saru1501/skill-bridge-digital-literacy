const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer'],
    default: 'multiple_choice'
  },
  options: [{ type: String }],        // for MCQ and true/false
  correctAnswer: { type: String, required: true }, // index as string "0","1" or exact text
  marks: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    default: null  // unlock condition: must complete this mission first
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  questions: [questionSchema],
  totalMarks: { type: Number, default: 0 },  // auto-calculated
  passMark: { type: Number, required: true },  // e.g. 50 means 50%
  timeLimitMinutes: { type: Number, default: null }, // null = no limit
  maxAttempts: { type: Number, default: 3 },   // -1 = unlimited
  isPublished: { type: Boolean, default: false },
  // unlock condition
  unlockAfterMission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    default: null
  }
}, { timestamps: true });

// auto-calculate totalMarks before saving
quizSchema.pre('save', function (next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);