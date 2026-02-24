const express = require("express");
const { enrollCourse, getMyEnrollments, checkEnrollment, getCourseEnrollments } = require("../controllers/enrollmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:courseId", protect, enrollCourse);
router.get("/my", protect, getMyEnrollments);
router.get("/:courseId/status", protect, checkEnrollment);
router.get("/course/:courseId", protect, adminOnly, getCourseEnrollments);

module.exports = router;