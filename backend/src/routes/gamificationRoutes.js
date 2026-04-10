const express = require("express");
const {
  setGamificationConfig, getGamificationConfig,
  handleCourseCompletion, handleQuizCompletion, getAchievementVault
} = require("../controllers/gamificationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
 
const router = express.Router();
 
router.get("/config/:courseId", protect, getGamificationConfig);
router.put("/config/:courseId", protect, adminOnly, setGamificationConfig);
router.post("/course-completed", handleCourseCompletion);
router.post("/quiz-completed", handleQuizCompletion);
router.get("/achievements", protect, getAchievementVault);
 
module.exports = router;
