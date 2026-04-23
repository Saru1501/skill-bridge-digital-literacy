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
  authorize("Admin"),
  (req, res) => res.status(200).json({ message: "Admin access granted", user: req.user })
);
router.get(
  "/organization",
  protect,
  authorize("University", "NGO"),
  (req, res) =>
    res.status(200).json({ message: "Organization access granted", user: req.user })
);
router.get(
  "/mentors",
  protect,
  authorize("Mentor", "Admin"),
  (req, res) => res.status(200).json({ message: "Mentor/Admin access granted", user: req.user })
);

module.exports = router;
