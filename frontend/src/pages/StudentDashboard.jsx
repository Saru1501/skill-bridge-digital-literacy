import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SummaryCard from "../components/SummaryCard";
import { getStudentDashboardData } from "../services/sponsorshipService";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    programs: 0,
    tickets: 0,
    openTickets: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getStudentDashboardData();
        const tickets = data.tickets || [];

        setStats({
          programs: data.programs.length,
          tickets: tickets.length,
          openTickets: tickets.filter((ticket) => ticket.status !== "RESOLVED").length,
        });
      } catch (error) {
        console.error("Failed to load student dashboard", error);
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
          Welcome, {user?.name || "Student"}
        </h2>
        <p className="mt-2 text-gray-600">
          Manage your sponsorship applications, support requests, payments, and activity from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Available Programs"
          value={loading ? "..." : stats.programs}
          subtitle="Active NGO sponsorship programs"
          tone="default"
        />
        <SummaryCard
          title="My Tickets"
          value={loading ? "..." : stats.tickets}
          subtitle="Support requests created by you"
          tone="info"
        />
        <SummaryCard
          title="Open Issues"
          value={loading ? "..." : stats.openTickets}
          subtitle="Tickets not yet resolved"
          tone="warning"
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <p className="mt-3 text-gray-600">
          Start by browsing available sponsorship programs, applying for support, checking tickets, or viewing your gamification progress.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/student/programs"
            className="rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800"
          >
            View Programs
          </Link>
          <Link
            to="/student/tickets"
            className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            My Tickets
          </Link>
          <Link
            to="/student/payment"
            className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Payments
          </Link>
          <Link
            to="/student/gamification"
            className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Activity
          </Link>
          <Link
            to="/student/leaderboard"
            className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}