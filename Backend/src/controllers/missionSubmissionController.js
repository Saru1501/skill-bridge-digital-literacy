const MissionSubmission = require('../models/MissionSubmission');
const Mission = require('../models/Mission');
const { emitMissionCompleted } = require('../services/eventService');

// POST /api/missions/:missionId/submit  (student)
exports.submitMission = async (req, res) => {
  try {
    const { missionId } = req.params;
    const studentId = req.user._id;

    const mission = await Mission.findById(missionId);
    if (!mission || !mission.isPublished)
      return res.status(404).json({ success: false, message: 'Mission not found' });

    // auto-grade if multiple_choice
    let score = null;
    let isCompleted = false;
    if (mission.submissionType === 'multiple_choice') {
      const isCorrect = req.body.selectedOption == mission.correctOption;
      score = isCorrect ? mission.maxScore : 0;
      isCompleted = true;  // auto-graded immediately
    }

    // upsert: allow resubmission
    const submission = await MissionSubmission.findOneAndUpdate(
      { mission: missionId, student: studentId },
      {
        ...req.body,
        mission: missionId,
        student: studentId,
        course: mission.course,
        score,
        isCompleted,
        status: isCompleted ? 'graded' : 'submitted',
        submittedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (isCompleted) {
      await emitMissionCompleted({
        studentId,
        missionId,
        courseId: mission.course,
        score
      });
    }

    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/missions/:missionId/submission  (student views own)
exports.getMySubmission = async (req, res) => {
  try {
    const submission = await MissionSubmission.findOne({
      mission: req.params.missionId,
      student: req.user._id
    });
    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/missions/:missionId/submissions  (admin views all)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await MissionSubmission.find({
      mission: req.params.missionId
    }).populate('student', 'name email');
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/submissions/:id/grade  (admin grades text/file submissions)
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const submission = await MissionSubmission.findById(req.params.id).populate('mission');
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.isCompleted = true;
    submission.gradedAt = new Date();
    await submission.save();

    await emitMissionCompleted({
      studentId: submission.student,
      missionId: submission.mission._id,
      courseId: submission.course,
      score
    });

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};