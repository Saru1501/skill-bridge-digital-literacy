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
