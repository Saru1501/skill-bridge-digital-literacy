const router = require('express').Router();
const { createFormFromQuiz, syncFormResponses, getFormLink } = require('../controllers/googleFormsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin routes
router.post('/quiz/:quizId/create-form', protect, authorize('admin'), createFormFromQuiz);
router.post('/quiz/:quizId/sync-responses', protect, authorize('admin'), syncFormResponses);

// Student route
router.get('/quiz/:quizId/form-link', protect, authorize('student'), getFormLink);

module.exports = router;