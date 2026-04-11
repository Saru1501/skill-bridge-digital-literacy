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
    if (role === "student") return "/student";
    if (role === "ngo") return "/ngo";
    if (role === "admin") return "/admin";
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

    navigate(getDashboardPath(formData.role));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
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
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          >
            <option value="student">Student</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-3 font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}