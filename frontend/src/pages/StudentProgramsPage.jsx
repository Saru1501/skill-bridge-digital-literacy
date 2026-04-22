import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivePrograms } from "../services/sponsorshipService";
import PageWrapper from "../components/PageWrapper";
import { Navigation } from "lucide-react";

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
    <PageWrapper className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Active Sponsorship Programs</h2>
        <p className="mt-2 text-gray-600">
          Browse available NGO sponsorship opportunities and apply for financial support.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
          <p className="text-gray-500 animate-pulse">Loading sponsorship programs...</p>
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
              className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {program.description || "No description provided."}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
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
                    {program.active ? (
                      <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                    ) : "Inactive"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleApply(program)}
                className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors active:scale-95"
              >
                <span>Apply Now</span>
                <Navigation size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}