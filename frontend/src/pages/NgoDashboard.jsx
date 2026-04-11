import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function NgoDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || "NGO"}
        </h2>
        <p className="mt-2 text-gray-600">
          This dashboard allows NGOs to manage sponsorship programs and review student applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Programs</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Live</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Applications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Live</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Approvals</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Manage</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <p className="mt-3 text-gray-600">
          Create sponsorship programs and review student applications from this NGO panel.
        </p>

        <div className="mt-5 flex gap-3">
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
            View Applications
          </Link>
        </div>
      </div>
    </div>
  );
}