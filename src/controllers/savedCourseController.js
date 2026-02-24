const SavedCourse = require("../models/SavedCourse");
const Course = require("../models/Course");

const toggleSaveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    const existing = await SavedCourse.findOne({ student: req.user._id, course: req.params.courseId });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, message: "Course unsaved", isSaved: false });
    }
    await SavedCourse.create({ student: req.user._id, course: req.params.courseId });
    res.status(201).json({ success: true, message: "Course saved", isSaved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMySavedCourses = async (req, res) => {
  try {
    const saved = await SavedCourse.find({ student: req.user._id })
      .populate("course", "title description category level thumbnail totalLessons isPublished");
    res.status(200).json({ success: true, count: saved.length, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { toggleSaveCourse, getMySavedCourses };