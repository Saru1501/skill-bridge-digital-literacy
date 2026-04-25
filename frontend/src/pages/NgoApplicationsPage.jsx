import { useEffect, useState } from "react";
import { getNgoApplications, reviewApplication } from "../services/sponsorshipService";

const getStatusClass = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "PENDING") return "status-pill--warning";
  if (normalized === "APPROVED") return "status-pill--success";
  if (normalized === "REJECTED") return "status-pill--danger";
  return "status-pill--info";
};

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
        reviewNote: status === "APPROVED" ? "Approved successfully." : "Rejected based on review.",
      });

      setSuccess(data.message || "Application updated successfully.");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update application.");
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Sponsorship Applications</h2>
        <p>Review student requests in a structured tile layout, then approve or reject them with clearer status visibility.</p>
      </section>

      {(error || success) && (
        <div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>
      )}

      <section className="content-panel">
        <div className="content-panel__header">
          <div>
            <h3 className="content-panel__title">Applicant Review Queue</h3>
            <p className="content-panel__sub">Each application now appears as a readable review tile instead of a plain text block.</p>
          </div>
        </div>

        <div className="content-panel__body">
          {loadingApplications ? (
            <div className="empty-panel">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="empty-panel">No applications found.</div>
          ) : (
            <div className="stack-list">
              {applications.map((application) => (
                <article key={application._id} className="tile-card tile-card--wide">
                  <div className="tile-top">
                    <div>
                      <h4 className="tile-title">{application.studentUser?.name || "Student Applicant"}</h4>
                      <p className="tile-subtitle">{application.studentUser?.email || "No email available"}</p>
                    </div>
                    <span className={`status-pill ${getStatusClass(application.status)}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="tile-meta">
                    <div className="tile-meta-row">
                      <span>Program</span>
                      <strong>{application.program?.title || "N/A"}</strong>
                    </div>
                    {application.sponsorshipCode && (
                      <div className="tile-meta-row">
                        <span>Sponsorship Code</span>
                        <strong>{application.sponsorshipCode}</strong>
                      </div>
                    )}
                  </div>

                  <div className="tile-note">
                    <strong>Reason:</strong> {application.reason}
                  </div>

                  {String(application.status).toUpperCase() === "PENDING" && (
                    <div className="tile-actions">
                      <button onClick={() => handleReview(application._id, "APPROVED")} className="btn btn-success btn-sm">
                        Approve
                      </button>
                      <button onClick={() => handleReview(application._id, "REJECTED")} className="btn btn-danger btn-sm">
                        Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
