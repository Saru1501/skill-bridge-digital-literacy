// routes/performanceRoutes.js
const router = require('express').Router();
const { getCoursePerformance } = require('../controllers/quizAttemptController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/courses/:courseId/performance', protect, authorize('student'), getCoursePerformance);

module.exports = router;