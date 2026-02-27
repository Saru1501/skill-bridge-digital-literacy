const UserPoints = require("../models/UserPoints");
const PointRule = require("../models/PointRule");
const { checkAndAwardBadges } = require("./badgeController");
const { checkFeeReduction } = require("./feeReductionController");
 
const createPointRule = async (req, res) => {
  try {
    const rule = await PointRule.create(req.body);
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getPointRules = async (req, res) => {
  try {
    const rules = await PointRule.find();
    res.status(200).json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const updatePointRule = async (req, res) => {
  try {
    const rule = await PointRule.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!rule) return res.status(404).json({ success: false, message: "Rule not found" });
    res.status(200).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const deletePointRule = async (req, res) => {
  try {
    await PointRule.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getMyPoints = async (req, res) => {
  try {
    let userPoints = await UserPoints.findOne({ student: req.user._id });
    if (!userPoints) {
      userPoints = await UserPoints.create({ student: req.user._id });
    }
    res.status(200).json({ success: true, data: userPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const awardPoints = async (studentId, action, courseId, description) => {
  try {
    const rule = await PointRule.findOne({ action, isActive: true });
    if (!rule) return;
 
    let userPoints = await UserPoints.findOne({ student: studentId });
    if (!userPoints) {
      userPoints = await UserPoints.create({
        student: studentId, totalPoints: 0, history: []
      });
    }
 
    userPoints.totalPoints += rule.points;
    userPoints.history.push({
      action,
      points: rule.points,
      description: description || rule.description,
      courseId,
      earnedAt: new Date(),
    });
 
    await userPoints.save();
    await checkAndAwardBadges(studentId, action, courseId);
    await checkFeeReduction(studentId);
 
    return userPoints;
  } catch (error) {
    console.error("Award points error:", error.message);
  }
};
 
module.exports = {
  createPointRule, getPointRules, updatePointRule,
  deletePointRule, getMyPoints, awardPoints
};
