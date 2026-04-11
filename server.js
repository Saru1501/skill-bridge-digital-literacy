require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");
const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const savedCourseRoutes = require("./src/routes/savedCourseRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// Base route
app.get("/", (req, res) => {
  res.send("Skill Bridge API Running...");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/saved", savedCourseRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

const badgeRoutes = require("./src/routes/badgeRoutes");
const pointsRoutes = require("./src/routes/pointsRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");
const leaderboardRoutes = require("./src/routes/leaderboardRoutes");
const feeReductionRoutes = require("./src/routes/feeReductionRoutes");
const gamificationRoutes = require("./src/routes/gamificationRoutes");
 
app.use("/api/badges", badgeRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/fee-reduction", feeReductionRoutes);
app.use("/api/gamification", gamificationRoutes);
