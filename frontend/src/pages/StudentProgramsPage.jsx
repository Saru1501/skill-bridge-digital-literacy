import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivePrograms } from "../services/sponsorshipService";

export default function StudentProgramsPage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getActivePrograms();
        setPrograms(data.programs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load sponsorship programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleApply = (program) => {
    navigate("/student/apply", {
      state: { selectedProgram: program },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Active Sponsorship Programs</h2>
        <p className="mt-2 text-gray-600">
          Browse available NGO sponsorship opportunities and apply for financial support.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
          <p className="text-gray-500">Loading sponsorship programs...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-6 shadow-sm text-left">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && programs.length === 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
          <p className="text-gray-500">No active sponsorship programs available right now.</p>
        </div>
      )}

      {!loading && !error && programs.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program._id}
              className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>

              <p className="mt-2 text-sm text-gray-600">
                {program.description || "No description provided."}
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p>
                  <span className="font-medium text-gray-700">NGO:</span>{" "}
                  {program.ngoUser?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Max Students:</span>{" "}
                  {program.maxStudents || "Unlimited"}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  {program.active ? "Active" : "Inactive"}
                </p>
              </div>

              <button
                onClick={() => handleApply(program)}
                className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-white font-semibold hover:bg-gray-800"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}