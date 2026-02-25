require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

// Existing route (auth)
const authRoutes = require("./src/routes/authRoutes");

// Component 4 routes (you will create these files)
const sponsorshipRoutes = require("./src/routes/sponsorshipRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("Skill Bridge API Running...");
});

/**
 * Routes
 * NOTE: Keep routes grouped by component to avoid merge conflicts.
 * Team members should only add new app.use(...) lines in this section.
 */
app.use("/api/auth", authRoutes);

// Component 4 — Sponsorship, Payment & Support
app.use("/api/sponsorship", sponsorshipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);

// Optional: 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

// Export app for testing (won't break anything in normal run)
module.exports = app;