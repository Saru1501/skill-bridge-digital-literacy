const UserPoints = require("../models/UserPoints");
 
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await UserPoints.find()
      .populate("student", "name email")
      .sort({ totalPoints: -1 })
      .limit(Number(limit));
 
    const ranked = leaderboard.map((entry, index) => ({
      rank: index + 1,
      student: entry.student,
      totalPoints: entry.totalPoints,
    }));
 
    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getMyRank = async (req, res) => {
  try {
    const myPoints = await UserPoints.findOne({ student: req.user._id });
    if (!myPoints) {
      return res.status(200).json({ success: true, rank: null, totalPoints: 0 });
    }
    const higherCount = await UserPoints.countDocuments({
      totalPoints: { $gt: myPoints.totalPoints }
    });
    const myRank = higherCount + 1;
    res.status(200).json({ success: true, rank: myRank, totalPoints: myPoints.totalPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
module.exports = { getLeaderboard, getMyRank };
