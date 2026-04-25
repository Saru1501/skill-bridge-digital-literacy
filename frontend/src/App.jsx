import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Dashboards
import Dashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";

// Course & Learning (Component 1)
import BrowseCourses from "./pages/student/BrowseCourses";
import CourseDetail from "./pages/student/CourseDetail";
import MyCourses from "./pages/student/MyCourses";
import LessonView from "./pages/student/LessonView";
import SavedResources from "./pages/student/SavedResources";
import SavedLessonResources from "./pages/student/SavedLessonResources";
import Downloads from "./pages/student/Downloads";

// Management (Admin/University)
import ManageCourses from "./pages/admin/ManageCourses";
import ManageLessons from "./pages/admin/ManageLessons";
import ManageResources from "./pages/admin/ManageResources";

// Assessment (Component 2)
import StudentAssessmentHub from "./pages/student/StudentAssessmentHub";
import MissionsPage from "./pages/student/MissionsPage";
import QuizPage from "./pages/student/QuizPage";
import PerformancePage from "./pages/student/PerformancePage";
import AdminAssessmentHub from "./pages/admin/AdminAssessmentHub";
import AdminMissionsPage from "./pages/admin/AdminMissionsPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";

// Gamification (Component 3)
import GamificationDashboard from "./pages/gamification/GamificationDashboard";
import Leaderboard from "./pages/gamification/Leaderboard";
import AdminGamification from "./pages/gamification/AdminGamification";

// Sponsorship & Support (Component 4)
import StudentProgramsPage from "./pages/StudentProgramsPage";
import StudentApplyPage from "./pages/StudentApplyPage";
import StudentApplicationsPage from "./pages/StudentApplicationsPage";
import StudentRedeemPage from "./pages/StudentRedeemPage";
import StudentTicketsPage from "./pages/StudentTicketsPage";
import StudentPaymentPage from "./pages/StudentPaymentPage";
import NgoProgramsPage from "./pages/NgoProgramsPage";
import NgoApplicationsPage from "./pages/NgoApplicationsPage";
import AdminTicketsPage from "./pages/AdminTicketsPage";

// Layout & Security
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import "./assessment.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* SHARED APP LAYOUT FOR ALL ROLES */}
      <Route element={<AppLayout />}>
        
        {/* STUDENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse" element={<BrowseCourses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/lesson/:id" element={<LessonView />} />
          <Route path="/saved" element={<SavedResources />} />
          <Route path="/saved-resources" element={<SavedLessonResources />} />
          <Route path="/downloads" element={<Downloads />} />
          
          {/* Assessment */}
          <Route path="/assessment" element={<StudentAssessmentHub />} />
          <Route path="/assessment/course/:courseId/missions" element={<MissionsPage />} />
          <Route path="/assessment/course/:courseId/quizzes" element={<QuizPage />} />
          <Route path="/assessment/course/:courseId/performance" element={<PerformancePage />} />
          
          {/* Gamification */}
          <Route path="/student/gamification" element={<GamificationDashboard />} />
          <Route path="/student/leaderboard" element={<Leaderboard />} />
          
          {/* Sponsorship & Support */}
          <Route path="/student/programs" element={<StudentProgramsPage />} />
          <Route path="/student/apply" element={<StudentApplyPage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
          <Route path="/student/redeem" element={<StudentRedeemPage />} />
          <Route path="/student/tickets" element={<StudentTicketsPage />} />
          <Route path="/student/payment" element={<StudentPaymentPage />} />
        </Route>

        {/* ADMIN & UNIVERSITY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "university"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/courses/:courseId/lessons" element={<ManageLessons />} />
          <Route path="/admin/lessons/:lessonId/resources" element={<ManageResources />} />
          <Route path="/admin/assessment" element={<AdminAssessmentHub />} />
          <Route path="/admin/assessment/course/:courseId/missions" element={<AdminMissionsPage />} />
          <Route path="/admin/assessment/course/:courseId/quizzes" element={<AdminQuizzesPage />} />
          <Route path="/admin/tickets" element={<AdminTicketsPage />} />
          <Route path="/admin/gamification" element={<AdminGamification />} />
        </Route>

        {/* NGO ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ngo"]} />}>
          <Route path="/ngo" element={<NgoDashboard />} />
          <Route path="/ngo/programs" element={<NgoProgramsPage />} />
          <Route path="/ngo/applications" element={<NgoApplicationsPage />} />
        </Route>

      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
