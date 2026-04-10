const FeeReduction = require("../models/FeeReduction");
const UserPoints = require("../models/UserPoints");
 
const checkFeeReduction = async (studentId) => {
  try {
    const userPoints = await UserPoints.findOne({ student: studentId });
    if (!userPoints) return;
 
    const discountTiers = [
      { points: 500, discount: 30 },
      { points: 300, discount: 20 },
      { points: 100, discount: 10 },
    ];
 
    for (const tier of discountTiers) {
      if (userPoints.totalPoints >= tier.points) {
        const existing = await FeeReduction.findOne({
          student: studentId,
          discountPercentage: tier.discount,
          isUsed: false,
        });
        if (!existing) {
          await FeeReduction.create({
            student: studentId,
            discountPercentage: tier.discount,
            reason: `Earned ${tier.points} points`,
            pointsUsed: tier.points,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Fee reduction check error:", error.message);
  }
};
 
const getMyFeeReductions = async (req, res) => {
  try {
    const reductions = await FeeReduction.find({
      student: req.user._id, isUsed: false
    }).sort({ discountPercentage: -1 });
    res.status(200).json({ success: true, data: reductions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const applyFeeReduction = async (req, res) => {
  try {
    const reduction = await FeeReduction.findOne({
      _id: req.params.id, student: req.user._id, isUsed: false
    });
    if (!reduction) {
      return res.status(404).json({
        success: false, message: "Fee reduction not found or already used"
      });
    }
    if (reduction.expiresAt && reduction.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Fee reduction has expired" });
    }
    reduction.isUsed = true;
    reduction.usedAt = new Date();
    await reduction.save();
    res.status(200).json({
      success: true,
      message: `${reduction.discountPercentage}% discount applied`,
      data: reduction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getAllFeeReductions = async (req, res) => {
  try {
    const reductions = await FeeReduction.find()
      .populate("student", "name email");
    res.status(200).json({ success: true, data: reductions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
module.exports = {
  checkFeeReduction, getMyFeeReductions,
  applyFeeReduction, getAllFeeReductions
};
