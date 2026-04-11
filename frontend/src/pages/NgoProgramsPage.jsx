import { useEffect, useState } from "react";
import { createProgram, deleteProgram, getActivePrograms } from "../services/sponsorshipService";
import useAuth from "../hooks/useAuth";

export default function NgoProgramsPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxStudents: "",
    active: true,
  });

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPrograms = async () => {
    try {
      setLoadingPrograms(true);
      const data = await getActivePrograms();

      const myPrograms = (data.programs || []).filter(
        (program) => program.ngoUser?._id === user?._id
      );

      setPrograms(myPrograms);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load programs.");
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPrograms();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Program title is required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        maxStudents: Number(formData.maxStudents) || 0,
        active: formData.active,
      };

      const data = await createProgram(payload);
      setSuccess(data.message || "Program created successfully.");

      setFormData({
        title: "",
        description: "",
        maxStudents: "",
        active: true,
      });

      fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create program.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (programId) => {
    const confirmed = window.confirm("Are you sure you want to delete this program?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      const data = await deleteProgram(programId);
      setSuccess(data.message || "Program deleted successfully.");
      fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete program.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Manage Sponsorship Programs</h2>
        <p className="mt-2 text-gray-600">
          Create sponsorship programs and manage the programs you have published.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Create New Program</h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Program title"
            className="w-full rounded-lg border px-4 py-3"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Program description"
            rows="4"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="number"
            name="maxStudents"
            value={formData.maxStudents}
            onChange={handleChange}
            placeholder="Maximum students (0 for unlimited)"
            className="w-full rounded-lg border px-4 py-3"
            min="0"
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            Program is active
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Program"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">My Programs</h3>

        {loadingPrograms ? (
          <p className="mt-4 text-gray-500">Loading programs...</p>
        ) : programs.length === 0 ? (
          <p className="mt-4 text-gray-500">No sponsorship programs created yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program._id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <h4 className="text-lg font-semibold text-gray-900">{program.title}</h4>
                <p className="mt-2 text-sm text-gray-600">
                  {program.description || "No description provided."}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  Max Students: {program.maxStudents || "Unlimited"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Status: {program.active ? "Active" : "Inactive"}
                </p>

                <button
                  onClick={() => handleDelete(program._id)}
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Delete Program
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}