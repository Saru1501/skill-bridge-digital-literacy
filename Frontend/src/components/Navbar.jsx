import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const navItemsByRole = {
  student: [
    { label: "My Courses", icon: "📚", path: "/student" },
    { label: "Gamification", icon: "🏆", path: "/student/gamification" },
    { label: "Leaderboard", icon: "🥇", path: "/student/leaderboard" },
    { label: "Progress", icon: "📊", path: "/student/progress" },
  ],
  ngo: [
    { label: "Dashboard", icon: "🏠", path: "/ngo" },
    { label: "Courses", icon: "📚", path: "/ngo/courses" },
    { label: "Students", icon: "🎓", path: "/ngo/students" },
  ],
  admin: [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Gamification", icon: "🎮", path: "/admin/gamification" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase();
  const navItems = navItemsByRole[role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getTitle = () => {
    switch (role) {
      case "admin":
        return "SkillBridge Admin";
      case "ngo":
        return "SkillBridge NGO";
      default:
        return "SkillBridge";
    }
  };

  return (
    <header className="bg-white" style={{ 
      boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
    }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold" style={{ color: '#ff385c', letterSpacing: '-0.18px' }}>
          {getTitle()}
        </h1>
        <div className="flex items-center gap-3">
          {navItems.length > 0 && (
            <nav className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="px-4 py-2 rounded-lg transition"
                  style={{ 
                    color: '#222222', 
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </nav>
          )}
          <span style={{ color: '#6a6a6a', fontSize: '14px', fontWeight: 500 }}>
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-lg font-medium transition"
            style={{ 
              backgroundColor: '#222222', 
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}