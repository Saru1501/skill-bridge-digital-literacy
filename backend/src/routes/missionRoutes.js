// routes/missionRoutes.js
const router = require('express').Router();
const mc = require('../controllers/missionController');
const msc = require('../controllers/missionSubmissionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, mc.getMissionsByCourse);
router.get('/:id', protect, mc.getMissionById);
router.post('/', protect, authorize('admin', 'university'), mc.createMission);
router.put('/:id', protect, authorize('admin', 'university'), mc.updateMission);
router.patch('/:id/publish', protect, authorize('admin', 'university'), mc.togglePublish);
router.delete('/:id', protect, authorize('admin', 'university'), mc.deleteMission);

// submission sub-routes
router.post('/:missionId/submit', protect, authorize('student'), msc.submitMission);
router.get('/:missionId/submission', protect, authorize('student'), msc.getMySubmission);
router.get('/:missionId/submissions', protect, authorize('admin', 'university'), msc.getAllSubmissions);

module.exports = router;