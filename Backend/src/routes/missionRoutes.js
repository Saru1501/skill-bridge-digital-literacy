// routes/missionRoutes.js
const router = require('express').Router();
const mc = require('../controllers/missionController');
const msc = require('../controllers/missionSubmissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, mc.getMissionsByCourse);
router.get('/:id', protect, mc.getMissionById);
router.post('/', protect, authorize('Admin', 'University'), mc.createMission);
router.put('/:id', protect, authorize('Admin', 'University'), mc.updateMission);
router.patch('/:id/publish', protect, authorize('Admin', 'University'), mc.togglePublish);
router.delete('/:id', protect, authorize('Admin', 'University'), mc.deleteMission);

// submission sub-routes
router.post('/:missionId/submit', protect, authorize('Student'), msc.submitMission);
router.get('/:missionId/submission', protect, authorize('Student'), msc.getMySubmission);
router.get('/:missionId/submissions', protect, authorize('Admin', 'University'), msc.getAllSubmissions);

module.exports = router;
