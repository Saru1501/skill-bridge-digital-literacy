import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNgoDashboardData } from "../services/sponsorshipService";

export default function NgoDashboard() {
  const { user } = useAuth();
  const [stats,   setStats]   = useState({ programs:0, applications:0, pending:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNgoDashboardData();
        setStats({
          programs:     (data.programs || []).filter(p => p.ngoUser?._id === user?._id).length,
          applications: (data.applications || []).length,
          pending:      (data.applications || []).filter(a => a.status === "PENDING").length,
        });
      } catch {} finally { setLoading(false); }
    };
    if (user?._id) load();
  }, [user]);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header" style={{marginBottom:28}}>
        <div>
          <h1 className="section-title">Welcome, {user?.name}</h1>
          <p className="section-sub">Manage sponsorship programs and review student applications.</p>
        </div>
        <Link to="/ngo/programs" className="btn btn-primary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          New Program
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{stats.programs}</div><div className="stat-label">My Programs</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{stats.applications}</div><div className="stat-label">Total Applications</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending Reviews</div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
        <div className="card-body">
          <p style={{color:"#64748B",marginBottom:20,fontSize:14}}>Create programs to offer sponsorship support to rural youth and review their applications.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Link to="/ngo/programs"     className="btn btn-primary">Manage Programs</Link>
            <Link to="/ngo/applications" className="btn btn-secondary">Review Applications</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
