// routes/missionSubmissionRoutes.js
const router = require('express').Router();
const msc = require('../controllers/missionSubmissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.patch('/:id/grade', protect, authorize('Admin', 'University'), msc.gradeSubmission);

module.exports = router;
