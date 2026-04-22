import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
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
import AdminMissionsPage from "./pages/admin/AdminMissionsPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageLessons from "./pages/admin/ManageLessons";
import ManageResources from "./pages/admin/ManageResources";
import AdminAssessmentHub from "./pages/admin/AdminAssessmentHub";
import "./assessment.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/browse"      element={<BrowseCourses />} />
            <Route path="/course/:id"  element={<CourseDetail />} />
            <Route path="/my-courses"  element={<MyCourses />} />
            <Route path="/lesson/:id"  element={<LessonView />} />
            <Route path="/saved"       element={<SavedResources />} />
            <Route path="/downloads"   element={<Downloads />} />
            <Route path="/assessment"  element={<StudentAssessmentHub />} />
            <Route path="/assessment/course/:courseId/missions"    element={<MissionsPage />} />
            <Route path="/assessment/course/:courseId/quizzes"     element={<QuizPage />} />
            <Route path="/assessment/course/:courseId/performance" element={<PerformancePage />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly><AppLayout /></ProtectedRoute>}>
            <Route path="/admin"                                element={<AdminDashboard />} />
            <Route path="/admin/courses"                        element={<ManageCourses />} />
            <Route path="/admin/courses/:courseId/lessons"      element={<ManageLessons />} />
            <Route path="/admin/lessons/:lessonId/resources"    element={<ManageResources />} />
            <Route path="/admin/assessment"                     element={<AdminAssessmentHub />} />
            <Route path="/admin/assessment/course/:courseId/missions" element={<AdminMissionsPage />} />
            <Route path="/admin/assessment/course/:courseId/quizzes"  element={<AdminQuizzesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}