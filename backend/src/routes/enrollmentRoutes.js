const express = require("express");
const { enrollCourse, getMyEnrollments, checkEnrollment, getCourseEnrollments } = require("../controllers/enrollmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// NOTE: /my and /course/:courseId MUST come before /:courseId
// otherwise Express treats "my" and "course" as courseId values
router.get("/my", protect, getMyEnrollments);
router.get("/course/:courseId", protect, adminOnly, getCourseEnrollments);
router.post("/:courseId", protect, enrollCourse);
router.get("/:courseId/status", protect, checkEnrollment);

module.exports = router;