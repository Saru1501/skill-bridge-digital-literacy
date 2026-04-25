import { useEffect, useState } from "react";
import { createSupportTicket, getMyTickets } from "../services/sponsorshipService";

const getStatusClass = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "OPEN") return "status-pill--warning";
  if (normalized === "IN_PROGRESS") return "status-pill--info";
  if (normalized === "RESOLVED") return "status-pill--success";
  return "status-pill--danger";
};

export default function StudentTicketsPage() {
  const [formData, setFormData] = useState({ subject: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const data = await getMyTickets();
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tickets.");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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

    if (!formData.subject.trim() || !formData.description.trim()) {
      setError("Subject and description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await createSupportTicket(formData);
      setSuccess(data.message || "Ticket created successfully.");
      setFormData({ subject: "", description: "" });
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Support Tickets</h2>
        <p>Submit issues through a cleaner request form and track each ticket in a more readable card layout.</p>
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
              <h3 className="content-panel__title">Create New Ticket</h3>
              <p className="content-panel__sub">Describe the issue clearly so support can respond faster.</p>
            </div>
          </div>

          <div className="content-panel__body">
            <form onSubmit={handleSubmit} className="field-stack">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Certificate not received after course completion"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain what happened, what you expected, and any steps you already tried."
                  rows="6"
                  className="form-control"
                  required
                />
              </div>

              <div className="tile-actions">
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Submitting..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Support Tips</h3>
              <p className="content-panel__sub">Useful guidance before you submit a request.</p>
            </div>
          </div>
          <div className="content-panel__body">
            <div className="stack-list">
              <div className="tile-note">Mention the course, lesson, or feature where the issue happened.</div>
              <div className="tile-note">If this is about certificates, rewards, or fee reductions, include what you already completed.</div>
              <div className="tile-note">Current tickets in your queue: <strong>{tickets.length}</strong></div>
            </div>
          </div>
        </section>
      </div>

      <section className="content-panel">
        <div className="content-panel__header">
          <div>
            <h3 className="content-panel__title">My Tickets</h3>
            <p className="content-panel__sub">Your requests now appear as tiles with clear status and admin feedback.</p>
          </div>
        </div>

        <div className="content-panel__body">
          {loadingTickets ? (
            <div className="empty-panel">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="empty-panel">No tickets created yet.</div>
          ) : (
            <div className="stack-list">
              {tickets.map((ticket) => (
                <article key={ticket._id} className="tile-card tile-card--wide">
                  <div className="tile-top">
                    <div>
                      <h4 className="tile-title">{ticket.subject}</h4>
                      <p className="tile-subtitle">Created {new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`status-pill ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                  </div>

                  <p className="tile-copy">{ticket.description}</p>

                  {ticket.adminResponse && (
                    <div className="tile-note">
                      <strong>Admin Response:</strong> {ticket.adminResponse}
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
