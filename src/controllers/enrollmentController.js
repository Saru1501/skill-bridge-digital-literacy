const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (!course.isPublished) return res.status(400).json({ success: false, message: "Course is not available" });
    const existing = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    if (existing) return res.status(400).json({ success: false, message: "Already enrolled" });
    const enrollment = await Enrollment.create({ student: req.user._id, course: req.params.courseId });
    await Progress.create({ student: req.user._id, course: req.params.courseId });
    course.enrollmentCount += 1;
    await course.save();
    res.status(201).json({ success: true, message: "Enrolled successfully", data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id, isActive: true })
      .populate("course", "title description category level thumbnail totalLessons");
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    res.status(200).json({ success: true, isEnrolled: !!enrollment, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId }).populate("student", "name email");
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollCourse, getMyEnrollments, checkEnrollment, getCourseEnrollments };