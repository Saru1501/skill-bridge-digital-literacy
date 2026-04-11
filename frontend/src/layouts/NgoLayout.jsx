import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function NgoLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/login", { replace: true });
};

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-3 font-medium transition ${
      isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r bg-white p-6">
          <h1 className="mb-2 text-2xl font-bold">Skill Bridge</h1>
          <p className="mb-6 text-sm text-gray-500">NGO Panel</p>

          <div className="mb-6 rounded-xl bg-gray-50 p-4 text-left">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-semibold text-gray-900">{user?.name || "NGO"}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <nav className="space-y-2 text-left">
            <NavLink to="/ngo" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/ngo/programs" className={linkClass}>
              Manage Programs
            </NavLink>
            <NavLink to="/ngo/applications" className={linkClass}>
              Sponsorship Applications
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </aside>

        <main className="p-6 md:p-8">
  <div className="mb-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
    <div>
      <p className="text-sm text-gray-500">Role</p>
      <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500">Session</p>
      <p className="font-semibold text-green-600">Active</p>
    </div>
  </div>

  <Outlet />
</main>
      </div>
    </div>
  );
}