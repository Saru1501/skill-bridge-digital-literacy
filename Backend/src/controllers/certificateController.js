const Certificate = require("../models/Certificate");
const { v4: uuidv4 } = require("uuid");
 
const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;
 
    const existing = await Certificate.findOne({
      student: studentId, course: courseId
    });
    if (existing) {
      return res.status(200).json({
        success: true, message: "Certificate already exists", data: existing
      });
    }
 
    const certificateNumber =
      `CERT-${uuidv4().split("-")[0].toUpperCase()}-${Date.now()}`;
 
    const certificate = await Certificate.create({
      student: studentId,
      course: courseId,
      certificateNumber,
    });
 
    await certificate.populate("student", "name email");
    await certificate.populate("course", "title category");
 
    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate("course", "title category level");
    res.status(200).json({
      success: true, count: certificates.length, data: certificates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title category level");
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }
    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "title");
    res.status(200).json({
      success: true, count: certificates.length, data: certificates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
module.exports = {
  generateCertificate, getMyCertificates,
  getCertificateById, getAllCertificates
};
