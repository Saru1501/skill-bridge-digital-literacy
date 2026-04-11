const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
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