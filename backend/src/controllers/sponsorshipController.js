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
    const isNgo = String(req.user?.role || "").toLowerCase() === "ngo";
    const query = isNgo ? { ngoUser: req.user._id } : { active: true };

    const programs = await SponsorshipProgram.find(query)
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

// Student: list own applications
const listMyApplications = async (req, res) => {
  try {
    const applications = await SponsorshipApplication.find({
      studentUser: req.user._id,
    })
      .populate({
        path: "program",
        populate: {
          path: "ngoUser",
          select: "name email role",
        },
      })
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

// NGO: delete sponsorship program
const deleteProgram = async (req, res) => {
  try {
    const program = await SponsorshipProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Ensure NGO owns this program
    if (String(program.ngoUser) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not your program" });
    }

    await program.deleteOne();

    return res.status(200).json({
      message: "Program deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// NGO: update sponsorship program
const updateProgram = async (req, res) => {
  try {
    const program = await SponsorshipProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    if (String(program.ngoUser) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not your program" });
    }

    const { title, description, maxStudents, active } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    program.title = title;
    program.description = description || "";
    program.maxStudents = Number(maxStudents) || 0;
    program.active = active !== undefined ? active : program.active;

    await program.save();

    return res.status(200).json({
      message: "Program updated successfully",
      program,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Student: delete their sponsorship application
const deleteApplication = async (req, res) => {
  try {
    const application = await SponsorshipApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ensure the student owns the application
    if (String(application.studentUser) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not your application" });
    }

    // Only allow deletion if still pending
    if (application.status !== "PENDING") {
      return res.status(400).json({
        message: "Cannot delete application after review",
      });
    }

    await application.deleteOne();

    return res.status(200).json({
      message: "Application deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createProgram,
  listPrograms,
  applyForSponsorship,
  deleteProgram,
  deleteApplication,
  listMyApplications,
  listNgoApplications,
  reviewApplication,
  redeemSponsorshipCode,
  updateProgram,
};
