import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import StudentDashboard from "./pages/StudentDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProgramsPage from "./pages/StudentProgramsPage";
import StudentApplyPage from "./pages/StudentApplyPage";
import StudentRedeemPage from "./pages/StudentRedeemPage";
import StudentTicketsPage from "./pages/StudentTicketsPage";
import StudentPaymentPage from "./pages/StudentPaymentPage";
import StudentLayout from "./layouts/StudentLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

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
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <NgoDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;