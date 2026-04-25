import { useState } from "react";
import { createPaymentIntent } from "../services/sponsorshipService";

export default function StudentPaymentPage() {
  const [formData, setFormData] = useState({
    amountLKR: "",
    purpose: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentData, setPaymentData] = useState(null);

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
    setPaymentData(null);

    if (!formData.amountLKR || !formData.purpose.trim()) {
      setError("Amount and purpose are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        amountLKR: Number(formData.amountLKR),
        purpose: formData.purpose,
      };

      const data = await createPaymentIntent(payload);
      setSuccess(data.message || "Payment intent created successfully.");
      setPaymentData(data);
      setFormData({ amountLKR: "", purpose: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create payment intent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Payment Intent</h2>
        <p>Create payment intents from a cleaner student finance panel and review the response in a readable summary tile.</p>
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
              <h3 className="content-panel__title">Create Payment Intent</h3>
              <p className="content-panel__sub">Prepare a payment request for a remaining course fee or other approved purpose.</p>
            </div>
          </div>

          <div className="content-panel__body">
            <form onSubmit={handleSubmit} className="field-stack">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Amount (LKR)</label>
                <input
                  type="number"
                  name="amountLKR"
                  value={formData.amountLKR}
                  onChange={handleChange}
                  placeholder="Enter amount in LKR"
                  className="form-control"
                  min="1"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="course_fee_remainder"
                  className="form-control"
                  required
                />
              </div>

              <div className="tile-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? "Creating..." : "Create Payment Intent"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Payment Notes</h3>
              <p className="content-panel__sub">What this demo page returns.</p>
            </div>
          </div>
          <div className="content-panel__body">
            <div className="stack-list">
              <div className="tile-note">This request creates a Stripe payment intent through the backend and returns its client secret.</div>
              <div className="tile-note">Use a clear purpose label so finance-related flows remain traceable and auditable.</div>
            </div>
          </div>
        </section>
      </div>

      {paymentData && (
        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Payment Intent Response</h3>
              <p className="content-panel__sub">The result is now grouped into a cleaner finance summary card.</p>
            </div>
          </div>

          <div className="content-panel__body">
            <div className="tile-card tile-card--wide">
              <div className="tile-top">
                <div>
                  <h4 className="tile-title">{paymentData.paymentIntentId || "Payment Intent"}</h4>
                  <p className="tile-subtitle">{paymentData.clientSecret || "No client secret returned"}</p>
                </div>
                <span className="status-pill status-pill--info">
                  {paymentData.payment?.status || "Created"}
                </span>
              </div>

              <div className="tile-meta">
                <div className="tile-meta-row">
                  <span>Payment Intent ID</span>
                  <strong>{paymentData.paymentIntentId || "N/A"}</strong>
                </div>
                <div className="tile-meta-row">
                  <span>Client Secret</span>
                  <strong>{paymentData.clientSecret || "N/A"}</strong>
                </div>
                {paymentData.payment && (
                  <>
                    <div className="tile-meta-row">
                      <span>Amount</span>
                      <strong>{paymentData.payment.amountLKR} LKR</strong>
                    </div>
                    <div className="tile-meta-row">
                      <span>Purpose</span>
                      <strong>{paymentData.payment.purpose}</strong>
                    </div>
                    <div className="tile-meta-row">
                      <span>Status</span>
                      <strong>{paymentData.payment.status}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
