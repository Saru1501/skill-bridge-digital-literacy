const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createProgram,
  listPrograms,
  applyForSponsorship,
  listNgoApplications,
  reviewApplication,
  redeemSponsorshipCode,
} = require("../controllers/sponsorshipController");

const router = express.Router();

// Programs
router.post("/programs", protect, authorize("NGO"), createProgram);
router.get("/programs", protect, listPrograms);

// Applications
router.post("/applications", protect, authorize("Student"), applyForSponsorship);
router.get("/applications", protect, authorize("NGO"), listNgoApplications);
router.put(
  "/applications/:id/status",
  protect,
  authorize("NGO"),
  reviewApplication
);

// Redeem
router.post("/redeem", protect, authorize("Student"), redeemSponsorshipCode);

module.exports = router;