import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus } from "../services/sponsorshipService";

const getStatusClass = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "OPEN") return "status-pill--warning";
  if (normalized === "IN_PROGRESS") return "status-pill--info";
  if (normalized === "RESOLVED") return "status-pill--success";
  return "status-pill--danger";
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const data = await getAllTickets();
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

  const handleStatusUpdate = async (ticketId, status) => {
    try {
      setError("");
      setSuccess("");

      const payload =
        status === "RESOLVED"
          ? { status, adminResponse: "Issue reviewed and resolved successfully." }
          : { status, adminResponse: "Ticket is currently under review." };

      const data = await updateTicketStatus(ticketId, payload);
      setSuccess(data.message || "Ticket status updated successfully.");
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket status.");
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Manage Support Tickets</h2>
        <p>Support requests now render as full review cards with status pills, timestamps, and action buttons that are easier to scan.</p>
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
            <h3 className="content-panel__title">Support Queue</h3>
            <p className="content-panel__sub">Review open issues, update progress, and leave visible admin responses.</p>
          </div>
        </div>

        <div className="content-panel__body">
          {loadingTickets ? (
            <div className="empty-panel">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="empty-panel">No tickets available.</div>
          ) : (
            <div className="stack-list">
              {tickets.map((ticket) => (
                <article key={ticket._id} className="tile-card tile-card--wide">
                  <div className="tile-top">
                    <div>
                      <h4 className="tile-title">{ticket.subject}</h4>
                      <p className="tile-subtitle">
                        {ticket.createdBy?.name || "N/A"} ({ticket.createdBy?.email || "N/A"})
                      </p>
                    </div>
                    <span className={`status-pill ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                  </div>

                  <p className="tile-copy">{ticket.description}</p>

                  {ticket.adminResponse && (
                    <div className="tile-note">
                      <strong>Admin Response:</strong> {ticket.adminResponse}
                    </div>
                  )}

                  <div className="tile-meta">
                    <div className="tile-meta-row">
                      <span>Created</span>
                      <strong>{new Date(ticket.createdAt).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="tile-actions">
                    {ticket.status !== "IN_PROGRESS" && (
                      <button onClick={() => handleStatusUpdate(ticket._id, "IN_PROGRESS")} className="btn btn-secondary btn-sm">
                        Mark In Progress
                      </button>
                    )}
                    {ticket.status !== "RESOLVED" && (
                      <button onClick={() => handleStatusUpdate(ticket._id, "RESOLVED")} className="btn btn-success btn-sm">
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
