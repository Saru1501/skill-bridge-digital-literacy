import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || "Student"}
        </h2>
        <p className="mt-2 text-gray-600">
          This is your student dashboard for Sponsorship, Support, and Payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Available Programs</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">Live</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">My Applications</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">My Tickets</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-left">
          <p className="text-sm text-gray-500">Payment Status</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">--</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        <p className="mt-3 text-gray-600">
          Start by browsing available sponsorship programs and applying for financial support.
        </p>

        <Link
          to="/student/programs"
          className="inline-block mt-5 rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800"
        >
          View Sponsorship Programs
        </Link>
      </div>
    </div>
  );
}