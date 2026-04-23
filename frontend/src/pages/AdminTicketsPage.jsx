import { useEffect, useState } from "react";
import { getAllTickets, updateTicketStatus } from "../services/sponsorshipService";

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
          ? {
              status,
              adminResponse: "Issue reviewed and resolved successfully.",
            }
          : {
              status,
              adminResponse: "Ticket is currently under review.",
            };

      const data = await updateTicketStatus(ticketId, payload);
      setSuccess(data.message || "Ticket status updated successfully.");
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ticket status.");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "OPEN") return "bg-yellow-100 text-yellow-700";
    if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-700";
    if (status === "RESOLVED") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Manage Support Tickets</h2>
        <p className="mt-2 text-gray-600">
          Review student issues and update ticket statuses.
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
        {loadingTickets ? (
          <p className="text-gray-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500">No tickets available.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {ticket.subject}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {ticket.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Student:</span>{" "}
                      {ticket.createdBy?.name || "N/A"} ({ticket.createdBy?.email || "N/A"})
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                {ticket.adminResponse && (
                  <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    <span className="font-medium">Admin Response:</span>{" "}
                    {ticket.adminResponse}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {ticket.status !== "IN_PROGRESS" && (
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, "IN_PROGRESS")}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {ticket.status !== "RESOLVED" && (
                    <button
                      onClick={() => handleStatusUpdate(ticket._id, "RESOLVED")}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}