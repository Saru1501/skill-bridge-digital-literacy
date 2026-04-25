import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { applyForSponsorship } from "../services/sponsorshipService";

const sectionStyle = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
};

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

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.programId) {
      setError("Please choose a sponsorship program before submitting an application.");
      return;
    }

    try {
      setLoading(true);
      const response = await applyForSponsorship(formData);
      setSuccess(response.message || "Application submitted successfully.");
      setFormData((current) => ({ ...current, reason: "" }));
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(37,99,235,0.92) 58%, rgba(96,165,250,0.82) 100%)",
          borderRadius: 28,
          padding: 28,
          color: "#FFFFFF",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
        }}
      >
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
            Sponsorship Request
          </div>
          <h2 style={{ fontSize: 32, lineHeight: 1.1, marginBottom: 12 }}>Apply for financial support</h2>
          <p style={{ color: "rgba(255,255,255,0.84)", fontSize: 16 }}>
            Submit a clear, thoughtful request so partner NGOs can review your learning goals and
            funding needs quickly.
          </p>
        </div>
      </section>

      {!selectedProgram && (
        <section style={{ ...sectionStyle, background: "#F8FBFF", borderColor: "#BFDBFE" }}>
          <h3 style={{ fontSize: 20, marginBottom: 10, color: "#0F172A" }}>No program selected</h3>
          <p style={{ color: "#64748B", marginBottom: 18 }}>
            Start from the sponsorship catalog so your application is attached to the correct NGO
            initiative.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/student/programs")}>
            Go to programs
          </button>
        </section>
      )}

      {selectedProgram && (
        <section style={sectionStyle}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div>
              <h3 className="section-title">{selectedProgram.title}</h3>
              <p className="section-sub">
                {selectedProgram.description || "Support program for SkillBridge learners."}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 20 }}>
            <div style={{ background: "#F8FBFF", border: "1px solid #DBEAFE", borderRadius: 18, padding: 16 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#3B82F6", fontWeight: 800 }}>
                NGO partner
              </div>
              <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, color: "#0F172A" }}>
                {selectedProgram.ngoUser?.name || "SkillBridge Partner"}
              </div>
            </div>
            <div style={{ background: "#F8FBFF", border: "1px solid #DBEAFE", borderRadius: 18, padding: 16 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "#3B82F6", fontWeight: 800 }}>
                Capacity
              </div>
              <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, color: "#0F172A" }}>
                {selectedProgram.maxStudents || "Open"} learners
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={sectionStyle}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Program ID</label>
            <input
              type="text"
              name="programId"
              value={formData.programId}
              readOnly
              className="form-control"
              style={{ background: "#F8FAFC", color: "#64748B" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reason for sponsorship</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your financial need, current learning goals, and how this support will help you finish your program."
              rows="6"
              className="form-control"
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="submit" disabled={loading || !formData.programId} className="btn btn-primary">
              {loading ? "Submitting..." : "Submit application"}
            </button>
            <button type="button" onClick={() => navigate("/student/programs")} className="btn btn-secondary">
              Back to programs
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
