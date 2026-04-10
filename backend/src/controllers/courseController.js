const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, tags } = req.body;
    const course = await Course.create({
      title, description, category, level, tags,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 10 } = req.query;
    const query = {};
    if (!req.user || req.user.role !== "admin") query.isPublished = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (level) query.level = level;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate("createdBy", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "name email");
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (!course.isPublished && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ success: false, message: "Course not available" });
    }
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
    res.status(200).json({ success: true, data: { ...course.toObject(), lessons } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    await Lesson.deleteMany({ course: req.params.id });
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    course.isPublished = !course.isPublished;
    await course.save();
    res.status(200).json({ success: true, message: `Course ${course.isPublished ? "published" : "unpublished"}`, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, togglePublish };