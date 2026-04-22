const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const ALLOWED_ROLES = ["Student", "University", "NGO", "Mentor", "Admin"];
const ROLE_MAP = {
  student: "Student",
  university: "University",
  ngo: "NGO",
  mentor: "Mentor",
  admin: "Admin",
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const formatAuthError = (error) => {
  if (error?.code === 11000) {
    return { status: 409, message: "User already exists" };
  }

  if (error?.name === "ValidationError") {
    const message = Object.values(error.errors || {})
      .map((entry) => entry.message)
      .filter(Boolean)
      .join(", ");

    return {
      status: 400,
      message: message || "Invalid user data",
    };
  }

  if (
    error?.name === "MongooseServerSelectionError" ||
    String(error?.message || "").includes("buffering timed out") ||
    String(error?.message || "").includes("ECONNREFUSED")
  ) {
    return {
      status: 503,
      message: "Database connection is not available. Check MongoDB and try again.",
    };
  }

  if (String(error?.message || "").includes("JWT_SECRET")) {
    return {
      status: 500,
      message: "JWT configuration is missing. Check backend .env settings.",
    };
  }

  if (
    error?.name === "MongooseServerSelectionError" ||
    String(error?.message || "").includes("buffering timed out") ||
    String(error?.message || "").includes("ECONNREFUSED")
  ) {
    return {
      status: 503,
      message: "Database connection is not available. Check MongoDB and try again.",
    };
  }

  if (String(error?.message || "").includes("JWT_SECRET")) {
    return {
      status: 500,
      message: "JWT configuration is missing. Check backend .env settings.",
    };
  }

  return {
    status: 500,
    message: error?.message || "Server error",
  };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedRole = role ? ROLE_MAP[String(role).toLowerCase()] : "Student";

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (role && !normalizedRole) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("loginUser failed:", error);
    const { status, message } = formatAuthError(error);
    return res.status(status).json({ message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("registerUser failed:", error);
    const { status, message } = formatAuthError(error);
    return res.status(status).json({ message });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({ data: req.user });
  } catch (error) {
    const { status, message } = formatAuthError(error);
    return res.status(status).json({ message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
