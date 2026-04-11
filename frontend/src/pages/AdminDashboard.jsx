import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SummaryCard from "../components/SummaryCard";
import { getAdminDashboardData } from "../services/sponsorshipService";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getAdminDashboardData();
        const tickets = data.tickets || [];

        setStats({
          total: tickets.length,
          open: tickets.filter((ticket) => ticket.status !== "RESOLVED").length,
          resolved: tickets.filter((ticket) => ticket.status === "RESOLVED").length,
        });
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || "Admin"}
        </h2>
        <p className="mt-2 text-gray-600">
          Monitor, review, and resolve support tickets from the admin dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Tickets"
          value={loading ? "..." : stats.total}
          subtitle="All student support requests"
          tone="default"
        />
        <SummaryCard
          title="Open / In Progress"
          value={loading ? "..." : stats.open}
          subtitle="Tickets needing action"
          tone="warning"
        />
        <SummaryCard
          title="Resolved"
          value={loading ? "..." : stats.resolved}
          subtitle="Successfully closed tickets"
          tone="success"
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Quick Action</h3>
        <p className="mt-3 text-gray-600">
          Open the support ticket panel to update statuses and resolve student issues.
        </p>

        <Link
          to="/admin/tickets"
          className="inline-block mt-5 rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800"
        >
          Manage Support Tickets
        </Link>
      </div>
    </div>
  );
}