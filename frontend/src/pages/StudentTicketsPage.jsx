import { useEffect, useState } from "react";
import { createSupportTicket, getMyTickets } from "../services/sponsorshipService";

export default function StudentTicketsPage() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setFormData({
        subject: "",
        description: "",
      });
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
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
        <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
        <p className="mt-2 text-gray-600">
          Create a new support ticket and track your existing ticket requests.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Create New Ticket</h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter ticket subject"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue clearly..."
              rows="5"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
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

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Create Ticket"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">My Tickets</h3>

        {loadingTickets ? (
          <p className="mt-4 text-gray-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="mt-4 text-gray-500">No tickets created yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {ticket.subject}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {ticket.description}
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