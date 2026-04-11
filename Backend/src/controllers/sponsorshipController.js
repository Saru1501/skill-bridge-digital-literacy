const { validationResult } = require("express-validator");
const SponsorshipProgram = require("../models/SponsorshipProgram");
const SponsorshipApplication = require("../models/SponsorshipApplication");

// Helper: generate a simple unique code
const generateCode = () => {
  return `SB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// NGO: create program
const createProgram = async (req, res) => {
  try {
    const { title, description, maxStudents, active } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const program = await SponsorshipProgram.create({
      ngoUser: req.user._id,
      title,
      description: description || "",
      maxStudents: maxStudents || 0,
      active: active !== undefined ? active : true,
    });

    return res.status(201).json({ message: "Program created", program });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Anyone logged-in: list active programs
const listPrograms = async (req, res) => {
  try {
    const programs = await SponsorshipProgram.find({ active: true })
      .populate("ngoUser", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ programs });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Student: apply
const applyForSponsorship = async (req, res) => {
  try {
    const { programId, reason } = req.body;

    if (!programId || !reason) {
      return res.status(400).json({ message: "programId and reason are required" });
    }

    const program = await SponsorshipProgram.findById(programId);
    if (!program || !program.active) {
      return res.status(404).json({ message: "Program not found or inactive" });
    }

    // prevent duplicate pending application for same program
    const existing = await SponsorshipApplication.findOne({
      program: programId,
      studentUser: req.user._id,
      status: "PENDING",
    });

    if (existing) {
      return res.status(409).json({ message: "You already have a pending application" });
    }

    const app = await SponsorshipApplication.create({
      program: programId,
      studentUser: req.user._id,
      reason,
    });

    return res.status(201).json({ message: "Application submitted", application: app });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// NGO: list applications for their programs
const listNgoApplications = async (req, res) => {
  try {
    // find NGO programs first
    const programs = await SponsorshipProgram.find({ ngoUser: req.user._id }).select("_id");
    const programIds = programs.map((p) => p._id);

    const applications = await SponsorshipApplication.find({ program: { $in: programIds } })
      .populate("studentUser", "name email role")
      .populate("program", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// NGO: approve/reject
const reviewApplication = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "status must be APPROVED or REJECTED" });
    }

    const application = await SponsorshipApplication.findById(req.params.id).populate(
      "program",
      "ngoUser title"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ensure this application belongs to this NGO
    if (String(application.program.ngoUser) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not your program application" });
    }

    application.status = status;
    application.reviewNote = reviewNote || "";
    application.reviewedBy = req.user._id;

    if (status === "APPROVED" && !application.sponsorshipCode) {
      application.sponsorshipCode = generateCode();
    }

    await application.save();

    return res.status(200).json({ message: "Application updated", application });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Student: redeem code
const redeemSponsorshipCode = async (req, res) => {
  try {
    const { sponsorshipCode } = req.body;
    if (!sponsorshipCode) {
      return res.status(400).json({ message: "sponsorshipCode is required" });
    }

    const application = await SponsorshipApplication.findOne({
      sponsorshipCode: sponsorshipCode.trim(),
      status: "APPROVED",
      studentUser: req.user._id,
    }).populate("program", "title");

    if (!application) {
      return res.status(404).json({ message: "Invalid code or not approved" });
    }

    // minimal response: valid + program
    return res.status(200).json({
      valid: true,
      message: "Sponsorship code valid",
      program: application.program,
      sponsorshipCode: application.sponsorshipCode,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createProgram,
  listPrograms,
  applyForSponsorship,
  listNgoApplications,
  reviewApplication,
  redeemSponsorshipCode,
};