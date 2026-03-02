// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./src/config/db");

// // Route imports
// const authRoutes = require("./src/routes/authRoutes");
// const courseRoutes = require("./src/routes/courseRoutes");
// const lessonRoutes = require("./src/routes/lessonRoutes");
// const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
// const progressRoutes = require("./src/routes/progressRoutes");
// const savedCourseRoutes = require("./src/routes/savedCourseRoutes");
// const quizRoutes = require("./src/routes/quizRoutes");
// const missionRoutes = require("./src/routes/missionRoutes");
// const missionSubmissionRoutes = require("./src/routes/missionSubmissionRoutes");
// const performanceRoutes = require("./src/routes/performanceRoutes");

// const app = express();
// const googleFormsRoutes = require('./src/routes/googleFormsRoutes');
// app.use('/api/google-forms', googleFormsRoutes);

// app.use(express.json());
// app.use(cors());

// // Base route
// app.get("/", (req, res) => {
//   res.send("Skill Bridge API Running...");
// });

// // Mount routes
// app.use("/api/auth", authRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/lessons", lessonRoutes);
// app.use("/api/enrollments", enrollmentRoutes);
// app.use("/api/progress", progressRoutes);
// app.use("/api/saved", savedCourseRoutes);
// app.use("/api/quizzes", quizRoutes);
// app.use("/api/missions", missionRoutes);
// app.use("/api/submissions", missionSubmissionRoutes);
// app.use("/api", performanceRoutes);

// // Handle unknown routes
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await connectDB();
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();
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
const quizRoutes = require("./src/routes/quizRoutes");
const missionRoutes = require("./src/routes/missionRoutes");
const missionSubmissionRoutes = require("./src/routes/missionSubmissionRoutes");
const performanceRoutes = require("./src/routes/performanceRoutes");
const googleFormsRoutes = require('./src/routes/googleFormsRoutes');

const app = express();

// ✅ Middleware FIRST — before all routes
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
app.use("/api/quizzes", quizRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/submissions", missionSubmissionRoutes);
app.use("/api", performanceRoutes);
app.use('/api/google-forms', googleFormsRoutes);

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