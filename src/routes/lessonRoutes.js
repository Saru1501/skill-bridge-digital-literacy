const express = require("express");
const { getLessonById, updateLesson, deleteLesson, uploadResource, deleteResource } = require("../controllers/lessonController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.route("/:id").get(protect, getLessonById).put(protect, adminOnly, updateLesson).delete(protect, adminOnly, deleteLesson);
router.post("/:id/resources", protect, adminOnly, upload.single("file"), uploadResource);
router.delete("/:id/resources/:resourceId", protect, adminOnly, deleteResource);

module.exports = router;