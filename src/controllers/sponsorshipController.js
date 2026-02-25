const { validationResult } = require("express-validator");
const NGO = require("../models/NGO");
const SponsorshipProgram = require("../models/SponsorshipProgram");
const SponsorshipApplication = require("../models/SponsorshipApplication");

const makeCode = (prefix = "NGO") => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}-${rand}`;
};

// ADMIN create NGO
exports.createNGO = async (req, res) => {
  const ngo = await NGO.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(ngo);
};

// NGO/ADMIN create Sponsorship Program
exports.createProgram = async (req, res) => {
  const program = await SponsorshipProgram.create(req.body);
  res.status(201).json(program);
};

// STUDENT apply
exports.applySponsorship = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const application = await SponsorshipApplication.create({
    student: req.user._id,
    program: req.body.program,
    fullName: req.body.fullName,
    nic: req.body.nic,
    phone: req.body.phone,
    reason: req.body.reason,
  });

  res.status(201).json(application);
};

// STUDENT view own application
exports.myApplication = async (req, res) => {
  const app = await SponsorshipApplication.findOne({ student: req.user._id })
    .populate({ path: "program", populate: { path: "ngo" } });

  if (!app) return res.status(404).json({ message: "No application found" });
  res.json(app);
};

// NGO/ADMIN list all applications (filter by status optional)
exports.listApplications = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const apps = await SponsorshipApplication.find(filter)
    .populate("student", "name email role")
    .populate({ path: "program", populate: { path: "ngo" } })
    .sort({ createdAt: -1 });

  res.json(apps);
};

// NGO/ADMIN review approve/reject
exports.reviewApplication = async (req, res) => {
  const { status } = req.body; // APPROVED / REJECTED
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const app = await SponsorshipApplication.findById(req.params.id)
    .populate({ path: "program", populate: { path: "ngo" } });

  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status = status;
  app.reviewedBy = req.user._id;
  app.reviewedAt = new Date();

  if (status === "APPROVED" && !app.sponsorshipCode) {
    const prefix = app.program?.ngo?.referralPrefix || "NGO";
    app.sponsorshipCode = makeCode(prefix);
  }

  await app.save();
  res.json(app);
};