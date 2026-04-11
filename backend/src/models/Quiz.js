const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer'],
    default: 'multiple_choice'
  },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  marks: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', default: null },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  questions: [questionSchema],
  totalMarks: { type: Number, default: 0 },
  passMark: { type: Number, required: true },
  timeLimitMinutes: { type: Number, default: null },
  maxAttempts: { type: Number, default: 3 },
  isPublished: { type: Boolean, default: false },
  unlockAfterMission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', default: null },
  googleFormId: { type: String, default: null },
  googleFormUrl: { type: String, default: null }
}, { timestamps: true });

quizSchema.pre('save', async function() {
  this.totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
});

module.exports = mongoose.model('Quiz', quizSchema);
