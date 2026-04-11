const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const MissionSubmission = require('../models/MissionSubmission');
const { calculateQuizScore, evaluatePassFail } = require('../services/scoreService');
const { emitQuizScored, emitCourseAssessmentCompleted } = require('../services/eventService');

// POST /api/quizzes/:quizId/attempt/start  (student starts attempt)
exports.startAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isPublished)
      return res.status(404).json({ success: false, message: 'Quiz not found' });

    // ── Unlock condition check ──────────────────────────────────────
    if (quiz.unlockAfterMission) {
      const missionDone = await MissionSubmission.findOne({
        mission: quiz.unlockAfterMission,
        student: studentId,
        isCompleted: true
      });
      if (!missionDone)
        return res.status(403).json({
          success: false,
          message: 'Complete the required mission before attempting this quiz'
        });
    }

    // ── Attempt limit check ─────────────────────────────────────────
    const attemptCount = await QuizAttempt.countDocuments({ quiz: quizId, student: studentId });
    if (quiz.maxAttempts !== -1 && attemptCount >= quiz.maxAttempts)
      return res.status(403).json({
        success: false,
        message: `Maximum attempts (${quiz.maxAttempts}) reached`
      });

    // ── Create new attempt ──────────────────────────────────────────
    const attempt = await QuizAttempt.create({
      quiz: quizId,
      student: studentId,
      course: quiz.course,
      attemptNumber: attemptCount + 1,
      startedAt: new Date(),
      status: 'in_progress'
    });

    res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/quizzes/:quizId/attempt/:attemptId/submit  (student submits answers)
exports.submitAttempt = async (req, res) => {
  try {
    const { quizId, attemptId } = req.params;
    const studentId = req.user._id;

    const [quiz, attempt] = await Promise.all([
      Quiz.findById(quizId),
      QuizAttempt.findById(attemptId)
    ]);

    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (!attempt || attempt.student.toString() !== studentId.toString())
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    if (attempt.status !== 'in_progress')
      return res.status(400).json({ success: false, message: 'Attempt already submitted' });

    // ── Time limit check ────────────────────────────────────────────
    if (quiz.timeLimitMinutes) {
      const elapsed = (Date.now() - attempt.startedAt.getTime()) / 60000;
      if (elapsed > quiz.timeLimitMinutes) {
        attempt.status = 'timed_out';
        await attempt.save();
        return res.status(400).json({ success: false, message: 'Time limit exceeded' });
      }
    }

    // ── Score calculation ───────────────────────────────────────────
    const { gradedAnswers, totalMarksAwarded } = calculateQuizScore(
      quiz.questions,
      req.body.answers
    );

    const { percentage, isPassed } = evaluatePassFail(
      totalMarksAwarded,
      quiz.totalMarks,
      quiz.passMark
    );

    attempt.answers = gradedAnswers;
    attempt.totalMarksAwarded = totalMarksAwarded;
    attempt.percentage = percentage;
    attempt.isPassed = isPassed;
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    await attempt.save();

    // ── Emit events ─────────────────────────────────────────────────
    await emitQuizScored({
      studentId,
      quizId,
      courseId: quiz.course,
      percentage,
      isPassed,
      attemptNumber: attempt.attemptNumber
    });

    // check if all quizzes in course are passed → course assessment complete
    await checkCourseAssessmentCompletion(studentId, quiz.course);

    res.json({
      success: true,
      data: {
        totalMarksAwarded,
        totalMarks: quiz.totalMarks,
        percentage,
        isPassed,
        passMark: quiz.passMark,
        attemptNumber: attempt.attemptNumber,
        answers: gradedAnswers
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/quizzes/:quizId/attempts  (student views own history)
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.quizId,
      student: req.user._id
    }).sort({ attemptNumber: 1 });
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/quizzes/:quizId/attempts/all  (admin views all students)
exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ quiz: req.params.quizId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/courses/:courseId/performance  (student performance summary)
exports.getCoursePerformance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const attempts = await QuizAttempt.find({
      course: courseId,
      student: studentId,
      status: 'submitted'
    }).populate('quiz', 'title totalMarks passMark maxAttempts');

    // group by quiz — get best attempt per quiz
    const quizMap = {};
    attempts.forEach((attempt) => {
      const qId = attempt.quiz._id.toString();
      if (!quizMap[qId] || attempt.percentage > quizMap[qId].percentage) {
        quizMap[qId] = attempt;
      }
    });

    const summary = Object.values(quizMap).map((a) => ({
      quizId: a.quiz._id,
      quizTitle: a.quiz.title,
      bestScore: a.totalMarksAwarded,
      totalMarks: a.quiz.totalMarks,
      bestPercentage: a.percentage,
      isPassed: a.isPassed,
      totalAttempts: attempts.filter(
        (x) => x.quiz._id.toString() === a.quiz._id.toString()
      ).length
    }));

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Internal helper ───────────────────────────────────────────────────────────
async function checkCourseAssessmentCompletion(studentId, courseId) {
  const allQuizzes = await Quiz.find({ course: courseId, isPublished: true });
  for (const quiz of allQuizzes) {
    const passed = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: studentId,
      isPassed: true
    });
    if (!passed) return; // not all quizzes passed yet
  }
  await emitCourseAssessmentCompleted({ studentId, courseId });
}