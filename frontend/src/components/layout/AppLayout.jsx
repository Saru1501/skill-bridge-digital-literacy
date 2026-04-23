import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/browse": "Browse Courses",
  "/my-courses": "My Courses",
  "/assessment": "Assessment & Evaluation Engine",
  "/saved": "Saved Courses",
  "/downloads": "Downloads",
  "/admin": "Admin Dashboard",
  "/admin/courses": "Manage Courses",
  "/admin/assessment": "Assessment & Evaluation Engine",
};

export default function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  let title = pageTitles[pathname] || "SkillBridge";

  if (pathname.startsWith("/assessment/course/")) title = "Assessment Workspace";
  if (pathname.startsWith("/admin/assessment/course/")) title = "Assessment Management";
  if (pathname.startsWith("/course/")) title = "Course Details";
  if (pathname.startsWith("/lesson/")) title = "Lesson View";

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
