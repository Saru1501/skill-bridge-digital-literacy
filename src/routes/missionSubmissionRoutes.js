// routes/missionSubmissionRoutes.js
const router = require('express').Router();
const msc = require('../controllers/missionSubmissionController');
const { protect, authorize } = require('../middleware/auth');

router.patch('/:id/grade', protect, authorize('admin', 'university'), msc.gradeSubmission);

module.exports = router;