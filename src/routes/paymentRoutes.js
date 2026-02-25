const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createPaymentIntent, markPaid } = require("../controllers/paymentController");

const router = express.Router();

// Student create intent
router.post("/intent", protect, authorize("STUDENT"), createPaymentIntent);

// Student confirm success (simplified)
router.put("/:id/paid", protect, authorize("STUDENT"), markPaid);

//
router.get("/health", (req, res) => res.json({ ok: true }));

module.exports = router;