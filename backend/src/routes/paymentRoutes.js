const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createPaymentIntent } = require("../controllers/paymentController");

const router = express.Router();

router.post("/intent", protect, authorize("student"), createPaymentIntent);

module.exports = router;