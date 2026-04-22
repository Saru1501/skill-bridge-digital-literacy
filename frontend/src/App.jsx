import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProgramsPage from "./pages/StudentProgramsPage";
import StudentApplyPage from "./pages/StudentApplyPage";
import StudentRedeemPage from "./pages/StudentRedeemPage";
import StudentTicketsPage from "./pages/StudentTicketsPage";
import StudentPaymentPage from "./pages/StudentPaymentPage";

import NgoDashboard from "./pages/NgoDashboard";
import NgoProgramsPage from "./pages/NgoProgramsPage";
import NgoApplicationsPage from "./pages/NgoApplicationsPage";

import AdminTicketsPage from "./pages/AdminTicketsPage";
import AdminGamification from "./pages/gamification/AdminGamification";
import GamificationDashboard from "./pages/gamification/GamificationDashboard";
import Leaderboard from "./pages/gamification/Leaderboard";

import Dashboard from "./pages/student/Dashboard";
import BrowseCourses from "./pages/student/BrowseCourses";
import CourseDetail from "./pages/student/CourseDetail";
import MyCourses from "./pages/student/MyCourses";
import LessonView from "./pages/student/LessonView";
import SavedResources from "./pages/student/SavedResources";
import Downloads from "./pages/student/Downloads";
import MissionsPage from "./pages/student/MissionsPage";
import QuizPage from "./pages/student/QuizPage";
import PerformancePage from "./pages/student/PerformancePage";
import StudentAssessmentHub from "./pages/student/StudentAssessmentHub";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageLessons from "./pages/admin/ManageLessons";
import ManageResources from "./pages/admin/ManageResources";
import AdminAssessmentHub from "./pages/admin/AdminAssessmentHub";
import AdminMissionsPage from "./pages/admin/AdminMissionsPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";

import StudentLayout from "./layouts/StudentLayout";
import NgoLayout from "./layouts/NgoLayout";
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

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="programs" element={<StudentProgramsPage />} />
        <Route path="apply" element={<StudentApplyPage />} />
        <Route path="redeem" element={<StudentRedeemPage />} />
        <Route path="tickets" element={<StudentTicketsPage />} />
        <Route path="payment" element={<StudentPaymentPage />} />
      </Route>

      <Route
        path="/student/gamification"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <GamificationDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <NgoLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<NgoDashboard />} />
        <Route path="programs" element={<NgoProgramsPage />} />
        <Route path="applications" element={<NgoApplicationsPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<BrowseCourses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/lesson/:id" element={<LessonView />} />
        <Route path="/saved" element={<SavedResources />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/assessment" element={<StudentAssessmentHub />} />
        <Route
          path="/assessment/course/:courseId/missions"
          element={<MissionsPage />}
        />
        <Route
          path="/assessment/course/:courseId/quizzes"
          element={<QuizPage />}
        />
        <Route
          path="/assessment/course/:courseId/performance"
          element={<PerformancePage />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "university"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<ManageCourses />} />
        <Route
          path="/admin/courses/:courseId/lessons"
          element={<ManageLessons />}
        />
        <Route
          path="/admin/lessons/:lessonId/resources"
          element={<ManageResources />}
        />
        <Route path="/admin/assessment" element={<AdminAssessmentHub />} />
        <Route
          path="/admin/assessment/course/:courseId/missions"
          element={<AdminMissionsPage />}
        />
        <Route
          path="/admin/assessment/course/:courseId/quizzes"
          element={<AdminQuizzesPage />}
        />
        <Route path="/admin/tickets" element={<AdminTicketsPage />} />
        <Route path="/admin/gamification" element={<AdminGamification />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
