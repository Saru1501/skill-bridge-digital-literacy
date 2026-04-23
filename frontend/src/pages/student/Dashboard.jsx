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
        const res  = await getMyEnrollments();
        const list = (res.data.data || []).filter(e => e.course && e.course._id);
        setEnrollments(list);
        const prog = {};
        await Promise.all(list.map(async e => {
          try {
            const r = await getCourseProgress(e.course._id);
            prog[e.course._id] = r.data.data;
          } catch {}
        }));
        setProgresses(prog);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const completed  = enrollments.filter(e => e.completionStatus === "completed").length;
  const inProgress = enrollments.filter(e => e.completionStatus === "in_progress").length;
  const avgProgress = enrollments.length > 0
    ? Math.round(Object.values(progresses).reduce((a, p) => a + (p?.completionPercentage || 0), 0) / enrollments.length)
    : 0;

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
          <div className="stat-info"><div className="stat-value">{avgProgress}%</div><div className="stat-label">Avg. Progress</div></div>
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
            <p>Start learning by enrolling in a course.</p>
            <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
          </div>
        </div>
      ) : (
        <div className="enrolled-list">
          {enrollments.slice(0, 5).map(e => {
            const c = e.course;
            if (!c || !c._id) return null;
            const p   = progresses[c._id];
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
                  <p style={{fontSize:12,color:"#94A3B8",marginTop:4}}>
                    {pct}% complete &mdash; {p?.completedLessons?.length ?? 0} / {c.totalLessons} lessons
                  </p>
                </div>
                <div className="enrolled-right">
                  <span className={"badge " + (e.completionStatus==="completed"?"badge-green":e.completionStatus==="in_progress"?"badge-yellow":"badge-gray")}>
                    {e.completionStatus?.replace("_"," ")}
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
