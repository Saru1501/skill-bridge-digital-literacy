import { useEffect, useState } from "react";
import { getMyApplications } from "../services/sponsorshipService";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import PageWrapper from "../components/PageWrapper";
import { Copy } from "lucide-react";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        addToast(err.response?.data?.message || "Failed to load applications", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    addToast("Code copied to clipboard!", "success");
  };

  return (
    <PageWrapper className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">My Sponsorship Applications</h2>
        <p className="mt-2 text-gray-600">
          Track the status of your sponsorship applications and access your approved codes here.
        </p>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingSpinner />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 shadow-sm text-center border border-gray-100">
          <p className="text-gray-500 text-lg">You haven't submitted any applications yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {applications.map((app) => (
            <div key={app._id} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{app.program?.title || "Unknown Program"}</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    app.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{app.program?.description}</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Your Request Reason:</p>
                  <p className="text-sm text-gray-600 italic">"{app.reason}"</p>
                </div>
                
                {app.reviewNote && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700">Reviewer Note:</p>
                    <p className="text-sm text-gray-600">{app.reviewNote}</p>
                  </div>
                )}
              </div>

              {app.status === "APPROVED" && app.sponsorshipCode && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Your Sponsorship Code:</p>
                  <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                    <code className="text-indigo-700 font-mono font-bold flex-1 text-center">{app.sponsorshipCode}</code>
                    <button 
                      onClick={() => handleCopy(app.sponsorshipCode)}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition active:scale-95"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
