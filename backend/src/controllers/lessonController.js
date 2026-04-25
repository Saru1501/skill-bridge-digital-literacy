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
    if (Array.isArray(lesson.resources)) {
      for (const resource of lesson.resources) {
        try {
          if (resource.publicId) await deleteFromCloudinary(resource.publicId);
        } catch (cloudErr) {
          console.error('Cloudinary deletion failed:', cloudErr.message);
        }
      }
    }
    await lesson.deleteOne();
    await Course.findByIdAndUpdate(lesson.course, { $inc: { totalLessons: -1 } });
    res.status(200).json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    console.error('Lesson deletion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const { name, type, isDownloadable } = req.body;
    let uploaded;
    try {
      uploaded = await uploadToCloudinary(req.file.path, "skillbridge/resources");
    } catch (cloudErr) {
      console.error('Cloudinary upload failed:', cloudErr.message);
      return res.status(500).json({ success: false, message: 'Cloudinary upload failed: ' + cloudErr.message });
    }
    fs.unlinkSync(req.file.path);
    // Detect PDF by mimetype or extension
    let resourceType = type;
    if (!resourceType && req.file.mimetype === 'application/pdf') resourceType = 'pdf';
    if (!resourceType && req.file.originalname && req.file.originalname.toLowerCase().endsWith('.pdf')) resourceType = 'pdf';
    lesson.resources.push({
      name: name || req.file.originalname,
      url: uploaded.url,
      publicId: uploaded.publicId,
      version: String(uploaded.version || ""),
      type: resourceType || "other",
      cloudinaryResourceType: uploaded.resourceType || "image",
      size: uploaded.size,
      isDownloadable: isDownloadable !== "false",
    });
    await lesson.save();
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    console.error('Resource upload error:', error);
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


const downloadResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    const resource = lesson.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
    if (!resource.isDownloadable) return res.status(403).json({ success: false, message: "Resource not downloadable" });
    
    if (resource.publicId) {
      const cloudinary = require("cloudinary").v2;
      const https = require("https");
      
      // Generate a SIGNED URL with version.
      // Logic: PDFs -> 'image', Videos -> 'video', others -> 'auto' or stored type
      let rType = resource.cloudinaryResourceType || 'auto';
      if (resource.type === 'pdf') rType = 'image';
      if (resource.type === 'video') rType = 'video';

      // Determine extension from original URL
      const ext = (resource.url || '').split('.').pop() || '';
      
      const resourceUrl = cloudinary.url(resource.publicId, {
        resource_type: rType,
        secure: true,
        sign_url: true,
        version: resource.version || undefined,
        format: ext || undefined // Crucial for video/raw files to not 404
      });

      const options = {
        headers: {
          'User-Agent': 'SkillBridge-Backend/1.0'
        }
      };

      https.get(resourceUrl, options, (stream) => {
        console.log(`[Proxy] Fetching ${resource.publicId} from Cloudinary. Status: ${stream.statusCode}`);
        
        if (stream.statusCode === 200) {
          if (resource.type === 'pdf' || (resource.url && resource.url.toLowerCase().endsWith('.pdf'))) {
            res.setHeader('Content-Type', 'application/pdf');
          } else if (resource.type === 'video') {
            res.setHeader('Content-Type', 'video/mp4');
          }
          
          const filename = resource.name || 'resource';
          const extension = (resource.url || '').split('.').pop() || (resource.type === 'pdf' ? 'pdf' : '');
          const finalFilename = filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`) ? filename : `${filename}.${extension}`;

          if (req.query.download === 'true') {
            res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
          } else {
            res.setHeader('Content-Disposition', `inline; filename="${finalFilename}"`);
          }
          
          stream.pipe(res);
        } else if (stream.statusCode === 301 || stream.statusCode === 302) {
          // Follow redirect once if Cloudinary redirects signed URLs
          https.get(stream.headers.location, options, (redirectStream) => {
            if (redirectStream.statusCode === 200) {
              redirectStream.pipe(res);
            } else {
              res.redirect(resourceUrl);
            }
          });
        } else {
          console.error(`[Proxy] Cloudinary returned ${stream.statusCode} for ${resourceUrl}`);
          // Last ditch effort: redirect to the signed URL so the browser can try
          res.redirect(resourceUrl);
        }
      }).on('error', (err) => {
        console.error('[Proxy] Stream error:', err.message);
        res.redirect(resourceUrl);
      });
      return;
    }
    res.status(404).json({ success: false, message: "Resource file not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addLesson, getLessons, getLessonById, updateLesson, deleteLesson, uploadResource, deleteResource, downloadResource };