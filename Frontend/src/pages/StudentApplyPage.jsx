import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { applyForSponsorship } from "../services/sponsorshipService";

export default function StudentApplyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedProgram = location.state?.selectedProgram || null;

  const [formData, setFormData] = useState({
    programId: selectedProgram?._id || "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.programId) {
      setError("Please select a sponsorship program from the programs page.");
      return;
    }

    try {
      setLoading(true);
      const data = await applyForSponsorship(formData);
      setSuccess(data.message || "Application submitted successfully.");
      setFormData((prev) => ({
        ...prev,
        reason: "",
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Apply for Sponsorship</h2>
        <p className="mt-2 text-gray-600">
          Submit your request for financial assistance through an NGO sponsorship program.
        </p>
      </div>

      {!selectedProgram && (
        <div className="rounded-2xl bg-yellow-50 p-6 shadow-sm text-left">
          <p className="text-yellow-700">
            No program selected. Please go to the Sponsorship Programs page and choose a program first.
          </p>

          <button
            onClick={() => navigate("/student/programs")}
            className="mt-4 rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800"
          >
            Go to Programs
          </button>
        </div>
      )}

      {selectedProgram && (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">{selectedProgram.title}</h3>
          <p className="mt-2 text-gray-600">
            {selectedProgram.description || "No description provided."}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            NGO: <span className="font-medium text-gray-700">{selectedProgram.ngoUser?.name || "N/A"}</span>
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Program ID
            </label>
            <input
              type="text"
              name="programId"
              value={formData.programId}
              readOnly
              className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason for Sponsorship
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Explain why you need sponsorship support..."
              rows="5"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.programId}
              className="rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/programs")}
              className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Programs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}