const express = require("express");
const { body } = require("express-validator");
const {
  createNGO,
  createProgram,
  applySponsorship,
  myApplication,
  listApplications,
  reviewApplication,
} = require("../controllers/sponsorshipController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin create NGO
router.post("/ngo", protect, authorize("ADMIN"), createNGO);

// NGO/Admin create program
router.post("/program", protect, authorize("NGO", "ADMIN"), createProgram);

// Student apply
router.post(
  "/apply",
  protect,
  authorize("STUDENT"),
  [
    body("program").notEmpty().withMessage("program is required"),
    body("fullName").notEmpty().withMessage("fullName is required"),
    body("nic").notEmpty().withMessage("nic is required"),
    body("phone").notEmpty().withMessage("phone is required"),
    body("reason").notEmpty().withMessage("reason is required"),
  ],
  applySponsorship
);

// Student view own
router.get("/me", protect, authorize("STUDENT"), myApplication);

// NGO/Admin list applications
router.get("/applications", protect, authorize("NGO", "ADMIN"), listApplications);

// NGO/Admin review
router.put("/applications/:id/status", protect, authorize("NGO", "ADMIN"), reviewApplication);

//
router.get("/health", (req, res) => res.json({ ok: true }));

module.exports = router;