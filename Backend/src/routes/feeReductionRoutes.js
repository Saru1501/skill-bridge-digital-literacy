const express = require("express");
const {
  getMyFeeReductions, applyFeeReduction, getAllFeeReductions
} = require("../controllers/feeReductionController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
 
const router = express.Router();
 
router.get("/", protect, adminOnly, getAllFeeReductions);
router.get("/my", protect, getMyFeeReductions);
router.post("/apply/:id", protect, applyFeeReduction);
 
module.exports = router;
