const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (!course.isPublished) return res.status(400).json({ success: false, message: "Course is not available" });

    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing?.isActive) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    const progress = await Progress.findOne({ student: studentId, course: courseId });
    let enrollment = existing;

    if (existing) {
      existing.isActive = true;
      existing.enrolledAt = new Date();

      if (progress?.isCourseCompleted) {
        existing.completionStatus = "completed";
        existing.completedAt = progress.courseCompletedAt || existing.completedAt || new Date();
      } else if ((progress?.completedLessons?.length || 0) > 0) {
        existing.completionStatus = "in_progress";
        existing.completedAt = undefined;
      } else {
        existing.completionStatus = "not_started";
        existing.completedAt = undefined;
      }

      enrollment = await existing.save();
    } else {
      enrollment = await Enrollment.create({ student: studentId, course: courseId });
    }

    if (!progress) {
      await Progress.findOneAndUpdate(
        { student: studentId, course: courseId },
        { $setOnInsert: { student: studentId, course: courseId } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }

    course.enrollmentCount += 1;
    await course.save();

    const message = existing ? "Re-enrolled successfully" : "Enrolled successfully";
    res.status(existing ? 200 : 201).json({ success: true, message, data: enrollment });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }
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
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId, isActive: true });
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

// Unenroll from a course
const unenrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId, isActive: true });
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });
    enrollment.isActive = false;
    await enrollment.save();
    // Optionally, decrease course enrollment count
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrollmentCount: -1 } });
    res.status(200).json({ success: true, message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollCourse, getMyEnrollments, checkEnrollment, getCourseEnrollments, unenrollCourse };
