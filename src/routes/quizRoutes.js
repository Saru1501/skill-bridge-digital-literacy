// routes/quizRoutes.js
const router = require('express').Router();
const qc = require('../controllers/quizController');
const qac = require('../controllers/quizAttemptController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, qc.getQuizzesByCourse);
router.get('/:id', protect, qc.getQuizById);
router.post('/', protect, authorize('admin', 'university'), qc.createQuiz);
router.put('/:id', protect, authorize('admin', 'university'), qc.updateQuiz);
router.patch('/:id/publish', protect, authorize('admin', 'university'), qc.togglePublish);
router.delete('/:id', protect, authorize('admin', 'university'), qc.deleteQuiz);

// attempt sub-routes
router.post('/:quizId/attempt/start', protect, authorize('student'), qac.startAttempt);
router.post('/:quizId/attempt/:attemptId/submit', protect, authorize('student'), qac.submitAttempt);
router.get('/:quizId/attempts', protect, authorize('student'), qac.getMyAttempts);
router.get('/:quizId/attempts/all', protect, authorize('admin', 'university'), qac.getAllAttempts);

module.exports = router;