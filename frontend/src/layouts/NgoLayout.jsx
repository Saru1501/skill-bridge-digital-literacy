import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { 
  LayoutDashboard, 
  Building2, 
  FileCheck2,
  LogOut,
  UserCircle
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function NgoLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${
      isActive
        ? "bg-purple-600 text-white shadow-md shadow-purple-200"
        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
    }`;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <aside className="w-72 fixed inset-y-0 left-0 bg-white border-r border-gray-100 shadow-sm z-20 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 p-2 rounded-xl text-white">
              <Building2 size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">SkillBridge</h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400 ml-11">NGO Partner Panel</p>
        </div>

        <div className="px-6 py-4 border-t border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "NGO Partner"}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <NavLink to="/ngo" end className={linkClass}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/ngo/programs" className={linkClass}>
            <Building2 size={20} />
            <span>Manage Programs</span>
          </NavLink>
          <NavLink to="/ngo/applications" className={linkClass}>
            <FileCheck2 size={20} />
            <span>Sponsorship Applications</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 flex flex-col min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Role /</span>
            <span className="text-sm font-extrabold text-purple-600 capitalize bg-purple-50 px-2 py-0.5 rounded-md">{user?.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-gray-700">Session Active</span>
          </div>
        </header>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}