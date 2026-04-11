const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createPaymentIntent } = require("../controllers/paymentController");

const router = express.Router();

router.post("/intent", protect, authorize("Student"), createPaymentIntent);

module.exports = router;