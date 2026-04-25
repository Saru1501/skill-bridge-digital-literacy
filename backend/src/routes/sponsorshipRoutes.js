const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createProgram,
  listPrograms,
  applyForSponsorship,
  listMyApplications,
  listNgoApplications,
  reviewApplication,
  redeemSponsorshipCode,
  deleteProgram,
  deleteApplication,
  updateProgram,
} = require("../controllers/sponsorshipController");

const router = express.Router();

// Programs
router.post("/programs", protect, authorize("ngo"), createProgram);
router.get("/programs", protect, listPrograms);

// Applications
router.post("/applications", protect, authorize("student"), applyForSponsorship);
router.get("/applications/my", protect, authorize("student"), listMyApplications);
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
router.put("/programs/:id", protect, authorize("ngo"), updateProgram);

// Delete application (Student)
router.delete(
  "/applications/:id",
  protect,
  authorize("student"),
  deleteApplication
);

module.exports = router;
