import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Icon({ path }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const icons = {
  dashboard: "M3.75 12h7.5V3.75h-7.5V12zm9 8.25h7.5v-5.25h-7.5v5.25zm0-8.25h7.5V3.75h-7.5V12zm-9 8.25h7.5V13.5h-7.5v6.75z",
  library: "M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75zm3.75-1.5v13.5m4.5-13.5v13.5",
  course: "M12 6.75c-2.25-1.5-5.25-1.5-7.5 0v10.5c2.25-1.5 5.25-1.5 7.5 0m0-10.5c2.25-1.5 5.25-1.5 7.5 0v10.5c-2.25-1.5-5.25-1.5-7.5 0m0-10.5v10.5",
  assessment: "M9 12.75l2.25 2.25L15 9.75m6 2.25a9 9 0 11-18 0 9 9 0 0118 0z",
  bookmark: "M6.75 4.5h10.5A1.5 1.5 0 0118.75 6v13.125l-6.75-3.375-6.75 3.375V6a1.5 1.5 0 011.5-1.5z",
  download: "M12 3.75v10.5m0 0l4.5-4.5m-4.5 4.5l-4.5-4.5m-3 8.25h15",
  rewards: "M7.5 5.25h9l1.5 3-6 3.75-6-3.75 1.5-3zm1.5 6.75v6.75h6V12",
  leaderboard: "M6 20.25h12M8.25 17.25V9.75m3.75 7.5V6.75m3.75 10.5V12",
  support: "M8.25 10.5h7.5m-7.5 3.75h4.5m-7.5 5.25h13.5A2.25 2.25 0 0021 17.25V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 19.5z",
  payment: "M3.75 7.5h16.5m-15 4.5h4.5m-6-6.75h16.5A1.5 1.5 0 0121.75 6v12A1.5 1.5 0 0120.25 19.5H3.75A1.5 1.5 0 012.25 18V6a1.5 1.5 0 011.5-1.5z",
  ngo: "M4.5 19.5h15M6.75 19.5v-9.75L12 6l5.25 3.75v9.75M9.75 19.5v-4.5h4.5v4.5M8.25 4.5h7.5",
  logout: "M15.75 9V5.625A1.875 1.875 0 0013.875 3.75h-7.5A1.875 1.875 0 004.5 5.625v12.75c0 1.036.84 1.875 1.875 1.875h7.5a1.875 1.875 0 001.875-1.875V15m-6-3h12m0 0l-3-3m3 3l-3 3",
};

const navByRole = {
  student: [
    {
      label: "Learning",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: icons.dashboard, end: true },
        { to: "/browse", label: "Browse Courses", icon: icons.library },
        { to: "/my-courses", label: "My Courses", icon: icons.course },
        { to: "/assessment", label: "Assessments", icon: icons.assessment },
      ],
    },
    {
      label: "Library",
      items: [
        { to: "/saved", label: "Saved Courses", icon: icons.bookmark },
        { to: "/saved-resources", label: "Saved Resources", icon: icons.bookmark },
        { to: "/downloads", label: "Offline Downloads", icon: icons.download },
      ],
    },
    {
      label: "Progress",
      items: [
        { to: "/student/gamification", label: "Rewards & Certificates", icon: icons.rewards },
        { to: "/student/leaderboard", label: "Leaderboard", icon: icons.leaderboard },
      ],
    },
    {
      label: "Support",
      items: [
        { to: "/student/programs", label: "Sponsorship", icon: icons.ngo },
        { to: "/student/applications", label: "Applications", icon: icons.support },
        { to: "/student/redeem", label: "Redeem Benefits", icon: icons.rewards },
        { to: "/student/tickets", label: "Tickets", icon: icons.support },
        { to: "/student/payment", label: "Payments", icon: icons.payment },
      ],
    },
  ],
  admin: [
    {
      label: "Administration",
      items: [
        { to: "/admin", label: "Dashboard", icon: icons.dashboard, end: true },
        { to: "/admin/courses", label: "Courses", icon: icons.library },
        { to: "/admin/assessment", label: "Assessment Hub", icon: icons.assessment },
        { to: "/admin/gamification", label: "Gamification", icon: icons.rewards },
        { to: "/admin/tickets", label: "Support Tickets", icon: icons.support },
      ],
    },
  ],
  ngo: [
    {
      label: "Partnerships",
      items: [
        { to: "/ngo", label: "Impact Hub", icon: icons.dashboard, end: true },
        { to: "/ngo/programs", label: "Initiatives", icon: icons.ngo },
        { to: "/ngo/applications", label: "Applicants", icon: icons.support },
      ],
    },
  ],
};

const roleMeta = {
  student: { title: "Student Portal", subtitle: "Learning, rewards, and support" },
  admin: { title: "Admin Console", subtitle: "Operations and oversight" },
  ngo: { title: "NGO Workspace", subtitle: "Programs and applicant review" },
};

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isNgo, logout } = useAuth();

  useEffect(() => {
    onClose();
  }, [pathname]);


  const role = isAdmin ? "admin" : isNgo ? "ngo" : "student";
  const sections = navByRole[role];
  const meta = roleMeta[role];
  const initials = (user?.name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  // Track expanded section by label
  const [expanded, setExpanded] = useState(sections[0]?.label || "");
  const handleToggle = (label) => {
    setExpanded((prev) => (prev === label ? "" : label));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`sidebar-backdrop${isOpen ? " open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className={`sidebar app-sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-shell">
          <div className="sidebar-brand-block">
            <div className="sidebar-logo-mark">
              <Icon path={icons.course} />
            </div>
            <div>
              <div className="sidebar-brand-title">SkillBridge</div>
              <div className="sidebar-brand-subtitle">{meta.title}</div>
            </div>
          </div>

          <div className="sidebar-role-banner">
            <div className="sidebar-role-label">{role}</div>
            <p>{meta.subtitle}</p>
          </div>

          <nav className="sidebar-sections">
            {sections.map((section) => (
              <div key={section.label} className="sidebar-section">
                <div className="nav-group-label" style={{display:'flex',alignItems:'center',cursor:'pointer'}} onClick={() => handleToggle(section.label)}>
                  <span>{section.label}</span>
                  <span style={{marginLeft:8,transition:'transform 0.2s',transform:expanded===section.label?'rotate(0deg)':'rotate(-90deg)'}}>
                    {/* Down arrow chevron SVG */}
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
                {expanded === section.label && (
                  <div className="sidebar-links">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
                        onClick={onClose}
                      >
                        <span className="nav-item-icon">
                          <Icon path={item.icon} />
                        </span>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="sidebar-footer-card">
            <div className="sidebar-user-row">
              <div className="sidebar-user-avatar">{initials || "U"}</div>
              <div className="sidebar-user-copy">
                <div className="sidebar-user-name">{user?.name || "Anonymous User"}</div>
                <div className="sidebar-user-role">{meta.title}</div>
              </div>
            </div>

            <button type="button" className="sidebar-logout" onClick={handleLogout}>
              <Icon path={icons.logout} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
