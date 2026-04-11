const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const UserPoints = require("../models/UserPoints");
 
const createBadge = async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json({ success: true, data: badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: badges.length, data: badges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!badge) return res.status(404).json({ success: false, message: "Badge not found" });
    res.status(200).json({ success: true, data: badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndDelete(req.params.id);
    if (!badge) return res.status(404).json({ success: false, message: "Badge not found" });
    res.status(200).json({ success: true, message: "Badge deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getMyBadges = async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ student: req.user._id })
      .populate("badge", "name description icon criteria")
      .populate("courseId", "title");
    res.status(200).json({ success: true, count: userBadges.length, data: userBadges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const checkAndAwardBadges = async (studentId, action, courseId, score) => {
  try {
    const badges = await Badge.find({ isActive: true });
    const userPoints = await UserPoints.findOne({ student: studentId });
    const totalPoints = userPoints ? userPoints.totalPoints : 0;
 
    for (const badge of badges) {
      const alreadyEarned = await UserBadge.findOne({
        student: studentId, badge: badge._id
      });
      if (alreadyEarned) continue;
 
      let eligible = false;
      if (badge.criteria.type === "course_completion" && action === "course_completion") {
        eligible = !badge.criteria.courseId ||
          badge.criteria.courseId.toString() === courseId?.toString();
      } else if (badge.criteria.type === "quiz_score" && action === "quiz_pass") {
        eligible = score >= badge.criteria.threshold;
      } else if (badge.criteria.type === "points_threshold") {
        eligible = totalPoints >= badge.criteria.threshold;
      }
 
      if (eligible) {
        await UserBadge.create({ student: studentId, badge: badge._id, courseId });
      }
    }
  } catch (error) {
    console.error("Badge check error:", error.message);
  }
};
 
module.exports = {
  createBadge, getBadges, updateBadge,
  deleteBadge, getMyBadges, checkAndAwardBadges
};
