import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteStudentApplication,
  getStudentApplications,
} from "../services/sponsorshipService";

const getStatusClass = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "PENDING") return "status-pill--warning";
  if (normalized === "APPROVED") return "status-pill--success";
  if (normalized === "REJECTED") return "status-pill--danger";
  return "status-pill--info";
};

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentApplications();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sponsorship applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Delete this pending sponsorship application?")) {
      return;
    }

    try {
      setWorkingId(applicationId);
      setError("");
      setSuccess("");
      const data = await deleteStudentApplication(applicationId);
      setSuccess(data.message || "Application deleted successfully.");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete application.");
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>My Sponsorship Applications</h2>
        <p>Track every request, see approval outcomes, and remove pending applications you no longer want to keep active.</p>
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
            <h3 className="content-panel__title">Application Tracker</h3>
            <p className="content-panel__sub">This page is now wired to the real student application endpoints for read and delete actions.</p>
          </div>
          <Link to="/student/programs" className="btn btn-primary">
            Apply to a Program
          </Link>
        </div>

        <div className="content-panel__body">
          {loading ? (
            <div className="empty-panel">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="empty-panel">No sponsorship applications submitted yet.</div>
          ) : (
            <div className="stack-list">
              {applications.map((application) => {
                const isPending = String(application.status || "").toUpperCase() === "PENDING";
                return (
                  <article key={application._id} className="tile-card tile-card--wide">
                    <div className="tile-top">
                      <div>
                        <h4 className="tile-title">{application.program?.title || "Program unavailable"}</h4>
                        <p className="tile-subtitle">
                          {application.program?.ngoUser?.name || "NGO partner unavailable"}
                        </p>
                      </div>
                      <span className={`status-pill ${getStatusClass(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    <div className="tile-meta">
                      <div className="tile-meta-row">
                        <span>Submitted</span>
                        <strong>{application.createdAt ? new Date(application.createdAt).toLocaleString() : "N/A"}</strong>
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

                    {application.reviewNote && (
                      <div className="tile-note">
                        <strong>Review Note:</strong> {application.reviewNote}
                      </div>
                    )}

                    <div className="tile-actions">
                      {isPending && (
                        <button
                          onClick={() => handleDelete(application._id)}
                          className="btn btn-danger btn-sm"
                          disabled={workingId === application._id}
                        >
                          {workingId === application._id ? "Deleting..." : "Delete Pending Request"}
                        </button>
                      )}
                      {!isPending && application.sponsorshipCode && (
                        <Link to="/student/redeem" className="btn btn-success btn-sm">
                          Redeem Code
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
