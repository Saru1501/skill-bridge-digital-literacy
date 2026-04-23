const SupportTicket = require("../models/SupportTicket");

// Student: create ticket
const createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: "subject and description are required" });
    }

    const ticket = await SupportTicket.create({
      createdBy: req.user._id,
      subject,
      description,
    });

    return res.status(201).json({ message: "Ticket created", ticket });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Student: view own tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Admin: view all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Admin: update status
const updateTicketStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    if (!["OPEN", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    ticket.adminResponse = adminResponse || ticket.adminResponse;
    ticket.resolvedBy = req.user._id;

    await ticket.save();

    return res.status(200).json({ message: "Ticket updated", ticket });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
};