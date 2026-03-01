const Mission = require('../models/Mission');

// GET /api/missions?course=:courseId
exports.getMissionsByCourse = async (req, res) => {
  try {
    const { course } = req.query;
    const filter = { course };
    if (req.user.role === 'student') filter.isPublished = true;

    const missions = await Mission.find(filter).sort({ order: 1 });
    res.json({ success: true, data: missions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/missions/:id
exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    res.json({ success: true, data: mission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/missions  (admin only)
exports.createMission = async (req, res) => {
  try {
    const mission = await Mission.create(req.body);
    res.status(201).json({ success: true, data: mission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/missions/:id  (admin only)
exports.updateMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    res.json({ success: true, data: mission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/missions/:id/publish  (admin only)
exports.togglePublish = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    mission.isPublished = !mission.isPublished;
    await mission.save();
    res.json({ success: true, data: mission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/missions/:id  (admin only)
exports.deleteMission = async (req, res) => {
  try {
    await Mission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Mission deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};