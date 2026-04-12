import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error,    setError]    = useState("");

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const getDashboardPath = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin" || r === "university") return "/admin";
    if (r === "ngo")     return "/ngo";
    if (r === "student") return "/dashboard";
    return "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(formData);
    if (!result.success) { setError(result.message); return; }
    navigate(getDashboardPath(result.user?.role), { replace: true });
  };

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f6f6f3", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ backgroundColor:"white", borderRadius:"24px", padding:"40px", maxWidth:"400px", width:"100%", boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"36px", fontWeight:700, color:"#2563EB", marginBottom:"12px" }}>SkillBridge</div>
          <h1 style={{ fontSize:"24px", fontWeight:600, color:"#0F172A" }}>Welcome back</h1>
          <p style={{ color:"#64748B", marginTop:"6px", fontSize:"14px" }}>Log in to continue your learning journey</p>
        </div>

        {error && (
          <div style={{ backgroundColor:"#FEE2E2", color:"#B91C1C", padding:"12px", borderRadius:"10px", marginBottom:"16px", fontSize:"14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          <div>
            <label style={{ display:"block", fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"6px" }}>Email</label>
            <input type="email" name="email" placeholder="your@email.com" value={formData.email}
              onChange={handleChange} required
              style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #E2E8F0", borderRadius:"10px", fontSize:"14px", outline:"none" }} />
          </div>
          <div>
            <label style={{ display:"block", fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"6px" }}>Password</label>
            <input type="password" name="password" placeholder="Your password" value={formData.password}
              onChange={handleChange} required
              style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #E2E8F0", borderRadius:"10px", fontSize:"14px", outline:"none" }} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"13px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"10px",
              fontSize:"15px", fontWeight:600, cursor:"pointer", opacity:loading?0.7:1 }}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:"20px", fontSize:"14px" }}>
          <span style={{ color:"#64748B" }}>Don't have an account? </span>
          <Link to="/register" style={{ color:"#2563EB", fontWeight:600, textDecoration:"none" }}>Sign up</Link>
        </div>

        <div style={{ marginTop:"20px", padding:"12px", background:"#F8FAFC", borderRadius:"10px", fontSize:"12px", color:"#94A3B8", textAlign:"center" }}>
          Roles: student &bull; university &bull; ngo &bull; admin
        </div>
      </div>
    </div>
  );
}
