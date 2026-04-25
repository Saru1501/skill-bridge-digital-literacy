import { useState } from "react";
import { redeemSponsorshipCode } from "../services/sponsorshipService";

export default function StudentRedeemPage() {
  const [formData, setFormData] = useState({ sponsorshipCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redeemedData, setRedeemedData] = useState(null);

  const handleChange = (event) => {
    setFormData({ sponsorshipCode: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setRedeemedData(null);

    if (!formData.sponsorshipCode.trim()) {
      setError("Please enter a sponsorship code.");
      return;
    }

    try {
      setLoading(true);
      const data = await redeemSponsorshipCode(formData);
      setSuccess(data.message || "Sponsorship code redeemed successfully.");
      setRedeemedData(data);
      setFormData({ sponsorshipCode: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to redeem sponsorship code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Redeem Sponsorship Code</h2>
        <p>Validate your approved sponsorship code in a cleaner benefit card instead of a plain utility-form layout.</p>
      </section>

      {(error || success) && (
        <div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>
      )}

      <div className="workspace-grid">
        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Enter Sponsorship Code</h3>
              <p className="content-panel__sub">Redeem the code you received from an approved NGO program.</p>
            </div>
          </div>

          <div className="content-panel__body">
            <form onSubmit={handleSubmit} className="field-stack">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sponsorship Code</label>
                <input
                  type="text"
                  name="sponsorshipCode"
                  value={formData.sponsorshipCode}
                  onChange={handleChange}
                  placeholder="Enter your sponsorship code"
                  className="form-control"
                  required
                />
              </div>

              <div className="tile-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? "Validating..." : "Redeem Code"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">How It Works</h3>
              <p className="content-panel__sub">Quick guidance before you redeem.</p>
            </div>
          </div>
          <div className="content-panel__body">
            <div className="stack-list">
              <div className="tile-note">Redeem only codes that were issued to your account after an approved sponsorship application.</div>
              <div className="tile-note">Once validated, the code can unlock tuition support, grants, or linked sponsorship benefits.</div>
            </div>
          </div>
        </section>
      </div>

      {redeemedData && (
        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Redeemed Sponsorship Details</h3>
              <p className="content-panel__sub">A tile summary of the validated program response.</p>
            </div>
          </div>

          <div className="content-panel__body">
            <div className="tile-card tile-card--wide">
              <div className="tile-top">
                <div>
                  <h4 className="tile-title">{redeemedData.program?.title || "Program not available"}</h4>
                  <p className="tile-subtitle">{redeemedData.sponsorshipCode || "No code returned"}</p>
                </div>
                <span className={`status-pill ${redeemedData.valid ? "status-pill--success" : "status-pill--danger"}`}>
                  {redeemedData.valid ? "Valid" : "Invalid"}
                </span>
              </div>

              <div className="tile-meta">
                <div className="tile-meta-row">
                  <span>Program</span>
                  <strong>{redeemedData.program?.title || "N/A"}</strong>
                </div>
                <div className="tile-meta-row">
                  <span>Sponsorship Code</span>
                  <strong>{redeemedData.sponsorshipCode || "N/A"}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
