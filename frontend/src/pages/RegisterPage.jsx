import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      const role = String(user?.role || "").toLowerCase();

      if (role === "admin" || role === "university") navigate("/admin");
      else if (role === "ngo") navigate("/ngo");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#1E293B', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <div className="auth-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(30,41,59,0.10)', maxWidth: 480, width: '100%', margin: 32 }}>
        <div className="auth-card-header" style={{ padding: '32px 32px 18px 32px', borderBottom: '1.5px solid #F1F5F9', textAlign: 'center' }}>
          <div className="auth-logo" style={{background: 'linear-gradient(135deg, #3B82F6 0%, #1E293B 100%)', color: 'white', width: 54, height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto'}}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6m3-3h-6"/></svg>
          </div>
          <h1 style={{ color: '#1E293B', fontWeight: 800, fontSize: 26, margin: 0 }}>Create Identity</h1>
          <p style={{ color: '#64748B', fontWeight: 500, margin: '8px 0 0 0' }}>Join the SkillBridge national digital literacy initiative</p>
        </div>

        <div className="auth-body" style={{ padding: 32 }}>
          {error && <div className="alert alert-error" style={{textAlign:"center"}}>{error}</div>}
          <form onSubmit={handleSubmit} style={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px"}}>
            <div className="form-group" style={{gridColumn: "span 2"}}>
              <label className="form-label" style={{display:"flex", alignItems:"center", gap:6, color: '#1E293B', fontWeight: 600}}>
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                 Full Legal Name
              </label>
              <input type="text" className="form-control" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B', borderRadius: 10, marginTop: 4 }} />
            </div>
            <div className="form-group" style={{gridColumn: "span 2"}}>
              <label className="form-label" style={{display:"flex", alignItems:"center", gap:6, color: '#1E293B', fontWeight: 600}}>
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                 Official Email
              </label>
              <input type="email" className="form-control" placeholder="john.doe@example.lk" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B', borderRadius: 10, marginTop: 4 }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{display:"flex", alignItems:"center", gap:6, color: '#1E293B', fontWeight: 600}}>
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                 Account Key
              </label>
              <input type="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B', borderRadius: 10, marginTop: 4 }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{display:"flex", alignItems:"center", gap:6, color: '#1E293B', fontWeight: 600}}>
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                 Global Role
              </label>
              <select className="form-control" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{appearance:"none", background: '#fff', border: '1.5px solid #E2E8F0', color: '#1E293B', borderRadius: 10, marginTop: 4}}>
                <option value="student">Student</option>
                <option value="ngo">NGO Partner</option>
                <option value="university">University Staff</option>
              </select>
            </div>
            <button type="submit" className="btn-auth" disabled={loading} style={{gridColumn: "span 2", marginTop: 12, display:"flex", alignItems:"center", justifyContent:"center", gap:10, background: '#1E293B', color: '#fff', fontWeight: 700, borderRadius: 10, fontSize: 16, padding: '12px 0'}}>
              {loading ? (
                <>
                  <div className="spinner" style={{width:16, height:16, borderTopColor:"white"}}></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#fff' }}>Join SkillBridge</span>

                </>
              )}
            </button>
          </form>
          <footer style={{marginTop: 32, paddingTop: 24, borderTop: "1px solid #E2E8F0", textAlign: "center"}}>
             <p className="auth-footer" style={{margin:0, color: '#64748B'}}>
               Already have a digital identity? <Link to="/login" style={{color: "#1E293B", fontWeight: 800}}>Sign In</Link>
             </p>
          </footer>
        </div>
      </div>
      <style>{`
        .spinner { border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 2px solid white; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
