const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in this course" });
    let progress = await Progress.findOne({ student: req.user._id, course: courseId });
    if (!progress) progress = await Progress.create({ student: req.user._id, course: courseId });
    if (!progress.completedLessons.includes(lessonId)) progress.completedLessons.push(lessonId);
    progress.lastAccessedLesson = lessonId;
    progress.lastAccessedAt = Date.now();
    const course = await Course.findById(courseId);
    progress.completionPercentage = course.totalLessons > 0
      ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0;
    if (progress.completionPercentage === 100 && !progress.isCourseCompleted) {
      progress.isCourseCompleted = true;
      progress.courseCompletedAt = Date.now();
      enrollment.completionStatus = "completed";
      enrollment.completedAt = Date.now();
      await enrollment.save();
    } else if (progress.completedLessons.length > 0) {
      enrollment.completionStatus = "in_progress";
      await enrollment.save();
    }
    await progress.save();
    res.status(200).json({ success: true, data: progress, courseCompleted: progress.isCourseCompleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId })
      .populate("completedLessons", "title order")
      .populate("lastAccessedLesson", "title order");
    if (!progress) return res.status(404).json({ success: false, message: "No progress found" });
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const trackDownload = async (req, res) => {
  try {
    const { resourceUrl } = req.body;
    if (!resourceUrl) return res.status(400).json({ success: false, message: "Resource URL required" });
    const progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId });
    if (!progress) return res.status(404).json({ success: false, message: "Progress not found" });
    if (!progress.downloadedResources.includes(resourceUrl)) {
      progress.downloadedResources.push(resourceUrl);
      await progress.save();
    }
    res.status(200).json({ success: true, message: "Download tracked", data: progress.downloadedResources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const syncOfflineProgress = async (req, res) => {
  try {
    const { completedLessons } = req.body;
    if (!completedLessons || !Array.isArray(completedLessons)) {
      return res.status(400).json({ success: false, message: "completedLessons array required" });
    }
    let progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId });
    if (!progress) return res.status(404).json({ success: false, message: "Progress not found" });
    for (const lessonId of completedLessons) {
      if (!progress.completedLessons.includes(lessonId)) progress.completedLessons.push(lessonId);
    }
    const course = await Course.findById(req.params.courseId);
    progress.completionPercentage = course.totalLessons > 0
      ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0;
    if (progress.completionPercentage === 100) {
      progress.isCourseCompleted = true;
      progress.courseCompletedAt = progress.courseCompletedAt || Date.now();
    }
    progress.lastAccessedAt = Date.now();
    await progress.save();
    res.status(200).json({ success: true, message: "Progress synced", data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateLessonProgress, getCourseProgress, trackDownload, syncOfflineProgress };