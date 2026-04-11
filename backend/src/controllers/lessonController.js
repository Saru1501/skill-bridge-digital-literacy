const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require("fs");

// Helper: extract YouTube embed URL from any YouTube link format
const getYouTubeEmbedUrl = (url) => {
  try {
    let videoId = null;
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const params = new URL(url).searchParams;
      videoId = params.get("v");
    } else if (url.includes("youtube.com/embed/")) {
      return url; // already embed format
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch { return url; }
};

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
    const lesson = await Lesson.findById(req.params.id).populate("course", "title _id");
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

// â”€â”€ Upload file to Cloudinary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Add YouTube / external URL link (no file upload) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const addLinkResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    const { name, url, type } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }
    // Convert YouTube watch URL to embed URL for in-app playback
    const embedUrl = (type === "video" || url.includes("youtube") || url.includes("youtu.be"))
      ? getYouTubeEmbedUrl(url.trim())
      : url.trim();

    lesson.resources.push({
      name: name?.trim() || url.trim(),
      url: embedUrl,
      publicId: null,       // no Cloudinary for links
      type: type || "video",
      size: 0,
      isDownloadable: false, // external links can't be downloaded
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

module.exports = {
  addLesson, getLessons, getLessonById,
  updateLesson, deleteLesson,
  uploadResource, addLinkResource, deleteResource
};

