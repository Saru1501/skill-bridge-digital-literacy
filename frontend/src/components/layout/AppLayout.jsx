import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Student Dashboard",
  "/browse": "Browse Courses",
  "/my-courses": "My Courses",
  "/assessment": "Assessment Hub",
  "/saved": "Saved Courses",
  "/saved-resources": "Saved Resources",
  "/downloads": "Offline Downloads",
  "/student/gamification": "Rewards & Certificates",
  "/student/leaderboard": "Leaderboard",
  "/student/programs": "Sponsorship Programs",
  "/student/apply": "Sponsorship Application",
  "/student/redeem": "Redeem Benefits",
  "/student/tickets": "Support Tickets",
  "/student/payment": "Payments",
  "/admin": "Admin Dashboard",
  "/admin/courses": "Course Management",
  "/admin/assessment": "Assessment Oversight",
  "/admin/tickets": "Support Operations",
  "/admin/gamification": "Gamification Controls",
  "/ngo": "Impact Hub",
  "/ngo/programs": "Program Initiatives",
  "/ngo/applications": "Applicant Review",
};

const pageTitlePrefixes = [
  ["/admin/courses/", "Lesson Management"],
  ["/admin/lessons/", "Resource Management"],
  ["/admin/assessment/course/", "Course Assessment Management"],
  ["/assessment/course/", "Course Assessment Workspace"],
  ["/course/", "Course Details"],
  ["/lesson/", "Lesson Workspace"],
];

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, isAdmin, isNgo } = useAuth();
  const { pathname } = useLocation();
  const roleLabel = isAdmin ? "Admin" : isNgo ? "NGO" : "Student";
  const title =
    pageTitles[pathname] ||
    pageTitlePrefixes.find(([prefix]) => pathname.startsWith(prefix))?.[1] ||
    "SkillBridge Workspace";

  const handleToggleSidebar = () => setMobileNavOpen((open) => !open);
  const handleCloseSidebar = () => setMobileNavOpen(false);

  return (
    <div className="layout" style={{ minHeight: "100vh", display: "flex", background: "#F8FBFF" }}>
      <Sidebar isOpen={mobileNavOpen} onClose={handleCloseSidebar} />

      <div className="main-content" style={{ flex: 1, marginLeft: 280, minHeight: "100vh" }}>
        <header
          className="topbar"
          style={{
            height: 88,
            padding: "0 32px",
            background: "rgba(255, 255, 255, 0.96)",
            borderBottom: "1px solid #DBEAFE",
            boxShadow: "0 14px 40px rgba(15, 23, 42, 0.06)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
            <button type="button" className="sidebar-toggle" onClick={handleToggleSidebar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6.75h16M4 12h16M4 17.25h16" />
              </svg>
            </button>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#3B82F6",
                  marginBottom: 4,
                }}
              >
                {roleLabel} Workspace
              </div>
              <h1
                className="page-title"
                style={{
                  fontSize: 28,
                  color: "#0F172A",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          <div className="topbar-meta" style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 999,
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.15)",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8" }}>System Online</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{user?.name}</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {roleLabel}
                </div>
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: "0 16px 30px rgba(29, 78, 216, 0.25)",
                }}
              >
                {user?.name?.[0] || "U"}
              </div>
            </div>
          </div>
        </header>

        <main className="page-wrap" style={{ padding: "32px", maxWidth: "1600px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
