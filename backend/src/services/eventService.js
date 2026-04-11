// services/eventService.js
const Enrollment = require("../models/Enrollment");
const Mission = require("../models/Mission");
const MissionSubmission = require("../models/MissionSubmission");
const Certificate = require("../models/Certificate");
const { v4: uuidv4 } = require("uuid");
const { handleQuizCompletion, handleCourseCompletion } = require("../controllers/gamificationController");
const { awardPoints } = require("../controllers/pointsController");

const emitMissionCompleted = async ({ studentId, missionId, courseId, score }) => {
  console.log(`[EVENT] mission_completed — student:${studentId} mission:${missionId} course:${courseId} score:${score}`);
  await awardPoints(studentId, "mission_completion", courseId, "Completed a practice mission");
  const [totalMissions, completedMissions] = await Promise.all([
    Mission.countDocuments({ course: courseId, isPublished: true }),
    MissionSubmission.countDocuments({ student: studentId, course: courseId, isCompleted: true })
  ]);
  const assessmentProgress = totalMissions > 0
    ? Math.round((completedMissions / totalMissions) * 100)
    : 0;
  await Enrollment.updateOne(
    { student: studentId, course: courseId, completionStatus: { $ne: "completed" } },
    { $set: { completionStatus: assessmentProgress > 0 ? "in_progress" : "not_started" } }
  );
  console.log(`[EVENT] course_assessment_progress — student:${studentId} course:${courseId} progress:${assessmentProgress}%`);
};

const emitQuizScored = async ({ studentId, quizId, courseId, percentage, isPassed, attemptNumber }) => {
  console.log(`[EVENT] quiz_scored — student:${studentId} quiz:${quizId} passed:${isPassed} score:${percentage}%`);
  await handleQuizCompletion({ body: { studentId, courseId, passed: isPassed, score: percentage } }, { status: () => ({ json: () => {} }) });
};

const emitCourseAssessmentCompleted = async ({ studentId, courseId }) => {
  console.log(`[EVENT] course_assessment_completed — student:${studentId} course:${courseId}`);
  const existingCert = await Certificate.findOne({ student: studentId, course: courseId });
  if (!existingCert) {
    const certificateNumber = `CERT-${uuidv4().split("-")[0].toUpperCase()}-${Date.now()}`;
    await Certificate.create({ student: studentId, course: courseId, certificateNumber });
    console.log(`[EVENT] certificate_generated — student:${studentId} course:${courseId}`);
  }
  await handleCourseCompletion({ body: { studentId, courseId } }, { status: () => ({ json: () => {} }) });
};

module.exports = {
  emitMissionCompleted,
  emitQuizScored,
  emitCourseAssessmentCompleted
};
