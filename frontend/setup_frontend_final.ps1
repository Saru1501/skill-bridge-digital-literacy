# SkillBridge Frontend - Complete Setup Script
# Run from: C:\Users\USER\skill-bridge-digital-literacy\frontend

Write-Host 'Setting up SkillBridge Frontend (Component 1)...' -ForegroundColor Cyan

$folders = @(
  "public"
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

[System.IO.File]::WriteAllText("$PWD\package.json", @'
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

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote package.json'

[System.IO.File]::WriteAllText("$PWD\public\index.html", @'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SkillBridge - Digital Literacy Platform for Rural Youth" />
    <title>SkillBridge - Digital Literacy Platform</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote public\index.html'

[System.IO.File]::WriteAllText("$PWD\src\App.jsx", @'
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/browse"      element={<BrowseCourses />} />
            <Route path="/course/:id"  element={<CourseDetail />} />
            <Route path="/my-courses"  element={<MyCourses />} />
            <Route path="/lesson/:id"  element={<LessonView />} />
            <Route path="/saved"       element={<SavedResources />} />
            <Route path="/downloads"   element={<Downloads />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly><AppLayout /></ProtectedRoute>}>
            <Route path="/admin"                                element={<AdminDashboard />} />
            <Route path="/admin/courses"                        element={<ManageCourses />} />
            <Route path="/admin/courses/:courseId/lessons"      element={<ManageLessons />} />
            <Route path="/admin/lessons/:lessonId/resources"    element={<ManageResources />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\App.jsx'

[System.IO.File]::WriteAllText("$PWD\src\index.css", @'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --primary: #2563EB;
  --primary-dark: #1D4ED8;
  --primary-light: #EFF6FF;
  --success: #16A34A;
  --success-light: #DCFCE7;
  --warning: #D97706;
  --warning-light: #FEF3C7;
  --danger: #DC2626;
  --danger-light: #FEE2E2;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --border: #E2E8F0;
  --surface: #FFFFFF;
  --surface-2: #F8FAFC;
  --sidebar-bg: #0F172A;
  --sidebar-text: #94A3B8;
  --sidebar-active: #2563EB;
  --radius: 8px;
  --radius-lg: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05);
}

body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: var(--surface-2); color: var(--text-primary); font-size: 14px; line-height: 1.6; }

/* ── Loading ── */
.page-loading { display: flex; align-items: center; justify-content: center; min-height: 300px; }
.spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; gap: 12px; color: var(--text-secondary); }

/* ── Alerts ── */
.alert { padding: 12px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; margin-bottom: 16px; }
.alert-success { background: var(--success-light); color: var(--success); border: 1px solid #86EFAC; }
.alert-error   { background: var(--danger-light);  color: var(--danger);  border: 1px solid #FCA5A5; }
.alert-warning { background: var(--warning-light); color: var(--warning); border: 1px solid #FCD34D; }

/* ── Buttons ── */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; text-decoration: none; white-space: nowrap; }
.btn-primary   { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-secondary { background: var(--surface-2); color: var(--text-secondary); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--border); color: var(--text-primary); }
.btn-success   { background: var(--success-light); color: var(--success); }
.btn-success:hover { background: #BBF7D0; }
.btn-warning   { background: var(--warning-light); color: var(--warning); }
.btn-warning:hover { background: #FDE68A; }
.btn-danger    { background: var(--danger-light); color: var(--danger); }
.btn-danger:hover { background: #FECACA; }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.btn-lg { padding: 12px 24px; font-size: 15px; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* ── Badges ── */
.badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-blue    { background: #DBEAFE; color: #1D4ED8; }
.badge-green   { background: var(--success-light); color: var(--success); }
.badge-yellow  { background: var(--warning-light); color: var(--warning); }
.badge-red     { background: var(--danger-light); color: var(--danger); }
.badge-gray    { background: #F1F5F9; color: var(--text-secondary); }
.badge-purple  { background: #EDE9FE; color: #7C3AED; }

/* ── Cards ── */
.card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); box-shadow: var(--shadow); }
.card-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-body   { padding: 24px; }
.card-title  { font-size: 16px; font-weight: 700; color: var(--text-primary); }

/* ── Forms ── */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.form-control { width: 100%; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius); font-size: 14px; color: var(--text-primary); background: var(--surface); font-family: inherit; outline: none; transition: border 0.15s, box-shadow 0.15s; }
.form-control:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.form-control::placeholder { color: var(--text-muted); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-error { font-size: 12px; color: var(--danger); margin-top: 4px; }

/* ── Tables ── */
.table-wrap { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow); }
.table { width: 100%; border-collapse: collapse; }
.table th { background: var(--surface-2); padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid var(--border); }
.table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text-primary); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: var(--surface-2); }
.table .actions { display: flex; gap: 6px; flex-wrap: wrap; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-box { background: var(--surface); border-radius: var(--radius-lg); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.modal-header h3 { font-size: 17px; font-weight: 700; }
.modal-body   { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
.modal-close  { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 4px; display: flex; align-items: center; }
.modal-close:hover { background: var(--surface-2); color: var(--text-primary); }

/* ── Progress ── */
.progress-wrap { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.progress-bar  { height: 100%; background: var(--primary); border-radius: 3px; transition: width 0.4s; }

/* ── Empty state ── */
.empty-state { text-align: center; padding: 60px 20px; }
.empty-state-icon { width: 64px; height: 64px; background: var(--surface-2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.empty-state-icon svg { color: var(--text-muted); }
.empty-state h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p  { color: var(--text-muted); font-size: 13px; margin-bottom: 20px; }

/* ── Stats ── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
.stat-card  { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; display: flex; align-items: flex-start; gap: 16px; box-shadow: var(--shadow); }
.stat-icon  { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.blue   { background: #DBEAFE; color: var(--primary); }
.stat-icon.green  { background: var(--success-light); color: var(--success); }
.stat-icon.yellow { background: var(--warning-light); color: var(--warning); }
.stat-icon.purple { background: #EDE9FE; color: #7C3AED; }
.stat-info { flex: 1; }
.stat-value { font-size: 26px; font-weight: 800; color: var(--text-primary); line-height: 1; }
.stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; font-weight: 500; }

/* ── Section header ── */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.section-title  { font-size: 22px; font-weight: 800; color: var(--text-primary); }
.section-sub    { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

/* ── Filters bar ── */
.filters-bar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.search-box  { flex: 1; min-width: 220px; position: relative; }
.search-box input { padding-left: 38px; }
.search-box svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
.filter-select { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius); font-size: 13px; color: var(--text-primary); background: var(--surface); outline: none; cursor: pointer; min-width: 150px; }
.filter-select:focus { border-color: var(--primary); }

/* ── Course cards ── */
.courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.course-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
.course-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.course-card-header { height: 90px; background: linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%); padding: 20px; display: flex; align-items: flex-end; }
.course-card-cat { background: rgba(255,255,255,0.2); color: #fff; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.course-card-body { padding: 18px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.course-card-title { font-size: 15px; font-weight: 700; color: var(--text-primary); line-height: 1.4; }
.course-card-desc  { font-size: 12px; color: var(--text-muted); line-height: 1.6; flex: 1; }
.course-card-meta  { display: flex; gap: 8px; flex-wrap: wrap; }
.course-card-footer { padding: 14px 18px; border-top: 1px solid var(--border); display: flex; gap: 8px; }

/* ── Lesson list ── */
.lesson-list { display: flex; flex-direction: column; gap: 0; }
.lesson-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--border); transition: background 0.15s; cursor: pointer; }
.lesson-item:last-child { border-bottom: none; }
.lesson-item:hover { background: var(--surface-2); }
.lesson-num { width: 30px; height: 30px; border-radius: 50%; background: #DBEAFE; color: var(--primary); font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lesson-num.done { background: var(--success-light); color: var(--success); }
.lesson-info { flex: 1; }
.lesson-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.lesson-meta  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.lesson-right { display: flex; align-items: center; gap: 8px; }

/* ── Login page ── */
.auth-page { min-height: 100vh; background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
.auth-card { background: var(--surface); border-radius: 20px; width: 100%; max-width: 440px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); overflow: hidden; }
.auth-card-top { background: linear-gradient(135deg, #1E3A5F, #2563EB); padding: 32px; text-align: center; }
.auth-logo-box { width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; backdrop-filter: blur(10px); }
.auth-card-top h1 { color: #fff; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.auth-card-top p  { color: rgba(255,255,255,0.7); font-size: 13px; }
.auth-body { padding: 32px; }
.auth-tabs { display: flex; background: var(--surface-2); border-radius: 10px; padding: 3px; margin-bottom: 24px; }
.auth-tab  { flex: 1; padding: 9px; border: none; background: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.auth-tab.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow); }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.auth-submit { padding: 13px; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.15s; width: 100%; }
.auth-submit:hover:not(:disabled) { background: var(--primary-dark); }
.auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.auth-footer { text-align: center; margin-top: 16px; padding: 14px; background: var(--surface-2); border-radius: 8px; font-size: 12px; color: var(--text-muted); }

/* ── Sidebar ── */
.layout { display: flex; min-height: 100vh; }
.sidebar { width: 240px; background: var(--sidebar-bg); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.sidebar-brand { padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 10px; }
.brand-logo { width: 38px; height: 38px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.brand-name { color: #fff; font-size: 17px; font-weight: 800; letter-spacing: -0.3px; }
.sidebar-section { padding: 12px 8px 4px; }
.sidebar-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 1.2px; padding: 0 10px; margin-bottom: 4px; }
.sidebar-nav { padding: 8px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius); text-decoration: none; color: var(--sidebar-text); font-size: 13px; font-weight: 500; transition: all 0.15s; margin-bottom: 2px; }
.nav-item:hover  { background: rgba(255,255,255,0.06); color: #fff; }
.nav-item.active { background: var(--primary); color: #fff; }
.nav-item svg    { width: 18px; height: 18px; flex-shrink: 0; }
.sidebar-footer { padding: 12px 8px; border-top: 1px solid rgba(255,255,255,0.07); }
.sidebar-user { padding: 10px 12px; display: flex; align-items: center; gap: 10px; border-radius: var(--radius); margin-bottom: 8px; }
.user-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.user-info { flex: 1; overflow: hidden; }
.user-name { color: #fff; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { color: var(--sidebar-text); font-size: 11px; text-transform: capitalize; }
.logout-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius); background: rgba(220,38,38,0.1); color: #FCA5A5; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s; }
.logout-btn:hover { background: rgba(220,38,38,0.2); color: #fff; }

/* ── Main content ── */
.main-content { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 24px; height: 58px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
.topbar-left { display: flex; align-items: center; gap: 8px; }
.topbar-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-badge { background: var(--primary-light); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
.page-wrap { padding: 28px; flex: 1; }

/* ── Lesson view ── */
.lesson-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; }
.lesson-sidebar-panel { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; height: fit-content; box-shadow: var(--shadow); }
.lesson-main-panel { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow); }
.lesson-panel-header { padding: 16px 20px; border-bottom: 1px solid var(--border); }
.lesson-panel-title { font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
.lesson-content-area { padding: 28px; }
.lesson-content-text { font-size: 15px; line-height: 1.8; color: var(--text-primary); white-space: pre-wrap; }
.resource-list { display: flex; flex-direction: column; gap: 10px; }
.resource-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--surface-2); border-radius: var(--radius); border: 1px solid var(--border); }
.resource-item-left { display: flex; align-items: center; gap: 10px; }
.resource-type-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.resource-type-icon.pdf   { background: #FEE2E2; color: var(--danger); }
.resource-type-icon.video { background: #DBEAFE; color: var(--primary); }
.resource-type-icon.slides { background: #EDE9FE; color: #7C3AED; }
.resource-type-icon.other  { background: var(--surface-2); color: var(--text-muted); }
.resource-name { font-size: 13px; font-weight: 600; }
.resource-type { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }

/* ── Enrollments/Progress ── */
.enrolled-list { display: flex; flex-direction: column; gap: 12px; }
.enrolled-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow); }
.enrolled-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #1E3A5F, #2563EB); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.enrolled-info { flex: 1; }
.enrolled-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
.enrolled-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

/* ── Tabs ── */
.tab-bar { display: flex; gap: 4px; background: var(--surface-2); padding: 4px; border-radius: 10px; margin-bottom: 20px; border: 1px solid var(--border); }
.tab-btn { flex: 1; padding: 8px 16px; border: none; background: none; border-radius: 7px; font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.tab-btn.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow); }

/* ── Upload area ── */
.upload-area { border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 32px; text-align: center; transition: border-color 0.15s; }
.upload-area:hover { border-color: var(--primary); }
.upload-area h4 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
.upload-area p  { font-size: 12px; color: var(--text-muted); }

/* ── Detail header ── */
.detail-hero { background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #2563EB 100%); border-radius: var(--radius-lg); padding: 32px; color: #fff; margin-bottom: 24px; }
.detail-hero h1 { font-size: 26px; font-weight: 800; margin-bottom: 12px; }
.detail-hero-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
.hero-tag { background: rgba(255,255,255,0.15); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.detail-hero p { color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.7; }

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\index.css'

[System.IO.File]::WriteAllText("$PWD\src\index.jsx", @'
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\index.jsx'

[System.IO.File]::WriteAllText("$PWD\src\context\AuthContext.jsx", @'
import { createContext, useContext, useState, useEffect } from "react";
import { authLogin, authRegister } from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
    persist(res.data.token, res.data.data);
    return res.data.data;
  };

  const register = async (name, email, password, role = "student") => {
    const res = await authRegister(name, email, password, role);
    persist(res.data.token, res.data.data);
    return res.data.data;
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const role     = user?.role?.toLowerCase();
  const isAdmin  = role === "admin" || role === "university";
  const isStudent = role === "student";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isStudent }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\context\AuthContext.jsx'

[System.IO.File]::WriteAllText("$PWD\src\services\api.js", @'
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3001/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// AUTH
export const authLogin    = (email, password) => api.post("/auth/login", { email, password });
export const authRegister = (name, email, password, role) => api.post("/auth/register", { name, email, password, role });
export const authMe       = () => api.get("/auth/me");

// COURSES
export const getCourses    = (params) => api.get("/courses", { params });
export const getCourseById = (id)     => api.get(`/courses/${id}`);
export const createCourse  = (data)   => api.post("/courses", data);
export const updateCourse  = (id, d)  => api.put(`/courses/${id}`, d);
export const deleteCourse  = (id)     => api.delete(`/courses/${id}`);
export const togglePublish = (id)     => api.patch(`/courses/${id}/publish`);

// LESSONS
export const getLessons     = (courseId)     => api.get(`/courses/${courseId}/lessons`);
export const getLessonById  = (id)           => api.get(`/lessons/${id}`);
export const addLesson      = (courseId, d)  => api.post(`/courses/${courseId}/lessons`, d);
export const updateLesson   = (id, d)        => api.put(`/lessons/${id}`, d);
export const deleteLesson   = (id)           => api.delete(`/lessons/${id}`);
export const uploadResource = (lessonId, fd) => api.post(`/lessons/${lessonId}/resources`, fd, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteResource = (lessonId, rid)=> api.delete(`/lessons/${lessonId}/resources/${rid}`);

// ENROLLMENTS
export const enrollCourse        = (courseId) => api.post(`/enrollments/${courseId}`);
export const getMyEnrollments    = ()         => api.get("/enrollments/my");
export const checkEnrollment     = (courseId) => api.get(`/enrollments/${courseId}/status`);
export const getCourseEnrollments= (courseId) => api.get(`/enrollments/course/${courseId}`);

// PROGRESS
export const markLessonComplete = (courseId, lessonId) => api.patch(`/progress/${courseId}/lessons/${lessonId}`);
export const getCourseProgress  = (courseId)           => api.get(`/progress/${courseId}`);
export const trackDownload      = (courseId, url)      => api.post(`/progress/${courseId}/download`, { resourceUrl: url });
export const syncOffline        = (courseId, lessons)  => api.post(`/progress/${courseId}/sync`, { completedLessons: lessons });

// SAVED COURSES
export const toggleSave  = (courseId) => api.post(`/saved/${courseId}`);
export const getMySaved  = ()         => api.get("/saved");

export default api;

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\services\api.js'

[System.IO.File]::WriteAllText("$PWD\src\components\ui\ProtectedRoute.jsx", @'
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role?.toLowerCase();
  if (adminOnly && role !== "admin" && role !== "university")
    return <Navigate to="/dashboard" replace />;
  return children;
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\components\ui\ProtectedRoute.jsx'

[System.IO.File]::WriteAllText("$PWD\src\components\layout\AppLayout.jsx", @'
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/browse": "Browse Courses",
  "/my-courses": "My Courses",
  "/saved": "Saved Courses",
  "/downloads": "Downloads",
  "/admin": "Admin Dashboard",
  "/admin/courses": "Manage Courses",
};

export default function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "SkillBridge";

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{color:"#94A3B8"}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-badge">{user?.role}</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700}}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span style={{fontSize:13,fontWeight:600,color:"#475569"}}>{user?.name}</span>
            </div>
          </div>
        </header>
        <main className="page-wrap">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\components\layout\AppLayout.jsx'

[System.IO.File]::WriteAllText("$PWD\src\components\layout\Sidebar.jsx", @'
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const studentLinks = [
  { to: "/dashboard",  label: "Dashboard",      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg> },
  { to: "/browse",     label: "Browse Courses",  icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { to: "/my-courses", label: "My Courses",      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
  { to: "/saved",      label: "Saved Courses",   icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg> },
  { to: "/downloads",  label: "Downloads",       icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg> },
];

const adminLinks = [
  { to: "/admin",          label: "Dashboard",       icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg> },
  { to: "/admin/courses",  label: "Manage Courses",  icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
];

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span className="brand-name">SkillBridge</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <p className="sidebar-label">{isAdmin ? "Administration" : "Learning"}</p>
        </div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            {l.icon}
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
          <div className="user-info">
            <p className="user-name">{user?.name || "User"}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\components\layout\Sidebar.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\Login.jsx", @'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "student",    label: "Student" },
  { value: "university", label: "University" },
  { value: "ngo",        label: "NGO" },
  { value: "admin",      label: "Admin" },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState({ name:"", email:"", password:"", role:"student" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      let user;
      if (mode === "login") { user = await login(form.email, form.password); }
      else {
        if (!form.name.trim()) { setError("Full name is required"); setLoading(false); return; }
        user = await register(form.name, form.email, form.password, form.role);
      }
      const role = user.role?.toLowerCase();
      navigate(role === "admin" || role === "university" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Connection failed. Ensure backend is running on port 3001.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-top">
          <div className="auth-logo-box">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1>SkillBridge</h1>
          <p>Digital Literacy for Rural Youth</p>
        </div>
        <div className="auth-body">
          <div className="auth-tabs">
            <button className={"auth-tab" + (mode==="login"    ? " active":"")} onClick={() => { setMode("login");    setError(""); }}>Sign In</button>
            <button className={"auth-tab" + (mode==="register" ? " active":"")} onClick={() => { setMode("register"); setError(""); }}>Register</button>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handle} placeholder="Enter your full name" required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" name="password" type="password" value={form.password} onChange={handle} placeholder="Minimum 6 characters" required minLength={6} />
            </div>
            {mode === "register" && (
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" name="role" value={form.role} onChange={handle}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            )}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div className="auth-footer">
            <strong>Roles:</strong> student, university, ngo, admin
          </div>
        </div>
      </div>
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\Login.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\admin\AdminDashboard.jsx", @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/api";

export default function AdminDashboard() {
  const [stats,   setStats]   = useState({ total:0, published:0, drafts:0, enrollments:0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCourses({ limit:100 });
        const all = res.data.data || [];
        const pub = all.filter(c => c.isPublished);
        const enr = all.reduce((a, c) => a + (c.enrollmentCount||0), 0);
        setStats({ total:all.length, published:pub.length, drafts:all.length-pub.length, enrollments:enr });
        setRecent(all.slice(0,6));
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header" style={{marginBottom:28}}>
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-sub">Overview of the SkillBridge learning platform.</p>
        </div>
        <Link to="/admin/courses" className="btn btn-primary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Course
        </Link>
      </div>

      <div className="stats-grid">
        {[
          { label:"Total Courses",   value:stats.total,       color:"blue",   icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> },
          { label:"Published",       value:stats.published,   color:"green",  icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
          { label:"Drafts",          value:stats.drafts,      color:"yellow", icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
          { label:"Total Enrollments",value:stats.enrollments, color:"purple", icon:<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className={"stat-icon "+s.color}>{s.icon}</div>
            <div className="stat-info"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{marginBottom:16}}>
        <h2 style={{fontSize:17,fontWeight:700}}>Recent Courses</h2>
        <Link to="/admin/courses" style={{fontSize:13,color:"#2563EB",textDecoration:"none",fontWeight:600}}>Manage All</Link>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Course Title</th><th>Category</th><th>Level</th><th>Lessons</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {recent.length === 0 && <tr><td colSpan={7} style={{textAlign:"center",color:"#94A3B8",padding:32}}>No courses yet. Create your first course.</td></tr>}
            {recent.map(c => (
              <tr key={c._id}>
                <td><span style={{fontWeight:600}}>{c.title}</span></td>
                <td><span className="badge badge-blue">{c.category}</span></td>
                <td>{c.level}</td>
                <td>{c.totalLessons}</td>
                <td>{c.enrollmentCount}</td>
                <td><span className={"badge "+(c.isPublished?"badge-green":"badge-yellow")}>{c.isPublished?"Published":"Draft"}</span></td>
                <td>
                  <div className="actions">
                    <Link to={`/admin/courses/${c._id}/lessons`} className="btn btn-secondary btn-sm">Lessons</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\admin\AdminDashboard.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\admin\ManageCourses.jsx", @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse, updateCourse, deleteCourse, togglePublish } from "../../services/api";

const CATS  = ["Basic IT","Internet Safety","Online Jobs","Digital Payments","Digital Tools"];
const LVLS  = ["beginner","intermediate","advanced"];
const EMPTY = { title:"", description:"", category:"Basic IT", level:"beginner", tags:"" };

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [show,    setShow]    = useState(false);
  const [alert,   setAlert]   = useState({ msg:"", type:"" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };
  const load  = async () => { try { const r = await getCourses({limit:100}); setCourses(r.data.data||[]); } catch {} setLoading(false); };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShow(true); };
  const openEdit = (c) => { setForm({ title:c.title, description:c.description, category:c.category, level:c.level, tags:(c.tags||[]).join(",") }); setEditId(c._id); setShow(true); };
  const close    = () => setShow(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) };
      if (editId) await updateCourse(editId, payload); else await createCourse(payload);
      flash(editId ? "Course updated successfully." : "Course created successfully."); close(); load();
    } catch (err) { flash(err?.response?.data?.message || "Operation failed","error"); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try { await deleteCourse(id); flash("Course deleted."); load(); } catch { flash("Delete failed","error"); }
  };

  const handlePublish = async (id) => {
    try { await togglePublish(id); flash("Course status updated."); load(); } catch { flash("Update failed","error"); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Manage Courses</h1>
          <p className="section-sub">{courses.length} total courses</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Course
        </button>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {show && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Edit Course" : "Add New Course"}</h3>
              <button className="modal-close" onClick={close}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input className="form-control" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Introduction to Digital Literacy" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Course overview..." required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select className="form-control" value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
                      {LVLS.map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-control" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="e.g. basics, beginner, IT" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving...":editId?"Update Course":"Create Course"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Lessons</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {courses.length===0 && <tr><td colSpan={7} style={{textAlign:"center",color:"#94A3B8",padding:40}}>No courses yet. Click "Add Course" to create your first course.</td></tr>}
            {courses.map(c => (
              <tr key={c._id}>
                <td><div style={{fontWeight:600}}>{c.title}</div><div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{c.tags?.join(", ")}</div></td>
                <td><span className="badge badge-blue">{c.category}</span></td>
                <td style={{textTransform:"capitalize"}}>{c.level}</td>
                <td>{c.totalLessons}</td>
                <td>{c.enrollmentCount}</td>
                <td><span className={"badge "+(c.isPublished?"badge-green":"badge-yellow")}>{c.isPublished?"Published":"Draft"}</span></td>
                <td>
                  <div className="actions">
                    <Link to={`/admin/courses/${c._id}/lessons`} className="btn btn-secondary btn-sm">Lessons</Link>
                    <button className={"btn btn-sm "+(c.isPublished?"btn-warning":"btn-success")} onClick={()=>handlePublish(c._id)}>{c.isPublished?"Unpublish":"Publish"}</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(c._id,c.title)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\admin\ManageCourses.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\admin\ManageLessons.jsx", @'
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById, getLessons, addLesson, updateLesson, deleteLesson } from "../../services/api";

const EMPTY = { title:"", description:"", content:"", order:"", duration:"" };

export default function ManageLessons() {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const [course,  setCourse]  = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [show,    setShow]    = useState(false);
  const [alert,   setAlert]   = useState({ msg:"", type:"" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  const load = async () => {
    try {
      const [cRes, lRes] = await Promise.all([getCourseById(courseId), getLessons(courseId)]);
      setCourse(cRes.data.data); setLessons(lRes.data.data||[]);
    } catch { flash("Failed to load","error"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [courseId]);

  const openAdd  = () => { setForm({...EMPTY, order:lessons.length+1}); setEditId(null); setShow(true); };
  const openEdit = (l) => { setForm({title:l.title,description:l.description||"",content:l.content||"",order:l.order,duration:l.duration||""}); setEditId(l._id); setShow(true); };
  const close    = () => setShow(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, order:Number(form.order)||1, duration:Number(form.duration)||0 };
      if (editId) await updateLesson(editId, payload); else await addLesson(courseId, payload);
      flash(editId ? "Lesson updated." : "Lesson added."); close(); load();
    } catch (err) { flash(err?.response?.data?.message||"Failed","error"); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try { await deleteLesson(id); flash("Lesson deleted."); load(); } catch { flash("Delete failed","error"); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/courses")}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Courses
        </button>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Lessons — {course?.title}</h1>
          <p className="section-sub">{lessons.length} lessons in this course</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Lesson
        </button>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {show && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" style={{maxWidth:600}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId?"Edit Lesson":"Add New Lesson"}</h3>
              <button className="modal-close" onClick={close}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Lesson Title *</label>
                  <input className="form-control" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Introduction to Computers" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Brief description of this lesson" />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-control" rows={6} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="Lesson content, notes, or instructions..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Order Number</label>
                    <input className="form-control" type="number" min="1" value={form.order} onChange={e=>setForm(f=>({...f,order:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input className="form-control" type="number" min="0" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving...":editId?"Update Lesson":"Add Lesson"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
          <h3>No lessons yet</h3><p>Add your first lesson to get started.</p>
          <button className="btn btn-primary" onClick={openAdd}>Add First Lesson</button>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Title</th><th>Duration</th><th>Resources</th><th>Actions</th></tr></thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l._id}>
                  <td><div style={{width:30,height:30,borderRadius:"50%",background:"#DBEAFE",color:"#1D4ED8",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>{l.order}</div></td>
                  <td><div style={{fontWeight:600}}>{l.title}</div><div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{l.description}</div></td>
                  <td>{l.duration ? `${l.duration} min` : "—"}</td>
                  <td><span className="badge badge-blue">{l.resources?.length||0} files</span></td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/lessons/${l._id}/resources`} className="btn btn-secondary btn-sm">Resources</Link>
                      <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(l)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(l._id,l.title)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\admin\ManageLessons.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\admin\ManageResources.jsx", @'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, uploadResource, deleteResource } from "../../services/api";

const TYPES = ["pdf","video","slides","other"];

export default function ManageResources() {
  const { lessonId } = useParams();
  const navigate     = useNavigate();
  const [lesson,    setLesson]    = useState(null);
  const [file,      setFile]      = useState(null);
  const [form,      setForm]      = useState({ name:"", type:"pdf", isDownloadable:true });
  const [uploading, setUploading] = useState(false);
  const [alert,     setAlert]     = useState({ msg:"", type:"" });
  const [loading,   setLoading]   = useState(true);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),4000); };

  const load = async () => {
    try { const r = await getLessonById(lessonId); setLesson(r.data.data); }
    catch { flash("Failed to load lesson","error"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [lessonId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { flash("Please select a file to upload","error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", form.name || file.name);
      fd.append("type", form.type);
      fd.append("isDownloadable", form.isDownloadable);
      await uploadResource(lessonId, fd);
      flash("Resource uploaded successfully via Cloudinary!");
      setFile(null); setForm({ name:"", type:"pdf", isDownloadable:true });
      document.getElementById("file-input").value = "";
      load();
    } catch (err) { flash(err?.response?.data?.message || "Upload failed","error"); } finally { setUploading(false); }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Delete this resource?")) return;
    try { await deleteResource(lessonId, resourceId); flash("Resource deleted."); load(); }
    catch { flash("Delete failed","error"); }
  };

  const typeIcon = (type) => {
    const icons = {
      pdf:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
      video:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>,
      slides: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>,
      other:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>,
    };
    return icons[type] || icons.other;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Lessons
        </button>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Resources</h1>
          <p className="section-sub">Lesson: {lesson?.title} — {lesson?.resources?.length||0} files uploaded</p>
        </div>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      <div className="card" style={{marginBottom:24}}>
        <div className="card-header">
          <h3 className="card-title">Upload Resource</h3>
          <span className="badge badge-purple">Cloudinary Storage</span>
        </div>
        <div className="card-body">
          <p style={{fontSize:13,color:"#64748B",marginBottom:20}}>Supports PDF, video, slides and other files. Files are stored securely via Cloudinary CDN.</p>
          <form onSubmit={handleUpload}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className="form-control" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Leave blank to use filename" />
              </div>
              <div className="form-group">
                <label className="form-label">Resource Type</label>
                <select className="form-control" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{marginBottom:16}}>
              <label className="form-label">File *</label>
              <input id="file-input" className="form-control" type="file" onChange={e=>setFile(e.target.files[0])} required />
            </div>
            <div className="form-group" style={{marginBottom:20}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500}}>
                <input type="checkbox" checked={form.isDownloadable} onChange={e=>setForm(f=>({...f,isDownloadable:e.target.checked}))} style={{width:16,height:16}} />
                Allow students to download this resource
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Uploading to Cloudinary..." : "Upload Resource"}
            </button>
          </form>
        </div>
      </div>

      <div className="section-header"><h2 style={{fontSize:17,fontWeight:700}}>Uploaded Resources ({lesson?.resources?.length||0})</h2></div>

      {!lesson?.resources?.length ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg></div>
          <h3>No resources yet</h3><p>Upload your first resource using the form above.</p>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Type</th><th>Name</th><th>Downloadable</th><th>Preview</th><th>Actions</th></tr></thead>
            <tbody>
              {lesson.resources.map(r => (
                <tr key={r._id}>
                  <td><div className={"resource-type-icon "+(r.type||"other")}>{typeIcon(r.type)}</div></td>
                  <td><span style={{fontWeight:600}}>{r.name}</span></td>
                  <td><span className={"badge "+(r.isDownloadable?"badge-green":"badge-gray")}>{r.isDownloadable?"Yes":"No"}</span></td>
                  <td><a href={r.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Open Link</a></td>
                  <td><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(r._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\admin\ManageResources.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\BrowseCourses.jsx", @'
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCourses, enrollCourse, toggleSave, getMySaved } from "../../services/api";

const CATEGORIES = ["","Basic IT","Internet Safety","Online Jobs","Digital Payments","Digital Tools"];
const LEVELS     = ["","beginner","intermediate","advanced"];

export default function BrowseCourses() {
  const [courses,  setCourses]  = useState([]);
  const [saved,    setSaved]    = useState([]);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [level,    setLevel]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ msg:"", type:"" });

  const flash = (msg, type="success") => { setAlert({msg, type}); setTimeout(()=>setAlert({msg:"",type:""}), 3000); };

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
    } catch { setCourses([]); } finally { setLoading(false); }
  }, [search, category, level]);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (courseId) => {
    try { await enrollCourse(courseId); flash("Enrolled successfully! Check My Courses."); }
    catch (err) { flash(err?.response?.data?.message || "Enrollment failed", "error"); }
  };

  const handleSave = async (courseId) => {
    try {
      const res = await toggleSave(courseId);
      if (res.data.isSaved) setSaved(s => [...s, courseId]);
      else setSaved(s => s.filter(id => id !== courseId));
    } catch {}
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Browse Courses</h1>
          <p className="section-sub">{courses.length} courses available</p>
        </div>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="filters-bar">
        <div className="search-box">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input className="form-control" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{paddingLeft:38}} />
        </div>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
        <select className="filter-select" value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l ? l.charAt(0).toUpperCase()+l.slice(1) : "All Levels"}</option>)}
        </select>
      </div>

      {loading ? <div className="page-loading"><div className="spinner"></div></div> :
       courses.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <h3>No courses found</h3><p>Try adjusting your search or filters.</p>
        </div></div>
       ) : (
        <div className="courses-grid">
          {courses.map(c => (
            <div className="course-card" key={c._id}>
              <div className="course-card-header">
                <span className="course-card-cat">{c.category}</span>
              </div>
              <div className="course-card-body">
                <h3 className="course-card-title">{c.title}</h3>
                <p className="course-card-desc">{c.description?.substring(0,100)}{c.description?.length > 100 ? "..." : ""}</p>
                <div className="course-card-meta">
                  <span className="badge badge-blue">{c.level}</span>
                  <span className="badge badge-gray">{c.totalLessons} lessons</span>
                  <span className="badge badge-gray">{c.enrollmentCount} enrolled</span>
                </div>
              </div>
              <div className="course-card-footer">
                <Link to={`/course/${c._id}`} className="btn btn-secondary btn-sm" style={{flex:1,justifyContent:"center"}}>View Details</Link>
                <button className="btn btn-primary btn-sm" style={{flex:1,justifyContent:"center"}} onClick={() => handleEnroll(c._id)}>Enroll</button>
                <button className="btn btn-secondary btn-sm" style={{padding:"5px 8px"}} onClick={() => handleSave(c._id)} title={saved.includes(c._id) ? "Unsave" : "Save"}>
                  {saved.includes(c._id) ? (
                    <svg width="16" height="16" fill="#2563EB" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
       )
      }
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\BrowseCourses.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\CourseDetail.jsx", @'
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, getLessons, checkEnrollment, enrollCourse, getCourseProgress, toggleSave } from "../../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course,   setCourse]   = useState(null);
  const [lessons,  setLessons]  = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ msg:"", type:"" });

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, lRes, eRes] = await Promise.all([getCourseById(id), getLessons(id), checkEnrollment(id)]);
        setCourse(cRes.data.data); setLessons(lRes.data.data || []); setEnrolled(eRes.data.isEnrolled);
        if (eRes.data.isEnrolled) { try { const pRes = await getCourseProgress(id); setProgress(pRes.data.data); } catch {} }
      } catch { flash("Failed to load course", "error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    try { await enrollCourse(id); setEnrolled(true); flash("Enrolled successfully! Start learning now."); }
    catch (err) { flash(err?.response?.data?.message || "Enrollment failed", "error"); }
  };

  const isCompleted = (lessonId) => progress?.completedLessons?.some(l => (l._id||l) === lessonId);
  const pct = progress?.completionPercentage ?? 0;

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!course) return <div className="alert alert-error">Course not found.</div>;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="detail-hero">
        <div className="detail-hero-meta">
          <span className="hero-tag">{course.category}</span>
          <span className="hero-tag">{course.level}</span>
          <span className="hero-tag">{course.totalLessons} Lessons</span>
          <span className="hero-tag">{course.enrollmentCount} Enrolled</span>
        </div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        {course.tags?.length > 0 && (
          <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
            {course.tags.map(t => <span key={t} style={{background:"rgba(255,255,255,0.1)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:12}}>{t}</span>)}
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24,alignItems:"start"}}>
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Course Lessons ({lessons.length})</h3>
            </div>
            <div className="lesson-list">
              {lessons.length === 0 ? (
                <div style={{padding:24,textAlign:"center",color:"#94A3B8"}}>No lessons added yet.</div>
              ) : lessons.map((l, i) => (
                <div className="lesson-item" key={l._id} onClick={() => enrolled && navigate(`/lesson/${l._id}`)}>
                  <div className={"lesson-num" + (isCompleted(l._id) ? " done" : "")}>{isCompleted(l._id) ? "✓" : i+1}</div>
                  <div className="lesson-info">
                    <div className="lesson-title">{l.title}</div>
                    <div className="lesson-meta">{l.description || "—"}{l.duration ? ` • ${l.duration} min` : ""}</div>
                  </div>
                  <div className="lesson-right">
                    {l.resources?.length > 0 && <span className="badge badge-gray">{l.resources.length} files</span>}
                    {enrolled ? <span className="badge badge-blue">Open</span> : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card">
            <div className="card-body">
              {enrolled ? (
                <>
                  <div style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,fontWeight:600}}>Your Progress</span>
                      <span style={{fontSize:13,fontWeight:700,color:"#2563EB"}}>{pct}%</span>
                    </div>
                    <div className="progress-wrap"><div className="progress-bar" style={{width:pct+"%"}}></div></div>
                    <p style={{fontSize:12,color:"#94A3B8",marginTop:6}}>{progress?.completedLessons?.length ?? 0} of {course.totalLessons} lessons completed</p>
                  </div>
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={() => lessons[0] && navigate(`/lesson/${lessons[0]._id}`)}>
                    {pct > 0 ? "Continue Learning" : "Start Course"}
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{fontSize:16,fontWeight:700,marginBottom:8}}>Enroll for Free</h3>
                  <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Get access to all {course.totalLessons} lessons and downloadable resources.</p>
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={handleEnroll}>Enroll Now</button>
                </>
              )}
            </div>
          </div>
          <div className="card"><div className="card-body">
            <h4 style={{fontSize:14,fontWeight:600,marginBottom:12}}>Course Info</h4>
            {[["Category",course.category],["Level",course.level],["Lessons",course.totalLessons],["Students",course.enrollmentCount]].map(([k,v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F1F5F9",fontSize:13}}>
                <span style={{color:"#64748B"}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div></div>
        </div>
      </div>
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\CourseDetail.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\Dashboard.jsx", @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyEnrollments, getCourseProgress } from "../../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progresses,  setProgresses]  = useState({});
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
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const completed  = enrollments.filter(e => e.completionStatus === "completed").length;
  const inProgress = enrollments.filter(e => e.completionStatus === "in_progress").length;

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header" style={{marginBottom:28}}>
        <div>
          <h1 className="section-title">Welcome back, {user?.name}</h1>
          <p className="section-sub">Track your learning progress and continue where you left off.</p>
        </div>
        <Link to="/browse" className="btn btn-primary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          Browse Courses
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{enrollments.length}</div><div className="stat-label">Enrolled Courses</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{completed}</div><div className="stat-label">Completed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{inProgress}</div><div className="stat-label">In Progress</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <div className="stat-info">
            <div className="stat-value">{enrollments.length > 0 ? Math.round(Object.values(progresses).reduce((a, p) => a + (p?.completionPercentage || 0), 0) / enrollments.length) : 0}%</div>
            <div className="stat-label">Avg. Progress</div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 style={{fontSize:17,fontWeight:700}}>Continue Learning</h2>
        <Link to="/my-courses" style={{fontSize:13,color:"#2563EB",textDecoration:"none",fontWeight:600}}>View All</Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <h3>No courses yet</h3>
            <p>Start learning by enrolling in a course below.</p>
            <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
          </div>
        </div>
      ) : (
        <div className="enrolled-list">
          {enrollments.slice(0, 5).map(e => {
            const c = e.course;
            const p = progresses[c._id];
            const pct = p?.completionPercentage ?? 0;
            return (
              <div className="enrolled-item" key={e._id}>
                <div className="enrolled-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div className="enrolled-info">
                  <div className="enrolled-title">{c.title}</div>
                  <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                    <span className="badge badge-blue">{c.category}</span>
                    <span className="badge badge-gray">{c.level}</span>
                    <span className="badge badge-gray">{c.totalLessons} lessons</span>
                  </div>
                  <div className="progress-wrap" style={{width:"100%",maxWidth:400}}>
                    <div className="progress-bar" style={{width:pct+"%"}}></div>
                  </div>
                  <p style={{fontSize:12,color:"#94A3B8",marginTop:4}}>{pct}% complete — {p?.completedLessons?.length ?? 0} / {c.totalLessons} lessons</p>
                </div>
                <div className="enrolled-right">
                  <span className={"badge " + (e.completionStatus==="completed"?"badge-green":e.completionStatus==="in_progress"?"badge-yellow":"badge-gray")}>
                    {e.completionStatus.replace("_"," ")}
                  </span>
                  <Link to={`/course/${c._id}`} className="btn btn-primary btn-sm">Continue</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\Dashboard.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\Downloads.jsx", @'
import { useState, useEffect } from "react";
import { getMyEnrollments, getCourseProgress, getLessons } from "../../services/api";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const enrRes = await getMyEnrollments();
        const enrollments = enrRes.data.data || [];
        const all = [];
        await Promise.all(enrollments.map(async e => {
          try {
            const [pRes, lRes] = await Promise.all([getCourseProgress(e.course._id), getLessons(e.course._id)]);
            const prog = pRes.data.data; const lessons = lRes.data.data || [];
            (prog?.downloadedResources || []).forEach(url => {
              lessons.forEach(l => {
                const res = l.resources?.find(r => r.url === url);
                if (res) all.push({ ...res, courseName: e.course.title, lessonName: l.title, courseId: e.course._id });
              });
            });
          } catch {}
        }));
        setDownloads(all);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const typeIcon = (type) => {
    if (type==="pdf") return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
    if (type==="video") return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Downloads</h1>
          <p className="section-sub">Resources saved for offline access</p>
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></div>
          <h3>No downloads yet</h3><p>Download lesson resources to access them offline.</p>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>File</th><th>Type</th><th>Course</th><th>Lesson</th><th>Action</th></tr></thead>
            <tbody>
              {downloads.map((d, i) => (
                <tr key={i}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className={"resource-type-icon "+(d.type||"other")}>{typeIcon(d.type)}</div>
                      <span style={{fontWeight:600}}>{d.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{d.type || "file"}</span></td>
                  <td style={{color:"#475569"}}>{d.courseName}</td>
                  <td style={{color:"#475569"}}>{d.lessonName}</td>
                  <td><a href={d.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Open</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\Downloads.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\LessonView.jsx", @'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, getLessons, markLessonComplete, trackDownload } from "../../services/api";

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson,   setLesson]   = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [completed,setCompleted]= useState(false);
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ msg:"", type:"" });
  const flash = (msg,type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3000); };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getLessonById(id);
        const l = res.data.data; setLesson(l);
        const sRes = await getLessons(l.course._id || l.course);
        setSiblings(sRes.data.data || []);
      } catch { flash("Failed to load lesson","error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    try {
      await markLessonComplete(lesson.course._id || lesson.course, lesson._id);
      setCompleted(true); flash("Lesson marked as complete!");
    } catch (err) { flash(err?.response?.data?.message || "Error","error"); }
  };

  const handleDownload = async (resource) => {
    try { await trackDownload(lesson.course._id || lesson.course, resource.url); } catch {}
    window.open(resource.url, "_blank");
  };

  const curIdx = siblings.findIndex(s => s._id === id);
  const prev   = siblings[curIdx - 1];
  const next   = siblings[curIdx + 1];

  const typeIcon = (type) => {
    if (type==="pdf")   return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
    if (type==="video") return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!lesson) return <div className="alert alert-error">Lesson not found.</div>;

  return (
    <div>
      <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Course
        </button>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="lesson-layout">
        <div className="lesson-sidebar-panel">
          <div className="lesson-panel-header"><p className="lesson-panel-title">Course Lessons</p></div>
          <div className="lesson-list">
            {siblings.map((s, i) => (
              <div key={s._id} className={"lesson-item" + (s._id===id?" active":"")} style={s._id===id?{background:"#EFF6FF"}:{}} onClick={() => navigate(`/lesson/${s._id}`)}>
                <div className={"lesson-num" + (s._id===id?"":"")} style={s._id===id?{background:"#2563EB",color:"#fff"}:{}}>{i+1}</div>
                <div className="lesson-info"><div className="lesson-title" style={{fontSize:13}}>{s.title}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-main-panel">
          <div style={{padding:"20px 28px",borderBottom:"1px solid #E2E8F0"}}>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:6}}>{lesson.title}</h1>
            {lesson.description && <p style={{color:"#64748B",fontSize:14}}>{lesson.description}</p>}
            {lesson.duration > 0 && <span className="badge badge-gray" style={{marginTop:8,display:"inline-block"}}>{lesson.duration} minutes</span>}
          </div>

          <div className="lesson-content-area">
            {lesson.content ? (
              <div className="lesson-content-text">{lesson.content}</div>
            ) : (
              <div style={{color:"#94A3B8",fontSize:14,textAlign:"center",padding:40}}>No content available for this lesson.</div>
            )}

            {lesson.resources?.length > 0 && (
              <div style={{marginTop:32}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Lesson Resources ({lesson.resources.length})</h3>
                <div className="resource-list">
                  {lesson.resources.map((r, i) => (
                    <div className="resource-item" key={i}>
                      <div className="resource-item-left">
                        <div className={"resource-type-icon " + (r.type || "other")}>{typeIcon(r.type)}</div>
                        <div><div className="resource-name">{r.name}</div><div className="resource-type">{r.type || "file"}</div></div>
                      </div>
                      {r.isDownloadable && (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(r)}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Download
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{padding:"16px 28px",borderTop:"1px solid #E2E8F0",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:8}}>
              {prev && <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${prev._id}`)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                Previous
              </button>}
              {next && <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${next._id}`)}>
                Next
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>}
            </div>
            <div>
              {completed ? (
                <span className="badge badge-green" style={{padding:"8px 16px",fontSize:13}}>Completed</span>
              ) : (
                <button className="btn btn-success" onClick={handleComplete}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\LessonView.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\MyCourses.jsx", @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments, getCourseProgress } from "../../services/api";

const FILTERS = ["all","not_started","in_progress","completed"];

export default function MyCourses() {
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
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter==="all" ? enrollments : enrollments.filter(e => e.completionStatus===filter);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">My Courses</h1>
          <p className="section-sub">{enrollments.length} enrolled courses</p>
        </div>
        <Link to="/browse" className="btn btn-primary">Browse More</Link>
      </div>

      <div className="tab-bar">
        {FILTERS.map(f => (
          <button key={f} className={"tab-btn"+(filter===f?" active":"")} onClick={()=>setFilter(f)}>
            {f==="all"?"All":f.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
          <h3>No courses here</h3><p>Enroll in courses to see them here.</p>
          <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
        </div></div>
      ) : (
        <div className="enrolled-list">
          {filtered.map(e => {
            const c = e.course; const p = progresses[c._id]; const pct = p?.completionPercentage ?? 0;
            const statusColor = e.completionStatus==="completed"?"badge-green":e.completionStatus==="in_progress"?"badge-yellow":"badge-gray";
            return (
              <div className="enrolled-item" key={e._id}>
                <div className="enrolled-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div className="enrolled-info">
                  <div className="enrolled-title">{c.title}</div>
                  <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                    <span className="badge badge-blue">{c.category}</span>
                    <span className="badge badge-gray">{c.level}</span>
                  </div>
                  <div className="progress-wrap" style={{maxWidth:360}}>
                    <div className="progress-bar" style={{width:pct+"%"}}></div>
                  </div>
                  <p style={{fontSize:12,color:"#94A3B8",marginTop:4}}>{pct}% — {p?.completedLessons?.length ?? 0}/{c.totalLessons} lessons</p>
                </div>
                <div className="enrolled-right">
                  <span className={"badge "+statusColor}>{e.completionStatus.replace("_"," ")}</span>
                  <Link to={`/course/${c._id}`} className="btn btn-primary btn-sm">Open Course</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\MyCourses.jsx'

[System.IO.File]::WriteAllText("$PWD\src\pages\student\SavedResources.jsx", @'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMySaved, toggleSave } from "../../services/api";

export default function SavedResources() {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySaved().then(r => setSaved(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (courseId) => {
    try { await toggleSave(courseId); setSaved(s => s.filter(i => i.course._id !== courseId)); } catch {}
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Saved Courses</h1>
          <p className="section-sub">{saved.length} saved courses</p>
        </div>
        <Link to="/browse" className="btn btn-primary">Browse More</Link>
      </div>

      {saved.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg></div>
          <h3>No saved courses</h3><p>Save courses while browsing to access them quickly.</p>
          <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
        </div></div>
      ) : (
        <div className="courses-grid">
          {saved.map(item => {
            const c = item.course;
            return (
              <div className="course-card" key={item._id}>
                <div className="course-card-header"><span className="course-card-cat">{c.category}</span></div>
                <div className="course-card-body">
                  <h3 className="course-card-title">{c.title}</h3>
                  <p className="course-card-desc">{c.description?.substring(0,90)}...</p>
                  <div className="course-card-meta">
                    <span className="badge badge-blue">{c.level}</span>
                    <span className="badge badge-gray">{c.totalLessons} lessons</span>
                  </div>
                </div>
                <div className="course-card-footer">
                  <Link to={`/course/${c._id}`} className="btn btn-primary btn-sm" style={{flex:1,justifyContent:"center"}}>Open Course</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleUnsave(c._id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'@, [System.Text.UTF8Encoding]::new($false))
Write-Host '  wrote src\pages\student\SavedResources.jsx'

Write-Host '' 
Write-Host 'All files written successfully!' -ForegroundColor Green
Write-Host '' 
Write-Host 'Next steps:' -ForegroundColor Yellow
Write-Host '  1. npm install'
Write-Host '  2. npm start'
Write-Host '  3. Open http://localhost:3000'
Write-Host '  4. In another terminal: cd ../backend && node server.js'