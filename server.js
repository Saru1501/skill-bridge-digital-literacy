const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => res.status(200).json({ success: true, message: "SkillBridge API running" }));

// Auth
app.use("/api/auth", require("./src/routes/authRoutes"));

// Component 1: Learning Management
app.use("/api/courses", require("./src/routes/courseRoutes"));
app.use("/api/lessons", require("./src/routes/lessonRoutes"));
app.use("/api/enrollments", require("./src/routes/enrollmentRoutes"));
app.use("/api/progress", require("./src/routes/progressRoutes"));
app.use("/api/saved", require("./src/routes/savedCourseRoutes"));

// Component 3: Gamification
app.use("/api/badges", require("./src/routes/badgeRoutes"));
app.use("/api/points", require("./src/routes/pointsRoutes"));
app.use("/api/certificates", require("./src/routes/certificateRoutes"));
app.use("/api/leaderboard", require("./src/routes/leaderboardRoutes"));
app.use("/api/fee-reduction", require("./src/routes/feeReductionRoutes"));
app.use("/api/gamification", require("./src/routes/gamificationRoutes"));

// Component 4: Sponsorship
app.use("/api/sponsorship", require("./src/routes/sponsorshipRoutes"));
app.use("/api/tickets", require("./src/routes/ticketRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// DB connection - returns promise so tests can await it
const dbReady = connectDB();

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  dbReady.then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });
}

module.exports = app;
module.exports.dbReady = dbReady;