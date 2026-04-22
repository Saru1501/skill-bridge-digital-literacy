# Component 1 — Learning Management & Offline Delivery Engine
# Run from: C:\Users\USER\skill-bridge-digital-literacy\frontend
# Or from anywhere — adjust paths accordingly

Write-Host "Setting up Component 1 Frontend..." -ForegroundColor Cyan

# Create all folders
New-Item -ItemType Directory -Force -Path @(
  "public",
  "src\context",
  "src\services",
  "src\components\layout",
  "src\components\ui",
  "src\pages\student",
  "src\pages\admin"
) | Out-Null
Write-Host "Folders created" -ForegroundColor Green

# package.json
Set-Content -Path 'package.json' -Value @'
{
  "name": "skillbridge-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%","not dead","not op_mini all"],
    "development": ["last 1 chrome version","last 1 firefox version","last 1 safari version"]
  }
}
'@ -Encoding UTF8
Write-Host "  wrote package.json" -ForegroundColor Gray

# public\index.html
Set-Content -Path 'public\index.html' -Value @'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkillBridge — Learning Platform</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
'@ -Encoding UTF8
Write-Host "  wrote public\index.html" -ForegroundColor Gray

# src\App.js
Set-Content -Path 'src\App.js' -Value @'
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login          from "./pages/Login";
import Dashboard      from "./pages/student/Dashboard";
import BrowseCourses  from "./pages/student/BrowseCourses";
import CourseDetail   from "./pages/student/CourseDetail";
import MyCourses      from "./pages/student/MyCourses";
import LessonView     from "./pages/student/LessonView";
import SavedResources from "./pages/student/SavedResources";
import Downloads      from "./pages/student/Downloads";

import AdminDashboard   from "./pages/admin/AdminDashboard";
import ManageCourses    from "./pages/admin/ManageCourses";
import ManageLessons    from "./pages/admin/ManageLessons";
import ManageResources  from "./pages/admin/ManageResources";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"      element={<Navigate to="/dashboard" replace />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard"                            element={<Dashboard />} />
            <Route path="/courses"                              element={<BrowseCourses />} />
            <Route path="/courses/:id"                          element={<CourseDetail />} />
            <Route path="/courses/:courseId/lessons/:lessonId"  element={<LessonView />} />
            <Route path="/my-courses"                           element={<MyCourses />} />
            <Route path="/saved"                                element={<SavedResources />} />
            <Route path="/downloads"                            element={<Downloads />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute adminOnly={true}><AppLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/courses"   element={<ManageCourses />} />
            <Route path="/admin/lessons"   element={<ManageLessons />} />
            <Route path="/admin/resources" element={<ManageResources />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\App.js" -ForegroundColor Gray

# src\components\layout\AppLayout.css
Set-Content -Path 'src\components\layout\AppLayout.css' -Value @'
.app-layout { display: flex; min-height: 100vh; }
.app-main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-width: 0; }
.app-header { height: var(--header-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 50; }
.header-search { display: flex; align-items: center; gap: 8px; background: var(--surface2); border-radius: var(--radius-sm); padding: 7px 14px; min-width: 280px; border: 1px solid transparent; transition: border .15s; }
.header-search:focus-within { border-color: var(--primary); background: var(--surface); }
.header-search input { background: none; border: none; outline: none; font-size: 13.5px; color: var(--text); flex: 1; }
.header-search input::placeholder { color: var(--text3); }
.header-actions { display: flex; align-items: center; gap: 4px; }
.header-icon-btn { width: 36px; height: 36px; border-radius: 8px; background: none; border: none; color: var(--text2); display: flex; align-items: center; justify-content: center; transition: background .12s; }
.header-icon-btn:hover { background: var(--surface2); }
.app-content { padding: 28px; flex: 1; }
'@ -Encoding UTF8
Write-Host "  wrote src\components\layout\AppLayout.css" -ForegroundColor Gray

# src\components\layout\AppLayout.js
Set-Content -Path 'src\components\layout\AppLayout.js' -Value @'
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <header className="app-header">
          <div className="header-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search courses, lessons..." />
          </div>
          <div className="header-actions">
            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\components\layout\AppLayout.js" -ForegroundColor Gray

# src\components\layout\Sidebar.css
Set-Content -Path 'src\components\layout\Sidebar.css' -Value @'
.sidebar { width: var(--sidebar-w); height: 100vh; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 100; overflow-y: auto; }
.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 16px 16px 12px; border-bottom: 1px solid var(--border); }
.brand-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; flex-shrink: 0; }
.brand-name { font-weight: 700; font-size: 14px; line-height: 1.2; }
.brand-sub { font-size: 11px; color: var(--text3); }
.sidebar-nav { flex: 1; padding: 8px; }
.nav-group { margin-bottom: 4px; }
.nav-group-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; color: var(--text3); padding: 12px 10px 4px; text-transform: uppercase; }
.nav-item { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px; color: var(--text2); font-size: 13.5px; font-weight: 500; transition: all .12s; margin-bottom: 1px; }
.nav-item:hover { background: var(--surface2); color: var(--text); }
.nav-item.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
.nav-icon { width: 17px; height: 17px; display: flex; align-items: center; flex-shrink: 0; }
.nav-icon svg { width: 100%; height: 100%; }
.sidebar-bottom { border-top: 1px solid var(--border); padding: 12px; }
.sidebar-user { display: flex; align-items: center; gap: 8px; padding: 8px 6px; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 11px; color: var(--text3); text-transform: capitalize; }
.logout-btn { background: none; border: none; padding: 4px; color: var(--text3); border-radius: 4px; display: flex; cursor: pointer; }
.logout-btn:hover { color: var(--danger); background: #FEE2E2; }
'@ -Encoding UTF8
Write-Host "  wrote src\components\layout\Sidebar.css" -ForegroundColor Gray

# src\components\layout\Sidebar.js
Set-Content -Path 'src\components\layout\Sidebar.js' -Value @'
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const I = ({ d }) => (
  <span className="nav-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  </span>
);

const studentNav = [
  { group: "LEARNING", items: [
    { to: "/dashboard",   icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",  label: "Dashboard" },
    { to: "/courses",     icon: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z", label: "Browse Courses" },
    { to: "/my-courses",  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "My Courses" },
    { to: "/saved",       icon: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z",  label: "Saved Courses" },
    { to: "/downloads",   icon: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3", label: "Downloads" },
  ]},
];

const adminNav = [
  { group: "OVERVIEW", items: [
    { to: "/admin/dashboard", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", label: "Dashboard" },
  ]},
  { group: "COMPONENT 1", items: [
    { to: "/admin/courses",   icon: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z", label: "Manage Courses" },
    { to: "/admin/lessons",   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "Manage Lessons" },
    { to: "/admin/resources", icon: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3", label: "Resources" },
  ]},
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const nav = useNavigate();
  const groups = isAdmin ? adminNav : studentNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">SB</div>
        <div>
          <div className="brand-name">SkillBridge</div>
          <div className="brand-sub">Digital Literacy</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {groups.map(g => (
          <div className="nav-group" key={g.group}>
            <div className="nav-group-label">{g.group}</div>
            {g.items.map(item => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
                <I d={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
            <button className="logout-btn" title="Logout" onClick={() => { logout(); nav("/login"); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\components\layout\Sidebar.js" -ForegroundColor Gray

# src\components\ui\ProtectedRoute.js
Set-Content -Path 'src\components\ui\ProtectedRoute.js' -Value @'
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
'@ -Encoding UTF8
Write-Host "  wrote src\components\ui\ProtectedRoute.js" -ForegroundColor Gray

# src\context\AuthContext.js
Set-Content -Path 'src\context\AuthContext.js' -Value @'
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use(req => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u && token) setUser(JSON.parse(u));
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const r = await API.post("/auth/login", { email, password });
    const { token: t, user: u } = r.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setToken(t); setUser(u); return u;
  };

  const register = async (name, email, password, role = "student") => {
    const r = await API.post("/auth/register", { name, email, password, role });
    const { token: t, user: u } = r.data;
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setToken(t); setUser(u); return u;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      isAdmin: user?.role === "admin",
      isStudent: user?.role === "student"
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API };
'@ -Encoding UTF8
Write-Host "  wrote src\context\AuthContext.js" -ForegroundColor Gray

# src\index.css
Set-Content -Path 'src\index.css' -Value @'
@import url(''https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'');

:root {
  --primary: #2563EB;
  --primary-dark: #1D4ED8;
  --primary-light: #EFF6FF;
  --success: #22C55E;
  --warning: #F59E0B;
  --danger: #EF4444;
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --surface2: #F1F5F9;
  --border: #E2E8F0;
  --text: #0F172A;
  --text2: #475569;
  --text3: #94A3B8;
  --sidebar-w: 240px;
  --header-h: 60px;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,.08);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: ''DM Sans'', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; }
input, textarea, select { font-family: inherit; }
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 18px; border-radius: var(--radius-sm); border: none; font-size: 14px; font-weight: 600; transition: all .15s; white-space: nowrap; }
.btn-primary { background: var(--primary); color: #fff; } .btn-primary:hover { background: var(--primary-dark); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); } .btn-secondary:hover { background: var(--border); }
.btn-danger { background: var(--danger); color: #fff; } .btn-danger:hover { opacity: .88; }
.btn-ghost { background: transparent; color: var(--primary); } .btn-ghost:hover { background: var(--primary-light); }
.btn-success { background: var(--success); color: #fff; }
.btn-sm { padding: 6px 12px; font-size: 12.5px; }
.btn-full { width: 100%; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-blue { background: #DBEAFE; color: #1D4ED8; }
.badge-green { background: #DCFCE7; color: #15803D; }
.badge-yellow { background: #FEF9C3; color: #A16207; }
.badge-red { background: #FEE2E2; color: #B91C1C; }
.badge-gray { background: var(--surface2); color: var(--text2); }
.badge-purple { background: #F3E8FF; color: #7E22CE; }
.progress-bar { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
.progress-bar-fill { height: 100%; background: var(--primary); border-radius: 3px; transition: width .4s; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 24px; box-shadow: var(--shadow); }
.stat-card .stat-value { font-size: 28px; font-weight: 700; line-height: 1.2; }
.stat-card .stat-label { font-size: 13px; color: var(--text2); margin-bottom: 4px; }
.stat-card .stat-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.page-header p { color: var(--text2); font-size: 14px; }
.section-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
.empty-state { text-align: center; padding: 60px 24px; color: var(--text3); }
.empty-state h3 { font-size: 16px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text2); }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 14px; color: var(--text); background: var(--surface); transition: border .15s; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
.form-group textarea { resize: vertical; min-height: 80px; }
.divider { height: 1px; background: var(--border); margin: 20px 0; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.loading-screen { display: flex; align-items: center; justify-content: center; height: 60vh; font-size: 16px; color: var(--text3); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
.modal-box { background: var(--surface); border-radius: var(--radius); padding: 28px; width: 100%; max-width: 540px; box-shadow: var(--shadow-md); }
@media(max-width:1024px) { .grid-4 { grid-template-columns: 1fr 1fr; } }
@media(max-width:768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
'@ -Encoding UTF8
Write-Host "  wrote src\index.css" -ForegroundColor Gray

# src\index.js
Set-Content -Path 'src\index.js' -Value @'
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
'@ -Encoding UTF8
Write-Host "  wrote src\index.js" -ForegroundColor Gray

# src\pages\Login.css
Set-Content -Path 'src\pages\Login.css' -Value @'
.login-page { min-height: 100vh; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { background: var(--surface); border-radius: 16px; box-shadow: 0 20px 60px rgba(37,99,235,.15); padding: 40px 36px; width: 100%; max-width: 420px; }
.login-logo { width: 60px; height: 60px; border-radius: 16px; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; margin: 0 auto 14px; }
.login-brand { text-align: center; margin-bottom: 28px; }
.login-brand h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
.login-brand p { font-size: 13px; color: var(--text3); }
.login-tabs { display: flex; background: var(--surface2); border-radius: 10px; padding: 3px; margin-bottom: 24px; }
.login-tabs button { flex: 1; padding: 9px; border: none; background: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: var(--text2); cursor: pointer; transition: all .15s; }
.login-tabs button.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
.login-error { background: #FEE2E2; color: #B91C1C; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; font-weight: 500; }
.login-footer { text-align: center; margin-top: 20px; padding: 14px; background: var(--surface2); border-radius: 8px; font-size: 12px; color: var(--text3); }
.login-footer strong { color: var(--text2); }
'@ -Encoding UTF8
Write-Host "  wrote src\pages\Login.css" -ForegroundColor Gray

# src\pages\Login.js
Set-Content -Path 'src\pages\Login.js' -Value @'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [tab, setTab]         = useState("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [role, setRole]       = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const { login, register }   = useAuth();
  const nav                   = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      let u;
      if (tab === "login") u = await login(email, password);
      else                 u = await register(name, email, password, role);
      nav(u.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">SB</div>
          <h1>SkillBridge</h1>
          <p>Digital Literacy Platform — Component 1</p>
        </div>

        <div className="login-tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); setError(""); }}>Register</button>
        </div>

        <form onSubmit={submit}>
          {tab === "register" && (
            <div className="form-group">
              <label>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
          </div>
          {tab === "register" && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Admin / University</option>
              </select>
            </div>
          )}
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="login-footer">
          <strong>Component 1:</strong> Learning Management &amp; Offline Delivery Engine<br />
          Saru — SE3040 SLIIT 2026
        </div>
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\Login.js" -ForegroundColor Gray

# src\pages\admin\AdminDashboard.js
Set-Content -Path 'src\pages\admin\AdminDashboard.js' -Value @'
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../../services/api";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCourses().then(r => setCourses(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const published   = courses.filter(c => c.isPublished).length;
  const unpublished = courses.filter(c => !c.isPublished).length;
  const totalEnrolled = courses.reduce((s, c) => s + (c.enrolledCount || 0), 0);

  const cards = [
    { label: "Total Courses",    value: courses.length, icon: "📚", to: "/admin/courses" },
    { label: "Published",        value: published,      icon: "✅", to: "/admin/courses" },
    { label: "Draft / Unpublished", value: unpublished, icon: "📝", to: "/admin/courses" },
    { label: "Total Enrollments",value: totalEnrolled,  icon: "👥", to: "/admin/courses" },
  ];

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Component 1 — Learning Management & Offline Delivery Engine</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {cards.map(c => (
          <Link to={c.to} key={c.label} style={{ textDecoration: "none" }}>
            <div className="stat-card" style={{ cursor: "pointer" }}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {c.value} <span style={{ fontSize: 28 }}>{c.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: "20px 24px" }}>
          <h2 className="section-title">Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/admin/courses" className="btn btn-primary">+ Create New Course</Link>
            <Link to="/admin/lessons" className="btn btn-secondary">Manage Lessons</Link>
            <Link to="/admin/resources" className="btn btn-secondary">Manage Resources</Link>
          </div>
        </div>

        <div className="card" style={{ padding: "20px 24px" }}>
          <h2 className="section-title">Recent Courses</h2>
          {courses.slice(0, 4).map(c => (
            <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{c.category} · {c.enrolledCount || 0} students</div>
              </div>
              <span className={`badge ${c.isPublished ? "badge-green" : "badge-gray"}`}>{c.isPublished ? "Published" : "Draft"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\admin\AdminDashboard.js" -ForegroundColor Gray

# src\pages\admin\ManageCourses.js
Set-Content -Path 'src\pages\admin\ManageCourses.js' -Value @'
import React, { useEffect, useState } from "react";
import { getAllCourses, createCourse, updateCourse, deleteCourse, publishCourse, unpublishCourse } from "../../services/api";

const CATS  = ["Basic IT Skills", "Internet Safety", "Online Jobs", "Digital Payments", "Social Media", "E-Commerce"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const empty = { title: "", description: "", category: "Basic IT Skills", level: "Beginner", duration: "", objectives: "", isPublished: false };

export default function ManageCourses() {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [msg, setMsg]           = useState("");

  const load = () => getAllCourses().then(r => setCourses(r.data.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const show = (m, isErr = false) => { setMsg({ text: m, err: isErr }); setTimeout(() => setMsg(""), 3000); };

  const openNew  = ()  => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = c   => { setEditing(c); setForm({ title: c.title, description: c.description, category: c.category, level: c.level || "Beginner", duration: c.duration || "", objectives: Array.isArray(c.objectives) ? c.objectives.join("\n") : c.objectives || "", isPublished: c.isPublished || false }); setModal(true); };

  const save = async () => {
    if (!form.title.trim()) return show("Title is required.", true);
    setSaving(true);
    try {
      const payload = { ...form, objectives: form.objectives ? form.objectives.split("\n").filter(Boolean) : [] };
      if (editing) await updateCourse(editing._id, payload);
      else         await createCourse(payload);
      setModal(false); load(); show(editing ? "Course updated!" : "Course created!");
    } catch (e) { show(e.response?.data?.message || "Save failed.", true); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try { await deleteCourse(id); load(); show("Course deleted."); }
    catch { show("Delete failed.", true); }
  };

  const togglePublish = async c => {
    try {
      if (c.isPublished) await unpublishCourse(c._id);
      else               await publishCourse(c._id);
      load(); show(c.isPublished ? "Course unpublished." : "Course published!");
    } catch { show("Action failed.", true); }
  };

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const filtered = courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Manage Courses</h1>
          <p>Create, edit, and publish digital literacy courses.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Create Course</button>
      </div>

      {msg && (
        <div style={{ padding: "10px 16px", background: msg.err ? "#FEE2E2" : "#DCFCE7", color: msg.err ? "#B91C1C" : "#15803D", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>
          {msg.text}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
          placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Course list */}
      <div className="card" style={{ padding: "0 24px" }}>
        {filtered.length === 0 && <div className="empty-state" style={{ padding: 60 }}><h3>No courses yet</h3></div>}
        {filtered.map((c, i) => (
          <div key={c._id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 0", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📚</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{c.category} · {c.level} · {c.duration || "Self-paced"} · {c.enrolledCount || 0} students enrolled</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{c.description?.slice(0, 80)}...</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              <span className={`badge ${c.isPublished ? "badge-green" : "badge-gray"}`}>{c.isPublished ? "Published" : "Draft"}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => togglePublish(c)}>{c.isPublished ? "Unpublish" : "Publish"}</button>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(c._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" style={{ alignItems: "flex-start", paddingTop: 30 }}>
          <div className="modal-box" style={{ maxWidth: 580 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit Course" : "Create New Course"}</h2>

            <div className="form-group"><label>Course Title *</label><input value={form.title} onChange={f("title")} placeholder="e.g. Basic IT Skills for Beginners" /></div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={f("description")} placeholder="What will students learn in this course?" rows={3} /></div>

            <div className="grid-2">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={f("category")}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="form-group">
                <label>Level</label>
                <select value={form.level} onChange={f("level")}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
              </div>
            </div>

            <div className="form-group"><label>Duration (e.g. 4 weeks, 10 hours)</label><input value={form.duration} onChange={f("duration")} placeholder="4 weeks" /></div>
            <div className="form-group">
              <label>Learning Objectives (one per line)</label>
              <textarea value={form.objectives} onChange={f("objectives")} placeholder={"Understand basic computer operations\nUse internet safely\nCreate email accounts"} rows={4} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || !form.title.trim()}>
                {saving ? "Saving..." : editing ? "Update Course" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\admin\ManageCourses.js" -ForegroundColor Gray

# src\pages\admin\ManageLessons.js
Set-Content -Path 'src\pages\admin\ManageLessons.js' -Value @'
import React, { useEffect, useState } from "react";
import { getAllCourses, getLessons, createLesson, updateLesson, deleteLesson } from "../../services/api";

const empty = { title: "", content: "", duration: "", type: "text", videoUrl: "", order: 1 };
const TYPES = ["text", "video", "quiz_intro", "practical"];

export default function ManageLessons() {
  const [courses, setCourses]     = useState([]);
  const [selCourse, setSelCourse] = useState("");
  const [lessons, setLessons]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState("");

  useEffect(() => { getAllCourses().then(r => setCourses(r.data.data || [])); }, []);

  const loadLessons = async cid => {
    setSelCourse(cid); setLoading(true);
    getLessons(cid).then(r => setLessons(r.data.data || [])).finally(() => setLoading(false));
  };

  const openNew  = ()  => { setEditing(null); setForm({ ...empty, order: lessons.length + 1 }); setModal(true); };
  const openEdit = l   => { setEditing(l); setForm({ title: l.title, content: l.content || "", duration: l.duration || "", type: l.type || "text", videoUrl: l.videoUrl || "", order: l.order || 1 }); setModal(true); };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing) await updateLesson(selCourse, editing._id, form);
      else         await createLesson(selCourse, form);
      setModal(false); loadLessons(selCourse);
      setMsg(editing ? "Lesson updated!" : "Lesson added!"); setTimeout(() => setMsg(""), 2000);
    } catch { setMsg("Save failed."); } finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm("Delete this lesson?")) return;
    await deleteLesson(selCourse, id); loadLessons(selCourse);
  };

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header"><h1>Manage Lessons</h1><p>Add and edit lessons for each course.</p></div>

      {msg && <div style={{ padding: "10px 16px", background: "#DCFCE7", color: "#15803D", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>{msg}</div>}

      {/* Select course */}
      <div className="card" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select a Course to Manage Lessons</label>
          <select value={selCourse} onChange={e => loadLessons(e.target.value)}>
            <option value="">-- Choose a course --</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {selCourse && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Lessons ({lessons.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Lesson</button>
          </div>

          <div className="card" style={{ padding: "0 24px" }}>
            {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading...</div>}
            {!loading && lessons.length === 0 && <div className="empty-state" style={{ padding: 60 }}><h3>No lessons yet</h3></div>}
            {lessons.map((l, i) => (
              <div key={l._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < lessons.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>{l.order || i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{l.type} · {l.duration || "—"}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(l)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(l._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 580 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit Lesson" : "Add Lesson"}</h2>
            <div className="grid-2">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={f("title")} placeholder="Lesson title" /></div>
              <div className="form-group"><label>Order</label><input type="number" value={form.order} onChange={f("order")} min={1} /></div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={f("type")}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
              </div>
              <div className="form-group"><label>Duration (e.g. 15 min)</label><input value={form.duration} onChange={f("duration")} placeholder="15 min" /></div>
            </div>
            {form.type === "video" && (
              <div className="form-group"><label>Video URL</label><input value={form.videoUrl} onChange={f("videoUrl")} placeholder="https://..." /></div>
            )}
            <div className="form-group"><label>Content / Notes</label><textarea value={form.content} onChange={f("content")} rows={5} placeholder="Lesson content, notes, or instructions..." /></div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || !form.title.trim()}>{saving ? "Saving..." : editing ? "Update Lesson" : "Add Lesson"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\admin\ManageLessons.js" -ForegroundColor Gray

# src\pages\admin\ManageResources.js
Set-Content -Path 'src\pages\admin\ManageResources.js' -Value @'
import React, { useEffect, useState } from "react";
import { getAllCourses, getResources, createResource, updateResource, deleteResource } from "../../services/api";

const TYPES = ["pdf", "video", "slides", "link", "document"];
const empty = { title: "", type: "pdf", url: "", size: "", description: "" };

export default function ManageResources() {
  const [courses, setCourses]     = useState([]);
  const [selCourse, setSelCourse] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState("");

  useEffect(() => { getAllCourses().then(r => setCourses(r.data.data || [])); }, []);

  const loadRes = cid => {
    setSelCourse(cid); setLoading(true);
    getResources(cid).then(r => setResources(r.data.data || [])).finally(() => setLoading(false));
  };

  const openNew  = ()  => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = r   => { setEditing(r); setForm({ title: r.title, type: r.type || "pdf", url: r.url || "", size: r.size || "", description: r.description || "" }); setModal(true); };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing) await updateResource(selCourse, editing._id, form);
      else         await createResource(selCourse, form);
      setModal(false); loadRes(selCourse);
      setMsg(editing ? "Resource updated!" : "Resource added!"); setTimeout(() => setMsg(""), 2000);
    } catch { setMsg("Save failed."); } finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm("Delete this resource?")) return;
    await deleteResource(selCourse, id); loadRes(selCourse);
  };

  const typeIcon = t => t === "pdf" ? "📄" : t === "video" ? "🎬" : t === "slides" ? "📊" : t === "link" ? "🔗" : "📁";
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <div className="page-header"><h1>Manage Resources</h1><p>Upload and manage downloadable course resources.</p></div>

      {msg && <div style={{ padding: "10px 16px", background: "#DCFCE7", color: "#15803D", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>{msg}</div>}

      <div className="card" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Course</label>
          <select value={selCourse} onChange={e => loadRes(e.target.value)}>
            <option value="">-- Choose a course --</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      {selCourse && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Resources ({resources.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Resource</button>
          </div>

          <div className="card" style={{ padding: "0 24px" }}>
            {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading...</div>}
            {!loading && resources.length === 0 && <div className="empty-state" style={{ padding: 60 }}><h3>No resources yet</h3></div>}
            {resources.map((r, i) => (
              <div key={r._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < resources.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{typeIcon(r.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{r.type?.toUpperCase()} · {r.size || "—"} · {r.description?.slice(0, 50)}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(r._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editing ? "Edit Resource" : "Add Resource"}</h2>
            <div className="grid-2">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={f("title")} placeholder="Resource title" /></div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={f("type")}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
              </div>
            </div>
            <div className="form-group"><label>URL / File Path</label><input value={form.url} onChange={f("url")} placeholder="https://... or file path" /></div>
            <div className="form-group"><label>File Size (e.g. 2.4 MB)</label><input value={form.size} onChange={f("size")} placeholder="2.4 MB" /></div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={f("description")} rows={3} placeholder="Brief description of this resource..." /></div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || !form.title.trim()}>{saving ? "Saving..." : editing ? "Update" : "Add Resource"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\admin\ManageResources.js" -ForegroundColor Gray

# src\pages\student\BrowseCourses.js
Set-Content -Path 'src\pages\student\BrowseCourses.js' -Value @'
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, enrollCourse, saveCourse } from "../../services/api";

const CATS = ["All", "Basic IT Skills", "Internet Safety", "Online Jobs", "Digital Payments", "Social Media", "E-Commerce"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function BrowseCourses() {
  const [courses, setCourses]   = useState([]);
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [level, setLevel]       = useState("All");
  const [loading, setLoading]   = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [saving, setSaving]     = useState(null);
  const [msg, setMsg]           = useState("");
  const nav                     = useNavigate();

  useEffect(() => {
    getAllCourses()
      .then(r => setCourses(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
                        c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = cat === "All" || c.category === cat;
    const matchLevel  = level === "All" || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  const handleEnroll = async id => {
    setEnrolling(id);
    try {
      await enrollCourse(id);
      setMsg("Enrolled successfully! Go to My Courses.");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg(e.response?.data?.message || "Already enrolled or error occurred.");
      setTimeout(() => setMsg(""), 3000);
    } finally { setEnrolling(null); }
  };

  const handleSave = async id => {
    setSaving(id);
    try { await saveCourse(id); setMsg("Course saved!"); setTimeout(() => setMsg(""), 2000); }
    catch { setMsg("Could not save course."); setTimeout(() => setMsg(""), 2000); }
    finally { setSaving(null); }
  };

  if (loading) return <div className="loading-screen">Loading courses...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Browse Courses</h1>
        <p>Explore digital literacy courses for rural youth.</p>
      </div>

      {msg && (
        <div style={{ padding: "10px 16px", background: "#DCFCE7", color: "#15803D", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          style={{ width: "100%", padding: "11px 16px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--surface)" }}
          placeholder="🔍 Search courses by title or description..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", marginRight: 8 }}>CATEGORY</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`btn btn-sm ${cat === c ? "btn-primary" : "btn-secondary"}`}
                style={{ borderRadius: 20 }}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", marginRight: 8 }}>LEVEL</span>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`btn btn-sm ${level === l ? "btn-primary" : "btn-secondary"}`}
                style={{ borderRadius: 20 }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: "var(--text3)" }}>
        Showing {filtered.length} of {courses.length} courses
      </div>

      {/* Course Grid */}
      <div className="grid-3">
        {filtered.map(c => (
          <div className="card" key={c._id} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Thumbnail */}
            <div style={{ height: 120, background: `linear-gradient(135deg, #EFF6FF, #DBEAFE)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
              {c.category === "Basic IT Skills" ? "💻" : c.category === "Internet Safety" ? "🛡️" : c.category === "Online Jobs" ? "💼" : c.category === "Digital Payments" ? "💳" : c.category === "Social Media" ? "📱" : "🛒"}
            </div>

            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                <span className="badge badge-blue">{c.category || "General"}</span>
                <span className="badge badge-gray">{c.level || "Beginner"}</span>
                {c.isPublished ? <span className="badge badge-green">Published</span> : null}
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12, lineHeight: 1.5, flex: 1 }}>
                {c.description?.slice(0, 90)}{c.description?.length > 90 ? "..." : ""}
              </p>

              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
                <span>🕐 {c.duration || "Self-paced"}</span>
                <span>👥 {c.enrolledCount || 0} enrolled</span>
                <span>📚 {c.lessonCount || 0} lessons</span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }}
                  onClick={() => handleEnroll(c._id)} disabled={enrolling === c._id}>
                  {enrolling === c._id ? "Enrolling..." : "Enroll Now"}
                </button>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => handleSave(c._id)} disabled={saving === c._id}
                  title="Save course">
                  {saving === c._id ? "..." : "🔖"}
                </button>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => nav(`/courses/${c._id}`)} title="View details">
                  👁
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1/-1", padding: 60 }}>
            <h3>No courses found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\BrowseCourses.js" -ForegroundColor Gray

# src\pages\student\CourseDetail.js
Set-Content -Path 'src\pages\student\CourseDetail.js' -Value @'
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, getLessons, getResources, enrollCourse, saveCourse, downloadResource } from "../../services/api";

export default function CourseDetail() {
  const { id }                   = useParams();
  const nav                      = useNavigate();
  const [course, setCourse]       = useState(null);
  const [lessons, setLessons]     = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [msg, setMsg]             = useState("");
  const [tab, setTab]             = useState("overview");

  useEffect(() => {
    Promise.all([getCourseById(id), getLessons(id), getResources(id)])
      .then(([c, l, r]) => {
        setCourse(c.data.data);
        setLessons(l.data.data || []);
        setResources(r.data.data || []);
      })
      .catch(() => nav("/courses"))
      .finally(() => setLoading(false));
  }, [id]);

  const enroll = async () => {
    try { await enrollCourse(id); setMsg("Enrolled! Go to My Courses."); }
    catch (e) { setMsg(e.response?.data?.message || "Error enrolling."); }
    setTimeout(() => setMsg(""), 3000);
  };

  const save = async () => {
    try { await saveCourse(id); setMsg("Course saved!"); }
    catch { setMsg("Could not save."); }
    setTimeout(() => setMsg(""), 2000);
  };

  const download = async (cid, rid, title) => {
    try { await downloadResource(cid, rid); setMsg(`"${title}" saved for offline access!`); }
    catch { setMsg("Download failed."); }
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading) return <div className="loading-screen">Loading course...</div>;
  if (!course) return <div className="loading-screen">Course not found.</div>;

  const typeIcon = t => t === "pdf" ? "📄" : t === "video" ? "🎬" : t === "slides" ? "📊" : "📁";

  return (
    <div>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => nav(-1)}>
        ← Back
      </button>

      {msg && (
        <div style={{ padding: "10px 16px", background: "#DCFCE7", color: "#15803D", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>{msg}</div>
      )}

      {/* Hero */}
      <div className="card" style={{ padding: "28px 32px", marginBottom: 20, background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span className="badge badge-blue">{course.category}</span>
              <span className="badge badge-gray">{course.level || "Beginner"}</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>{course.title}</h1>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, maxWidth: 600, marginBottom: 16 }}>{course.description}</p>
            <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--text3)" }}>
              <span>📚 {lessons.length} lessons</span>
              <span>📎 {resources.length} resources</span>
              <span>👥 {course.enrolledCount || 0} students</span>
              <span>🕐 {course.duration || "Self-paced"}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" style={{ minWidth: 160 }} onClick={enroll}>Enroll Now</button>
            <button className="btn btn-secondary" onClick={save}>🔖 Save Course</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "2px solid var(--border)", paddingBottom: 0 }}>
        {["overview", "lessons", "resources"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-ghost"}`}
            style={{ borderRadius: "6px 6px 0 0", textTransform: "capitalize" }}>
            {t === "overview" ? "📋 Overview" : t === "lessons" ? `📖 Lessons (${lessons.length})` : `📎 Resources (${resources.length})`}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="card" style={{ padding: "24px 28px" }}>
          <h2 className="section-title">About this Course</h2>
          <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8, marginBottom: 20 }}>{course.description}</p>
          {course.objectives && (
            <>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>What you''ll learn</h3>
              <ul style={{ paddingLeft: 20, color: "var(--text2)", fontSize: 14, lineHeight: 2 }}>
                {(Array.isArray(course.objectives) ? course.objectives : [course.objectives]).map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Lessons Tab */}
      {tab === "lessons" && (
        <div className="card" style={{ padding: "0 24px" }}>
          {lessons.length === 0
            ? <div className="empty-state" style={{ padding: 60 }}><h3>No lessons yet</h3></div>
            : lessons.map((l, i) => (
              <div key={l._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < lessons.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: l.isCompleted ? "#DCFCE7" : "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, color: l.isCompleted ? "#15803D" : "var(--text3)" }}>
                  {l.isCompleted ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{l.duration || "—"} · {l.type || "lesson"}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => nav(`/courses/${id}/lessons/${l._id}`)}>
                  {l.isCompleted ? "Review" : "Start"}
                </button>
              </div>
            ))
          }
        </div>
      )}

      {/* Resources Tab */}
      {tab === "resources" && (
        <div className="card" style={{ padding: "0 24px" }}>
          {resources.length === 0
            ? <div className="empty-state" style={{ padding: 60 }}><h3>No resources yet</h3></div>
            : resources.map((r, i) => (
              <div key={r._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < resources.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {typeIcon(r.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{r.type?.toUpperCase()} · {r.size || "—"}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => download(id, r._id, r.title)}>
                  ⬇ Download
                </button>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\CourseDetail.js" -ForegroundColor Gray

# src\pages\student\Dashboard.css
Set-Content -Path 'src\pages\student\Dashboard.css' -Value @'
.db-stats { margin-bottom: 24px; }
.stat-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 30px; opacity: .65; }
.stat-card { position: relative; overflow: hidden; }
.db-main { display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; margin-bottom: 20px; }
.db-card { padding: 20px 24px; }
.db-card-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.course-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.course-row:last-child { border-bottom: none; }
.course-row-ico { width: 38px; height: 38px; border-radius: 8px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.course-row-info { flex: 1; min-width: 0; }
.course-row-title { font-size: 13.5px; font-weight: 600; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media(max-width:900px) { .db-main { grid-template-columns: 1fr; } }
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\Dashboard.css" -ForegroundColor Gray

# src\pages\student\Dashboard.js
Set-Content -Path 'src\pages\student\Dashboard.js' -Value @'
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses, getSavedCourses, getDownloads } from "../../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user }                   = useAuth();
  const [courses, setCourses]       = useState([]);
  const [saved, setSaved]           = useState([]);
  const [downloads, setDownloads]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getMyCourses(), getSavedCourses(), getDownloads()])
      .then(([c, s, d]) => {
        setCourses(c.data.data || []);
        setSaved(s.data.data || []);
        setDownloads(d.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  const completed = courses.filter(c => (c.progress || 0) >= 100).length;
  const inProgress = courses.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100).length;

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
        <p>Continue your digital literacy learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid-4 db-stats">
        <div className="stat-card">
          <div className="stat-label">Enrolled Courses</div>
          <div className="stat-value">{courses.length}</div>
          <div className="stat-sub">Active enrollments</div>
          <div className="stat-icon">📚</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{inProgress}</div>
          <div className="stat-sub">Courses ongoing</div>
          <div className="stat-icon">🔄</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completed}</div>
          <div className="stat-sub">Courses finished</div>
          <div className="stat-icon">✅</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Saved</div>
          <div className="stat-value">{saved.length}</div>
          <div className="stat-sub">Bookmarked courses</div>
          <div className="stat-icon">🔖</div>
        </div>
      </div>

      <div className="db-main">
        {/* Continue Learning */}
        <div className="card db-card">
          <div className="db-card-hd">
            <h2 className="section-title" style={{ margin: 0 }}>Continue Learning</h2>
            <Link to="/my-courses" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {courses.length === 0
            ? <div className="empty-state">
                <h3>No courses yet</h3>
                <p style={{ marginBottom: 12 }}>Browse and enroll in a course to get started.</p>
                <Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
              </div>
            : courses.slice(0, 4).map(c => (
              <div className="course-row" key={c._id}>
                <div className="course-row-ico">📖</div>
                <div className="course-row-info">
                  <div className="course-row-title">{c.title}</div>
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div className="progress-bar-fill" style={{ width: `${c.progress || 0}%` }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>{c.progress || 0}%</span>
              </div>
            ))
          }
        </div>

        {/* Offline Downloads */}
        <div className="card db-card">
          <div className="db-card-hd">
            <h2 className="section-title" style={{ margin: 0 }}>Offline Downloads</h2>
            <Link to="/downloads" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {downloads.length === 0
            ? <div className="empty-state">
                <h3>No downloads yet</h3>
                <p>Download course resources for offline learning.</p>
              </div>
            : downloads.slice(0, 4).map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                  {d.type === "pdf" ? "📄" : d.type === "video" ? "🎬" : "📁"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{d.courseTitle} · {d.size || "—"}</div>
                </div>
                <span className="badge badge-green">Offline</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Categories Banner */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <h2 className="section-title">Course Categories</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Basic IT Skills", "Internet Safety", "Online Jobs", "Digital Payments", "Social Media", "E-Commerce"].map(cat => (
            <Link key={cat} to={`/courses?category=${cat}`}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 20 }}>
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\Dashboard.js" -ForegroundColor Gray

# src\pages\student\Downloads.js
Set-Content -Path 'src\pages\student\Downloads.js' -Value @'
import React, { useEffect, useState } from "react";
import { getDownloads } from "../../services/api";

export default function Downloads() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDownloads().then(r => setItems(r.data.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const typeIcon = t => t === "pdf" ? "📄" : t === "video" ? "🎬" : t === "slides" ? "📊" : "📁";
  const statusLabel = { done: "Available Offline", downloading: "Downloading...", queued: "Queued" };
  const statusColor = { done: "badge-green", downloading: "badge-blue", queued: "badge-gray" };

  if (loading) return <div className="loading-screen">Loading downloads...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Downloads</h1>
          <p>Course resources saved for offline learning.</p>
        </div>
        <span className="badge badge-green" style={{ fontSize: 13, padding: "6px 12px" }}>
          📶 {items.filter(i => i.status === "done").length} offline ready
        </span>
      </div>

      {items.length === 0
        ? <div className="card empty-state" style={{ padding: 60 }}>
            <h3>No downloads yet</h3>
            <p>Download resources from course pages for offline access.</p>
          </div>
        : <div className="card" style={{ padding: "0 24px" }}>
          {items.map((d, i) => (
            <div key={d._id || i} style={{ padding: "16px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: d.status === "done" ? "#DCFCE7" : "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                  {typeIcon(d.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{d.courseTitle} · {d.type?.toUpperCase()} · {d.size || "—"}</div>
                </div>
                <span className={`badge ${statusColor[d.status] || "badge-gray"}`}>{statusLabel[d.status] || d.status}</span>
                {d.status === "done" && (
                  <button className="btn btn-danger btn-sm">Remove</button>
                )}
                {d.status === "downloading" && (
                  <span style={{ fontWeight: 700, fontSize: 13, color: "var(--primary)" }}>{d.progress || 0}%</span>
                )}
              </div>
              {d.status === "downloading" && (
                <div className="progress-bar" style={{ marginTop: 10, marginLeft: 58 }}>
                  <div className="progress-bar-fill" style={{ width: `${d.progress || 0}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      }

      {/* Offline notice */}
      <div className="card" style={{ padding: "16px 20px", marginTop: 20, background: "var(--primary-light)", border: "1px solid #BFDBFE" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 24 }}>📶</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Offline Learning Mode</div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>Downloaded resources are available without internet. Progress syncs automatically when you reconnect.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\Downloads.js" -ForegroundColor Gray

# src\pages\student\LessonView.js
Set-Content -Path 'src\pages\student\LessonView.js' -Value @'
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, completeLesson, getLessons } from "../../services/api";

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const nav                    = useNavigate();
  const [lesson, setLesson]     = useState(null);
  const [lessons, setLessons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [completing, setCompleting] = useState(false);
  const [msg, setMsg]           = useState("");

  useEffect(() => {
    Promise.all([getLessonById(courseId, lessonId), getLessons(courseId)])
      .then(([l, all]) => {
        setLesson(l.data.data);
        setLessons(all.data.data || []);
      })
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  const complete = async () => {
    setCompleting(true);
    try {
      await completeLesson(courseId, lessonId);
      setMsg("Lesson completed! Progress saved. ✓");
      setLesson(prev => ({ ...prev, isCompleted: true }));
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("Could not mark as complete."); }
    finally { setCompleting(false); }
  };

  const currentIndex = lessons.findIndex(l => l._id === lessonId);
  const prevLesson   = lessons[currentIndex - 1];
  const nextLesson   = lessons[currentIndex + 1];

  if (loading) return <div className="loading-screen">Loading lesson...</div>;
  if (!lesson) return <div className="loading-screen">Lesson not found.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Nav bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => nav(`/courses/${courseId}`)}>← Back to Course</button>
        <span style={{ fontSize: 13, color: "var(--text3)" }}>Lesson {currentIndex + 1} of {lessons.length}</span>
      </div>

      {msg && (
        <div style={{ padding: "10px 16px", background: "#DCFCE7", color: "#15803D", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>{msg}</div>
      )}

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: 24, height: 8 }}>
        <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }} />
      </div>

      {/* Lesson content */}
      <div className="card" style={{ padding: "32px 36px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
              Lesson {currentIndex + 1}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{lesson.title}</h1>
          </div>
          {lesson.isCompleted && (
            <span className="badge badge-green" style={{ fontSize: 13, padding: "6px 14px" }}>✓ Completed</span>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 24, fontSize: 13, color: "var(--text3)" }}>
          {lesson.duration && <span>🕐 {lesson.duration}</span>}
          {lesson.type && <span>📋 {lesson.type}</span>}
        </div>

        {/* Video */}
        {lesson.videoUrl && (
          <div style={{ marginBottom: 24, borderRadius: 10, overflow: "hidden", background: "#000", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <video controls style={{ width: "100%", maxHeight: 400 }} src={lesson.videoUrl}>
              Your browser does not support video.
            </video>
          </div>
        )}

        {/* Content */}
        <div style={{ fontSize: 15, lineHeight: 1.9, color: "var(--text2)" }}>
          {lesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, "<br/>") }} />
          ) : (
            <p style={{ color: "var(--text3)" }}>No content available for this lesson.</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <button className="btn btn-secondary" disabled={!prevLesson}
          onClick={() => nav(`/courses/${courseId}/lessons/${prevLesson._id}`)}>
          ← Previous
        </button>

        {!lesson.isCompleted && (
          <button className="btn btn-success" onClick={complete} disabled={completing} style={{ flex: 1, maxWidth: 220 }}>
            {completing ? "Saving..." : "✓ Mark as Complete"}
          </button>
        )}

        {lesson.isCompleted && (
          <span style={{ flex: 1, textAlign: "center", fontSize: 13, color: "var(--success)", fontWeight: 600 }}>✓ Lesson Completed</span>
        )}

        <button className="btn btn-primary" disabled={!nextLesson}
          onClick={() => nav(`/courses/${courseId}/lessons/${nextLesson._id}`)}>
          Next →
        </button>
      </div>

      {/* Lesson list sidebar */}
      <div className="card" style={{ marginTop: 24, padding: "20px 24px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>All Lessons</h3>
        {lessons.map((l, i) => (
          <div key={l._id}
            onClick={() => nav(`/courses/${courseId}/lessons/${l._id}`)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: l._id === lessonId ? "var(--primary-light)" : "transparent", marginBottom: 4, transition: "background .12s" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: l.isCompleted ? "#DCFCE7" : l._id === lessonId ? "var(--primary)" : "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: l.isCompleted ? "#15803D" : l._id === lessonId ? "#fff" : "var(--text3)", flexShrink: 0 }}>
              {l.isCompleted ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: l._id === lessonId ? 600 : 400, color: l._id === lessonId ? "var(--primary)" : "var(--text)" }}>{l.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\LessonView.js" -ForegroundColor Gray

# src\pages\student\MyCourses.js
Set-Content -Path 'src\pages\student\MyCourses.js' -Value @'
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyCourses } from "../../services/api";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const nav                   = useNavigate();

  useEffect(() => {
    getMyCourses().then(r => setCourses(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    if (filter === "in_progress") return (c.progress || 0) > 0 && (c.progress || 0) < 100;
    if (filter === "completed")   return (c.progress || 0) >= 100;
    if (filter === "not_started") return (c.progress || 0) === 0;
    return true;
  });

  if (loading) return <div className="loading-screen">Loading your courses...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>My Courses</h1>
        <p>Continue where you left off.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "All"], ["not_started", "Not Started"], ["in_progress", "In Progress"], ["completed", "Completed"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`btn btn-sm ${filter === val ? "btn-primary" : "btn-secondary"}`}>
            {label} ({val === "all" ? courses.length : courses.filter(c => val === "in_progress" ? (c.progress||0)>0&&(c.progress||0)<100 : val==="completed" ? (c.progress||0)>=100 : (c.progress||0)===0).length})
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="card empty-state" style={{ padding: 60 }}>
            <h3>No courses here</h3>
            <Link to="/courses" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Courses</Link>
          </div>
        : <div className="grid-2">
          {filtered.map(c => (
            <div className="card" key={c._id} style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
                  📖
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.title}</h3>
                    <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 14 }}>{c.progress || 0}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <span className="badge badge-blue">{c.category}</span>
                    <span className={`badge ${(c.progress||0)>=100?"badge-green":(c.progress||0)>0?"badge-yellow":"badge-gray"}`}>
                      {(c.progress||0)>=100?"Completed":(c.progress||0)>0?"In Progress":"Not Started"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="progress-bar" style={{ marginTop: 12, marginBottom: 14 }}>
                <div className="progress-bar-fill" style={{ width: `${c.progress || 0}%` }} />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => nav(`/courses/${c._id}`)}>
                  {(c.progress||0) > 0 ? "▶ Continue" : "▶ Start Learning"}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => nav(`/courses/${c._id}`)}>Details</button>
              </div>

              {c.nextLesson && (
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--text3)" }}>
                  Next: {c.nextLesson}
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\MyCourses.js" -ForegroundColor Gray

# src\pages\student\SavedResources.js
Set-Content -Path 'src\pages\student\SavedResources.js' -Value @'
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedCourses, unsaveCourse } from "../../services/api";

export default function SavedResources() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState("");
  const nav                   = useNavigate();

  useEffect(() => {
    getSavedCourses().then(r => setItems(r.data.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const unsave = async (id) => {
    try {
      await unsaveCourse(id);
      setItems(prev => prev.filter(i => i._id !== id));
      setMsg("Removed from saved."); setTimeout(() => setMsg(""), 2000);
    } catch { setMsg("Could not remove."); }
  };

  if (loading) return <div className="loading-screen">Loading saved courses...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Saved Courses</h1>
        <p>Your bookmarked courses and learning materials.</p>
      </div>

      {msg && <div style={{ padding: "10px 16px", background: "#FEF9C3", color: "#A16207", borderRadius: 8, marginBottom: 16, fontWeight: 600 }}>{msg}</div>}

      {items.length === 0
        ? <div className="card empty-state" style={{ padding: 60 }}>
            <h3>No saved courses yet</h3>
            <p style={{ marginBottom: 12 }}>Bookmark courses while browsing to find them here.</p>
            <button className="btn btn-primary btn-sm" onClick={() => nav("/courses")}>Browse Courses</button>
          </div>
        : <div className="card" style={{ padding: "0 24px" }}>
          {items.map((item, i) => (
            <div key={item._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📚</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{item.category} · {item.level || "Beginner"} · {item.lessonCount || 0} lessons</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => nav(`/courses/${item._id}`)}>View</button>
                <button className="btn btn-secondary btn-sm" onClick={() => nav(`/courses/${item._id}`)}>Enroll</button>
                <button className="btn btn-danger btn-sm" onClick={() => unsave(item._id)} title="Remove from saved">✕</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
'@ -Encoding UTF8
Write-Host "  wrote src\pages\student\SavedResources.js" -ForegroundColor Gray

# src\services\api.js
Set-Content -Path 'src\services\api.js' -Value @'
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use(req => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

// ── AUTH
export const loginUser    = d => API.post("/auth/login", d);
export const registerUser = d => API.post("/auth/register", d);

// ── COMPONENT 1: COURSES
export const getAllCourses      = ()        => API.get("/courses");
export const getCourseById      = id        => API.get(`/courses/${id}`);
export const getMyCourses       = ()        => API.get("/courses/my");
export const enrollCourse       = id        => API.post(`/courses/${id}/enroll`);
export const createCourse       = d         => API.post("/courses", d);
export const updateCourse       = (id, d)   => API.put(`/courses/${id}`, d);
export const deleteCourse       = id        => API.delete(`/courses/${id}`);
export const publishCourse      = id        => API.put(`/courses/${id}/publish`);
export const unpublishCourse    = id        => API.put(`/courses/${id}/unpublish`);

// ── COMPONENT 1: LESSONS
export const getLessons         = cid       => API.get(`/courses/${cid}/lessons`);
export const getLessonById      = (cid, id) => API.get(`/courses/${cid}/lessons/${id}`);
export const createLesson       = (cid, d)  => API.post(`/courses/${cid}/lessons`, d);
export const updateLesson       = (cid, id, d) => API.put(`/courses/${cid}/lessons/${id}`, d);
export const deleteLesson       = (cid, id) => API.delete(`/courses/${cid}/lessons/${id}`);
export const completeLesson     = (cid, id) => API.post(`/courses/${cid}/lessons/${id}/complete`);

// ── COMPONENT 1: RESOURCES
export const getResources       = cid       => API.get(`/courses/${cid}/resources`);
export const createResource     = (cid, d)  => API.post(`/courses/${cid}/resources`, d);
export const updateResource     = (cid, id, d) => API.put(`/courses/${cid}/resources/${id}`, d);
export const deleteResource     = (cid, id) => API.delete(`/courses/${cid}/resources/${id}`);
export const downloadResource   = (cid, id) => API.post(`/courses/${cid}/resources/${id}/download`);

// ── COMPONENT 1: SAVED & PROGRESS
export const getSavedCourses    = ()        => API.get("/courses/saved");
export const saveCourse         = id        => API.post(`/courses/${id}/save`);
export const unsaveCourse       = id        => API.delete(`/courses/${id}/save`);
export const getProgress        = cid       => API.get(`/courses/${cid}/progress`);
export const updateProgress     = (cid, d)  => API.put(`/courses/${cid}/progress`, d);
export const getDownloads       = ()        => API.get("/courses/downloads");

export default API;
'@ -Encoding UTF8
Write-Host "  wrote src\services\api.js" -ForegroundColor Gray

Write-Host ""
Write-Host "All 26 files written!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "App runs at: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend must run at: http://localhost:5000" -ForegroundColor Yellow