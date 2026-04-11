const express = require("express");
const {
  getLessonById, updateLesson, deleteLesson,
  uploadResource, addLinkResource, deleteResource
} = require("../controllers/lessonController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// GET/PUT/DELETE single lesson
router.route("/:id")
  .get(protect, getLessonById)
  .put(protect, adminOnly, updateLesson)
  .delete(protect, adminOnly, deleteLesson);

// POST file resource  (PDF, video file, slides) → Cloudinary
router.post("/:id/resources", protect, adminOnly, upload.single("file"), uploadResource);

// POST link resource (YouTube URL, external link) → stored directly
router.post("/:id/resources/link", protect, adminOnly, addLinkResource);

// DELETE resource
router.delete("/:id/resources/:resourceId", protect, adminOnly, deleteResource);

module.exports = router;
