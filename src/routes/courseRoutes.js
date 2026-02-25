const express = require("express");
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, togglePublish } = require("../controllers/courseController");
const { addLesson, getLessons } = require("../controllers/lessonController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getCourses).post(protect, adminOnly, createCourse);
router.route("/:id").get(protect, getCourseById).put(protect, adminOnly, updateCourse).delete(protect, adminOnly, deleteCourse);
router.patch("/:id/publish", protect, adminOnly, togglePublish);
router.route("/:courseId/lessons").get(protect, getLessons).post(protect, adminOnly, addLesson);

module.exports = router;