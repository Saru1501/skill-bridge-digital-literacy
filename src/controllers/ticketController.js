const SupportTicket = require("../models/SupportTicket");

// STUDENT create ticket
exports.createTicket = async (req, res) => {
  const { subject, description } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ message: "subject and description required" });
  }

  const ticket = await SupportTicket.create({
    student: req.user._id,
    subject,
    description,
  });

  res.status(201).json(ticket);
};

// STUDENT list own tickets
exports.myTickets = async (req, res) => {
  const tickets = await SupportTicket.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
};

// ADMIN list all tickets
exports.allTickets = async (req, res) => {
  const tickets = await SupportTicket.find()
    .populate("student", "name email role")
    .sort({ createdAt: -1 });
  res.json(tickets);
};

// ADMIN update status / resolve
exports.updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  if (!["OPEN", "IN_PROGRESS", "RESOLVED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  ticket.status = status;
  if (status === "RESOLVED") {
    ticket.resolvedBy = req.user._id;
    ticket.resolvedAt = new Date();
  }

  await ticket.save();
  res.json(ticket);
};