import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudentDashboardData } from "../services/sponsorshipService";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ programs:0, tickets:0, openTickets:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data    = await getStudentDashboardData();
        const tickets = data.tickets || [];
        setStats({
          programs:   (data.programs || []).length,
          tickets:    tickets.length,
          openTickets: tickets.filter(t => t.status !== "RESOLVED").length,
        });
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header" style={{marginBottom:28}}>
        <div>
          <h1 className="section-title">Sponsorship Hub</h1>
          <p className="section-sub">Welcome, {user?.name} &mdash; manage your sponsorship and support here.</p>
        </div>
        <Link to="/dashboard" className="btn btn-primary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          My Courses
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{stats.programs}</div><div className="stat-label">Available Programs</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{stats.tickets}</div><div className="stat-label">My Tickets</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{stats.openTickets}</div><div className="stat-label">Open Tickets</div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
        <div className="card-body">
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Link to="/student/programs" className="btn btn-primary">Browse Programs</Link>
            <Link to="/student/apply"    className="btn btn-secondary">Apply for Sponsorship</Link>
            <Link to="/student/redeem"   className="btn btn-secondary">Redeem Code</Link>
            <Link to="/student/tickets"  className="btn btn-secondary">Support Ticket</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
