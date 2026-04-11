const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const MissionSubmission = require('../models/MissionSubmission');
const { createGoogleForm, getFormResponses, getFormMetadata } = require('../utils/googleForms');

// POST /api/google-forms/quiz/:quizId/create-form  (admin)
exports.createFormFromQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const { formId, formUrl } = await createGoogleForm(quiz);

    // Save formId on the quiz for future response fetching
    quiz.googleFormId = formId;
    quiz.googleFormUrl = formUrl;
    await quiz.save();

    res.json({ success: true, formId, formUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/google-forms/quiz/:quizId/sync-responses  (admin)
// Fetches Google Form responses and scores them against quiz answers
exports.syncFormResponses = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (!quiz.googleFormId) return res.status(400).json({ success: false, message: 'No Google Form linked to this quiz' });

    // Get form metadata to map questionId -> question index
    const formMeta = await getFormMetadata(quiz.googleFormId);
    const formItems = formMeta.items || [];

    // Build map: questionId -> question index
    const questionIdToIndex = {};
    formItems.forEach((item, i) => {
      if (item.questionItem) {
        questionIdToIndex[item.questionItem.question.questionId] = i;
      }
    });

    const responses = await getFormResponses(quiz.googleFormId);
    const results = [];

    for (const response of responses) {
      const answers = response.answers || {};
      let score = 0;

      for (const [questionId, answerData] of Object.entries(answers)) {
        const qIndex = questionIdToIndex[questionId];
        if (qIndex === undefined) continue;

        const quizQuestion = quiz.questions[qIndex];
        if (!quizQuestion) continue;

        const studentAnswer = answerData.textAnswers?.answers?.[0]?.value || '';

        // Score: compare student answer to correct answer
        if (quizQuestion.questionType === 'multiple_choice') {
          const correctOption = quizQuestion.options[parseInt(quizQuestion.correctAnswer)];
          if (studentAnswer === correctOption) score += quizQuestion.marks;
        } else if (quizQuestion.questionType === 'true_false') {
          if (studentAnswer.toLowerCase() === quizQuestion.correctAnswer.toLowerCase()) {
            score += quizQuestion.marks;
          }
        } else {
          // short_answer: case-insensitive match
          if (studentAnswer.trim().toLowerCase() === quizQuestion.correctAnswer.trim().toLowerCase()) {
            score += quizQuestion.marks;
          }
        }
      }

      const percentage = quiz.totalMarks > 0 ? Math.round((score / quiz.totalMarks) * 100) : 0;
      const passed = percentage >= quiz.passMark;

      results.push({
        responseId: response.responseId,
        submittedAt: response.lastSubmittedTime,
        score,
        totalMarks: quiz.totalMarks,
        percentage,
        passed
      });
    }

    res.json({ success: true, total: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/google-forms/quiz/:quizId/form-link  (student)
// Returns the Google Form URL for a student to attempt
exports.getFormLink = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (!quiz.isPublished) return res.status(403).json({ success: false, message: 'Quiz not published' });
    if (!quiz.googleFormUrl) return res.status(400).json({ success: false, message: 'No Google Form linked yet' });

    // Check unlock condition: mission must be completed first
    if (quiz.unlockAfterMission) {
      const missionDone = await MissionSubmission.findOne({
        student: req.user._id,
        mission: quiz.unlockAfterMission
      });
      if (!missionDone) {
        return res.status(403).json({
          success: false,
          message: 'Complete the required mission before attempting this quiz'
        });
      }
    }

    // Check attempt limit
    if (quiz.maxAttempts !== -1) {
      const attemptCount = await QuizAttempt.countDocuments({
        student: req.user._id,
        quiz: quiz._id
      });
      if (attemptCount >= quiz.maxAttempts) {
        return res.status(403).json({ success: false, message: 'Maximum attempts reached' });
      }
    }

    res.json({ success: true, formUrl: quiz.googleFormUrl, timeLimitMinutes: quiz.timeLimitMinutes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};