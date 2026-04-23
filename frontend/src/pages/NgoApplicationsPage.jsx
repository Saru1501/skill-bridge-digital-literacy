import { useEffect, useState } from "react";
import { getNgoApplications, reviewApplication } from "../services/sponsorshipService";

export default function NgoApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const data = await getNgoApplications();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (applicationId, status) => {
    try {
      setError("");
      setSuccess("");

      const data = await reviewApplication(applicationId, {
        status,
        reviewNote:
          status === "APPROVED"
            ? "Approved successfully."
            : "Rejected based on review.",
      });

      setSuccess(data.message || "Application updated successfully.");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update application.");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Sponsorship Applications</h2>
        <p className="mt-2 text-gray-600">
          Review student applications and approve or reject them.
        </p>
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

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        {loadingApplications ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {application.studentUser?.name || "Student"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {application.studentUser?.email || "No email"}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Program:</span>{" "}
                      {application.program?.title || "N/A"}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Reason:</span>{" "}
                      {application.reason}
                    </p>

                    {application.sponsorshipCode && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-gray-800">Code:</span>{" "}
                        {application.sponsorshipCode}
                      </p>
                    )}
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                {application.status === "PENDING" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleReview(application._id, "APPROVED")}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReview(application._id, "REJECTED")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}