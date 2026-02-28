require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

// Route imports
const authRoutes = require("./src/routes/authRoutes");

const badgeRoutes = require("./src/routes/badgeRoutes");
const pointsRoutes = require("./src/routes/pointsRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");
const leaderboardRoutes = require("./src/routes/leaderboardRoutes");
const feeReductionRoutes = require("./src/routes/feeReductionRoutes");
const gamificationRoutes = require("./src/routes/gamificationRoutes");

//component 1 routes
const courseRoutes = require("./src/routes/courseRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");
const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const savedCourseRoutes = require("./src/routes/savedCourseRoutes");

// Component 4 routes (you will create these files)
const sponsorshipRoutes = require("./src/routes/sponsorshipRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Base route
app.get("/", (req, res) => {
  res.send("Skill Bridge API Running...");
});

// Mount routes
app.use("/api/auth", authRoutes);
//component 1
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/saved", savedCourseRoutes);
// Component 4 — Sponsorship, Payment & Support
app.use("/api/sponsorship", sponsorshipRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);
//

app.use("/api/badges", badgeRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/fee-reduction", feeReductionRoutes);
app.use("/api/gamification", gamificationRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


// Optional: 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();


 
