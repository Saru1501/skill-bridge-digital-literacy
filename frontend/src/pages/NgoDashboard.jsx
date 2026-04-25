import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getNgoApplications, getNgoPrograms } from "../services/sponsorshipService";

const heroStyle = {
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(37,99,235,0.92) 55%, rgba(96,165,250,0.84) 100%)",
  borderRadius: 28,
  padding: 32,
  color: "#FFFFFF",
  marginBottom: 32,
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
};

const cardPanel = {
  background: "#F8FBFF",
  border: "1px solid #DBEAFE",
  borderRadius: 22,
  padding: 20,
};

export default function NgoDashboard() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNgoData = async () => {
      try {
        const [programRes, applicationRes] = await Promise.all([getNgoPrograms(), getNgoApplications()]);
        setPrograms(programRes.programs || []);
        setApplications(applicationRes.applications || []);
      } catch (error) {
        console.error("NGO dashboard error", error);
      } finally {
        setLoading(false);
      }
    };

    loadNgoData();
  }, []);

  const pendingApplications = useMemo(
    () =>
      applications.filter(
        (application) => String(application.status || "").toUpperCase() === "PENDING"
      ).length,
    [applications]
  );

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-v2">
      <section style={heroStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Partnership Management
            </div>
            <h2 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 12 }}>Impact hub for {user?.name || "NGO Partner"}</h2>
            <p style={{ color: "rgba(255,255,255,0.84)", fontSize: 16, maxWidth: 620 }}>
              Track active initiatives, review student applications, and manage the reach of your
              organization across the platform.
            </p>
          </div>

          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
              Pending review
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>{pendingApplications}</div>
            <div style={{ color: "rgba(255,255,255,0.8)" }}>Applications waiting for a decision</div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">PR</div>
          <div>
            <div className="stat-value">{programs.length}</div>
            <div className="stat-label">Programs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">PD</div>
          <div>
            <div className="stat-value">{pendingApplications}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">AP</div>
          <div>
            <div className="stat-value">
              {
                applications.filter(
                  (application) => String(application.status || "").toUpperCase() === "APPROVED"
                ).length
              }
            </div>
            <div className="stat-label">Approved Learners</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">IM</div>
          <div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent applications</h3>
              <p className="section-sub" style={{ marginTop: 6 }}>
                Review incoming sponsorship requests and prioritize urgent candidates.
              </p>
            </div>
            <Link to="/ngo/applications" className="btn btn-secondary">
              Review all
            </Link>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Program</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: 36 }}>
                      No applications received yet.
                    </td>
                  </tr>
                ) : (
                  applications.slice(0, 5).map((application) => (
                    <tr key={application._id}>
                      <td>{application.studentUser?.name || "Student"}</td>
                      <td>{application.program?.title || "Program"}</td>
                      <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            String(application.status || "").toUpperCase() === "APPROVED"
                              ? "badge-green"
                              : String(application.status || "").toUpperCase() === "PENDING"
                                ? "badge-yellow"
                                : "badge-gray"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div style={{ display: "grid", gap: 24 }}>
          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Program overview</h3>
            </div>
            <div className="card-body" style={{ padding: 24, display: "grid", gap: 14 }}>
              {programs.length === 0 ? (
                <div className="empty-state" style={{ padding: "36px 20px" }}>
                  <h3>No initiatives yet</h3>
                  <p>Create your first program to begin accepting applications.</p>
                </div>
              ) : (
                programs.slice(0, 3).map((program) => (
                  <div key={program._id} style={cardPanel}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>{program.title}</div>
                    <p style={{ color: "#64748B", marginBottom: 12 }}>
                      {program.description || "Sponsorship initiative for SkillBridge learners."}
                    </p>
                    <span className={`badge ${program.active ? "badge-green" : "badge-gray"}`}>
                      {program.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Quick actions</h3>
            </div>
            <div className="card-body" style={{ padding: 24, display: "grid", gap: 12 }}>
              <Link to="/ngo/programs" className="btn btn-primary" style={{ justifyContent: "center" }}>
                Manage initiatives
              </Link>
              <Link to="/ngo/applications" className="btn btn-secondary" style={{ justifyContent: "center" }}>
                Review applicants
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
