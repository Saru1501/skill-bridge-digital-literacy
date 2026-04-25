import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token, loading } = useAuth();

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:12 }}>
      <div style={{ width:36, height:36, border:"3px solid #D1FAE5", borderTop:"3px solid #10B981",
        borderRadius:"50%", animation:"spin 0.8s linear infinite" }}></div>
      <span style={{ color:"#059669", fontSize:14, fontWeight:600 }}>Syncing Workspace...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user || !token) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0) {
    const userRole    = user.role?.toLowerCase();
    const allowedLow  = allowedRoles.map(r => r.toLowerCase());
    if (!allowedLow.includes(userRole)) return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
