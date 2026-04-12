const express = require("express");
const { toggleSaveCourse, getMySavedCourses } = require("../controllers/savedCourseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMySavedCourses);
router.post("/:courseId", protect, toggleSaveCourse);

module.exports = router;