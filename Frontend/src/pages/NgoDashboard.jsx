import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SummaryCard from "../components/SummaryCard";
import { getNgoDashboardData } from "../services/sponsorshipService";

export default function NgoDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    programs: 0,
    applications: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getNgoDashboardData();

        setStats({
          programs: data.programs.filter((p) => p.ngoUser?._id === user?._id).length,
          applications: data.applications.length,
          pending: data.applications.filter((app) => app.status === "PENDING").length,
        });
      } catch (error) {
        console.error("Failed to load NGO dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      loadDashboard();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || "NGO"}
        </h2>
        <p className="mt-2 text-gray-600">
          Create sponsorship programs and review student applications from this dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="My Programs"
          value={loading ? "..." : stats.programs}
          subtitle="Programs created by your NGO"
          tone="default"
        />
        <SummaryCard
          title="Applications"
          value={loading ? "..." : stats.applications}
          subtitle="Student applications received"
          tone="info"
        />
        <SummaryCard
          title="Pending Reviews"
          value={loading ? "..." : stats.pending}
          subtitle="Applications waiting for action"
          tone="warning"
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <p className="mt-3 text-gray-600">
          Create sponsorship programs and process incoming student applications.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/ngo/programs"
            className="rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800"
          >
            Manage Programs
          </Link>
          <Link
            to="/ngo/applications"
            className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Review Applications
          </Link>
        </div>
      </div>
    </div>
  );
}