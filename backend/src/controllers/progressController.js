const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { handleCourseCompletion } = require("./gamificationController");
const EventEmitter = require("events");
const progressEvents = new EventEmitter();

const emitProgressUpdated = (studentId, courseId, progress) => {
  progressEvents.emit("progressUpdated", {
    studentId,
    courseId,
    completionPercentage: progress.completionPercentage,
    completedLessons: progress.completedLessons,
    isCourseCompleted: progress.isCourseCompleted,
  });
};

const syncEnrollmentCompletion = async ({ enrollment, progress, courseId, studentId }) => {
  if (!enrollment) return;

  if (progress.completionPercentage === 100) {
    if (!progress.isCourseCompleted) {
      progress.isCourseCompleted = true;
      progress.courseCompletedAt = progress.courseCompletedAt || Date.now();
      enrollment.completionStatus = "completed";
      enrollment.completedAt = progress.courseCompletedAt;
      await enrollment.save();
      await handleCourseCompletion(
        { body: { studentId, courseId } },
        { status: () => ({ json: () => {} }) }
      );
      progressEvents.emit("courseCompleted", { studentId, courseId });
      return;
    }

    if (enrollment.completionStatus !== "completed") {
      enrollment.completionStatus = "completed";
      enrollment.completedAt = progress.courseCompletedAt || enrollment.completedAt || Date.now();
      await enrollment.save();
    }
    return;
  }

  if (progress.completedLessons.length > 0) {
    enrollment.completionStatus = "in_progress";
    enrollment.completedAt = undefined;
    await enrollment.save();
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId, isActive: true });
    if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in this course" });
    let progress = await Progress.findOne({ student: req.user._id, course: courseId });
    if (!progress) progress = await Progress.create({ student: req.user._id, course: courseId });
    let lessonCompleted = false;
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      lessonCompleted = true;
    }
    progress.lastAccessedLesson = lessonId;
    progress.lastAccessedAt = Date.now();
    const course = await Course.findById(courseId);
    progress.completionPercentage = course.totalLessons > 0
      ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0;
    if (lessonCompleted) {
      progressEvents.emit("lessonCompleted", { studentId: req.user._id, courseId, lessonId });
    }
    await syncEnrollmentCompletion({ enrollment, progress, courseId, studentId: req.user._id });
    await progress.save();
    emitProgressUpdated(req.user._id, courseId, progress);
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
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
      isActive: true,
    });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Not enrolled in this course" });
    }

    let progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId });
    if (!progress) {
      progress = await Progress.create({ student: req.user._id, course: req.params.courseId });
    }

    const newlyCompletedLessons = [];
    for (const lessonId of completedLessons) {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        newlyCompletedLessons.push(lessonId);
      }
    }

    if (completedLessons.length > 0) {
      progress.lastAccessedLesson = completedLessons[completedLessons.length - 1];
    }
    const course = await Course.findById(req.params.courseId);
    progress.completionPercentage = course.totalLessons > 0
      ? Math.round((progress.completedLessons.length / course.totalLessons) * 100) : 0;

    for (const lessonId of newlyCompletedLessons) {
      progressEvents.emit("lessonCompleted", {
        studentId: req.user._id,
        courseId: req.params.courseId,
        lessonId,
      });
    }

    await syncEnrollmentCompletion({
      enrollment,
      progress,
      courseId: req.params.courseId,
      studentId: req.user._id,
    });

    progress.lastAccessedAt = Date.now();
    await progress.save();
    emitProgressUpdated(req.user._id, req.params.courseId, progress);
    res.status(200).json({ success: true, message: "Progress synced", data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateLessonProgress, getCourseProgress, trackDownload, syncOfflineProgress, progressEvents };
