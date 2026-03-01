const express = require("express");
const { getLeaderboard, getMyRank } = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");
 
const router = express.Router();
 
router.get("/", protect, getLeaderboard);
router.get("/my-rank", protect, getMyRank);
 
module.exports = router;
