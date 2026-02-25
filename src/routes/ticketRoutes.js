const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createTicket,
  myTickets,
  allTickets,
  updateTicketStatus,
} = require("../controllers/ticketController");

const router = express.Router();

// Student
router.post("/", protect, authorize("STUDENT"), createTicket);
router.get("/me", protect, authorize("STUDENT"), myTickets);

// Admin
router.get("/", protect, authorize("ADMIN"), allTickets);
router.put("/:id/status", protect, authorize("ADMIN"), updateTicketStatus);

//
router.get("/health", (req, res) => res.json({ ok: true }));

module.exports = router;