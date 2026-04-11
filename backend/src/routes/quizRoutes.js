// routes/quizRoutes.js
const router = require('express').Router();
const qc = require('../controllers/quizController');
const qac = require('../controllers/quizAttemptController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, qc.getQuizzesByCourse);
router.get('/:id', protect, qc.getQuizById);
router.post('/', protect, authorize('Admin', 'University'), qc.createQuiz);
router.put('/:id', protect, authorize('Admin', 'University'), qc.updateQuiz);
router.patch('/:id/publish', protect, authorize('Admin', 'University'), qc.togglePublish);
router.delete('/:id', protect, authorize('Admin', 'University'), qc.deleteQuiz);

// attempt sub-routes
router.post('/:quizId/attempt/start', protect, authorize('Student'), qac.startAttempt);
router.post('/:quizId/attempt/:attemptId/submit', protect, authorize('Student'), qac.submitAttempt);
router.get('/:quizId/attempts', protect, authorize('Student'), qac.getMyAttempts);
router.get('/:quizId/attempts/all', protect, authorize('Admin', 'University'), qac.getAllAttempts);

module.exports = router;
