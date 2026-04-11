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
    return "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const role = result.user?.role;
    navigate(getDashboardPath(role), { replace: true });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#f6f6f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#ff385c",
              marginBottom: "16px",
            }}
          >
            SkillBridge
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#211922" }}>
            Welcome back
          </h1>
          <p style={{ color: "#62625b", marginTop: "8px" }}>
            Log in to continue your learning journey
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fff0f0",
              color: "#9e0a0a",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%" }}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%" }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "16px" }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ color: "#62625b" }}>Don't have an account? </span>
          <Link to="/register" style={{ color: "#e60023", fontWeight: 600 }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}