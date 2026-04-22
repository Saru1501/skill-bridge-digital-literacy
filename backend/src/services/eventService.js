// services/eventService.js
// Right now these are in-process function calls.
// Later you can swap to an event emitter, Redis pub/sub, or a message queue.
const Enrollment = require("../models/Enrollment");
const Mission = require("../models/Mission");
const MissionSubmission = require("../models/MissionSubmission");

const emitMissionCompleted = async ({ studentId, missionId, courseId, score }) => {
    console.log(`[EVENT] mission_completed — student:${studentId} mission:${missionId} course:${courseId} score:${score}`);
    // TODO: call Gamification service to award points
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
    console.log(
      `[EVENT] course_assessment_progress — student:${studentId} course:${courseId} progress:${assessmentProgress}%`
    );
  };
  
  const emitQuizScored = async ({ studentId, quizId, courseId, percentage, isPassed, attemptNumber }) => {
    console.log(`[EVENT] quiz_scored — student:${studentId} quiz:${quizId} passed:${isPassed} score:${percentage}%`);
    // TODO: trigger badge check in Gamification component
    // TODO: check if all quizzes passed → emit course_assessment_completed
  };
  
  const emitCourseAssessmentCompleted = async ({ studentId, courseId }) => {
    console.log(`[EVENT] course_assessment_completed — student:${studentId} course:${courseId}`);
    // TODO: trigger certificate generation in Component 4
  };
  
  module.exports = {
    emitMissionCompleted,
    emitQuizScored,
    emitCourseAssessmentCompleted
  };
