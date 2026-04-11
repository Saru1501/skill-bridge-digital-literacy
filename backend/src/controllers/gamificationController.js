const GamificationConfig = require("../models/GamificationConfig");
const UserPoints = require("../models/UserPoints");
const UserBadge = require("../models/UserBadge");
const Certificate = require("../models/Certificate");
const FeeReduction = require("../models/FeeReduction");
const { awardPoints } = require("./pointsController");
 
const setGamificationConfig = async (req, res) => {
  try {
    const config = await GamificationConfig.findOneAndUpdate(
      { course: req.params.courseId },
      { ...req.body, course: req.params.courseId },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getGamificationConfig = async (req, res) => {
  try {
    const config = await GamificationConfig.findOne({
      course: req.params.courseId
    });
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const handleCourseCompletion = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const config = await GamificationConfig.findOne({ course: courseId });
    if (config && !config.isEnabled) {
      return res.status(200).json({
        success: true, message: "Gamification disabled for this course"
      });
    }
    await awardPoints(studentId, "course_completion", courseId, "Completed a course");
    res.status(200).json({ success: true, message: "Course completion rewards processed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const handleQuizCompletion = async (req, res) => {
  try {
    const { studentId, courseId, passed, score } = req.body;
    if (passed) {
      await awardPoints(
        studentId, "quiz_pass", courseId, `Passed quiz with score ${score}`
      );
    }
    res.status(200).json({ success: true, message: "Quiz completion rewards processed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getAchievementVault = async (req, res) => {
  try {
    const studentId = req.user._id;
    const points = await UserPoints.findOne({ student: studentId });
    const badges = await UserBadge.find({ student: studentId })
      .populate("badge", "name description icon");
    const certificates = await Certificate.find({ student: studentId })
      .populate("course", "title category");
    const feeReductions = await FeeReduction.find({
      student: studentId, isUsed: false
    });
 
    res.status(200).json({
      success: true,
      data: {
        totalPoints: points ? points.totalPoints : 0,
        pointsHistory: points ? points.history : [],
        badges,
        certificates,
        feeReductions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
module.exports = {
  setGamificationConfig, getGamificationConfig,
  handleCourseCompletion, handleQuizCompletion, getAchievementVault
};
