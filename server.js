const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./backend/src/config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => res.status(200).json({ success: true, message: "SkillBridge API running" }));

// ── Auth ──────────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./backend/src/routes/authRoutes"));

// ── Component 1: Learning Management & Offline Delivery ──────────────────────
app.use("/api/courses",     require("./backend/src/routes/courseRoutes"));
app.use("/api/lessons",     require("./backend/src/routes/lessonRoutes"));
app.use("/api/enrollments", require("./backend/src/routes/enrollmentRoutes"));
app.use("/api/progress",    require("./backend/src/routes/progressRoutes"));
app.use("/api/saved",       require("./backend/src/routes/savedCourseRoutes"));
app.use("/api/saved-resources", require("./backend/src/routes/savedResourceRoutes"));

// ── Component 2: Assessment & Evaluation ─────────────────────────────────────
app.use("/api/missions",    require("./backend/src/routes/missionRoutes"));
app.use("/api/submissions", require("./backend/src/routes/missionSubmissionRoutes"));
app.use("/api/quizzes",     require("./backend/src/routes/quizRoutes"));
app.use("/api/performance", require("./backend/src/routes/performanceRoutes"));

// ── Component 3: Gamification, Rewards & Certification ───────────────────────
app.use("/api/badges",        require("./backend/src/routes/badgeRoutes"));
app.use("/api/points",        require("./backend/src/routes/pointsRoutes"));
app.use("/api/certificates",  require("./backend/src/routes/certificateRoutes"));
app.use("/api/leaderboard",   require("./backend/src/routes/leaderboardRoutes"));
app.use("/api/fee-reduction", require("./backend/src/routes/feeReductionRoutes"));
app.use("/api/gamification",  require("./backend/src/routes/gamificationRoutes"));

// ── Component 4: Sponsorship, Payments & Support ─────────────────────────────
app.use("/api/sponsorship", require("./backend/src/routes/sponsorshipRoutes"));
app.use("/api/tickets",     require("./backend/src/routes/ticketRoutes"));
app.use("/api/payments",    require("./backend/src/routes/paymentRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// DB connection
const dbReady = connectDB();

const PORT = process.env.PORT || 3001;

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
