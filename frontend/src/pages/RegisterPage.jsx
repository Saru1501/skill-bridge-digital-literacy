import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
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

    const result = await register(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Read from localStorage after state update
    setTimeout(() => {
      navigate(getDashboardPath(formData.role));
    }, 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h1>

        {error && (
          <p className="mb-4 text-sm text-red-300 bg-red-500/20 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-white/20 bg-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-white/20 bg-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-white/20 bg-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-white/20 bg-white/10 rounded-lg px-4 py-3 text-white"
          >
            <option value="student" className="text-black">Student</option>
            <option value="ngo" className="text-black">NGO</option>
            <option value="admin" className="text-black">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white rounded-lg py-3 font-semibold hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-pink-400 hover:text-pink-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}