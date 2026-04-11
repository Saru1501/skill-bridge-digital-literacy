# SkillBridge Frontend Setup Script - ALL JSX FILES
Write-Host 'Setting up SkillBridge Frontend...' -ForegroundColor Cyan

# Create folders
$folders = @(
  "public"
  "src"
  "src\components\layout"
  "src\components\ui"
  "src\context"
  "src\pages"
  "src\pages\admin"
  "src\pages\student"
  "src\services"
)
foreach ($f in $folders) { New-Item -ItemType Directory -Force -Path $f | Out-Null }
Write-Host 'Folders created' -ForegroundColor Green

Set-Content -Path 'package.json' -Encoding UTF8 -Value @'
{
  "name": "skillbridge-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
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
'@
Write-Host '  wrote package.json'

Set-Content -Path 'public\index.html' -Encoding UTF8 -Value @'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SkillBridge - Digital Literacy Platform</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
'@
Write-Host '  wrote public\index.html'

Set-Content -Path 'src\index.jsx' -Encoding UTF8 -Value @'
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
'@
Write-Host '  wrote src\index.jsx'

Set-Content -Path 'src\index.css' -Encoding UTF8 -Value @'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Inter",sans-serif;background:#F1F5F9;color:#0F172A;font-size:14px}
.loading-text{color:#64748B;padding:40px;text-align:center;font-size:16px}
.loading{display:flex;align-items:center;justify-content:center;height:100vh;font-size:18px;color:#64748B}
.flash{padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:14px;background:#F0FDF4;border:1px solid #BBF7D0;color:#15803D}
.empty-state{text-align:center;padding:60px 20px;background:#fff;border-radius:12px}
.empty-state span{font-size:48px;display:block;margin-bottom:12px}
.empty-state p{color:#64748B;margin-bottom:20px}
.btn-primary{background:#2563EB;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;border:none;cursor:pointer;transition:background .2s}
.btn-primary:hover{background:#1D4ED8}
.btn-outline{background:#fff;color:#2563EB;padding:10px 20px;border-radius:8px;border:1.5px solid #2563EB;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-outline:hover{background:#EFF6FF}
.btn-sm{background:#F1F5F9;color:#475569;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:500;display:inline-block;border:none;cursor:pointer;transition:background .2s;white-space:nowrap}
.btn-sm:hover{background:#E2E8F0}
.btn-sm.yellow{background:#FEF3C7;color:#92400E}
.btn-sm.yellow:hover{background:#FDE68A}
.btn-sm.red{background:#FEF2F2;color:#DC2626}
.btn-sm.red:hover{background:#FEE2E2}
.btn-danger-sm{background:#FEF2F2;color:#DC2626;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;border:none;cursor:pointer}
.badge{background:#DBEAFE;color:#1D4ED8;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.level-badge{background:#F0FDF4;color:#15803D;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.done-badge{color:#15803D;font-size:13px;font-weight:600}
.locked{color:#94A3B8;font-size:18px}
.progress-bar-wrap{height:6px;background:#E2E8F0;border-radius:3px;margin:8px 0 4px;overflow:hidden}
.progress-bar{height:100%;background:#2563EB;border-radius:3px;transition:width .3s}
.progress-text{font-size:12px;color:#64748B}
.course-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.course-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);transition:transform .2s,box-shadow .2s}
.course-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.1)}
.course-thumb{height:80px;background:linear-gradient(135deg,#2563EB,#7C3AED);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:700}
.course-info{padding:16px}
.course-info h4{font-size:15px;font-weight:600;margin-bottom:8px;line-height:1.4}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.save-btn{background:none;border:none;cursor:pointer;font-size:18px;padding:0;flex-shrink:0}
.desc{color:#64748B;font-size:13px;margin:8px 0;line-height:1.5}
.meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0;font-size:12px;color:#64748B}
.card-actions{display:flex;gap:8px;margin-top:12px;align-items:center}
.lessons{color:#64748B;font-size:12px}
.filters{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}
.search-input{flex:1;min-width:200px;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none}
.search-input:focus{border-color:#2563EB}
.filters select{padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;background:#fff}
.filter-tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.filter-tab{padding:8px 16px;border:1.5px solid #E2E8F0;border-radius:20px;background:#fff;cursor:pointer;font-size:13px;font-weight:500;color:#475569;transition:all .2s}
.filter-tab.active{background:#2563EB;color:#fff;border-color:#2563EB}
.course-list{display:flex;flex-direction:column;gap:12px}
.course-row{background:#fff;border-radius:12px;padding:16px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.course-icon{width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#2563EB,#7C3AED);display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;font-weight:700;flex-shrink:0}
.course-actions{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.status-dot{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:#F1F5F9;color:#475569;text-transform:capitalize;white-space:nowrap}
.manage-page{max-width:1100px}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:16px}
.admin-table-wrap{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th{background:#F8FAFC;padding:12px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #E2E8F0}
.admin-table td{padding:12px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;vertical-align:middle}
.admin-table tr:last-child td{border-bottom:none}
.admin-table tr:hover td{background:#FAFAFA}
.action-cell{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.status-chip{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
.status-chip.pub{background:#DCFCE7;color:#15803D}
.status-chip.draft{background:#FEF9C3;color:#854D0E}
.quick-actions{margin-bottom:32px}
.quick-actions h3{font-size:18px;font-weight:600;margin-bottom:12px}
.action-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.action-card{background:#fff;border-radius:12px;padding:24px;text-align:center;text-decoration:none;color:#1E293B;box-shadow:0 1px 4px rgba(0,0,0,.06);transition:all .2s}
.action-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1);color:#2563EB}
.action-card span{font-size:36px;display:block;margin-bottom:8px}
.action-card p{font-size:14px;font-weight:600}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px}
.modal{background:#fff;border-radius:16px;padding:28px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto}
.modal h3{font-size:18px;font-weight:700;margin-bottom:20px}
.modal-form{display:flex;flex-direction:column;gap:16px}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:8px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group label{font-size:13px;font-weight:600;color:#374151}
.form-group input,.form-group select,.form-group textarea{padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;font-family:inherit}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.checkbox-group label{display:flex;align-items:center;font-size:14px;font-weight:400;color:#374151;cursor:pointer}
.course-detail{max-width:900px}
.detail-header{background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.detail-hero{display:flex;gap:20px;margin-bottom:20px}
.category-icon{font-size:48px;flex-shrink:0}
.detail-hero h2{font-size:22px;font-weight:700;margin-bottom:8px}
.enroll-box{padding-top:8px}
.lessons-section{background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.lessons-section h3{font-size:16px;font-weight:600;margin-bottom:16px}
.lesson-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #F1F5F9}
.lesson-row:last-child{border-bottom:none}
.lesson-num{width:28px;height:28px;border-radius:50%;background:#DBEAFE;color:#1D4ED8;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.lesson-info{flex:1}
.lesson-info h4{font-size:14px;font-weight:600;margin-bottom:2px}
.lesson-info p{font-size:12px;color:#64748B}
.lesson-right{display:flex;align-items:center;gap:8px}
.res-count{font-size:11px;color:#64748B}
.lesson-view{max-width:1100px}
.lesson-breadcrumb{margin-bottom:16px;font-size:14px}
.lesson-layout{display:grid;grid-template-columns:220px 1fr;gap:20px}
.lesson-sidebar{background:#fff;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);height:fit-content}
.lesson-sidebar h4{font-size:14px;font-weight:600;margin-bottom:12px;color:#64748B}
.lesson-item{display:flex;align-items:flex-start;gap:8px;padding:8px;border-radius:8px;cursor:pointer;font-size:13px;transition:background .2s}
.lesson-item:hover{background:#F1F5F9}
.lesson-item.active{background:#DBEAFE;color:#1D4ED8;font-weight:600}
.lesson-main{background:#fff;border-radius:12px;padding:28px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.lesson-main h2{font-size:22px;font-weight:700;margin-bottom:8px}
.lesson-desc{color:#64748B;font-size:15px;margin-bottom:20px;line-height:1.6}
.lesson-content{background:#F8FAFC;border-radius:8px;padding:20px;margin-bottom:24px;min-height:100px}
.content-body{font-size:15px;line-height:1.8;white-space:pre-wrap;color:#374151}
.resources-section{border-top:1px solid #E2E8F0;padding-top:20px;margin-bottom:24px}
.resources-section h3{font-size:15px;font-weight:600;margin-bottom:12px}
.resource-row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#F8FAFC;border-radius:8px;margin-bottom:8px;font-size:14px}
.lesson-actions{display:flex;gap:10px;align-items:center;padding-top:16px;border-top:1px solid #E2E8F0}
.upload-card{background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.upload-card h3{font-size:16px;font-weight:600;margin-bottom:4px}
.upload-form{display:flex;flex-direction:column;gap:14px;margin-top:16px}
.download-list{display:flex;flex-direction:column;gap:10px}
.download-row{background:#fff;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.dl-icon{font-size:28px;flex-shrink:0}
.dl-info{flex:1}
.dl-info strong{font-size:14px}
.dl-info p{font-size:12px;color:#64748B;margin-top:2px}
.dl-meta{display:flex;align-items:center;gap:8px}
.stat-card.purple{border-left:4px solid #7C3AED}
.page-title{font-size:24px;font-weight:700;color:#1E293B;margin-bottom:24px}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.stat-card{background:#fff;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.stat-icon{font-size:32px}
.stat-info{display:flex;flex-direction:column}
.stat-num{font-size:28px;font-weight:700;color:#1E293B}
.stat-label{font-size:13px;color:#64748B}
.stat-card.blue{border-left:4px solid #2563EB}
.stat-card.green{border-left:4px solid #22C55E}
.stat-card.orange{border-left:4px solid #F59E0B}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.section-header h3{font-size:18px;font-weight:600;color:#1E293B}
.view-all{color:#2563EB;font-size:14px;text-decoration:none}
.view-all:hover{text-decoration:underline}
'@
Write-Host '  wrote src\index.css'

Set-Content -Path 'src\App.jsx' -Encoding UTF8 -Value @'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/student/Dashboard";
import BrowseCourses from "./pages/student/BrowseCourses";
import CourseDetail from "./pages/student/CourseDetail";
import MyCourses from "./pages/student/MyCourses";
import LessonView from "./pages/student/LessonView";
import SavedResources from "./pages/student/SavedResources";
import Downloads from "./pages/student/Downloads";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageLessons from "./pages/admin/ManageLessons";
import ManageResources from "./pages/admin/ManageResources";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/browse"     element={<BrowseCourses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/lesson/:id" element={<LessonView />} />
            <Route path="/saved"      element={<SavedResources />} />
            <Route path="/downloads"  element={<Downloads />} />
          </Route>
          <Route element={<ProtectedRoute adminOnly><AppLayout /></ProtectedRoute>}>
            <Route path="/admin"                                 element={<AdminDashboard />} />
            <Route path="/admin/courses"                         element={<ManageCourses />} />
            <Route path="/admin/courses/:courseId/lessons"       element={<ManageLessons />} />
            <Route path="/admin/lessons/:lessonId/resources"     element={<ManageResources />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
'@
Write-Host '  wrote src\App.jsx'

Set-Content -Path 'src\context\AuthContext.jsx' -Encoding UTF8 -Value @'
import React, { createContext, useContext, useState, useEffect } from "react";
import { authLogin, authRegister } from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t && u && u !== "undefined" && u !== "null") {
        const parsed = JSON.parse(u);
        setToken(t); setUser(parsed);
        axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      }
    } catch {
      localStorage.removeItem("token"); localStorage.removeItem("user");
    } finally { setLoading(false); }
  }, []);

  const persist = (t, u) => {
    setToken(t); setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  };

  const login = async (email, password) => {
    const res = await authLogin(email, password);
    persist(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, role = "student") => {
    const res = await authRegister(name, email, password, role);
    persist(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("token"); localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const role     = user?.role?.toLowerCase();
  const isAdmin  = role === "admin" || role === "university";
  const isStudent = role === "student";
  const isNGO    = role === "ngo";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isStudent, isNGO }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
'@
Write-Host '  wrote src\context\AuthContext.jsx'

Set-Content -Path 'src\services\api.js' -Encoding UTF8 -Value @'
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authLogin    = (email, password) => api.post("/auth/login", { email, password });
export const authRegister = (name, email, password, role) => api.post("/auth/register", { name, email, password, role });
export const authMe       = () => api.get("/auth/me");
export const getCourses       = (params) => api.get("/courses", { params });
export const getCourseById    = (id)     => api.get(`/courses/${id}`);
export const createCourse     = (data)   => api.post("/courses", data);
export const updateCourse     = (id, d)  => api.put(`/courses/${id}`, d);
export const deleteCourse     = (id)     => api.delete(`/courses/${id}`);
export const togglePublish    = (id)     => api.patch(`/courses/${id}/publish`);
export const getLessons       = (courseId)     => api.get(`/courses/${courseId}/lessons`);
export const getLessonById    = (id)           => api.get(`/lessons/${id}`);
export const addLesson        = (courseId, d)  => api.post(`/courses/${courseId}/lessons`, d);
export const updateLesson     = (id, d)        => api.put(`/lessons/${id}`, d);
export const deleteLesson     = (id)           => api.delete(`/lessons/${id}`);
export const uploadResource   = (lessonId, fd) => api.post(`/lessons/${lessonId}/resources`, fd, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteResource   = (lessonId, rid)=> api.delete(`/lessons/${lessonId}/resources/${rid}`);
export const enrollCourse         = (courseId) => api.post(`/enrollments/${courseId}`);
export const getMyEnrollments     = ()         => api.get("/enrollments/my");
export const checkEnrollment      = (courseId) => api.get(`/enrollments/${courseId}/status`);
export const getCourseEnrollments = (courseId) => api.get(`/enrollments/course/${courseId}`);
export const markLessonComplete = (courseId, lessonId) => api.patch(`/progress/${courseId}/lessons/${lessonId}`);
export const getCourseProgress  = (courseId)           => api.get(`/progress/${courseId}`);
export const trackDownload      = (courseId, url)      => api.post(`/progress/${courseId}/download`, { resourceUrl: url });
export const syncOffline        = (courseId, lessons)  => api.post(`/progress/${courseId}/sync`, { completedLessons: lessons });
export const toggleSave  = (courseId) => api.post(`/saved/${courseId}`);
export const getMySaved  = ()         => api.get("/saved");
export default api;
'@
Write-Host '  wrote src\services\api.js'

Set-Content -Path 'src\components\ui\ProtectedRoute.jsx' -Encoding UTF8 -Value @'
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  const role = user.role?.toLowerCase();
  if (adminOnly && role !== "admin" && role !== "university")
    return <Navigate to="/dashboard" replace />;
  return children;
};
export default ProtectedRoute;
'@
Write-Host '  wrote src\components\ui\ProtectedRoute.jsx'

Set-Content -Path 'src\components\layout\Sidebar.jsx' -Encoding UTF8 -Value @'
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { isAdmin, logout } = useAuth();
  const studentLinks = [
    { to: "/dashboard",  label: "Dashboard",     icon: "🏠" },
    { to: "/browse",     label: "Browse Courses", icon: "🔍" },
    { to: "/my-courses", label: "My Courses",     icon: "📚" },
    { to: "/saved",      label: "Saved Courses",  icon: "🔖" },
    { to: "/downloads",  label: "Downloads",      icon: "⬇️" },
  ];
  const adminLinks = [
    { to: "/admin",           label: "Dashboard",        icon: "🏠" },
    { to: "/admin/courses",   label: "Manage Courses",   icon: "📘" },
  ];
  const links = isAdmin ? adminLinks : studentLinks;
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">SB</span>
        <span className="logo-text">SkillBridge</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout-btn" onClick={logout}>🚪 Logout</button>
    </aside>
  );
};
export default Sidebar;
'@
Write-Host '  wrote src\components\layout\Sidebar.jsx'

Set-Content -Path 'src\components\layout\Sidebar.css' -Encoding UTF8 -Value @'
.sidebar{width:240px;min-height:100vh;background:#1E293B;display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100}
.sidebar-logo{display:flex;align-items:center;gap:10px;padding:20px 16px;border-bottom:1px solid #334155}
.logo-mark{width:36px;height:36px;background:#2563EB;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;letter-spacing:.5px;flex-shrink:0}
.logo-text{color:#fff;font-weight:700;font-size:17px}
.sidebar-nav{flex:1;padding:16px 8px;display:flex;flex-direction:column;gap:4px}
.nav-link{display:flex;align-items:center;gap:10px;padding:10px 12px;color:#94A3B8;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;transition:all .2s}
.nav-link:hover{background:#334155;color:#fff}
.nav-link.active{background:#2563EB;color:#fff}
.nav-icon{font-size:18px;width:24px;text-align:center}
.logout-btn{margin:16px;padding:10px;background:#EF4444;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;transition:background .2s}
.logout-btn:hover{background:#DC2626}
'@
Write-Host '  wrote src\components\layout\Sidebar.css'

Set-Content -Path 'src\components\layout\AppLayout.jsx' -Encoding UTF8 -Value @'
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import "./AppLayout.css";

const AppLayout = () => {
  const { user } = useAuth();
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <span className="welcome">Welcome, <strong>{user?.name}</strong></span>
          <span className="role-badge">{user?.role}</span>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
};
export default AppLayout;
'@
Write-Host '  wrote src\components\layout\AppLayout.jsx'

Set-Content -Path 'src\components\layout\AppLayout.css' -Encoding UTF8 -Value @'
.app-layout{display:flex;min-height:100vh}
.main-content{margin-left:240px;flex:1;display:flex;flex-direction:column;background:#F1F5F9}
.topbar{background:#fff;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E2E8F0;position:sticky;top:0;z-index:50}
.welcome{color:#475569;font-size:14px}.welcome strong{color:#1E293B}
.role-badge{background:#DBEAFE;color:#1D4ED8;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:capitalize}
.page-content{padding:24px;flex:1}
'@
Write-Host '  wrote src\components\layout\AppLayout.css'

Set-Content -Path 'src\pages\Login.jsx' -Encoding UTF8 -Value @'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const ROLES = [
  { value: "student",    label: "Student" },
  { value: "university", label: "University" },
  { value: "ngo",        label: "NGO" },
  { value: "admin",      label: "Admin" },
];

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState({ name: "", email: "", password: "", role: "student" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      let user;
      if (mode === "login") {
        user = await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError("Full name is required"); setLoading(false); return; }
        user = await register(form.name, form.email, form.password, form.role);
      }
      const role = user.role?.toLowerCase();
      navigate(role === "admin" || role === "university" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Check backend is running.");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">SB</div>
          <h1>SkillBridge</h1>
          <p>Digital Literacy for Rural Youth</p>
        </div>

        <div className="login-tabs">
          <button className={mode === "login"    ? "active" : ""} onClick={() => { setMode("login");    setError(""); }}>Login</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Register</button>
        </div>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={submit} className="login-form">
          {mode === "register" && (
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Enter your full name" required />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 6 characters" required minLength={6} />
          </div>
          {mode === "register" && (
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handle}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          )}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="login-footer">
          <strong>Roles:</strong> student · university · ngo · admin
        </div>
      </div>
    </div>
  );
};
export default Login;
'@
Write-Host '  wrote src\pages\Login.jsx'

Set-Content -Path 'src\pages\Login.css' -Encoding UTF8 -Value @'
:root{--primary:#2563EB;--surface:#FFFFFF;--surface2:#F1F5F9;--text:#0F172A;--text2:#475569;--text3:#94A3B8;--shadow:0 1px 4px rgba(0,0,0,0.08)}
.login-page{min-height:100vh;background:linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 50%,#EFF6FF 100%);display:flex;align-items:center;justify-content:center;padding:20px}
.login-card{background:var(--surface);border-radius:16px;box-shadow:0 20px 60px rgba(37,99,235,.15);padding:40px 36px;width:100%;max-width:420px}
.login-brand{text-align:center;margin-bottom:28px}
.login-logo{width:60px;height:60px;border-radius:16px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;margin:0 auto 14px;letter-spacing:1px}
.login-brand h1{font-size:24px;font-weight:800;color:var(--text);margin-bottom:4px}
.login-brand p{font-size:13px;color:var(--text3)}
.login-tabs{display:flex;background:var(--surface2);border-radius:10px;padding:3px;margin-bottom:24px}
.login-tabs button{flex:1;padding:9px;border:none;background:none;border-radius:8px;font-size:14px;font-weight:600;color:var(--text2);cursor:pointer;transition:all .15s}
.login-tabs button.active{background:var(--surface);color:var(--primary);box-shadow:var(--shadow)}
.login-error{background:#FEE2E2;color:#B91C1C;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:16px;font-weight:500}
.login-form{display:flex;flex-direction:column;gap:16px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group label{font-size:13px;font-weight:600;color:var(--text2)}
.form-group input,.form-group select{padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:14px;outline:none;color:var(--text);background:#fff;transition:border .2s,box-shadow .2s;width:100%}
.form-group input:focus,.form-group select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.submit-btn{padding:12px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s,transform .1s;margin-top:4px;width:100%}
.submit-btn:hover:not(:disabled){background:#1D4ED8;transform:translateY(-1px)}
.submit-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
.login-footer{text-align:center;margin-top:20px;padding:12px 14px;background:var(--surface2);border-radius:8px;font-size:12px;color:var(--text3)}
.login-footer strong{color:var(--text2)}
'@
Write-Host '  wrote src\pages\Login.css'

Set-Content -Path 'src\pages\student\Dashboard.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyEnrollments, getCourseProgress } from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progresses, setProgresses]   = useState({});
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyEnrollments();
        const enrList = res.data.data || [];
        setEnrollments(enrList);
        const prog = {};
        await Promise.all(enrList.map(async (e) => {
          try {
            const r = await getCourseProgress(e.course._id);
            prog[e.course._id] = r.data.data;
          } catch { prog[e.course._id] = null; }
        }));
        setProgresses(prog);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const completed  = enrollments.filter(e => e.completionStatus === "completed").length;
  const inProgress = enrollments.filter(e => e.completionStatus === "in_progress").length;

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h2 className="page-title">Welcome back, {user?.name}! 👋</h2>

      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-icon">📚</div><div className="stat-info"><span className="stat-num">{enrollments.length}</span><span className="stat-label">Enrolled Courses</span></div></div>
        <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-info"><span className="stat-num">{completed}</span><span className="stat-label">Completed</span></div></div>
        <div className="stat-card orange"><div className="stat-icon">⏳</div><div className="stat-info"><span className="stat-num">{inProgress}</span><span className="stat-label">In Progress</span></div></div>
      </div>

      <div className="section-header">
        <h3>Continue Learning</h3>
        <Link to="/browse" className="view-all">Browse More Courses →</Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <span>📖</span>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/browse" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="course-grid">
          {enrollments.slice(0,4).map(e => {
            const course = e.course;
            const prog   = progresses[course._id];
            const pct    = prog?.completionPercentage ?? 0;
            return (
              <div className="course-card" key={e._id}>
                <div className="course-thumb">{course.category?.charAt(0) || "📘"}</div>
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <span className="badge">{course.category}</span>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" style={{ width: pct + "%" }} />
                  </div>
                  <p className="progress-text">{pct}% complete</p>
                  <Link to={`/course/${course._id}`} className="btn-sm">Continue →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

'@
Write-Host '  wrote src\pages\student\Dashboard.jsx'

Set-Content -Path 'src\pages\student\Dashboard.css' -Encoding UTF8 -Value @'
.dashboard{max-width:1100px}
.page-title{font-size:24px;font-weight:700;color:#1e293b;margin-bottom:24px}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
.stat-card{background:#fff;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.stat-icon{font-size:32px}
.stat-info{display:flex;flex-direction:column}
.stat-num{font-size:28px;font-weight:700;color:#1e293b}
.stat-label{font-size:13px;color:#64748b}
.stat-card.blue{border-left:4px solid #3b82f6}
.stat-card.green{border-left:4px solid #22c55e}
.stat-card.orange{border-left:4px solid #f59e0b}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.section-header h3{font-size:18px;font-weight:600;color:#1e293b}
.view-all{color:#3b82f6;font-size:14px;text-decoration:none}
.view-all:hover{text-decoration:underline}
.empty-state{text-align:center;padding:60px 20px;background:#fff;border-radius:12px}
.empty-state span{font-size:48px}
.empty-state p{margin:12px 0 20px;color:#64748b}
.course-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.course-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);transition:transform .2s}
.course-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.1)}
.course-thumb{height:80px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:36px;color:#fff}
.course-info{padding:16px}
.course-info h4{font-size:15px;font-weight:600;color:#1e293b;margin-bottom:8px}
.badge{background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.progress-bar-wrap{height:6px;background:#e2e8f0;border-radius:3px;margin:10px 0 4px;overflow:hidden}
.progress-bar{height:100%;background:#3b82f6;border-radius:3px;transition:width .3s}
.progress-text{font-size:12px;color:#64748b;margin-bottom:12px}
.btn-primary{background:#3b82f6;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;border:none;cursor:pointer}
.btn-primary:hover{background:#2563eb}
.btn-sm{background:#f0f9ff;color:#0284c7;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;display:inline-block;border:none;cursor:pointer}
.btn-sm:hover{background:#e0f2fe}

'@
Write-Host '  wrote src\pages\student\Dashboard.css'

Set-Content -Path 'src\pages\student\BrowseCourses.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCourses, enrollCourse, toggleSave, getMySaved } from "../../services/api";

const CATEGORIES = ["", "Basic IT", "Internet Safety", "Online Jobs", "Digital Payments", "Digital Tools"];
const LEVELS     = ["", "beginner", "intermediate", "advanced"];

const BrowseCourses = () => {
  const [courses,  setCourses]  = useState([]);
  const [saved,    setSaved]    = useState([]);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [level,    setLevel]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (category) params.category = category;
      if (level)    params.level    = level;
      const [cRes, sRes] = await Promise.all([getCourses(params), getMySaved()]);
      setCourses(cRes.data.data || []);
      setSaved((sRes.data.data || []).map(s => s.course._id));
    } catch { setCourses([]); }
    setLoading(false);
  }, [search, category, level]);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);
      setMsg("✅ Enrolled successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) { setMsg("⚠️ " + (err?.response?.data?.message || "Error")); setTimeout(() => setMsg(""), 3000); }
  };

  const handleSave = async (courseId) => {
    try {
      const res = await toggleSave(courseId);
      if (res.data.isSaved) setSaved(s => [...s, courseId]);
      else                   setSaved(s => s.filter(id => id !== courseId));
    } catch {}
  };

  return (
    <div className="browse">
      <h2 className="page-title">Browse Courses 🔍</h2>
      {msg && <div className="flash">{msg}</div>}

      <div className="filters">
        <input className="search-input" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
        <select value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l || "All Levels"}</option>)}
        </select>
      </div>

      {loading ? <p className="loading-text">Loading courses...</p> : (
        courses.length === 0 ? <div className="empty-state"><span>📭</span><p>No courses found</p></div> :
        <div className="course-grid">
          {courses.map(c => (
            <div className="course-card" key={c._id}>
              <div className="course-thumb">{c.category?.charAt(0) || "📘"}</div>
              <div className="course-info">
                <div className="card-top">
                  <h4>{c.title}</h4>
                  <button className="save-btn" onClick={() => handleSave(c._id)} title={saved.includes(c._id) ? "Unsave" : "Save"}>
                    {saved.includes(c._id) ? "🔖" : "📌"}
                  </button>
                </div>
                <p className="desc">{c.description?.substring(0,80)}...</p>
                <div className="meta">
                  <span className="badge">{c.category}</span>
                  <span className="level-badge">{c.level}</span>
                  <span className="lessons">📖 {c.totalLessons} lessons</span>
                </div>
                <div className="card-actions">
                  <Link to={`/course/${c._id}`} className="btn-sm">View Details</Link>
                  <button className="btn-primary" onClick={() => handleEnroll(c._id)}>Enroll</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;

'@
Write-Host '  wrote src\pages\student\BrowseCourses.jsx'

Set-Content -Path 'src\pages\student\CourseDetail.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, getLessons, checkEnrollment, enrollCourse, getCourseProgress } from "../../services/api";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course,     setCourse]     = useState(null);
  const [lessons,    setLessons]    = useState([]);
  const [enrolled,   setEnrolled]   = useState(false);
  const [progress,   setProgress]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [msg,        setMsg]        = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, lRes, eRes] = await Promise.all([
          getCourseById(id), getLessons(id), checkEnrollment(id)
        ]);
        setCourse(cRes.data.data);
        setLessons(lRes.data.data || []);
        setEnrolled(eRes.data.isEnrolled);
        if (eRes.data.isEnrolled) {
          try { const pRes = await getCourseProgress(id); setProgress(pRes.data.data); } catch {}
        }
      } catch { setMsg("Failed to load course"); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await enrollCourse(id);
      setEnrolled(true);
      setMsg("✅ Enrolled! Start learning now.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) { setMsg("⚠️ " + (err?.response?.data?.message || "Error")); setTimeout(() => setMsg(""), 3000); }
  };

  const isCompleted = (lessonId) => progress?.completedLessons?.some(l => (l._id || l) === lessonId);

  if (loading) return <p className="loading-text">Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  const pct = progress?.completionPercentage ?? 0;

  return (
    <div className="course-detail">
      {msg && <div className="flash">{msg}</div>}

      <div className="detail-header">
        <div className="detail-hero">
          <span className="category-icon">📘</span>
          <div>
            <h2>{course.title}</h2>
            <div className="meta">
              <span className="badge">{course.category}</span>
              <span className="level-badge">{course.level}</span>
              <span>📖 {course.totalLessons} lessons</span>
              <span>👥 {course.enrollmentCount} enrolled</span>
            </div>
            <p className="desc">{course.description}</p>
          </div>
        </div>

        <div className="enroll-box">
          {enrolled ? (
            <>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: pct + "%" }} />
              </div>
              <p className="progress-text">{pct}% complete</p>
              <button className="btn-primary" onClick={() => navigate(`/lesson/${lessons[0]?._id}`)}>
                {pct > 0 ? "Continue Learning" : "Start Course"}
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={handleEnroll}>Enroll for Free</button>
          )}
        </div>
      </div>

      <div className="lessons-section">
        <h3>Course Lessons ({lessons.length})</h3>
        {lessons.length === 0 ? <p style={{color:"#64748b"}}>No lessons yet.</p> :
          lessons.map((l, i) => (
            <div className="lesson-row" key={l._id}>
              <div className="lesson-num">{i + 1}</div>
              <div className="lesson-info">
                <h4>{l.title}</h4>
                <p>{l.description || "—"}</p>
              </div>
              <div className="lesson-right">
                {l.resources?.length > 0 && <span className="res-count">📎 {l.resources.length} files</span>}
                {isCompleted(l._id) && <span className="done-badge">✅</span>}
                {enrolled
                  ? <Link to={`/lesson/${l._id}`} className="btn-sm">Open</Link>
                  : <span className="locked">🔒</span>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default CourseDetail;

'@
Write-Host '  wrote src\pages\student\CourseDetail.jsx'

Set-Content -Path 'src\pages\student\MyCourses.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments, getCourseProgress } from "../../services/api";

const STATUS_COLORS = { not_started:"#94a3b8", in_progress:"#f59e0b", completed:"#22c55e" };

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progresses,  setProgresses]  = useState({});
  const [filter,      setFilter]      = useState("all");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyEnrollments();
        const list = res.data.data || [];
        setEnrollments(list);
        const prog = {};
        await Promise.all(list.map(async e => {
          try { const r = await getCourseProgress(e.course._id); prog[e.course._id] = r.data.data; } catch {}
        }));
        setProgresses(prog);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === "all" ? enrollments : enrollments.filter(e => e.completionStatus === filter);

  if (loading) return <p className="loading-text">Loading your courses...</p>;

  return (
    <div className="my-courses">
      <h2 className="page-title">My Courses 📚</h2>

      <div className="filter-tabs">
        {["all","not_started","in_progress","completed"].map(f => (
          <button key={f} className={"filter-tab"+(filter===f?" active":"")} onClick={() => setFilter(f)}>
            {f.replace("_"," ").replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><span>📭</span><p>No courses in this category.</p><Link to="/browse" className="btn-primary">Browse Courses</Link></div>
      ) : (
        <div className="course-list">
          {filtered.map(e => {
            const c = e.course;
            const p = progresses[c._id];
            const pct = p?.completionPercentage ?? 0;
            return (
              <div className="course-row" key={e._id}>
                <div className="course-icon">{c.category?.charAt(0) || "📘"}</div>
                <div className="course-info">
                  <h4>{c.title}</h4>
                  <div className="meta">
                    <span className="badge">{c.category}</span>
                    <span className="level-badge">{c.level}</span>
                    <span>📖 {c.totalLessons} lessons</span>
                  </div>
                  <div className="progress-bar-wrap"><div className="progress-bar" style={{width:pct+"%"}}/></div>
                  <p className="progress-text">{pct}% complete — {p?.completedLessons?.length ?? 0}/{c.totalLessons} lessons</p>
                </div>
                <div className="course-actions">
                  <span className="status-dot" style={{background:STATUS_COLORS[e.completionStatus]||"#94a3b8"}}>
                    {e.completionStatus.replace("_"," ")}
                  </span>
                  <Link to={`/course/${c._id}`} className="btn-sm">Open</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

'@
Write-Host '  wrote src\pages\student\MyCourses.jsx'

Set-Content -Path 'src\pages\student\LessonView.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, getLessons, markLessonComplete, trackDownload } from "../../services/api";

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson,    setLesson]    = useState(null);
  const [siblings,  setSiblings]  = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [msg,       setMsg]       = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getLessonById(id);
        const l = res.data.data;
        setLesson(l);
        const sRes = await getLessons(l.course._id || l.course);
        setSiblings(sRes.data.data || []);
      } catch { setMsg("Failed to load lesson"); }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    try {
      const courseId = lesson.course._id || lesson.course;
      await markLessonComplete(courseId, lesson._id);
      setCompleted(true);
      setMsg("✅ Lesson marked as complete!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) { setMsg("⚠️ " + (err?.response?.data?.message || "Error")); setTimeout(() => setMsg(""), 3000); }
  };

  const handleDownload = async (resource) => {
    try {
      const courseId = lesson.course._id || lesson.course;
      await trackDownload(courseId, resource.url);
      window.open(resource.url, "_blank");
    } catch { window.open(resource.url, "_blank"); }
  };

  const currentIdx = siblings.findIndex(s => s._id === id);
  const prevLesson = siblings[currentIdx - 1];
  const nextLesson = siblings[currentIdx + 1];

  if (loading) return <p className="loading-text">Loading lesson...</p>;
  if (!lesson)  return <p>Lesson not found</p>;

  return (
    <div className="lesson-view">
      {msg && <div className="flash">{msg}</div>}

      <div className="lesson-breadcrumb">
        <span style={{cursor:"pointer",color:"#3b82f6"}} onClick={() => navigate(-1)}>← Back to Course</span>
      </div>

      <div className="lesson-layout">
        {/* Sidebar: lesson list */}
        <aside className="lesson-sidebar">
          <h4>Lessons</h4>
          {siblings.map((s, i) => (
            <div
              key={s._id}
              className={"lesson-item" + (s._id === id ? " active" : "")}
              onClick={() => navigate(`/lesson/${s._id}`)}
            >
              <span className="lesson-num">{i+1}</span>
              <span>{s.title}</span>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="lesson-main">
          <h2>{lesson.title}</h2>
          {lesson.description && <p className="lesson-desc">{lesson.description}</p>}

          <div className="lesson-content">
            {lesson.content ? (
              <div className="content-body">{lesson.content}</div>
            ) : (
              <p style={{color:"#94a3b8"}}>No content for this lesson yet.</p>
            )}
          </div>

          {lesson.resources?.length > 0 && (
            <div className="resources-section">
              <h3>📎 Resources ({lesson.resources.length})</h3>
              {lesson.resources.map((r, i) => (
                <div className="resource-row" key={i}>
                  <span>{r.type === "pdf" ? "📄" : r.type === "video" ? "🎬" : "📁"} {r.name}</span>
                  {r.isDownloadable && (
                    <button className="btn-sm" onClick={() => handleDownload(r)}>⬇️ Download</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="lesson-actions">
            {prevLesson && (
              <button className="btn-sm" onClick={() => navigate(`/lesson/${prevLesson._id}`)}>← Previous</button>
            )}
            {!completed && (
              <button className="btn-primary" onClick={handleComplete}>✅ Mark as Complete</button>
            )}
            {completed && <span className="done-badge">✅ Completed!</span>}
            {nextLesson && (
              <button className="btn-primary" onClick={() => navigate(`/lesson/${nextLesson._id}`)}>Next →</button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonView;

'@
Write-Host '  wrote src\pages\student\LessonView.jsx'

Set-Content -Path 'src\pages\student\SavedResources.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMySaved, toggleSave } from "../../services/api";

const SavedResources = () => {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySaved().then(r => { setSaved(r.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleUnsave = async (courseId) => {
    try {
      await toggleSave(courseId);
      setSaved(s => s.filter(i => i.course._id !== courseId));
    } catch {}
  };

  if (loading) return <p className="loading-text">Loading saved courses...</p>;

  return (
    <div className="saved-page">
      <h2 className="page-title">Saved Courses 🔖</h2>
      {saved.length === 0 ? (
        <div className="empty-state"><span>🔖</span><p>No saved courses yet.</p><Link to="/browse" className="btn-primary">Browse Courses</Link></div>
      ) : (
        <div className="course-grid">
          {saved.map(item => {
            const c = item.course;
            return (
              <div className="course-card" key={item._id}>
                <div className="course-thumb">{c.category?.charAt(0)||"📘"}</div>
                <div className="course-info">
                  <h4>{c.title}</h4>
                  <div className="meta">
                    <span className="badge">{c.category}</span>
                    <span className="level-badge">{c.level}</span>
                  </div>
                  <p className="desc">{c.description?.substring(0,80)}...</p>
                  <div className="card-actions">
                    <Link to={`/course/${c._id}`} className="btn-sm">View Course</Link>
                    <button className="btn-danger-sm" onClick={() => handleUnsave(c._id)}>🗑 Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedResources;

'@
Write-Host '  wrote src\pages\student\SavedResources.jsx'

Set-Content -Path 'src\pages\student\Downloads.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { getMyEnrollments, getCourseProgress, getLessons } from "../../services/api";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const enrRes = await getMyEnrollments();
        const enrollments = enrRes.data.data || [];
        const allDownloads = [];
        await Promise.all(enrollments.map(async e => {
          try {
            const [pRes, lRes] = await Promise.all([getCourseProgress(e.course._id), getLessons(e.course._id)]);
            const prog = pRes.data.data;
            const lessons = lRes.data.data || [];
            (prog?.downloadedResources || []).forEach(url => {
              lessons.forEach(l => {
                const res = l.resources?.find(r => r.url === url);
                if (res) allDownloads.push({ ...res, courseName: e.course.title, lessonName: l.title, courseId: e.course._id });
              });
            });
          } catch {}
        }));
        setDownloads(allDownloads);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="loading-text">Loading downloads...</p>;

  return (
    <div className="downloads-page">
      <h2 className="page-title">Downloads ⬇️</h2>
      <p style={{color:"#64748b",marginBottom:20}}>All resources you've downloaded for offline access.</p>

      {downloads.length === 0 ? (
        <div className="empty-state"><span>📥</span><p>No downloads yet. Download lesson resources to access them offline.</p></div>
      ) : (
        <div className="download-list">
          {downloads.map((d, i) => (
            <div className="download-row" key={i}>
              <span className="dl-icon">{d.type==="pdf"?"📄":d.type==="video"?"🎬":"📁"}</span>
              <div className="dl-info">
                <strong>{d.name}</strong>
                <p>{d.courseName} → {d.lessonName}</p>
              </div>
              <div className="dl-meta">
                <span className="badge">{d.type}</span>
                <a href={d.url} target="_blank" rel="noreferrer" className="btn-sm">Open</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;

'@
Write-Host '  wrote src\pages\student\Downloads.jsx'

Set-Content -Path 'src\pages\admin\AdminDashboard.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/api";

const AdminDashboard = () => {
  const [stats,   setStats]   = useState({ total:0, published:0, unpublished:0, enrollments:0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCourses({ limit: 100 });
        const all = res.data.data || [];
        const pub = all.filter(c => c.isPublished);
        const enr = all.reduce((a, c) => a + (c.enrollmentCount || 0), 0);
        setStats({ total: all.length, published: pub.length, unpublished: all.length - pub.length, enrollments: enr });
        setRecent(all.slice(0, 5));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="dashboard">
      <h2 className="page-title">Admin Dashboard 🏛️</h2>

      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-icon">📘</div><div className="stat-info"><span className="stat-num">{stats.total}</span><span className="stat-label">Total Courses</span></div></div>
        <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-info"><span className="stat-num">{stats.published}</span><span className="stat-label">Published</span></div></div>
        <div className="stat-card orange"><div className="stat-icon">📝</div><div className="stat-info"><span className="stat-num">{stats.unpublished}</span><span className="stat-label">Drafts</span></div></div>
        <div className="stat-card purple"><div className="stat-icon">👥</div><div className="stat-info"><span className="stat-num">{stats.enrollments}</span><span className="stat-label">Enrollments</span></div></div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/admin/courses" className="action-card"><span>📘</span><p>Manage Courses</p></Link>
          <Link to="/admin/lessons" className="action-card"><span>📝</span><p>Manage Lessons</p></Link>
          <Link to="/admin/resources" className="action-card"><span>📂</span><p>Manage Resources</p></Link>
        </div>
      </div>

      <div className="section-header"><h3>Recent Courses</h3></div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Lessons</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {recent.map(c => (
              <tr key={c._id}>
                <td><strong>{c.title}</strong></td>
                <td>{c.category}</td>
                <td>{c.level}</td>
                <td>{c.totalLessons}</td>
                <td><span className={"status-chip "+(c.isPublished?"pub":"draft")}>{c.isPublished?"Published":"Draft"}</span></td>
                <td><Link to={`/admin/courses/${c._id}/lessons`} className="btn-sm">Lessons</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

'@
Write-Host '  wrote src\pages\admin\AdminDashboard.jsx'

Set-Content -Path 'src\pages\admin\ManageCourses.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse, updateCourse, deleteCourse, togglePublish } from "../../services/api";

const CATEGORIES = ["Basic IT","Internet Safety","Online Jobs","Digital Payments","Digital Tools"];
const LEVELS     = ["beginner","intermediate","advanced"];
const EMPTY      = { title:"", description:"", category:"Basic IT", level:"beginner", tags:"" };

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [show,    setShow]    = useState(false);
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(true);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const load = async () => {
    try { const res = await getCourses({ limit:100 }); setCourses(res.data.data || []); }
    catch {} setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShow(true); };
  const openEdit = (c) => { setForm({ title:c.title, description:c.description, category:c.category, level:c.level, tags:(c.tags||[]).join(",") }); setEditId(c._id); setShow(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) };
      if (editId) await updateCourse(editId, payload);
      else        await createCourse(payload);
      flash(editId ? "✅ Course updated!" : "✅ Course created!");
      setShow(false); load();
    } catch (err) { flash("⚠️ " + (err?.response?.data?.message || "Error")); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await deleteCourse(id); flash("✅ Deleted!"); load(); } catch { flash("⚠️ Delete failed"); }
  };

  const handlePublish = async (id) => {
    try { await togglePublish(id); flash("✅ Status updated!"); load(); } catch { flash("⚠️ Error"); }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <h2 className="page-title">Manage Courses 📘</h2>
        <button className="btn-primary" onClick={openAdd}>+ Add Course</button>
      </div>
      {msg && <div className="flash">{msg}</div>}

      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? "Edit Course" : "Add Course"}</h3>
            <form onSubmit={submit} className="modal-form">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required /></div>
              <div className="form-group"><label>Description *</label><textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Level</label>
                  <select value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
                    {LEVELS.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="e.g. basics, beginner" /></div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShow(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Lessons</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {courses.length === 0 && <tr><td colSpan={7} style={{textAlign:"center",color:"#94a3b8"}}>No courses yet</td></tr>}
            {courses.map(c => (
              <tr key={c._id}>
                <td><strong>{c.title}</strong></td>
                <td>{c.category}</td>
                <td>{c.level}</td>
                <td>{c.totalLessons}</td>
                <td>{c.enrollmentCount}</td>
                <td><span className={"status-chip "+(c.isPublished?"pub":"draft")}>{c.isPublished?"Published":"Draft"}</span></td>
                <td className="action-cell">
                  <Link to={`/admin/courses/${c._id}/lessons`} className="btn-sm">Lessons</Link>
                  <button className="btn-sm yellow" onClick={() => handlePublish(c._id)}>{c.isPublished?"Unpublish":"Publish"}</button>
                  <button className="btn-sm" onClick={() => openEdit(c)}>✏️</button>
                  <button className="btn-sm red" onClick={() => handleDelete(c._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;

'@
Write-Host '  wrote src\pages\admin\ManageCourses.jsx'

Set-Content -Path 'src\pages\admin\ManageLessons.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, getLessons, addLesson, updateLesson, deleteLesson } from "../../services/api";

const EMPTY = { title:"", description:"", content:"", order:"", duration:"" };

const ManageLessons = () => {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const [course,  setCourse]  = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [show,    setShow]    = useState(false);
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(true);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const load = async () => {
    try {
      const [cRes, lRes] = await Promise.all([getCourseById(courseId), getLessons(courseId)]);
      setCourse(cRes.data.data);
      setLessons(lRes.data.data || []);
    } catch { flash("⚠️ Failed to load"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [courseId]);

  const openAdd  = () => { setForm({ ...EMPTY, order: lessons.length + 1 }); setEditId(null); setShow(true); };
  const openEdit = (l) => { setForm({ title: l.title, description: l.description||"", content: l.content||"", order: l.order, duration: l.duration||"" }); setEditId(l._id); setShow(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, order: Number(form.order), duration: Number(form.duration) || 0 };
      if (editId) await updateLesson(editId, payload);
      else        await addLesson(courseId, payload);
      flash(editId ? "✅ Lesson updated!" : "✅ Lesson added!");
      setShow(false); load();
    } catch (err) { flash("⚠️ " + (err?.response?.data?.message || "Error")); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    try { await deleteLesson(id); flash("✅ Deleted!"); load(); } catch { flash("⚠️ Delete failed"); }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <div>
          <button className="btn-sm" onClick={() => navigate("/admin/courses")}>← Back to Courses</button>
          <h2 className="page-title" style={{marginTop:8}}>Lessons — {course?.title}</h2>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Lesson</button>
      </div>
      {msg && <div className="flash">{msg}</div>}

      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editId ? "Edit Lesson" : "Add Lesson"}</h3>
            <form onSubmit={submit} className="modal-form">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div className="form-group"><label>Description</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="form-group"><label>Content</label><textarea rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Lesson content / notes..." /></div>
              <div className="form-row">
                <div className="form-group"><label>Order</label><input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} min="1" /></div>
                <div className="form-group"><label>Duration (mins)</label><input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} min="0" /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShow(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="empty-state"><span>📝</span><p>No lessons yet. Add your first lesson.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>#</th><th>Title</th><th>Duration</th><th>Resources</th><th>Actions</th></tr></thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l._id}>
                  <td>{l.order}</td>
                  <td><strong>{l.title}</strong><br /><span style={{color:"#64748b",fontSize:12}}>{l.description}</span></td>
                  <td>{l.duration ? l.duration + " min" : "—"}</td>
                  <td>{l.resources?.length || 0} files</td>
                  <td className="action-cell">
                    <button className="btn-sm" onClick={() => navigate(`/admin/lessons/${l._id}/resources`)}>📂 Resources</button>
                    <button className="btn-sm" onClick={() => openEdit(l)}>✏️ Edit</button>
                    <button className="btn-sm red" onClick={() => handleDelete(l._id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageLessons;

'@
Write-Host '  wrote src\pages\admin\ManageLessons.jsx'

Set-Content -Path 'src\pages\admin\ManageResources.jsx' -Encoding UTF8 -Value @'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, uploadResource, deleteResource } from "../../services/api";

const TYPES = ["pdf", "video", "slides", "other"];

const ManageResources = () => {
  const { lessonId } = useParams();
  const navigate     = useNavigate();
  const [lesson,     setLesson]     = useState(null);
  const [file,       setFile]       = useState(null);
  const [form,       setForm]       = useState({ name:"", type:"pdf", isDownloadable:true });
  const [uploading,  setUploading]  = useState(false);
  const [msg,        setMsg]        = useState("");
  const [loading,    setLoading]    = useState(true);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 4000); };

  const load = async () => {
    try { const r = await getLessonById(lessonId); setLesson(r.data.data); }
    catch { flash("⚠️ Failed to load lesson"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [lessonId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { flash("⚠️ Please select a file"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", form.name || file.name);
      fd.append("type", form.type);
      fd.append("isDownloadable", form.isDownloadable);
      await uploadResource(lessonId, fd);
      flash("✅ Resource uploaded successfully!");
      setFile(null); setForm({ name:"", type:"pdf", isDownloadable:true });
      document.getElementById("file-input").value = "";
      load();
    } catch (err) { flash("⚠️ " + (err?.response?.data?.message || "Upload failed")); }
    setUploading(false);
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Delete this resource?")) return;
    try { await deleteResource(lessonId, resourceId); flash("✅ Deleted!"); load(); }
    catch { flash("⚠️ Delete failed"); }
  };

  const typeIcon = (t) => t === "pdf" ? "📄" : t === "video" ? "🎬" : t === "slides" ? "📊" : "📁";

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="manage-page">
      <div className="page-header">
        <div>
          <button className="btn-sm" onClick={() => navigate(-1)}>← Back to Lessons</button>
          <h2 className="page-title" style={{marginTop:8}}>Resources — {lesson?.title}</h2>
        </div>
      </div>
      {msg && <div className="flash">{msg}</div>}

      {/* Upload form */}
      <div className="upload-card">
        <h3>📤 Upload New Resource</h3>
        <p style={{color:"#64748b",fontSize:13,marginBottom:16}}>Supports PDF, video, slides and other files. Uploaded to Cloudinary.</p>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label>Resource Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Leave blank to use filename" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>File *</label>
            <input id="file-input" type="file" onChange={e => setFile(e.target.files[0])} required />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" checked={form.isDownloadable} onChange={e => setForm(f => ({ ...f, isDownloadable: e.target.checked }))} />
              &nbsp; Allow students to download this resource
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Resource"}
          </button>
        </form>
      </div>

      {/* Resource list */}
      <h3 style={{margin:"24px 0 12px"}}>Existing Resources ({lesson?.resources?.length || 0})</h3>
      {!lesson?.resources?.length ? (
        <div className="empty-state"><span>📂</span><p>No resources yet. Upload your first resource above.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Type</th><th>Name</th><th>Downloadable</th><th>Link</th><th>Actions</th></tr></thead>
            <tbody>
              {lesson.resources.map(r => (
                <tr key={r._id}>
                  <td style={{fontSize:20}}>{typeIcon(r.type)}</td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.isDownloadable ? "✅ Yes" : "❌ No"}</td>
                  <td><a href={r.url} target="_blank" rel="noreferrer" className="btn-sm">Open ↗</a></td>
                  <td><button className="btn-sm red" onClick={() => handleDelete(r._id)}>🗑 Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageResources;

'@
Write-Host '  wrote src\pages\admin\ManageResources.jsx'

Write-Host '' 
Write-Host 'All files written!' -ForegroundColor Green
Write-Host ''
Write-Host 'Now run:' -ForegroundColor Yellow
Write-Host '  npm install'
Write-Host '  npm start'