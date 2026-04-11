const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", protect, authorize("student"), createTicket);
router.get("/my", protect, authorize("student"), getMyTickets);

router.get("/", protect, authorize("admin"), getAllTickets);
router.put("/:id/status", protect, authorize("admin"), updateTicketStatus);

module.exports = router;