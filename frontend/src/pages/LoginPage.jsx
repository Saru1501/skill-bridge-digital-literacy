import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      const role = String(user?.role || "").toLowerCase();

      if (role === "admin" || role === "university") navigate("/admin");
      else if (role === "ngo") navigate("/ngo");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#1E293B', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <div className="auth-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(30,41,59,0.10)', maxWidth: 420, width: '100%', margin: 32 }}>
        <div className="auth-card-header" style={{ padding: '32px 32px 18px 32px', borderBottom: '1.5px solid #F1F5F9', textAlign: 'center' }}>
          <div className="auth-logo" style={{background: 'linear-gradient(135deg, #3B82F6 0%, #1E293B 100%)', color: 'white', width: 54, height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto'}}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 style={{ color: '#1E293B', fontWeight: 800, fontSize: 26, margin: 0 }}>Platform Access</h1>
          <p style={{ color: '#64748B', fontWeight: 500, margin: '8px 0 0 0' }}>Login to the SkillBridge Digital Literacy Hub</p>
        </div>

        <div className="auth-body" style={{ padding: 32 }}>
          {error && <div className="alert alert-error" style={{textAlign:"center"}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{display:"flex", alignItems:"center", gap:6, color: '#1E293B', fontWeight: 600}}>
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                 Email Address
              </label>
              <input
                type="email"
                className="form-control"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B', borderRadius: 10, marginTop: 4 }}
                placeholder="university.id@skill-bridge.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{marginBottom: 24}}>
              <label className="form-label" style={{display:"flex", alignItems:"center", gap:6, color: '#1E293B', fontWeight: 600}}>
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                 Security Code
              </label>
              <input
                type="password"
                className="form-control"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B', borderRadius: 10, marginTop: 4 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "220px",
                minHeight: 48,
                margin: "8px auto 0",
                background: "#1E293B",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 10,
                fontSize: 16,
                padding: "12px 20px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{width:16, height:16, borderTopColor:"white"}}></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span style={{ color: "#fff", width: "100%", textAlign: "center" }}>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div style={{marginTop: 32, paddingTop: 24, borderTop: "1px solid #E2E8F0", textAlign: "center"}}>
             <p className="auth-footer" style={{margin:0, color: '#64748B'}}>
               No workspace account? <Link to="/register" style={{color: "#1E293B", fontWeight: 800}}>Register Here</Link>
             </p>
          </div>
        </div>
      </div>
      <style>{`
        .spinner { border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 2px solid white; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
