const express = require("express");
const {
  createBadge, getBadges, updateBadge, deleteBadge, getMyBadges
} = require("../controllers/badgeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
 
const router = express.Router();
 
router.get("/my", protect, getMyBadges);
router.route("/")
  .get(protect, adminOnly, getBadges)
  .post(protect, adminOnly, createBadge);
router.route("/:id")
  .put(protect, adminOnly, updateBadge)
  .delete(protect, adminOnly, deleteBadge);
 
module.exports = router;
