const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createProgram,
  listPrograms,
  applyForSponsorship,
  listNgoApplications,
  reviewApplication,
  redeemSponsorshipCode,
  deleteProgram,
  deleteApplication
} = require("../controllers/sponsorshipController");

const router = express.Router();

// Programs
router.post("/programs", protect, authorize("ngo"), createProgram);
router.get("/programs", protect, listPrograms);

// Applications
router.post("/applications", protect, authorize("student"), applyForSponsorship);
router.get("/applications", protect, authorize("ngo"), listNgoApplications);
router.put(
  "/applications/:id/status",
  protect,
  authorize("ngo"),
  reviewApplication
);

// Redeem
router.post("/redeem", protect, authorize("student"), redeemSponsorshipCode);

// Delete program (NGO)
router.delete(
  "/programs/:id",
  protect,
  authorize("ngo"),
  deleteProgram
);

// Delete application (Student)
router.delete(
  "/applications/:id",
  protect,
  authorize("student"),
  deleteApplication
);

module.exports = router;