const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Middleware (JWT Authentication)
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, token missing");
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      res.status(500);
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode === 200) res.status(401);
    const errMessage = error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" 
      ? "Not authorized, token invalid or expired" 
      : error.message;
    next(new Error(errMessage));
  }
};

// Reusable Role-Based Authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      res.status(401);
      return next(new Error("Not authorized, user role missing"));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Forbidden: ${req.user.role} role does not have access`));
    }

    next();
  };
};

// Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    return next(new Error("Access denied. Admins only."));
  }
};

module.exports = { protect, authorize, adminOnly };