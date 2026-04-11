import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import StudentDashboard from "./pages/StudentDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import GamificationDashboard from "./pages/gamification/GamificationDashboard";
import AdminGamification from "./pages/gamification/AdminGamification";
import Leaderboard from "./pages/gamification/Leaderboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/gamification"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <GamificationDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["Student"]}>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={["NGO"]}>
            <NgoDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/gamification"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminGamification />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;