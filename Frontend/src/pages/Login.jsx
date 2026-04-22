import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "student",    label: "Student" },
  { value: "university", label: "University" },
  { value: "ngo",        label: "NGO" },
  { value: "admin",      label: "Admin" },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState({ name:"", email:"", password:"", role:"student" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const submitted = {
        name: String(formData.get("name") || form.name || "").trim(),
        email: String(formData.get("email") || form.email || "").trim(),
        password: String(formData.get("password") || form.password || ""),
        role: String(formData.get("role") || form.role || "student"),
      };

      let user;
      if (!submitted.email || !submitted.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      if (mode === "login") { user = await login(submitted.email, submitted.password); }
      else {
        if (!submitted.name) { setError("Full name is required"); setLoading(false); return; }
        user = await register(submitted.name, submitted.email, submitted.password, submitted.role);
      }
      const role = user.role?.toLowerCase();
      navigate(role === "admin" || role === "university" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Connection failed. Ensure backend is running on port 3001.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-top">
          <div className="auth-logo-box">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1>SkillBridge</h1>
          <p>Digital Literacy for Rural Youth</p>
        </div>
        <div className="auth-body">
          <div className="auth-tabs">
            <button className={"auth-tab" + (mode==="login"    ? " active":"")} onClick={() => { setMode("login");    setError(""); }}>Sign In</button>
            <button className={"auth-tab" + (mode==="register" ? " active":"")} onClick={() => { setMode("register"); setError(""); }}>Register</button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handle} placeholder="Enter your full name" required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" name="password" type="password" value={form.password} onChange={handle} placeholder="Minimum 6 characters" required minLength={6} />
            </div>
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" name="role" value={form.role} onChange={handle}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            )}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div className="auth-footer">
            <strong>Roles:</strong> student, university, ngo, admin
          </div>
        </div>
      </div>
    </div>
  );
}
