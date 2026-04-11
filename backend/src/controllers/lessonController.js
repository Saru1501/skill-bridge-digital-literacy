const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");
const fs = require("fs");

const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    const { title, description, content, order, duration } = req.body;
    const lesson = await Lesson.create({
      course: req.params.courseId, title, description, content, duration,
      order: order || (await Lesson.countDocuments({ course: req.params.courseId })) + 1,
    });
    course.totalLessons += 1;
    await course.save();
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.status(200).json({ success: true, count: lessons.length, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course", "title");
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    for (const resource of lesson.resources) {
      if (resource.publicId) await deleteFromCloudinary(resource.publicId);
    }
    await lesson.deleteOne();
    await Course.findByIdAndUpdate(lesson.course, { $inc: { totalLessons: -1 } });
    res.status(200).json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const { name, type, isDownloadable } = req.body;
    const uploaded = await uploadToCloudinary(req.file.path, "skillbridge/resources");
    fs.unlinkSync(req.file.path);
    lesson.resources.push({
      name: name || req.file.originalname,
      url: uploaded.url,
      publicId: uploaded.publicId,
      type: type || "other",
      size: uploaded.size,
      isDownloadable: isDownloadable !== "false",
    });
    await lesson.save();
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    const resource = lesson.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
    if (resource.publicId) await deleteFromCloudinary(resource.publicId);
    resource.deleteOne();
    await lesson.save();
    res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addLesson, getLessons, getLessonById, updateLesson, deleteLesson, uploadResource, deleteResource };