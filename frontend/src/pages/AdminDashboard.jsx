import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || "Admin"}
        </h2>
        <p className="mt-2 text-gray-600">
          This dashboard allows admins to monitor and resolve support tickets.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Support Tickets</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Live</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Open Issues</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Manage</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Resolved Tickets</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Track</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Quick Action</h3>
        <p className="mt-3 text-gray-600">
          View all tickets and update their status from OPEN to IN_PROGRESS or RESOLVED.
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