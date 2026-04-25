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
        const response = await getActivePrograms();
        setPrograms(response.programs || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load sponsorship programs. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleApply = (program) => {
    navigate("/student/apply", { state: { selectedProgram: program } });
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Sponsorship Catalog</h1>
          <p className="section-sub">
            Discover NGO-backed support programs and apply directly from a consistent student
            workspace.
          </p>
        </div>
      </div>

      {loading && (
        <div className="page-loading">
          <div className="spinner" />
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && programs.length === 0 && (
        <div className="card">
          <div className="empty-state" style={{ padding: "60px 20px" }}>
            <div className="empty-state-icon">SP</div>
            <h3>No active programs</h3>
            <p>Check back soon for new sponsorship opportunities from our partners.</p>
          </div>
        </div>
      )}

      {!loading && !error && programs.length > 0 && (
        <div className="courses-grid">
          {programs.map((program) => (
            <div key={program._id} className="course-card">
              <div className="course-card-header">
                <span className="course-card-tag">{program.ngoUser?.name || "Verified NGO"}</span>
              </div>

              <div className="course-card-body">
                <h3 className="course-card-title">{program.title}</h3>
                <p className="course-card-desc">
                  {program.description ||
                    "Apply for this sponsorship to reduce financial barriers and continue your learning path."}
                </p>

                <div
                  style={{
                    marginTop: 18,
                    padding: 16,
                    borderRadius: 18,
                    background: "#F8FBFF",
                    border: "1px solid #DBEAFE",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13 }}>
                    <span style={{ color: "#64748B", fontWeight: 600 }}>NGO Partner</span>
                    <span style={{ fontWeight: 700, color: "#1D4ED8" }}>
                      {program.ngoUser?.name || "SkillBridge Partner"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13 }}>
                    <span style={{ color: "#64748B", fontWeight: 600 }}>Capacity</span>
                    <span style={{ fontWeight: 700, color: "#0F172A" }}>
                      {program.maxStudents || "Open"} learners
                    </span>
                  </div>
                </div>
              </div>

              <div className="course-card-footer">
                <button
                  type="button"
                  onClick={() => handleApply(program)}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Apply for sponsorship
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
