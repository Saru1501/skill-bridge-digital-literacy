import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  const allowedLower = allowedRoles.map(r => r.toLowerCase());

  if (allowedRoles.length > 0 && !allowedLower.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}