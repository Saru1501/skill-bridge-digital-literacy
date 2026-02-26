const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, authorize("Student"), createTicket);
router.get("/my", protect, authorize("Student"), getMyTickets);

router.get("/", protect, authorize("Admin"), getAllTickets);
router.put("/:id/status", protect, authorize("Admin"), updateTicketStatus);

module.exports = router;