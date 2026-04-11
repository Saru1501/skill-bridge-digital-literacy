const express = require("express");
const {
  generateCertificate, getMyCertificates,
  getCertificateById, getAllCertificates
} = require("../controllers/certificateController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
 
const router = express.Router();
 
router.get("/", protect, adminOnly, getAllCertificates);
router.get("/my", protect, getMyCertificates);
router.get("/:id", protect, getCertificateById);
router.post("/generate/:courseId", protect, generateCertificate);
 
module.exports = router;
