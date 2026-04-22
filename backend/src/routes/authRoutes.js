const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["student", "admin", "university", "ngo", "mentor"])
      .withMessage("Invalid role provided"),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);
router.get("/me", protect, getMe);
router.get(
  "/admin",
  protect,
  authorize("admin"),  // fixed: lowercase
  (req, res) => res.status(200).json({ success: true, message: "Admin access granted", user: req.user })
);
router.get(
  "/organization",
  protect,
  authorize("university", "ngo"),  // fixed: lowercase
  (req, res) => res.status(200).json({ success: true, message: "Organization access granted", user: req.user })
);
router.get(
  "/mentors",
  protect,
  authorize("mentor", "admin"),  // fixed: lowercase
  (req, res) => res.status(200).json({ success: true, message: "Mentor/Admin access granted", user: req.user })
);

module.exports = router;