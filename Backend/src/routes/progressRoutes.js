const express = require("express");
const { updateLessonProgress, getCourseProgress, trackDownload, syncOfflineProgress } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:courseId", protect, getCourseProgress);
router.patch("/:courseId/lessons/:lessonId", protect, updateLessonProgress);
router.post("/:courseId/download", protect, trackDownload);
router.post("/:courseId/sync", protect, syncOfflineProgress);

module.exports = router;