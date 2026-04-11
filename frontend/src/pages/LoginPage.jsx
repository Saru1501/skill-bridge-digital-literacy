import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getDashboardPath = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin") return "/admin";
    if (r === "ngo") return "/ngo";
    if (r === "student") return "/student";
    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem("skillbridge_auth") || "{}");
      const role = stored?.user?.role || "student";
      navigate(getDashboardPath(role));
    }, 50);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #f2f2f2',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#222222',
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div 
        className="w-full max-w-md p-8"
        style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '32px',
          boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
        }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#222222', letterSpacing: '-0.18px' }}>
          Welcome back
        </h1>

        {error && (
          <p 
            className="mb-4 text-sm p-3 rounded-lg"
            style={{ 
              color: '#c13515', 
              backgroundColor: 'rgba(193, 53, 21, 0.1)',
              borderRadius: '14px'
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition"
            style={{ 
              backgroundColor: '#ff385c', 
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 500,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center" style={{ color: '#6a6a6a' }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: '#222222', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}