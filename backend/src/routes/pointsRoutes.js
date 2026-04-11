const express = require("express");
const {
  createPointRule, getPointRules, updatePointRule,
  deletePointRule, getMyPoints
} = require("../controllers/pointsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
 
const router = express.Router();
 
router.get("/my", protect, getMyPoints);
router.route("/rules")
  .get(protect, adminOnly, getPointRules)
  .post(protect, adminOnly, createPointRule);
router.route("/rules/:id")
  .put(protect, adminOnly, updatePointRule)
  .delete(protect, adminOnly, deletePointRule);
 
module.exports = router;
