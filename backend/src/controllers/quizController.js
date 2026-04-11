const Quiz = require('../models/Quiz');

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const filter = { course: req.query.course };
    if (req.user.role === 'student') filter.isPublished = true;
    const quizzes = await Quiz.find(filter).select('-questions.correctAnswer'); // hide answers from student list
    res.json({ success: true, data: quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // strip correct answers for students
    if (req.user.role === 'student') {
      quiz = quiz.toObject();
      quiz.questions = quiz.questions.map(({ correctAnswer, ...rest }) => rest);
    }

    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    quiz.isPublished = !quiz.isPublished;
    await quiz.save();
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};